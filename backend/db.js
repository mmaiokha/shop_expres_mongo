const mongodb = require('mongodb')
const MongoClient = mongodb.MongoClient

const mongoUrl = "mongodb+srv://admin:admin@cluster0.rbg9kgt.mongodb.net/shop?retryWrites=true"

let _db;

const initDb = callback => {
    if (_db) {
        return callback(null, _db)
    }
    MongoClient
        .connect(mongoUrl)
        .then(client => {
            _db = client.db()
            callback(null, _db)
        })
        .catch(err => {
            callback(err)
        })
}

const getDb = () => {
    if (!_db) {
        throw Error("database not initialize")
    }
    return _db
}

module.exports = {
    getDb, initDb
}