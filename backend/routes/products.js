const mongodb = require("mongodb");
const Router = require('express').Router;
const db = require('../db')

const Decimal128 = mongodb.Decimal128
const ObjectId = mongodb.ObjectId

const router = Router();


// Get list of products
router.get('/', (req, res, next) => {
    const products = []
    db.getDb()
        .collection('products')
        .find()
        .forEach(prod => {
            prod.price = prod.price.toString()
            products.push(prod)
        })
        .then(result => {
            res.status(200).json(products);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Bad request'});
        })
});

// Get single product
router.get('/:id', (req, res, next) => {
    db.getDb()
        .collection('products')
        .findOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            result.price = result.price.toString()
            res.status(200).json(result);
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Bad request'});
        })
});

// Add new product
router.post('', (req, res, next) => {
    const newProduct = {
        name: req.body.name,
        description: req.body.description,
        price: Decimal128.fromString(req.body.price.toString()),
        image: req.body.image
    };

    db.getDb()
        .collection('products')
        .insertOne(newProduct)
        .then(result => {
            // client.close()
            res.status(201).json({message: 'Product added', productId: result.insertedId});
        })
        .catch(err => {
            console.log(err)
            // client.close()
            res.status(500).json({message: 'Bad request'});
        })
});

// Edit existing product
// Requires logged in user
router.patch('/:id', (req, res, next) => {
    const updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: parseFloat(req.body.price),
        image: req.body.image
    };
    db.getDb()
        .collection('products')
        .updateOne({_id: new ObjectId(req.params.id)}, {$set: updatedProduct})
        .then(result => {
            res.status(201).json({message: 'Product updated', productId: req.params.id});
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Bad request'});
        })
});

// Delete a product
// Requires logged in user
router.delete('/:id', (req, res, next) => {
    db.getDb()
        .collection('products')
        .deleteOne({_id: new ObjectId(req.params.id)})
        .then(result => {
            res.status(200).json({message: 'Product deleted'});
        })
        .catch(err => {
            console.log(err)
            res.status(500).json({message: 'Bad request'});
        })

});

module.exports = router;
