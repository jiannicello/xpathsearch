'use strict';

var fs = require('fs'),
    writer = require('./writer');

function getDataStr(req, data) {
    var dataXPath = null,
        dataSort = null,
        dataNamespace = null;

    dataXPath = data.toString().replace('<<xpath>>', req.query.xpath);
        
    if (req.query.sort) {
        dataSort = dataXPath.replace('<!--<<sort>>-->', req.query.sort);
    } else {
        dataSort = dataXPath;
    }
    
    console.log('req.query.namespace: ' + req.query.namespace);
    if (req.query.namespace) {
        dataNamespace = dataSort.replace('<<namespace>>', req.query.namespace);
        
    } else {
        dataNamespace = dataSort.replace('<<namespace>>', '');
    }

    return dataNamespace;
}

module.exports = function () {
    return function (req, res, next) {
        if (req.query.xpath) {
            fs.readFile(process.cwd() + '/site/xslt/search.xsl', function (err, data) {
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