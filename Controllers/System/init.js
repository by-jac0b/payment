const console = require('tracer').colorConsole();
(async function () {
    const {dbInit} = await require("Shared/Models/db.init");
    process
        .on('unhandledRejection', (reason, p) => {
            console.error('Unhandled Rejection at Promise', reason, p);
        })
        .on('uncaughtException', err => {
            console.error('Node JS Hatası:', err);
        })
        .on('SIGINT', () => {
        })
        .setMaxListeners(0);


    module.exports = {
        //dbInit
    }
})()