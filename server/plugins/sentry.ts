import { Toucan } from 'toucan-js'

export default defineNitroPlugin((nitroApp) => {
  const config = useRuntimeConfig()
  const sentryConfig = config.public.sentry

  nitroApp.hooks.hook('error', (err, context) => {
    const sentry = new Toucan({
      dsn: sentryConfig.dsn,
      context: context.event,
      tracesSampleRate: 1.0
    })

    sentry.setTag('server', true)
    sentry.captureException(err)
  })
})
