import { DefaultSession } from 'next-auth'

// import { UserRole } from "@prisma/client"

type UserId = string
// id: string;
// studentId: string;
// name: string;
// givenName: string;
// familyName: string;
// picture: string;
// email: string;
// role: string;
// createdAt: Date;

declare module 'next-auth' {
  interface User {
    accessToken: string
  }
}
declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
  }
}

declare module 'next-auth' {
  // interface Profile {
  //   given_name: string
  //   family_name: string
  //   picture: string
  // }
  interface Session {
    user: {
      accessToken: string
    } & DefaultSession['user']
  }
  // type User = DatabaseUser
}
