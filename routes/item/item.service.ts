import { Item } from "../../models/item.model";
import { useSlug } from "../../utils/helpers";
import { CreateItemBody, UpdateItemBody } from "./item.route";

export async function itemCreator(body: CreateItemBody, createdBy: string) {

    const tags = [
        ...useSlug(body.title).split("-"),
        ...useSlug(body.categories.join(" ")).split("-")
    ]

    if (body.brand) tags.push(...useSlug(body.brand).split("-"))
    if (body.mode) tags.push(...useSlug(body.mode).split("-"))

    const item = await Item.create({ ...body, createdBy, tags })
    return item
}

export async function itemEditor(id: string, body: UpdateItemBody, updatedBy: string) {

    const item = await Item.findById(id)

    if (item) {

        if (item?.createdBy?.toString() !== updatedBy) throw new Error("Chỉ chủ sở hữu được phép chỉnh sửa")

        if (body.title) {
            const oldTags = useSlug(item.title).split("-")
            item.tags = item.tags.filter(item => !oldTags.includes(item))
            item.tags = [...item.tags, ...useSlug(body.title).split("-")]
        }
        if (body.categories) {
            const oldTags = useSlug(item.categories.join(" ")).split("-")
            item.tags = item.tags.filter(item => !oldTags.includes(item))
            item.tags = [...item.tags, ...useSlug(body.categories.join(" ")).split("-")]
        }
        if (body.brand) {
            if (item.brand) {
                const oldTags = useSlug(item.brand).split("-")
                item.tags = item.tags.filter(item => !oldTags.includes(item))
                item.tags = [...item.tags, ...useSlug(body.brand)]
            } else item.tags = [...item.tags, ...useSlug(body.brand)]
        }
        if (body.mode) {
            if (item.mode) {
                const oldTags = useSlug(item.mode).split("-")
                item.tags = item.tags.filter(item => !oldTags.includes(item))
                item.tags = [...item.tags, ...useSlug(body.mode)]
            } else item.tags = [...item.tags, ...useSlug(body.mode)]
        }
        await Promise.all([item.save(), Item.findByIdAndUpdate(id, body)])
    } else throw new Error("Sản phẩm không hợp lệ")
}