const Account = require('../models/account')
const bcrypt = require('bcrypt')
const mail = require('../middleware/nodemailer')

const store = async (req, res, next) => {
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let account = new Account({
        email: req.body.signupEmail,
        password: hashedPassword,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        address: req.body.address,
        phoneNumber: req.body.phoneNumber,
        favoriteItems: [],
        cartItems: [],
        admin: false
    })
    account.save()
    .then(response => {
            res.redirect('/')
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

const changePhoneNumber = (req, res) => {
    let query = {email: req.body.email};

    Account.findOneAndUpdate(query, { phoneNumber: req.body.newPhoneNumber }, {upsert: true}, function(err, doc)
    {
        if (err) return res.send(500, {error: err});
        else    res.redirect('/')
    });
}

const changeAddress = (req, res) => {
    let query = {email: req.user.email};
    Account.findOneAndUpdate(query, { address: req.body.newAddress }, {upsert: true}, function(err, doc) 
    {
        if (err) return res.send(500, {error: err});
        else    res.redirect('/')
    });
}

const addFavorite = (req, res) => {
    let query = {email: req.user.email};
    Account.updateOne(query, {$push: {favoriteItems: req.body.itemName}}, function(err, doc) 
    {
        if (err) return res.send(500, {error: err});
        else    return res.sendStatus(200);
    });
}

const removeFavorite = (req, res) => {
    let query = {email: req.user.email};

    Account.updateOne({query, $pull: {favoriteItems: req.body.itemName}}, function(err, doc) 
    {
        if (err)  return res.sendStatus(500, {error: err});
        else return res.sendStatus(200);
    });
}

const forgotPassword = (req, res) => {
    let query = {email: req.user.email};
    let resetPasswordCode = (Math.random() + 1).toString(36);
    Account.updateOne(query, {$push: {resetPasswordCode}}, function(err, doc)
    {
        if (err)  return res.sendStatus(500, {error: err});
        else
        {
        mail(req.user.firstName, req.user.email, resetPasswordCode);
        res.sendStatus(200);
        }
    })
}

const resetPassword = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.resetPassword, 10);
    let query = {resetPasswordCode: req.body.id};
    Account.findOneAndUpdate(query, {password: hashedPassword, resetPasswordCode: ""}, function(err, doc)
    {
        if (err)  return res.sendStatus(500, {error: err});
        {
        res.redirect('/');
        }
    })
}

module.exports = {store, changePhoneNumber, changeAddress, addFavorite, removeFavorite, forgotPassword, resetPassword}