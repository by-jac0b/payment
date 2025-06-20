(async () => {
    const console = require('tracer').colorConsole();
    await require("./Controllers/System/init");
    const {TEMP} = await require('./Controllers/System/temp.js');
    await TEMP.start();
    await require('./Routes');
    await require('./Controllers/Socket/listener');
})();
