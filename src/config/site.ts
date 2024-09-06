type Site = {
  url: string
  cookies: {
    expires: number
  }
}

export const site: Site = {
  url: process.env.SITE_URL!,
  cookies: {
    expires: 365
  }
}
