var tap = require('tap');
var marktex = require('../lib/index');
var fs = require('fs');

tap.test('Marktex should be defined', function (t) {
    t.ok(marktex)
    t.end()
});

tap.test('Input commands should be replaced with file contents', function (t) {
    var testFile = fs.readFileSync('test/res/input/test.md', 'utf8');
    var markdown = marktex.latexify(testFile, 'test/res/input/');
    t.equal(markdown, 'test\ntest_input\ntest_inner_input', 'inputs have not been replaced');
    t.end();
});