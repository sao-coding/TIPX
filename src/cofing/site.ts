type Site = {
    url: string
}

export const site: Site = {
    url: process.env.NODE_ENV === "production" ? "https://tip.sao-x.com" : "http://localhost:3000",
}
