const Loki = require("lokijs");
const Status = require("./Status");
const User = require("./User");
const bcrypt = require('bcrypt');

const db = new Loki('demo.db',{
    autoload: true,
    autoloadCallback: databaseInit,
    autosave: true,
    autosaveInterval: 1000
});

function databaseInit(){
    var entries = db.getCollection('status');
    if(entries === null)
    {
        entries = db.addCollection('status');

        entries.insert(new Status("Michael",false,true));
        entries.insert(new Status("Engelbert",false,true));
    }
}

module.exports = db;