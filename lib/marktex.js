(function( expose ) {
var fs = require('fs'),
    _ = require('lodash');
        
expose.latexify = function(source, cwd) { 
    source = replaceInputs(source, cwd);
    source = numberedHeadings(source);
    source = tableOfContents(source);
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
}

function numberedHeadings(source) {
    // If command is not present return immediately othervise 
    // remove command.
    if(!source.match(/\\numberedHeadings/g)) {
        return source;
    } else {
        source = source.replace(/\\numberedHeadings/g,'');
    }
    var countHashMarks = function(heading) {
        return (heading.match(/#/g) || []).length; 
    };
    
    // Count headings h1 -> h6
    var headingsCounter = [
        1,
        1,
        1,
        1,
        1,
        1,
    ];
    var headings = source.match(/.*#.*/g);
    var previusLevel = -1;
    _.map(headings, function(heading, index, all) {
        var level = countHashMarks(heading)-1;
        var hashMarks = _.repeat('#', countHashMarks(heading));
        // If previous level is same as this increase count
        if(level <= previusLevel) {
            headingsCounter[level]++;
            // After adding to a level reset counter on lower level
            headingsCounter = _.map(headingsCounter, function(count, index) {
                return index <= level ? count : 1;
            });
        }
        // Build heading number
        var number = _.reduce(headingsCounter,function(mem, levelCount, index) {
            if(index <= level) {
                mem += levelCount;
                if(index < level) {
                    mem+='.';
                }
            }
            return mem;
        }, '');
        // Replace original heading with numbered heading
        source = source.replace(heading, hashMarks+' '+number+' '+heading.split(hashMarks)[1].trim());
        previusLevel = level;
    });
    return source;
}

// Work in progress
function tableOfContents(source) {
    // If command is not present return immediately othervise 
    // remove command.
    if(!source.match(/\\tableOfContents/g)) {
        console.log('no match for tableOfContents');
        return source;
    } 
    // The link counter ensures that each link is 
    var linkCounter = 0;
    var buildLink = function(heading) {
        linkCounter++;
        var clean = heading.match(/[A-Za-z]/g);
        return _.chain(clean)
            .join('')
            .reduce(function(word, letter) {
                word = word+letter;
                return word;
            }, '')
            .value() + linkCounter; 
    };
    var headings = source.match(/.*#.*/g);
    var toc = _.reduce(headings, function(mem, heading, index) {
        var link = buildLink(heading);
        source = source.replace(heading, heading + ' <a name='+link+'></a>');
        mem += '* [' + heading.replace(/#/g, '').trim() +'](#'+link+')\n';
        return mem;
    }, '');
    source = source.replace(/\\tableOfContents/g, toc);
    return source;
}

}) ( (function() {
  if ( typeof exports === "undefined" ) {
    window.marktex = {};
    return window.marktex;
  }
  else {
    return exports;
  }
} )() );
