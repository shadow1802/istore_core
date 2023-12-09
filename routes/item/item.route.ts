import { Elysia } from "elysia"
import AuthMiddleware from "../../utils/middleware"
import { AuthState } from "../../request.body/auth"
import ItemController from "./item.controller"

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
    model?: string
    brand?: string
    count!: number
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

    }
}

export default ItemRouter