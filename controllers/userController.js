const Account = require('../models/account')
const bcrypt = require('bcrypt')
const mail = require('../middleware/nodemailer')

const store = async (req, res, next) => {
    // confirm that email address has not been registered yet
    const hashedPassword = await bcrypt.hash(req.body.password, 10)
    let query  = Account.where({ email: req.body.signUpEmail });
    query.findOne(function (err, data) 
    {
        if (err) return handleError(err);
        if (data && data != null) 
        {
            res.json({
            message: 'There is an account with this email address already.'
            })
        }
        else
        {
            let account = new Account({
                email: req.body.signUpEmail,
                password: hashedPassword,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                address: req.body.address,
                phoneNumber: req.body.phoneNumber,
                favoriteItems: [],
                cartItems: [],
                admin: false,
                resetPasswordCode: ""
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
    });
}

const changePhoneNumber = (req, res) => {
    let query = {email: req.body.email};

    Account.findOneAndUpdate(query, { phoneNumber: req.body.new-phone-number }, {upsert: true}, function(err, doc)
    {
        if (err) return res.send(500, {error: err});
        else    res.redirect('/')
    });
}

const changeAddress = (req, res) => {
    let query = {email: req.user.email};
    Account.findOneAndUpdate(query, { address: req.body.new-address }, {upsert: true}, function(err, doc) 
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
    let query = {"email": req.body.emailPassword};
    let resetPasswordCode = (Math.random() + 1).toString(36);
    Account.findOneAndUpdate(query, {resetPasswordCode}, function(err, doc)
    {
        if (err)  return res.sendStatus(500, {error: err});
        else
        {
            let query = {email: req.body.emailPassword};
            Account.find(query, 'firstName -_id', function(err, data)
            {
                if (err) return res.send(500, {error: err});
                else
                {
                    mail(data[0].firstName, req.body.emailPassword, resetPasswordCode);
                    res.sendStatus(200);
                }    
            });
        }
    })
}

const resetPassword = async (req, res) => {
    const hashedPassword = await bcrypt.hash(req.body.reset-password, 10);
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