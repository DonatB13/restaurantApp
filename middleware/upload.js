const path = require('path'); 
const multer = require('multer');

var storage = multer.diskStorage({
    destination: function(req, file, next) {
        next(null, 'public/uploads/')
    },
    filename: function(req, file, next) {
        next(null, file.originalname)
    }
})

var upload = multer ({
    storage: storage,
    fileFilter: function(req, file, callback) {
        if(
            file.mimetype == "image/png" ||
            file.minetype == "image/jpg"
        ) 
        {
            callback(null, true)
        } 
        else
        {
            console.log('only jpg & png file supported!')
            callback(null, false)
        }
    },
    limits: {
        fileSize: 1024 * 1024 * 2
    }
})

module.exports = upload