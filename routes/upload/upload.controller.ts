import { Context } from "elysia"
import { WithAuth } from "../../types/auth";
import ResponseSender from "../../utils/response.sender";
import { codeGenerator } from "../../services/code.service";

const ext: { [key: string]: string } = {
    "video/mp4": "mp4",
    "image/png": "png",
    "image/jpeg": "jpg",
    "audio/mpeg": "mp3"
} 

export default class UploadController {
    static async single(ctx: Context<{ body: { file: File } }> & WithAuth) {
        try {
            if (!ext[ctx.body.file.type]) return new ResponseSender(400, null, "Không hỗ trợ định dạng này")
            const fileName = codeGenerator(8)
            const fileExt = ext[ctx.body.file.type]
            const owner = ctx.store.user._id
            await Bun.write(`public/${owner}_${fileName}.${fileExt}`, ctx.body.file)
            return new ResponseSender(200, `/public/${owner}_${fileName}.${fileExt}`, "Thành công")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }

    static async multiple(ctx: Context<{ body: { files: File[] } }> & WithAuth) {
        try {
            const results: string[] = []
            let filesMaker: Promise<any>[] = []
            const owner = ctx.store.user._id
            ctx.body.files.forEach(item => {
                const fileName = codeGenerator(10)
                results.push(`/public/${owner}_${fileName}.${ext[item.type]}`)
                const maker = Bun.write(`public/${owner}_${fileName}.${ext[item.type]}`, item)
                filesMaker.push(maker)
            })
            await Promise.all(filesMaker)

            return new ResponseSender(200, results, "Thành công")
        } catch (error: any) {
            return new ResponseSender(400, null, error.message)
        }
    }
}