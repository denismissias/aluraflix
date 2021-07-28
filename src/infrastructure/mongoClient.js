const {MongoClient} = require('mongodb');

const uri = "mongodb://aluraflix:aluraflix@localhost:27017/?authSource=aluraflix&readPreference=primary&ssl=false";

const client = new MongoClient(uri);

module.exports = client;