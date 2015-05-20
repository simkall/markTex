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
};

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
    var headingsCounter = [
        1,
        1,
        1,
        1,
    ];
    var headings = source.match(/.*#.*/g);
    var previusLevel = -1;
    _.map(headings, function(heading, index, all) {
        var original = _.clone(heading);
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
        source = source.replace(original, hashMarks+' '+number+' '+heading.split(hashMarks)[1].trim());
        previusLevel = level;
    });
    console.log(source)
    return source;
};
function tableOfContents(source) {
    // If command is not present return immediately othervise 
    // remove command.
    if(!source.match(/\\tableOfContents/g)) {
        return source;
    } 
        
    var headings = source.match(/.*#.*/g);
    // console.log('got command')
    // console.log(source)
    var toc = _.map(headings, function(heading) {
        heading = heading.replace(/#/g, '');
        console.log(heading)
    })
    source = source.replace(/\\tableOfContents/g, toc);
    
    return source;
}

// tableOfContents('# 1 Title\n## 1.1 SubTitle\n### 1.1.1 SubsubTitle\n# 1 SecondTitle\n## 1.1 SecondSubTitle\n### 1.1.1 SecondSubsubTitle\n\\tableOfContents');
numberedHeadings('# Title\n## SubTitle\n## SubsubTitle\n# SecondTitle\n## SecondSubTitle\n## SecondSubsubTitle\n\\numberedHeadings');

}) ( (function() {
  if ( typeof exports === "undefined" ) {
    window.marktex = {};
    return window.marktex;
  }
  else {
    return exports;
  }
} )() );
