import { Context } from "elysia";
import { CreateItemBody, ItemParams } from "./item.route";
import ResponseSender from "../../utils/response.sender";
import { Item } from "../../models/item.model";
import type { ItemDetail } from "../../models/item.model";
import { WithAuth } from "../../types/auth";
import { itemCreator } from "./item.service";
import { useSlug } from "../../utils/helpers";

export default class ItemController {

    static async search(ctx: Context) {
        try {
            const { keyword } = ctx.query
            if (keyword) {
                const tags = useSlug(keyword).split("-")
                const results = await Item.find({ tags: { $in: tags } })
                return new ResponseSender(200, results, "Tìm kiếm thành công")
            } else return new ResponseSender(200, [], "Tìm kiếm thành công")
        } catch (error: any) {
            return new ResponseSender(404, null, error.message)
        }
    }

    static async get(ctx: Context<{ params: ItemParams }>) {
        try {
            const item = await Item.findById(ctx.params.id)
            return new ResponseSender(200, item as ItemDetail, "Lấy thông tin sản phẩm thành công")
        } catch (error: any) {
            return new ResponseSender(404, null, error.message)
        }
    }

    static async create(ctx: Context<{ body: CreateItemBody }> & WithAuth) {
        try {

            const { body, store } = ctx
            const item = await itemCreator(body, store.user._id)
            return new ResponseSender(200, item as ItemDetail, "Tạo sản phẩm thành công")

        } catch (error: any) {
            return new ResponseSender(404, null, error.message)
        }
    }
}