const console = require('tracer').colorConsole();
const {Settings} = require("Shared/Models/Settings.model");
class Temp {
    constructor() {//log patlı
        this.db = false;
        Temp.instance = this;
        this.que = {

        }
    }
    async start(){
        if(this.db===false){
            this.db =  await Settings.findOne({});
            console.debug("DB Temporary has been loaded", this.db._id);
        }

        console.silly("Temporary installed")
        return this.db;
    }
}

const TEMP = new Temp();
module.exports = {TEMP};

