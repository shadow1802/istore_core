import jwt from "jsonwebtoken"

export const SECRET = "XP9A11090955"

export const tokenGenerator = (payload: string | Object | Buffer) => {
    const token = jwt.sign(payload, SECRET)
    return token
}

export const tokenDecoder = (token: string) => {
    try {
        const decoded = jwt.verify(token, SECRET)
        return decoded
    } catch(err:any) {
        throw new Error(err.message)
    }
}