const express = require('express')
const upload  = require('../middleware/upload')
const router = express.Router()

const itemController = require('../controllers/itemController')

router.post('/addItem', upload.single('image'), itemController.store)
router.post('/getPrice', itemController.getPrice)


module.exports = router