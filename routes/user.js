const express = require('express')
const router = express.Router()

const userController = require('../controllers/userController')

router.post('/add', checkNotAuthenticated, userController.store)
router.post('/changePhoneNumber', checkAuthenticated, userController.changePhoneNumber)
router.post('/changeAddress', checkAuthenticated, userController.changeAddress)
router.post('/addFavorite', checkAuthenticated, userController.addFavorite)
router.post('/removeFavorite', checkAuthenticated, userController.removeFavorite)
router.post('/forgotPassword', checkAuthenticated, userController.forgotPassword)
router.post('/resetPassword', userController.resetPassword)


function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    return next()
    }

    res.redirect('/')
}

function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
    return res.redirect('/')
    }
    next()
}

module.exports = router