import { Elysia } from "elysia"
import mongoose from 'mongoose'

// use plugins
import { cors } from '@elysiajs/cors'
import { Stream } from '@elysiajs/stream'
import { cron } from '@elysiajs/cron'
import { staticPlugin } from '@elysiajs/static'

import AuthRouter from "../routes/auth/auth.route"
import UserRouter from "../routes/user/user.route"
import UploadRouter from "../routes/upload/upload.route"
import StoreRouter from "../routes/store/store.route"
import ItemRouter from "../routes/item/item.route"
import ResponseSender from "../utils/response.sender"
class Program {
  constructor() {
    this.main()
  }

  async main() {
    try {
      await mongoose.connect('mongodb+srv://darkness:123123123@cluster0.n52juyp.mongodb.net/ichat')

      const app = new Elysia()

      app.use(cors())
      app.use(staticPlugin({
        assets: "public"
      }))

      app.onAfterHandle(ctx => {
        console.log("after each handle request")
      })

      app.onError((ctx) => {
        ctx.set.status = 200
        return new ResponseSender(400, ctx.error, ctx.code)
      })

      app.use(
        cron({
          name: 'heartbeat',
          /* pattern syntax >>>>> second | minute | hour | day_of_month | month | day_of_week
            - second?: (0–59),
            - minute: (0–59)
            - hour: (0–23)
            - day_of_month: (1–31)
            - month: (1–12)
            - day_of_week: (0–6)
          >>>>>>>>>> */
          pattern: '*/10 * * * * *', // each 10 second
          async run() {
            console.log("Beated at: ", new Date())
            const file = Bun.file("logs.txt")
            const content = await file.text()
            await Bun.write("logs.txt", content + "\n" + "[LOG]: " + new Date().toJSON() + "\n", { mode: 0 })
          }
        })
      ).get('/stop', ({ store: { cron: { heartbeat } } }) => {
        heartbeat.stop()

        return 'Stop heartbeat'
      })

      app.get('/', () => new Stream(async (stream) => {
        stream.send('data is sending ... 0 %')
        await stream.wait(1000)
        stream.send('data is sending ... 20 %')
        await stream.wait(1000)
        stream.send('data is sending ... 40 %')
        await stream.wait(1000)
        stream.send('data is sending ... 60 %')
        await stream.wait(1000)
        stream.send('data is sending ... 80 %')
        await stream.wait(1000)
        stream.send('data is sending ... 100 %')
        await stream.wait(1000)
        stream.send('DONE!!!')
        stream.close()
      }))

      new AuthRouter(app)
      new UserRouter(app)
      new UploadRouter(app)
      new StoreRouter(app)
      new ItemRouter(app)

      app.listen(8888)
      console.log(`Server is running at ${app.server?.hostname}:${app.server?.port}`)
    } catch (error) {
      console.log(error)
    }
  }
}


new Program()