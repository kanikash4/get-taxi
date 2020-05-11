'use strict';

module.exports = function (app) {
	app.all('/_status', function (req, res, next) {
		res.sendStatus(200);
	});
};