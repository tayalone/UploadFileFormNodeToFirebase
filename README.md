# Upload Image Form Node To Firebase
เป็น Snippet ที่สร้าง API Upload ไฟล์ไปยัง Storage ของ Firebase

## Library

 - **Express.js** - ใช้สร้าง Routing จัดการ http request เช่น get, post, put และ delete
 - **Multer.js** - เป็นMiddlewareจัดการ file ที่ถูก upload ผ่านทาง http request 
 - **firebase-admin** - เป็น sdk ที่จัดการบริการของfirebase  ในsnippet นี้ใช้ StorageBucket

## Setting

 1. Download **serviceAccountKey.js** จาก **project firebase** แล้วนำไปวางที่ root directory
 2. ที่ app.js **line:63**   `storageBucket:  "<Your bucket name>"`

## Routing 

 - [ post ] /upload - upload ไฟล์แบบไฟล์เดียว แล้วนำไปเก็บที่ ./tmp
 - [ post ] /uploadMulti - upload ไฟล์แบบหลายไฟล์ แล้วนำไปเก็บที่ ./tmp
 -  [ post ] /uploadFB - upload ไฟล์แบบไฟล์เดียวจากนั้น upload ต่อไป ยัง filebase
 -  [ post ] /uploadMultiFB - upload ฟล์แบบหลายไฟล์ จากนั้น upload ต่อไป ยัง filebase
  
## Reference
 - [Express API](https://expressjs.com/en/4x/api.html)
 - [Multer API](https://github.com/expressjs/multer)
 - [Firebase Admin](https://firebase.google.com/docs/admin/setup)
 - [Google Cloud Storage: Node.js](https://cloud.google.com/nodejs/docs/reference/storage/1.6.x/)

 
