import { Context } from "elysia"
import ROLE from "../constants/role"
import { tokenDecoder } from "../routes/auth/auth.service"
import ResponseSender from "./response.sender"

export default function AuthMiddleware(ctx: any): ResponseSender | void {
    try {
        if (ctx.headers.authorization) {
            const token = ctx.headers.authorization.split(" ")[1]
            const decoded = tokenDecoder(token) as { _id: string, role: string, [key: string]: any }
            if (decoded.role === ROLE.ADMIN) { ctx.store = { isAdmin: true } }
            ctx.store = { user: decoded }
        } else {
            return new ResponseSender(401, null, "Token chưa được truyền đúng")
        }
    } catch(error) {

    }
}