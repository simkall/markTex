var tap = require('tap');
var marktex = require('../lib/index');
var fs = require('fs');
 
tap.test('Headers should be numbered in ascending order', function (t) {
    var testFile = fs.readFileSync('test/res/numbered-headings.md', 'utf8');
    var markdown = marktex.latexify(testFile, 'test/res/');
    t.ok(testFile);
    t.ok(markdown);
    t.equal(markdown, '# 1 Title\n## 1.1 SubTitle\n### 1.1.1 SubsubTitle\n# 2 SecondTitle\n## 2.1 SecondSubTitle\n### 2.1.1 SecondSubsubTitle\n', 'headings are not numbered correctly');
    t.end();
});
