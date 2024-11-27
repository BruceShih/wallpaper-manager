import process from 'node:process'
import { D1Dialect } from '@atinux/kysely-d1'
import { betterAuth, type BetterAuthOptions } from 'better-auth'
import { admin, anonymous, bearer } from 'better-auth/plugins'
import { consola } from 'consola'

let _auth: ReturnType<typeof betterAuth>
export function serverAuth() {
  if (!_auth) {
    const options: BetterAuthOptions = {
      database: {
        /**
         * NOTE: after upgrade to "@nuxthub/core": "^0.8.7", 'dump()' function is removed due to deprecation
         * by cloudflare
         * the type of @atinux/kysely-d1 needs to be updated
         */
        dialect: new D1Dialect({
          database: hubDatabase()
        }),
        type: 'sqlite'
      },
      secondaryStorage: {
        get: key => hubKV().getItemRaw(`_auth:${key}`),
        set: (key, value, ttl) => {
          return hubKV().set(`_auth:${key}`, value, { ttl })
        },
        delete: key => hubKV().del(`_auth:${key}`)
      },
      baseURL: getBaseURL(),
      emailAndPassword: {
        enabled: true
      },
      socialProviders: {
        github: {
          clientId: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!
        }
      },
      account: {
        accountLinking: {
          enabled: true
        }
      },
      plugins: [anonymous(), admin(), bearer()]
    }
    _auth = betterAuth(options)
  }
  return _auth
}

function getBaseURL() {
  let baseURL = process.env.BETTER_AUTH_URL
  if (!baseURL) {
    try {
      baseURL = getRequestURL(useEvent()).origin
    }
    catch (error) {
      consola.error(error)
    }
  }
  return baseURL
}
