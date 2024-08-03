type Site = {
  url: string
  cookies: {
    expires: number
  }
}

export const site: Site = {
  url: process.env.NODE_ENV === 'production' ? 'https://tipx.sao-x.com' : 'http://localhost:3000',
  cookies: {
    expires: 365
  }
}
