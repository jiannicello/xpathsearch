'use strict';

var fs = require('fs'),
    writer = require('./writer');
    
function getNamespacesArr(str) {
    var re = /xmlns:(.+?)="(.+?)"/g,
        matches = [],
        match = re.exec(str);
    
    while (match = re.exec(str)) {
        matches.push({text:match[0], prefix: match[1], namespace: match[2]});
    }
    
    return matches;
}

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