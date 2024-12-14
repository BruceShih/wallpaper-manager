import type { ApiHousekeepingRequest, ApiHousekeepingResponse } from '../types/api/housekeeping'
import JPEG_DEC_WASM from '@jsquash/jpeg/codec/dec/mozjpeg_dec'
import decode, { init as initJpegDecode } from '@jsquash/jpeg/decode'
import { consola } from 'consola'
import { images, imagesToTags } from '../database/schema'
import { inArray, tables, useDrizzle } from '../types/drizzle'
import { apiHousekeepingQuerySchema } from '../utils/validator'

export default defineEventHandler<ApiHousekeepingRequest, ApiHousekeepingResponse>(async (event) => {
  const query = await getValidatedQuery(event, data => apiHousekeepingQuerySchema.safeParse(data))
  if (!query.success) {
    consola.error(query.error)
    throw createError({ statusCode: 400 })
  }

  const dryRun = query.data.dry
  const lowQualityImageList: string[] = []
  const brokenImageList: string[] = []
  const imageList = await useDrizzle().query.images.findMany()
  for (const image of imageList) {
    const imageR2 = await hubBlob().get(image.key)
    if (imageR2) {
      try {
        const imageBinary = await imageR2.arrayBuffer()
        await initJpegDecode(JPEG_DEC_WASM)
        await decode(imageBinary)
        // TODO: normal image, check whether it's blurry or low quality
      }
      catch {
        brokenImageList.push(image.key)
      }
    }
  }

  if (brokenImageList.length > 0) {
    if (dryRun)
      consola.warn('Running in dry mode:')

    try {
      consola.start('Deleting broken images...')
      if (!dryRun) {
        await useDrizzle().batch([
          useDrizzle().delete(tables.imagesToTags).where(inArray(imagesToTags.imageKey, brokenImageList)),
          useDrizzle().delete(tables.images).where(inArray(images.key, brokenImageList))
        ])
        await hubBlob().delete(brokenImageList)
      }
      consola.success('Broken images deleted! List of deleted images:')
      for (const key of brokenImageList) {
        consola.log(key)
      }
    }
    catch (error) {
      consola.error('Failed to delete broken image:', error)
    }
  }

  return 'Housekeeping done!'
})
