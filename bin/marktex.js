#!/usr/bin/env node
(function () {
    'use strict';
    var marktex = require( 'marktex' ),
        fs = require('fs'),
        stream,
        cwd = '',
        buffer = '';
   //THis is wrong
    if (process.argv.length >= 3) {
        stream = fs.createReadStream(process.argv[2]);
        cwd = require('path').dirname(process.argv[2]);
    } else {
        console.error('Input file missing');
        process.exit(1);
    }
    stream.resume();
    stream.setEncoding('utf8');

    stream.on('error', function(error) {
        console.error(error.toString());
        process.exit(1);
    });
 
    stream.on('data', function(data) {
        buffer += data;
    });
    stream.on('end', function() {
        console.log(marktex.latexify(buffer,cwd));
    });
}());
