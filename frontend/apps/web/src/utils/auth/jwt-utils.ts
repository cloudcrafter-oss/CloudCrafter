interface JwtPayload {
    exp: number;

}

const parseJwt = (token: string): JwtPayload => {
    const base64Url: string = token.split('.')[1]
    const base64: string = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    return JSON.parse(atob(base64))
}

export const isTokenExpired = (token: string): boolean => {
    const json: JwtPayload = parseJwt(token)

    const jwtExpireTimestamp: number = json.exp

    const jwtExpireDateTime: Date = new Date(jwtExpireTimestamp * 1000)
    const currentDateTime: Date = new Date()

    return jwtExpireDateTime < currentDateTime
}

export const debugToken = (token: string, from: string) => {
    const json: JwtPayload = parseJwt(token)

    const jwtExpireTimestamp: number = json.exp

    const jwtExpireDateTime: Date = new Date(jwtExpireTimestamp * 1000)
    const currentDateTime: Date = new Date()

    if (jwtExpireDateTime < currentDateTime) {
        const secondsSinceExpiration: number = Math.floor((currentDateTime.getTime() - jwtExpireDateTime.getTime()) / 1000)
        console.log(`[${from}] API token expired ${secondsSinceExpiration} seconds ago`)
    } else {
        const secondsUntilExpiration: number = Math.floor((jwtExpireDateTime.getTime() - currentDateTime.getTime()) / 1000)
        console.log(`[${from}] Token is still valid. It will expire in ${secondsUntilExpiration} seconds`)
    }
}