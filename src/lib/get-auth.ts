import { verifyJwt } from './jwt'

const getAuth = async (accessToken: string) => {
  console.log('驗證 accessToken', accessToken)
  const verify = await verifyJwt(accessToken)

  type Auth = {
    type: 'refresh' | 'access'
    userId: string
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  }

  return verify as Auth | null
}

export default getAuth
