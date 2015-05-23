var tap = require('tap');
var marktex = require('../lib/index');
var fs = require('fs');
 
tap.test('Headers should be numbered in ascending order', function (t) {
    var input = fs.readFileSync('test/res/numbered-headings.md', 'utf8');
    var expectedOutput = fs.readFileSync('test/res/numbered-headings_out.md', 'utf8');
    var markdown = marktex.latexify(input, 'test/res/');
    t.ok(input);
    t.ok(expectedOutput);
    t.ok(markdown);
    t.equal(markdown, expectedOutput, 'headings are not numbered correctly');
    t.end();
});