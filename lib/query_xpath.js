'use strict';

var fs = require('fs'),
    writer = require('./writer');

function getDataStr(req, data) {
    var dataXPath = data.toString().replace('<<xpath>>', req.query.xpath);

    if (req.query.sort) {
        return dataXPath.replace('<!--<<sort>>-->', req.query.sort);
    }

    return dataXPath;
}

module.exports = function () {
    return function (req, res, next) {
        if (req.query.xpath) {
            fs.readFile(__dirname + '/../site/xslt/search.xsl', function (err, data) {
                if (err) {
                    writer.writeErrorResponse(res, err);
                } else {
                    writer.writeResponse(res, getDataStr(req, data));
                }
            });
        } else {
            next();
        }
    };
};