import { Item } from "../../models/item.model";
import { useSlug } from "../../utils/helpers";
import { CreateItemBody } from "./item.route";

export async function itemCreator(body: CreateItemBody, createdBy: string) {

    const tags = [
        ...useSlug(body.title).split("-"),
        ...useSlug(body.categories.join(" ")).split("-")
    ]

    if (body.brand) tags.push(...useSlug(body.brand).split("-"))
    if (body.model) tags.push(...useSlug(body.model).split("-"))

    const item = await Item.create({...body, createdBy, tags})
    return item
}