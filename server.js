require("dotenv").config({ path: "./config.env" })
const mongoDB = require("./config/db")
const path = require("path");
const express = require("express");
const app = express()
const port = process.env.PORT || 5000;
const errorHandler = require("./middlewares/errorHandler")

app.use(express.json())

app.use("/api/auth", require("./routes/auth"))
app.use("/api/post", require("./routes/post"))

app.use(errorHandler)



if (process.env.NODE_ENV == "production") {
    const reactPath= path.join(__dirname,"/client/build")
    app.use(express.static(reactPath));
    app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));

    })
}
app.listen(port, () => console.log(`Server running at the port ${port}`))