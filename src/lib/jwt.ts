// import jwt, { JwtPayload } from 'jsonwebtoken'

// interface SignOption {
//   expiresIn: string
// }

// const DEFAULT_SIGN_OPTION: SignOption = {
//   expiresIn: '5s'
// }

// export const signJwtAccessToken = (
//   payload: JwtPayload,
//   options: SignOption = DEFAULT_SIGN_OPTION
// ) => {
//   const secretKey = process.env.NEXTAUTH_SECRET as string
//   const token = jwt.sign(payload, secretKey, options)
//   return token
// }

// export const verifyJwt = (token: string, type: 'access' | 'refresh' = 'access') => {
//   try {
//     console.log('token', process.env.NEXTAUTH_SECRET)
//     const secretKey = process.env.NEXTAUTH_SECRET as string
//     const payload = jwt.verify(token, secretKey)
//     return payload
//   } catch (error) {
//     console.error(`verifyJwt error: ${type} ${error}`)
//     return null
//   }
// }
import { jwtVerify, SignJWT } from 'jose'

interface SignOption {
  expiresIn: string
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: '5s'
}

export const signJwtAccessToken = async (
  payload: Record<string, any>,
  options: SignOption = DEFAULT_SIGN_OPTION
): Promise<string> => {
  const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET as string)
  const alg = 'HS256'

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg })
    .setExpirationTime(options.expiresIn)
    .sign(secretKey)

  return token
}

export const verifyJwt = async (token: string, type: 'access' | 'refresh' = 'access') => {
  try {
    const secretKey = new TextEncoder().encode(process.env.NEXTAUTH_SECRET as string)
    const { payload } = await jwtVerify(token, secretKey)
    return payload
  } catch (error) {
    console.error(`${type} verifyJwt 錯誤: ${error}`)
    return null
  }
}
