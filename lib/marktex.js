(function( expose ) {
var fs = require('fs'),
    _ = require('lodash');
        
expose.latexify = function(source, cwd) { 
    source = replaceInputs(source, cwd);
    source = numberHeaders(source);
    return source;
}; 

function getFullPath(fileInput, cwd) {
    var fullpath = fileInput.slice(7,fileInput.length-1);
    if(cwd && cwd.slice(-1) !== '/') { cwd += '/'; }
    if(cwd) { fullpath = cwd + fullpath; }
    return fullpath;
}

function replaceInputs(source, cwd) {
    var matchInput = /\\input\(.*\)/g;
    var fileInputs = source.match(matchInput);
    _.map(fileInputs, function(fileInput) {
        var fullpath = getFullPath(fileInput,cwd);
        var fileContents = fs.readFileSync(fullpath, 'utf8');
        if(fileContents.match(matchInput)) {
            fileContents = replaceInputs(fileContents,cwd);
        }
        source = source.replace(fileInput, fileContents);
    });
    return source;
};

function numberHeaders(source) {
    console.log(source)
    var headers = source.match(/.*#.*/g);
    console.log(headers)
};
numberHeaders('#Test\n'+
'## Test\n' +
'### Test\n' +
'#### Test\n' +
'Included\n' +
'Inner included\n');
}) ( (function() {
  if ( typeof exports === "undefined" ) {
    window.marktex = {};
    return window.marktex;
  }
  else {
    return exports;
  }
} )() );
