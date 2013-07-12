'use strict';

var connect = require('connect'),
    query_sources = require('./lib/query_sources'),
    server = connect.createServer();

server.use(connect.logger('dev'));

server.use(connect.query());

server.use(query_sources());

server.use(connect.static(__dirname + '/site'));

server.listen(3000);