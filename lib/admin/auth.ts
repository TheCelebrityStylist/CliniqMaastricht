import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

const cookieName = 'cliniq_admin_session'
const sessionMaxAgeSeconds = 60 * 60 * 8

function cleanEnvValue(value?: string) {
  const trimmed = (value || '').trim()
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1).trim()
  }
  return trimmed
}

function secret() {
  return cleanEnvValue(process.env.ADMIN_SESSION_SECRET) || cleanEnvValue(process.env.ADMIN_PASSWORD) || 'development-secret'
}

function configuredUsername() {
  return cleanEnvValue(process.env.ADMIN_USERNAME)
}

function configuredPassword() {
  return cleanEnvValue(process.env.ADMIN_PASSWORD)
}

function safeEqual(left: string, right: string) {
  const leftBuffer = Buffer.from(left)
  const rightBuffer = Buffer.from(right)
  if (leftBuffer.length !== rightBuffer.length) return false
  return crypto.timingSafeEqual(leftBuffer, rightBuffer)
}

function signPayload(payload: string) {
  return crypto.createHmac('sha256', secret()).update(payload).digest('hex')
}

export function hasAdminCredentials() {
  return Boolean(configuredUsername() && configuredPassword())
}

export function validateAdminCredentials(username: string, password: string) {
  const expectedUsername = configuredUsername()
  const expectedPassword = configuredPassword()
  const submittedUsername = cleanEnvValue(username)
  const submittedPassword = cleanEnvValue(password)

  if (!expectedUsername || !expectedPassword) return false

  const usernameMatches = submittedUsername.toLowerCase() === expectedUsername.toLowerCase()
  const passwordMatches = safeEqual(submittedPassword, expectedPassword)
  return usernameMatches && passwordMatches
}

export function signAdminSession(username: string) {
  const payload = Buffer.from(JSON.stringify({ username: cleanEnvValue(username), issuedAt: Date.now() })).toString('base64url')
  return `${payload}.${signPayload(payload)}`
}

export function verifyAdminSession(token?: string) {
  if (!token || !hasAdminCredentials()) return false

  const parts = token.split('.')
  if (parts.length !== 2) return false

  const [payload, signature] = parts
  const expected = signPayload(payload)
  if (!safeEqual(signature, expected)) return false

  try {
    const session = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { username?: string; issuedAt?: number }
    if (!session.username || !session.issuedAt) return false
    if (Date.now() - session.issuedAt > sessionMaxAgeSeconds * 1000) return false
    return session.username.toLowerCase() === configuredUsername().toLowerCase()
  } catch {
    return false
  }
}

export async function requireAdmin() {
  const jar = await cookies()
  if (!verifyAdminSession(jar.get(cookieName)?.value)) redirect('/admin/login')
}

export async function setAdminCookie(token: string) {
  const jar = await cookies()
  jar.set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/admin', maxAge: sessionMaxAgeSeconds })
}

export async function clearAdminCookie() {
  const jar = await cookies()
  jar.delete(cookieName)
}
