import { createClient } from '@libsql/client/http'

let client

export function getDb() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL.trim()
    const httpUrl = url.replace(/^libsql:\/\//, 'https://')
    client = createClient({
      url: httpUrl,
      authToken: process.env.TURSO_AUTH_TOKEN?.trim(),
    })
  }
  return client
}
