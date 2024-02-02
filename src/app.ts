import "reflect-metadata"
import "express-async-errors"
import express from "express";
import { userRouter } from "./routes/user.route";
import { handleAppErrorMiddlieware } from "./middlewares/handleAppError.middleware";
import { sessionRouter } from "./routes/session.route";
import { contactRouter } from "./routes/contact.routes";



const app = express()

app.use(express.json())
app.use("/users", userRouter)
app.use("/login", sessionRouter)
app.use("/contacts", contactRouter)
app.use(handleAppErrorMiddlieware)

export default app