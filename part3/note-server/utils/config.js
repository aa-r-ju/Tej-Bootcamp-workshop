require("dotenv").config()
const url = process.env.MONGODB_URL
const PORT = process.env.PORT
module.exports = {url, PORT}