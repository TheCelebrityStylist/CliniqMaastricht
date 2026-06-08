import crypto from 'crypto'

type TokenCache = { token: string; expiresAt: number }
let cachedToken: TokenCache | null = null

function base64url(input: string | Buffer) {
  return Buffer.from(input).toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_')
}

export function googleSyncConfigured() {
  return Boolean(process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY)
}

export function normalizePrivateKey(privateKey: string) {
  return privateKey.replace(/\\n/g, '\n')
}

export async function getGoogleAccessToken(scope: string) {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    throw new Error('Google sync is not configured.')
  }

  const now = Math.floor(Date.now() / 1000)
  if (cachedToken && cachedToken.expiresAt - 60 > now) return cachedToken.token

  const header = { alg: 'RS256', typ: 'JWT' }
  const claim = {
    iss: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    scope,
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now,
  }
  const unsigned = `${base64url(JSON.stringify(header))}.${base64url(JSON.stringify(claim))}`
  const signer = crypto.createSign('RSA-SHA256')
  signer.update(unsigned)
  signer.end()
  const signature = signer.sign(normalizePrivateKey(process.env.GOOGLE_PRIVATE_KEY))
  const assertion = `${unsigned}.${base64url(signature)}`

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }),
    cache: 'no-store',
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Google token request failed: ${response.status} ${body}`)
  }

  const data = await response.json() as { access_token: string; expires_in?: number }
  cachedToken = { token: data.access_token, expiresAt: now + (data.expires_in || 3600) }
  return data.access_token
}
