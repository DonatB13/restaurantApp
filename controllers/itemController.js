const Item = require('../models/item')

const store = (req, res, next) => {
    let item = new Item({
        name: req.body.itemName,
        description: req.body.description,
        price: req.body.price,
        imagePath: 'uploads/'+req.file.originalname,
        menu: req.body.menu
    })
    item.save()
    .then(response => {
        res.json({
            message: 'Item added successfully!'
        })
    })
    .catch(error => {
        res.json({
            message: 'An error occured!'
        })
    })
}

const getPrice = (req, res) => {
    let query = {'name': req.body.itemName};
    Item.find(query, 'price -_id', function(err, data)
    {
        if (err) return res.send(500, {error: err});
        else    return res.send(data);
    });
}


module.exports = {store, getPrice}