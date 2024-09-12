import { verifyJwt } from '@/lib/jwt'

const getAuth = async (accessToken: string) => {
  type Auth = {
    type: 'refresh' | 'access'
    userId: string
    role: 'SUPER_ADMIN' | 'ADMIN' | 'USER'
  }

  const verify = (await verifyJwt(accessToken, { clockTolerance: 5 })) as Auth
  // console.log('getAuth()', verify)

  return verify && verify.type === 'access' ? verify : null
}

export default getAuth
