const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs.promised');
const path = require('path');
const fbAdmin = require('firebase-admin');


console.log("clear all file in tmp folder")
fs.readdir("./tmp")
    .then((files) => {
        const promisedOBJ = files.map(file => {
            //console.log(file)
            return fs.unlink("./tmp/"+file)
                .then(() => { return true })
                .catch((err) => {return false})
        })
       return Promise.all(promisedOBJ)
        .then((values) => {return values})
    })
    .then((values) => {
        //console.log(values)
        console.log("File was deleted "+values.length+" files")
    })
    .catch((err) => {
        console.log(err)
    })

//---- setting middleware
const app = express()
app.use(cors())
app.use(morgan("combined"))
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}))
// ------------------------

// -------- Multer --------------------
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
//-------------------------------------------------------
//------------ firebase admin ---------------------------

// const serviceAccount = require("./serviceAccountKey.json")
// fbAdmin.initializeApp({
//     credential: fbAdmin.credential.cert(serviceAccount),
//     storageBucket: "gs://warebefine.appspot.com"
//   });
// var bucket = fbAdmin.storage().bucket();
// bucket.get().then(function(data) {
//     console.log()
//     var bucket = data[0];
//     console.log(bucket)
//     var apiResponse = data[1];
//     console.log(apiResponse)
//   });

//-------------------------------------------------------
// --------- Router --------------------------------------
app.get("/",(req, res) => {
    res.send("/")
})
app.post("/upload",upload.single('file'),(req,res) => {
    res.send(req.file) 
})
app.post("/uploadMulti",upload.array('photos',5),(req,res) => {
    //console.log(req.body)
    res.send(JSON.stringify(req.files))
})

//--------------------------------------------------------

const server = app.listen(8888, () =>{
    console.log("This App running at 8888")
})

module.exports = server