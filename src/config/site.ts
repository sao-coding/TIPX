type Site = {
  url: string
  cookie: {
    expires: number
  }
}

export const site: Site = {
  url: process.env.NODE_ENV === "production" ? "https://tipx.sao-x.com" : "http://localhost:3000",
  cookie: {
    expires: 365
  }
}
