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

function getNamespacesDataStr(datastr) {
    var namespacesArr = getNamespacesArr(datastr),
        namespaces = null;
    
    if (namespacesArr.length === 0) {
        return datastr;
    } else {
        namespaces = namespacesArr.join('\n');
        return datastr.replace('<!--<<namespaces>>-->', namespaces);
    }
}

function getSortDataStr(req, datastr) {
    if (req.query.sort) {
        return datastr.replace('<!--<<sort>>-->', req.query.sort);
    } else {
        return datastr;
    }
}

function getDataStr(req, data) {
    var datastrXPath = data.toString().replace('<<xpath>>', req.query.xpath),
        datastrSort = getSortDataStr(req, datastrXPath),
        datastrNamespaces = getNamespacesDataStr(datastrSort);
    
    return datastrNamespaces;
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