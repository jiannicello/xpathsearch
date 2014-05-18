'use strict';

var connect = require('connect'),
    query_sources = require('./lib/query_sources'),
    query_xpath = require('./lib/query_xpath'),
    post_download = require('./lib/post_download'),
    server = connect.createServer();

server.use(connect.logger('dev'));

server.use(connect.query());
server.use(query_xpath());
server.use(query_sources());


server.use(connect.bodyParser());
server.use(post_download());

server.use(connect.static(__dirname + '/site'));

server.listen(3000);