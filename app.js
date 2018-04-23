const express = require('express')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const cors = require('cors')
const multer = require('multer')
const fs = require('fs.promised');
const path = require('path');
const fbAdmin = require('firebase-admin');
const format = require('util').format;


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
const storage2 = multer.memoryStorage()
const upload = multer({ storage: storage })
const upload2 = multer({ storage: storage2 })
//-------------------------------------------------------

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
        console.log("File(tmp) was deleted "+values.length+" files")
    })
    .catch((err) => {
        console.log(err)
    })



//------------ firebase admin ---------------------------

const serviceAccount = require("./serviceAccountKey.json")
fbAdmin.initializeApp({
    credential: fbAdmin.credential.cert(serviceAccount),
    storageBucket: "gs://warebefine.appspot.com"
  });
var bucket = fbAdmin.storage().bucket();
const options = {
    prefix: 'Images/',
  };
// bucket.getFiles(options)
//   .then((res) => {
//       files = res[0]
      
//       const promisedOBJ = files.map((file) => {
//             return bucket.file(file.name).delete()
//                 .then((data) => { return true })
//                 .catch((err) => { return false})
//         })
//         return Promise.all(promisedOBJ)
//         .then((values) => {return values})
//   })
//   .then((values) => {
//         if(values){ console.log("File(Firebase) was deleted "+values.length+" files")
//         }else{ console.log("File(Firebase) was deleted 0 files")}
//   })
//   .catch((err) => { console.log(err)})

// ======== get sign url ===================
bucket.getFiles(options)
    .then((res) => {
        const files = res[0]
        const promisedOBJ = files.map((file) => {
            return bucket.file(file.name).getSignedUrl({action: 'read',expires: '03-17-2025'})
                .then((res) => { return res[0] })
                .catch((err) => { return false})
        })
        return Promise.all(promisedOBJ)
            .then((values) => {return values})
    })
    .then((values) => {
        console.log(values)
    })
    .catch((err)=>{
        console.log(err)
    })
// ===============================
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
app.post("/uploadFB",upload2.single('file'),(req,res) => {
     const tmpfile = req.file
     console.log(tmpfile)
    uploadImageToStorage(tmpfile).then((success) => {
        res.status(200).send({
          status: 'success',
          url: success
        });
      }).catch((error) => {
        console.error(error);
      }); 
})
app.post("/uploadMultiFB",upload2.array('photos',5), (req,res) => {
    const tmpFiles = req.files
    const promObj = tmpFiles.map((tmpfile) => {
        return uploadImageToStorage(tmpfile)
            .then(url => { return url})
    })
    Promise.all(promObj)
        .then((values) => {
            return values
        })
        .then((values) => {
            res.send(JSON.stringify(values))
        })
        .catch((err) => {
            res.send(err)
        })

})

//--------------------------------------------------------

const uploadImageToStorage = (file) => {
    let prom = new Promise((resolve, reject) => {
      if (!file) {
        reject('No image file');
      }
      let newFileName = `${Date.now()}_${file.originalname}`;
      let fileUpload = bucket.file("Images/"+newFileName);
  
      const blobStream = fileUpload.createWriteStream({
        metadata: {
          contentType: file.mimetype
        }
      });
  
      blobStream.on('error', (error) => {
        reject('Something is wrong! Unable to upload at the moment.');
      });
  
      blobStream.on('finish', () => {
        const url = format(`https://storage.googleapis.com/${bucket.name}/${fileUpload.name}`);
        resolve(url);
      });
  
      blobStream.end(file.buffer);
    });
    return prom;
  }

const server = app.listen(8888, () =>{
    console.log("This App running at 8888")
})

module.exports = server