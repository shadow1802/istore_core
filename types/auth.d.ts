import { JwtPayload } from "jsonwebtoken"

export interface Auth extends JwtPayload {
    _id: string
    role: string
    isActive: boolean
}

export type WithAuth = { store: { user: Auth } }