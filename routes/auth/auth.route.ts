import { Elysia } from "elysia"
import AuthController from "./auth.controller"
import { LoginBody, RegisterBody } from "../../request.body/auth"

class AuthRouter {
	path: string
	router: Elysia
	constructor(app: Elysia) {
		this.path = "/auth"
		this.router = app
		this.main()
	}

	main() {
		this.router.decorate("body", new RegisterBody)
		.post(this.path + "/register", AuthController.register)

		this.router.decorate("body", new LoginBody)
		.post(this.path + "/login", AuthController.login)
	}
}

export default AuthRouter