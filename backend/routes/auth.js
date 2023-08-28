const Router = require('express').Router;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../db')

const router = Router();

const createToken = (payload) => {
    return jwt.sign(payload, 'secret', {expiresIn: '1h'});
};

router.post('/login', (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;

    db.getDb()
        .collection('users')
        .findOne({email})
        .then(user => {
            return bcrypt.compare(pw, user.password)
        })
        .then(isValidPw => {
            if (!isValidPw) {
                throw Error()
            }
            const token = createToken({email: user.email});
            res
                .status(201)
                .json({token, user: {email}});
        })
        .catch(err => {
            res
                .status(401)
                .json({message: 'Authentication failed, invalid username or password.'});
        })
    const token = createToken();
});

router.post('/signup', (req, res, next) => {
    const email = req.body.email;
    const pw = req.body.password;
    bcrypt.hash(pw, 12)
        .then(hashedPW => {
            db.getDb()
                .collection('users')
                .insertOne({email, password: hashedPW})
                .then(user => {
                    const token = createToken({email: user.email});
                    res
                        .status(201)
                        .json({token, user: {email}});
                })
        })
        .catch(err => {
            console.log(err);
            res.status(500).json({message: 'Creating the user failed.'});
        });
    // Add user to database
});

module.exports = router;
