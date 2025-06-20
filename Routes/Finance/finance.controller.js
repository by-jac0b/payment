const console = require('tracer').colorConsole();
const {UserModel,UserSchema} = require("Shared/Models/Users.model");
const f = require("Shared/Helpers/f");
const Action = require("Shared/Models/Actions.model/create");
const {TEMP} = require("./../../Controllers/System/temp");
const {PUBLISHER} = require("Shared/Helpers/redis-server");


const hook = async (req, res, next) => {
    console.log(req.body)
    return    res.status(200).json({ "success": true});

};


module.exports = { hook };
