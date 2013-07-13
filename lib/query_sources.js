'use strict';

var fs = require('fs'),
    writer = require('./writer');

module.exports = function () {
    return function (req, res, next) {
        if (req.query.get_ddl_sources) {
            fs.readdir(__dirname + '/../site/data', function (err, files) {
                var data = [];

                if (err) {
                    writer.writeErrorResponse(res, err);
                } else {
                    files.forEach(function (file) {
                        data.push({text: file, value: '/data/' + file});
                    });

                    writer.writeJSONResponse(res, data);
                }
            });
        } else {
            next();
        }
    };
};