'use strict';

var connect = require('connect'),
    server = connect.createServer();

server.use(connect.logger('dev'));

server.use(connect.static(__dirname + '/site'));

server.listen(3000);