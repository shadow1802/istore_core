import { Context } from "elysia"
import { LoginBody, RegisterBody } from "../../request.body/auth"
import { User } from "../../models/user.model"
import * as alert from "../../utils/alert"
import { tokenGenerator } from "./auth.service"
import ResponseSender from "../../utils/response.sender"
import { codeGenerator } from "../../services/code.service"
import { Auth } from "../../types/auth"
import REGEX from "../../constants/regex"
import { useSlug } from "../../utils/helpers"

export default class AuthController {
    static async register(ctx: Context<{ body: RegisterBody }>) {
        try {

            const { username, password, email, fullName } = ctx.body

            if (!REGEX.INCLUDE_SPACE.test(username)) {
                throw new Error(`Tên người dùng không được có khoảng trắng`)
            }

            if (!REGEX.INCLUDE_SPACE.test(password)) {
                throw new Error(`Mật khẩu không được có khoảng trắng`)
            }

            if (!REGEX.EMAIL.test(email)) {
                throw new Error(`Email không hợp lệ`)
            }
            const bio = codeGenerator(6)
            const tags = [...useSlug(fullName).split("-"), bio, username]
            const user = await User.create({ username, password, email, fullName, bio, tags })

            user.lastLogin = new Date(Date.now())
            await user.save()

            const token = tokenGenerator({ _id: user._id, role: user.role, isActive: user.isActive })

            return new ResponseSender(200, {_id: user._id, token}, "Đăng ký thành công")
        } catch (error: any) {

            alert.error(error)

            return new ResponseSender(400, null, error.message)
        }
    }

    static async login(ctx: Context<{ body: LoginBody }>) {
        try {
            const { username, password } = ctx.body

            console.log(username, password)

            if (!REGEX.INCLUDE_SPACE.test(username)) {
                throw new Error(`Tên người dùng không được có khoảng trắng`)
            }

            if (!REGEX.INCLUDE_SPACE.test(password)) {
                throw new Error(`Mật khẩu không được có khoảng trắng`)
            }

            const user = await User.findOne({ username, password })

            if (user) {
                user.lastLogin = new Date(Date.now())
                await user.save()
                const token = tokenGenerator({ _id: user._id, role: user.role, isActive: user.isActive })
                return new ResponseSender(200, {_id: user._id, token}, "Đăng nhập thành công")
            } else {
                return new ResponseSender(400, null, "Tài khoản hoặc mật khẩu sai")
            }

        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async deleteUser(ctx: Context<{params: { user: string }}> & { store: { user: Auth }}) {
        try {
            if (ctx.store.user) { console.log(ctx.store)}
            return new ResponseSender(200, "CC", "123123qweqwe")
        } catch (error) {

        }
    }
}