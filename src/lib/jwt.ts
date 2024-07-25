import jwt, { JwtPayload } from 'jsonwebtoken'

interface SignOption {
  expiresIn: string
}

const DEFAULT_SIGN_OPTION: SignOption = {
  expiresIn: '40s'
}

export const signJwtAccessToken = (
  payload: JwtPayload,
  options: SignOption = DEFAULT_SIGN_OPTION
) => {
  const secretKey = process.env.NEXTAUTH_SECRET as string
  const token = jwt.sign(payload, secretKey, options)
  return token
}

export const verifyJwt = (token: string) => {
  try {
    const secretKey = process.env.NEXTAUTH_SECRET as string
    const payload = jwt.verify(token, secretKey)
    return payload
  } catch (error) {
    console.error(error)
  }
}
