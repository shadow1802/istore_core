import { Elysia, t as validator } from "elysia"
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
			.post(this.path + "/register", AuthController.register, {
				body: validator.Object({
					username: validator.String({ minLength: 6, maxLength: 32 }),
					password: validator.String({ minLength: 6, maxLength: 32 }),
					email: validator.String({ minLength: 12, maxLength: 225 }),
					fullName: validator.String({ minLength: 6, maxLength: 225 })
				})
			})

		this.router.decorate("body", new LoginBody)
			.post(this.path + "/login", AuthController.login, {
				body: validator.Object({
					username: validator.String({ minLength: 6, maxLength: 32 }),
					password: validator.String({ minLength: 6, maxLength: 32 }),
				})
			})
	}
}

export default AuthRouter