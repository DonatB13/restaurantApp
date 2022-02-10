var PORT = process.env.PORT || 5000;

//requires
const express           = require('express')
const mongoose          = require('mongoose');
const flash             = require('express-flash')
const session           = require('express-session')
const bcrypt            = require('bcrypt')
const methodOverride    = require('method-override')
const passport            = require('passport')
require('./config/passport')(passport);
var dotenv = require('dotenv').config();
//mongoose models
const Account           = require('./models/account')
const Item              = require('./models/item')

//routes
const itemRoute         = require('./routes/item')
const userRoute         = require('./routes/user')

//express app
const app               = express()

// Static files
app.use(express.static('public'))

//additional middlewares
app.use(express.urlencoded({ extended: false }))
app.use(flash())
app.use(session({
    secret: process.env.SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000
    }
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

// register view engine
app.set('view-engine', 'ejs')

// connect to mongoDB
const dbURL = process.env.MONGODB;

mongoose.connect(dbURL)
// only listen to requests from user when database connection has been established
.then((result) =>   {app.listen(PORT);      console.log("connected to db")}
)
.catch((err) => console.log(err));


// index page
app.get('/', (req, res) => {
    if(req.isAuthenticated())
    {
        if(req.query.id)
        {
            Item.find({}, function(err, items) {
                if(err)
                {
                    res.send("Error occured");
                    return;
                }
                console.log(req.user)
                let query = {'email': req.user.email};

                Account.find(query, 'admin favoriteItems -_id', function(err, data)
                {
                    res.render('index.ejs', {id: req.query.id, favoriteItems: data[0].favoriteItems, items, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, address: req.user.address, phoneNumber: req.user.phoneNumber, admin: data[0].admin})
                    return;
                });
            });
        }
        else
        {
            Item.find({}, function(err, items) {
                let query = {'email': req.user.email};
                if(err)
                {
                    res.send("Error occured");
                    return;
                }
                Account.find(query, 'admin favoriteItems -_id', function(err, data)
                {
                    res.render('index.ejs', {favoriteItems: data[0].favoriteItems, items: items, email: req.user.email, firstName: req.user.firstName, lastName: req.user.lastName, address: req.user.address, phoneNumber: req.user.phoneNumber, admin: data[0].admin})
                    return;
                });
            });
        }
    }
    else
    {
        if(req.query.id)
        {
            let id = req.query.id;
            Item.find({}, function(err, items)
            {
                res.render('index.ejs', {items, id, admin: false});
                return;
            });
        }
        else
        {
            Item.find({}, function(err, items) {
                res.render('index.ejs', {items: items, admin: false});
                return;
            });
        }
    }
})

app.use('/api/item', itemRoute);
app.use('/api/user', userRoute);

// Login
app.post('/login', (req, res, next) => {
    passport.authenticate('local', {
    failureFlash: true,
    successRedirect: '/'
    })
    (req, res, next);
});

app.delete('/logout', (req, res) => {
    req.logOut()
    res.redirect('/')
})

