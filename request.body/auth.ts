import { Auth } from "../types/auth"

export class RegisterBody {
    username!: string
    password!: string
    email!:string
    fullName!:string
}

export class LoginBody {
    username!: string
    password!: string
}

export class AuthState implements Auth {
	_id!: string
	role!: string
	isActive!: boolean;
}