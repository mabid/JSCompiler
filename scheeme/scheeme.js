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

assert.deepEqual(parse("(a)"),["a"]);

assert.deepEqual(parse("(+ a b)"),["+","a","b"]);

var fac_result = ["define","factorial", ["lambda",["n"],["if",["=","n","0"],"1",["*","n",["factorial", ["-","n","1"]]]]]];
assert.deepEqual( parse("(define factorial (lambda (n) (if (= n 0) 1 (* n (factorial (- n 1))))))"),fac_result);
