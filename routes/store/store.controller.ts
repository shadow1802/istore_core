import { Context } from "elysia";
import { CreateStoreBody, GetStoreParams, UpdateStoreBody } from "./store.route";
import { WithAuth } from "../../types/auth";
import ResponseSender from "../../utils/response.sender";
import { Store } from "../../models/store.model";
import { useSlug } from "../../utils/helpers";

export default class StoreController {
    static async create(ctx: Context<{ body: CreateStoreBody }> & WithAuth) {
        try {
            const { body, store } = ctx

            const iStore = await Store.create({
                title: body.title,
                banner: body.banner,
                description: body.description,
                createdBy: store.user._id,
                tags: [...useSlug(body.title).split("-")]
            })

            return new ResponseSender(200, iStore, "Tạo thành công cửa hàng")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async get(ctx: Context<{ params: GetStoreParams }>) {
        try {
            const iStore = await Store.findById(ctx.params.id)
                .populate({ path: "createdBy", select: "username fullName avatar phoneNumber email bio" })

            return new ResponseSender(200, iStore, "Lấy thành công thông tin cửa hàng")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async update(ctx: Context<{ body: UpdateStoreBody, params: GetStoreParams }> & WithAuth) {
        try {

            const { body, store } = ctx
            const iStore = await Store.findById(ctx.params.id)


            if (iStore) {

                if (iStore.createdBy?.toString() !== store.user._id) return new ResponseSender(
                    403, 
                    iStore.createdBy + " " + store.user._id, 
                    "Chỉ chủ sở hữu mới có thể chỉnh sửa thông tin cửa hàng"
                )

                console.log(iStore.createdBy.toString(), store.user._id)

                if (body.title) {
                    const tags = useSlug(body.title).split("-")
                    iStore.title = body.title
                    iStore.tags = tags
                }

                body.isActive && (iStore.isActive = body.isActive)
                body.banner && (iStore.banner = body.banner)
                body.description && (iStore.description = body.description)

                await iStore.save()
                return new ResponseSender(200, iStore, "Chỉnh sửa thành công thông tin cửa hàng")
            } else return new ResponseSender(404, null, "không tìm thấy cửa hàng này")

        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async search(ctx: Context) {
        try {
            const { keyword } = ctx.query

            if (keyword) {
                const search = useSlug(keyword).split("-")
                const results = await Store.find({ tags: { $in: search } })
                return new ResponseSender(200, results, "Ok")
            } else return new ResponseSender(200, [], "Ok")
        } catch(error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }
}