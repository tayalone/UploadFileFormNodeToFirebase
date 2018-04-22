const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs.promised');


//---- setting middleware
const app = express()
app.use(cors())
app.use(morgan("combined"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
// ------------------------

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        //console.log(file)
      cb(null, './tmp')
    },
    filename: function (req, file, cb) {
        //console.log(file)
      cb(null,  Date.now()+"-"+file.originalname)
    }
})
const upload = multer({ storage: storage })
const upload2 = multer({ storage: storage })

// --------- Router --------------------------------------
app.get("/",(req, res) => {
    res.send("/")
})
app.post("/upload2",upload.single('file'),(req,res) => {
    //res.send(req.file)
    fs.unlink(req.file.path)
        .then(() => {
            console.log('file deleted successfully');
            res.send(req.file)
        })
        .catch((err) => {
            console.log('file deleted failed')
            res.send(err)
        })  
})
app.post("/uploadMulti",upload.array('photos',5),(req,res) => {
    console.log(req.body)
    const promisedOBJ = req.files.map(file => {
        return fs.unlink(file.path)
            .then(() => {
                return true
            })
            .catch((err) => {
                return false
            })
    })
    Promise.all(promisedOBJ)
    .then((values) => {
        res.send(JSON.stringify(req.files))
      })
    .catch((err) => {
        res.send(err)
    })
})

//--------------------------------------------------------

const server = app.listen(8888, () =>{
    console.log("This App running at 8888")
})

module.exports = server