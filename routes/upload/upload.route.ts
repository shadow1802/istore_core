import { Elysia, t } from "elysia"
import { codeGenerator } from "../../services/code.service"
import ResponseSender from "../../utils/response.sender"
import AuthMiddleware from "../../utils/middleware"
import UploadController from "./upload.controller"
import { AuthState } from "../../request.body/auth"

export class MultipleUploadBody {
    files!: File[]
}

export class SingleUploadBody {
    file!: File
}

class UploadRouter {
    path: string
    router: Elysia
    constructor(app: Elysia) {
        this.path = "/upload"
        this.router = app
        this.main()
    }

    main() {

        this.router
            .decorate("store", { user: new AuthState })
            .decorate("body", new SingleUploadBody)
            .post(this.path + "/single", UploadController.single, {
                beforeHandle: AuthMiddleware,
                body: t.Object({
                    file: t.File()
                })
            })

        this.router
            .decorate("store", { user: new AuthState })
            .decorate("body", new MultipleUploadBody)
            .post(this.path + "/multiple", UploadController.multiple, {
                beforeHandle: AuthMiddleware,
                body: t.Object({
                    files: t.Files({
                        type: ['image', 'video', 'audio', 'audio/mpeg', 'video/mpeg']
                    })
                })
            })
    }
}

export default UploadRouter