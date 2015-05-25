var tap = require('tap');
var markedtex = require('../lib/index');
var fs = require('fs');
 
tap.test('Headers should be numbered in ascending order', function (t) {
    var input = fs.readFileSync('test/res/table-of-contents.md', 'utf8');
    var expectedOutput = fs.readFileSync('test/res/table-of-contents_out.md', 'utf8');
    var markdown = markedtex.latexify(input, 'test/res/');
    t.ok(input);
    t.ok(expectedOutput);
    t.ok(markdown);
    t.equal(markdown, expectedOutput, 'table of contents is malformed');
    t.end();
});
