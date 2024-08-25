import { verifyJwt } from '@/lib/jwt'

const getAuth = async (accessToken: string) => {
  const verify = await verifyJwt(accessToken, { clockTolerance: 5 })
  console.log('getAuth()', verify)

  type Auth = {
    type: 'refresh' | 'access'
    userId: string
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  }

  return verify as Auth | null
}

export default getAuth
