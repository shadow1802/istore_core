import { Elysia, t } from "elysia"
import AuthMiddleware from "../../utils/middleware"
import { AuthState } from "../../request.body/auth"
import ItemController from "./item.controller"
import { Optional } from "@sinclair/typebox"

export class ItemParams {
    id!: string
}

export class CreateItemBody {
    title!: string
    description!: string
    images?: string[]
    categories!: string[]
    notes?: string[]
    price!: string
    mode?: string
    brand?: string
    count!: number
}

export class UpdateItemBody {
    title?: string
    description?: string
    images?: string[]
    categories?: string[]
    notes?: string[]
    price?: string
    mode?: string
    brand?: string
    count?: number
}

class ItemRouter {
    path: string
    router: Elysia
    constructor(app: Elysia) {
        this.path = "/item"
        this.router = app
        this.main()
    }

    main() {

        this.router
        .get(this.path + "/search", ItemController.search)

        this.router
        .decorate("params", new ItemParams)
        .get(this.path + "/detail/:id", ItemController.get)

        this.router
        .decorate("store", { user: new AuthState })
        .decorate("body", new CreateItemBody)
        .post(this.path + "/create", ItemController.create, { beforeHandle: AuthMiddleware })

        this.router
        .decorate("store", { user: new AuthState })
        .decorate("params", new ItemParams)
        .decorate("body", new UpdateItemBody)
        .put(this.path + "/update/:id", ItemController.update, { beforeHandle: AuthMiddleware })
    }
}

export default ItemRouter