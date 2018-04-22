const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer');

//---- setting middleware
const app = express()
app.use(cors())
app.use(morgan("combined"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
// ------------------------

app.get("/",(req, res) => {
    res.send("/")
})


const server = app.listen(8888, () =>{
    console.log("This App running at 8888")
})

module.exports = server