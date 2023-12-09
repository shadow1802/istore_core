import { Context } from "elysia";
import { AuthState, RegisterBody } from "../../request.body/auth";
import { UpdateUserBody } from "../../request.body/user";
import REGEX from "../../constants/regex";
import { User } from "../../models/user.model";
import { codeGenerator } from "../../services/code.service";
import ResponseSender from "../../utils/response.sender";
import ROLE from "../../constants/role";
import { useSlug } from "../../utils/helpers";
import { WithAuth } from "../../types/auth";

type sortType = "desc" | "asc"

export default class UserController {

    static async getUser(ctx: Context & WithAuth) {
        try {
            if (ctx.query.user) {
                const user = await User.findById(ctx.query.user).select("-password")
                return new ResponseSender(200, user, "Lấy dữ liệu người dùng thành công")
            } else {

                let sortBy: sortType = ctx.query.sortBy as sortType || "desc"
                let pageSize = Number(ctx.query.pageSize) || 10
                let pageIndex = Number(ctx.query.pageIndex) || 1

                let searchObject: Record<any, any> = {}

                if (ctx.query.username) {
                    searchObject = {
                        $and: [
                            { ...searchObject },
                            { username: { $regex: ".*" + ctx.query.username + ".*" } }
                        ]
                    }
                }

                if (ctx.query.role) {
                    searchObject = {
                        $and: [
                            { ...searchObject },
                            { role: ctx.query.role.toUpperCase() }
                        ]
                    }
                }

                let total = await User.find(searchObject).countDocuments()
                let users = await User.find(searchObject, { password: 0 })
                    .skip(pageSize * pageIndex - pageSize)
                    .limit(pageSize)
                    .sort({
                        createdAt: sortBy,
                    })

                return new ResponseSender(200, { total, pageIndex, pageSize, data: users }, "Lấy dữ liệu người dùng thành công")

            }
        } catch (error: any) {

        }
    }

    static async create(ctx: Context<{ body: RegisterBody }> & WithAuth) {
        try {

            if (ctx.store.user.role !== ROLE.ADMIN) {
                return new ResponseSender(403, null, "Chỉ admin mới có quyền tạo người dùng")
            }

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

            return new ResponseSender(200, user, "Tạo người dùng mới thành công")

        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async search(ctx: Context) {
        try {
            const { keyword } = ctx.query

            if (keyword) {
                const search = useSlug(keyword).split("-")

                console.log(search)

                const results = await User.find({ tags: { $in: search } }, { password: 0, tags: 0 })
                return new ResponseSender(200, results, "Ok")
            } else return new ResponseSender(200, [], "Ok")

        } catch (error) {

        }
    }

    static async update(ctx: Context<{
        params: { user: string },
        body: UpdateUserBody
    }> & WithAuth) {
        try {
            if (ctx.store.user._id !== ctx.params.user) {
                return new ResponseSender(403, null, "Không thể sửa thông tin của người khác")
            }

            const { password } = ctx.body

            if (password && (!REGEX.INCLUDE_SPACE.test(password) || password.length < 6)) {
                console.log(password.length)
                throw new Error(`Mật khẩu không được có khoảng trắng và phải lớn hơn 6 ký tự`)
            }

            const user = await User.findByIdAndUpdate(ctx.params.user, ctx.body)

            if (!user) return new ResponseSender(404, null, "Không tìm thấy người dùng này")

            return new ResponseSender(200, user, "Chỉnh sửa thông tin thành công")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async delete(ctx: Context<{
        params: { user: string }
    }> & WithAuth) {
        try {
            if (ctx.store.user.role !== ROLE.ADMIN) {
                return new ResponseSender(403, null, "Chỉ admin mới có quyền xóa người dùng")
            }

            const user = await User.findByIdAndDelete(ctx.params.user)
            return new ResponseSender(200, user, "Xóa người dùng thành công")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }
}