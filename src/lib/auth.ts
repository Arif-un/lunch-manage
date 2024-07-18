/* eslint-disable @typescript-eslint/no-explicit-any */
import { SignJWT, jwtVerify } from 'jose'
import { cookies } from 'next/headers'

const secretKey = process.env.JWT_SECRET_KEY
const key = new TextEncoder().encode(secretKey)

type Token = {
  email: string
  id: number
}
/**
 * Encrypts the given payload into a JWT token.
 * @param {object} payload - The data to be encrypted into the token.
 * @returns {Promise<string>} A promise that resolves to the JWT token.
 */
export async function encrypt(payload: Record<string, any>): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

/**
 * Decrypts the given JWT token and returns the payload.
 * @param {string} token - The JWT token to decrypt.
 * @returns {Promise<object>} A promise that resolves to the decrypted payload.
 */
export async function decrypt(token: string): Promise<Token> {
  const { payload } = await jwtVerify<Token>(token, key, {
    algorithms: ['HS256']
  })
  return payload
}

/**
 * Retrieves the JWT secret key from the environment variables.
 * @returns {string} The JWT secret key.
 * @throws {Error} If the JWT_SECRET_KEY environment variable is not set.
 */
export function getJwtSecretKey(): string {
  if (!secretKey || secretKey.length === 0) {
    throw new Error('The environment variable JWT_SECRET_KEY is not set.')
  }

  return secretKey
}

/**
 * Attempts to log in a user with the given email and password.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<boolean>} A promise that resolves to true if login is successful, false otherwise.
 */
export async function login(email: string, password: string): Promise<boolean> {
  // Here you would typically check the email and password against your database
  // For this example, we'll just check if the email includes '@' and the password is longer than 3 characters
  if (email.includes('@') && password.length > 3) {
    const token = await encrypt({ email, id: 1 })
    cookies().set('token', token, { httpOnly: true })
    return true
  }
  return false
}

/**
 * Logs out the current user by clearing the token cookie.
 * @returns {Promise<void>}
 */
export async function logout(): Promise<void> {
  cookies().set('token', '', { expires: new Date(0) })
}

/**
 * Retrieves the current session information from the token cookie.
 * @returns {Promise<object | null>} A promise that resolves to the session payload if a valid token exists, null otherwise.
 */
export async function getSession(): Promise<Token | null> {
  const token = cookies().get('token')?.value
  if (token) {
    try {
      const payload = await decrypt(token)
      return payload
    } catch (error) {
      console.error('error', error)
      return null
    }
  }
  return null
}
