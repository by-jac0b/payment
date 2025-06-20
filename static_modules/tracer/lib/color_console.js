"use strict";
var colors = require('colors/safe');
module.exports = function(conf) {
	return require('./console')({
		filters : {
			//log : do nothing
			trace : colors.magenta,
			debug : colors.cyan,
			info : colors.blue,
			warn : colors.yellow,
			error : colors.red.bold,
			fatal : colors.gray.bgRed,
			success : colors.black.bgGreen,
			silly : colors.gray.bold,
			color : colors.rainbow,
			ins : colors.inverse
		}
	}, conf);
};
