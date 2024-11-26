import { Toucan } from 'toucan-js'

export default defineNitroPlugin((nitroApp) => {
  const { public: { sentryDsn, sentryReleaseName, environment } } = useRuntimeConfig()

  nitroApp.hooks.hook('error', async (err, context) => {
    const sentry = new Toucan({
      dsn: sentryDsn,
      release: sentryReleaseName,
      environment,
      context: context.event,
      request: context.event ? toWebRequest(context.event) : undefined,
      requestDataOptions: {
        allowedSearchParams: true,
        allowedHeaders: true
      }
    })

    if (context.event) {
      sentry.setRequestBody(await readRawBody(context.event))
    }

    sentry.setTag('server', true)
    sentry.captureException(err)
  })
})
