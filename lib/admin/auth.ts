import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import crypto from 'crypto'

const cookieName = 'cliniq_admin_session'

function secret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || 'development-secret'
}

export function signAdminSession(username: string) {
  const value = `${username}.${Date.now()}`
  const signature = crypto.createHmac('sha256', secret()).update(value).digest('hex')
  return `${value}.${signature}`
}

export function verifyAdminSession(token?: string) {
  if (!token) return false
  if (!process.env.ADMIN_USERNAME || !process.env.ADMIN_PASSWORD) return false
  const parts = token.split('.')
  if (parts.length !== 3) return false
  const value = `${parts[0]}.${parts[1]}`
  const expected = crypto.createHmac('sha256', secret()).update(value).digest('hex')
  if (parts[2].length !== expected.length) return false
  return crypto.timingSafeEqual(Buffer.from(parts[2]), Buffer.from(expected))
}

export async function requireAdmin() {
  const jar = await cookies()
  if (!verifyAdminSession(jar.get(cookieName)?.value)) redirect('/admin/login')
}

export async function setAdminCookie(token: string) {
  const jar = await cookies()
  jar.set(cookieName, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/admin', maxAge: 60 * 60 * 8 })
}

export async function clearAdminCookie() {
  const jar = await cookies()
  jar.delete(cookieName)
}
