var PEG = require('pegjs');
var assert = require('assert');
var fs = require('fs');

// Read file contents
var data = fs.readFileSync('my.peg', 'utf-8');

// Show the PEG grammar file
console.log(data);

// Create my parser
var parse = PEG.buildParser(data).parse;

// Do some  tests
assert.deepEqual(parse("a"),"a");
assert.deepEqual(parse("   a   "),"a");
assert.deepEqual(parse("a\t\t\n\n\n   "),"a");
assert.deepEqual(parse("\n\n\n\t   a   "),"a");

assert.deepEqual(parse("(a)"),["a"]);
assert.deepEqual(parse("( a)"),["a"]);
assert.deepEqual(parse("   (   a\n\t\t\t\t   )\n\n\n\t\t"),["a"]);

assert.deepEqual(parse("(+ a b)"),["+","a","b"]);
assert.deepEqual(parse("(+ a\n     b)"),["+","a","b"]);
assert.deepEqual(parse("(+ a b   )"),["+","a","b"]);
assert.deepEqual(parse("(    + a    b)"),["+","a","b"]);

var fac_result = ["define","factorial", ["lambda",["n"],["if",["=","n","0"],"1",["*","n",["factorial", ["-","n","1"]]]]]];
assert.deepEqual( parse("(define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1))))))"),fac_result);
assert.deepEqual( parse("(    define     factorial (    lambda (     n    ) (   if (   =    n    0) 1     (    * n (   factorial (   - n 1     )))     )))"),fac_result);


var input = "   (   define factorial\n\t(    lambda (n)\n\t\t(if    (   = n 0) 1\n\t\t(* n (    factorial (- n 1)))   ))   )";
assert.deepEqual(parse(input), fac_result);
