const multer = require("multer");


//diskStorage() → tells Multer to save files on your computer.
//destination → save them in server/uploads/.
//filename → prevents duplicate names by adding a timestamp.
//file.originalname → the name the user uploaded.
// cb: callback to tell what to do next :null :no error and name of file
//upload.single("file") creates req.file.
const storage = multer.diskStorage({
    destination:"uploads/",
    filename: (req,file, cb) =>{
        cb(null, Date.now()+"-"+file.originalname)
    }
})

const upload = multer({storage})


module.exports = upload