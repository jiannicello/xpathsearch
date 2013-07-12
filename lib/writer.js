'use strict';

exports.writeErrorResponse = function (res, err) {
    res.writeHead(404);
    res.end(JSON.stringify(err));
};

exports.writeResponse = function (res, data) {
    res.writeHead(200);
    res.end(data);
};

exports.writeJSONResponse = function (res, data) {
    res.writeHead(200, {'Content-Type': 'application/json'});
    res.end(JSON.stringify(data));
};