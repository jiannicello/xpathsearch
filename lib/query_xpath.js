'use strict';

var fs = require('fs'),
    writer = require('./writer');

function getNamespaces(str) {
    var re = /xmlns:(.+?)="(.+?)"/g,
        matches = [],
        match = null;

    match = re.exec(str);
    while (match !== null) {
        matches.push({text: match[0], prefix: match[1], namespace: match[2]});
        match = re.exec(str);
    }

    return matches;
}



function run(req, res) {
    var readFile = function (file, callback) {
            fs.readFile(file, function (err, data) {
                if (err) {
                    writer.writeErrorResponse(res, err);
                } else {
                    callback(data);
                }
            });
        },
        state = {
            datastrXslt: null,
            datastrSource: null,
            sourceNamespaces: null
        },
        steps = {
            readXslt: function () {
                var pathToXslt = __dirname + '/../site/xslt/search.xsl';
                readFile(pathToXslt, function (data) {
                    console.log('readFile callback xslt');
                    state.datastrXslt = data.toString();
                    steps.readSource();
                });
            },
            readSource: function () {
                var pathToSource = __dirname + '/../site' + req.query.source;
                readFile(pathToSource, function (data) {
                    console.log('readFile callback source');
                    state.datastrSource = data.toString();
                    steps.parseNamespaces();
                });
            },
            parseNamespaces: function () {
                state.sourceNamespaces = getNamespaces(state.datastrSource);
                steps.setXsltTemplateVariables();
            },
            setXsltTemplateVariables: function () {
                var namespacesTextArr = [];
                
                state.datastrXslt = state.datastrXslt.replace('<<xpath>>', req.query.xpath);
                if (req.query.sort) {
                    state.datastrXslt = state.datastrXslt.replace('<!--<<sort>>-->', req.query.sort);
                }
                if (state.sourceNamespaces.length > 0) {
                    state.sourceNamespaces.forEach(function (namespaceItem) {
                        namespacesTextArr.push(namespaceItem.text);
                    });
                    state.datastrXslt = state.datastrXslt.replace('<<namespaces>>', namespacesTextArr.join('\n'));
                } else {
                    state.datastrXslt = state.datastrXslt.replace('<<namespaces>>', '');
                }

                steps.writeResponse();
            },
            writeResponse: function () {
                writer.writeResponse(res, state.datastrXslt);
            }
        };

    steps.readXslt();
} //end run


module.exports = function () {
    return function (req, res, next) {
        if (req.query.xpath) {
            run(req, res);
        } else {
            next();
        }
    };
};