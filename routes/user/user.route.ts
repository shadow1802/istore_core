import { Elysia } from "elysia"
import UserController from "./user.controller"
import { AuthState, RegisterBody } from "../../request.body/auth"
import { UpdateUserBody } from "../../request.body/user";
import AuthMiddleware from "../../utils/middleware"

class UserRouter {
    path: string
    router: Elysia
    constructor(app: Elysia) {
        this.path = "/user"
        this.router = app
        this.main()
    }

    main() {

        this.router.decorate("store", { user: new AuthState })
            .get(this.path, UserController.getUser, {
                beforeHandle: AuthMiddleware
            })

        this.router.get(this.path + "/search", UserController.search)

        this.router.decorate("store", { user: new AuthState })
            .decorate("body", new RegisterBody)
            .post(this.path + "/create", UserController.create, {
                beforeHandle: AuthMiddleware
            })

        this.router.decorate("store", { user: new AuthState })
            .decorate("body", new UpdateUserBody)
            .put(this.path + "/update/:user", UserController.update, {
                beforeHandle: AuthMiddleware
            })

        this.router.decorate("store", { user: new AuthState })
            .delete(this.path + "/delete/:user", UserController.delete, {
                beforeHandle: AuthMiddleware
            })
    }
}

export default UserRouter