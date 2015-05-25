var tap = require('tap');
var markedtex = require('../lib/index');
var fs = require('fs');

tap.test('Marktex should be defined', function (t) {
    t.ok(markedtex);
    t.end();
});

tap.test('Input commands should be replaced with file contents', function (t) {
    var input = fs.readFileSync('test/res/input/test.md', 'utf8');
    var expectedOutput = fs.readFileSync('test/res/input/test_out.md', 'utf8');
    var markdown = markedtex.latexify(input, 'test/res/input/');
    t.ok(input);
    t.ok(expectedOutput);
    t.ok(markdown);
    t.equal(markdown, expectedOutput, 'inputs have not been replaced');
    t.end();
});
