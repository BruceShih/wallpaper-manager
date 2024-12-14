import type { ApiHouseKeepRequest, ApiHouseKeepResponse } from '../types/api/housekeep'
import * as photon from '@cf-wasm/photon'
import { consola } from 'consola'
import { images, imagesToTags } from '../database/schema'
import { inArray, tables, useDrizzle } from '../types/drizzle'
import { apiHouseKeepQuerySchema } from '../utils/validator'

export default defineEventHandler<ApiHouseKeepRequest, ApiHouseKeepResponse>(async (event) => {
  const query = await getValidatedQuery(event, data => apiHouseKeepQuerySchema.safeParse(data))
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
        const imageUint8 = new Uint8Array(imageBinary)
        const photonImage = photon.PhotonImage.new_from_byteslice(imageUint8)
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
