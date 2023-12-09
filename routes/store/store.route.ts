import { Elysia, t as validator } from "elysia"
import AuthMiddleware from "../../utils/middleware"
import { AuthState } from "../../request.body/auth"
import StoreController from "./store.controller"

export class CreateStoreBody {
    title!: string
    description?: string
    banner?: string
}

export class UpdateStoreBody {
    title?: string
    description?: string
    banner?: string
    isActive?: boolean
}

export class GetStoreParams {
    id!: string
}

class StoreRouter {
    path: string
    router: Elysia
    constructor(app: Elysia) {
        this.path = "/store"
        this.router = app
        this.main()
    }

    main() {

        this.router
            .decorate("store", { user: new AuthState })
            .decorate("body", new CreateStoreBody)
            .post(this.path + "/create", StoreController.create, { 
                beforeHandle: AuthMiddleware,
                // validator demo: add line "age: validator.String()" and you will receive a error on request
                body: validator.Object({
                    age: validator.String(),
                    title: validator.String()
                })
            })

        this.router
            .decorate("params", new GetStoreParams)
            .get(this.path + "/detail/:id", StoreController.get)

        this.router
            .decorate("store", { user: new AuthState })
            .decorate("params", new GetStoreParams)
            .decorate("body", new UpdateStoreBody)
            .put(this.path + "/update/:id", StoreController.update, { beforeHandle: AuthMiddleware })
    }
}

export default StoreRouter