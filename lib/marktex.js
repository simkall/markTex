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
    if(!source.match(/\\numberedHeadings/g)) {
        return source;
    } else {
        source = source.replace(/\\numberedHeadings/g,'');
    }
    var countHashMarks = function(header) {
        return (header.match(/#/g) || []).length; 
    };
    var headerCounter = {
        '1': 1,
        '2': 1,
        '3': 1,
        '4': 1,
    };
    var headers = source.match(/.*#.*/g);
    _.map(headers, function(header, index, all) {
        var original = _.clone(header);
        var level = countHashMarks(header);
        var hashMarks = _.repeat('#', level);
        // Build header number
        var number = _.reduce(_.values(headerCounter),function(mem, levelCount, index) {
            if(index < level) {
                mem+=  levelCount;
                if(index+1 < level) {
                    mem+='.';
                }
            }
            return mem;
        }, '');
        // If next level is same as this increase count
        if(all.length > index+1 && level == countHashMarks(all[index+1])) {
            headerCounter[level]++;
        }
        // Replace original header with numbered header
        source = source.replace(original, hashMarks+' '+number+' '+header.split(hashMarks)[1].trim());
    });
    return source;
};

}) ( (function() {
  if ( typeof exports === "undefined" ) {
    window.marktex = {};
    return window.marktex;
  }
  else {
    return exports;
  }
} )() );
