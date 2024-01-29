import app from './app'
import "dotenv/config"
import { AppDataSource } from "./data-source"


AppDataSource.initialize()
    .then(() => {
        console.log("database is running")
        const PORT = process.env.PORT || 3000
        app.listen(PORT, () => {
            console.log(`Server is running on ${PORT}`)
        })
    })
    .catch((err) => console.log(err))