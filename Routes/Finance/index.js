const express = require('express');
const router = express.Router();
const Controller = require('./finance.controller');
const Middleware = require('./finance.middleware');


router.all('/hook', Middleware.hook, Controller.hook);


module.exports = router;
