import { JwtPayload } from 'jsonwebtoken'

interface SignOption {
  expiresIn: string
}

const DEFAULT_SIGN_OPTIONS: SignOption = {
  expiresIn: '1d'
}

export const sign = (
  payload: JwtPayload,
  secret: string,
  options: SignOption = DEFAULT_SIGN_OPTIONS
) => {
  return jwt.sign(payload, secret, options)
}
