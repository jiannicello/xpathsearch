'use strict';

var EOL = require('os').EOL;

function getFileName() {
    var dt = new Date(),
        sb = ['download_'],
        getTwoDigit = function (number) {
            var s = number.toString();

            if (s.length === 1) {
                return '0' + s;
            }

            return s;
        };

    sb.push(dt.getFullYear());
    sb.push(getTwoDigit(dt.getMonth() + 1));
    sb.push(getTwoDigit(dt.getDate()));
    sb.push(getTwoDigit(dt.getHours()));
    sb.push(getTwoDigit(dt.getMinutes()));
    sb.push(getTwoDigit(dt.getSeconds()));

    sb.push('.txt');

    return sb.join('');
}

module.exports = function () {
    return function (req, res, next) {
        var sb = [],
            data = null;

        if (req.url === '/download') {
            data = JSON.parse(req.body.data);

            if (data.header.length > 0) {
                sb.push(data.header.join('\t'));
                sb.push(EOL);
            }

            data.rows.forEach(function (row) {
                sb.push(row.join('\t'));
                sb.push(EOL);
            });

            res.setHeader('Content-disposition', 'attachment; filename=' + getFileName());
            res.writeHead(200, {'Content-Type': 'text/plain'});
            res.end(sb.join(''));
        } else {
            next();
        }
    };
};