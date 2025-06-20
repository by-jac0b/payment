const console = require('tracer').colorConsole();
const { LISTENER, PUBLISHER } = require("Shared/Helpers/redis-server");
LISTENER.client.subscribe('sendMoney');
const UserProcess = require("../User/proc");
LISTENER.client.on('message', async (channel, message) => {
    message = JSON.parse(message);
    const actions = {
        socket_connected: () => {
            console.info(message);
        },
        sendMoney: async () => {
            console.info(message)
        },

    };

    if (actions[channel]) {
        await actions[channel]();
    }
});

