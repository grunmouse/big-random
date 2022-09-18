/* global describe, it */
"use strict";

var RC4 = require("../rc4.js");
var assert = require("assert");

function sq(x) {
  return x * x;
}

// http://sites.stat.psu.edu/~mga/401/tables/Chi-square-table.pdf
var chi15p1 = 5.229;
// var chi15p5 = 7.261;
// var chi15p10 = 8.547;
// var chi15p90 = 22.307;
// var chi15p95 = 24.996;
var chi15p99 = 30.578;

var chi1p1 = 0.000;
var chi1p99 = 6.635;

var chi6p1 = 0.872;
var chi6p99 = 16.812;

describe("constructor", function () {
  it("autoseeds if no parameter given", function () {
    var rc4 = new RC4();
    var r = rc4.randomByte();

    assert(0 <= r && r < 256);
  });

});

describe("currentState + setState", function () {
  it("can be used to reproduce values", function () {
    var rc4 = new RC4();
    var state = rc4.currentState();
    var N = 100;

    function generate() {
      var result = new Array(N);
      for (var i =0; i < N; i++) {
        result[i] = rc4.randomByte();
      }
      return result;
    }

    var a = generate();
	
    rc4.setState(state);
	
	assert.deepEqual(rc4.currentState(), state, 'state set success');
    var b = generate();

    assert.deepEqual(a, b, "generated sequences should be equal");
  });

});

describe("χ² tests", function () {
  var rc4 = new RC4();

  function run(N) {
      var i;
      var high = new Array(16);
      var low = new Array(16);
      for (i = 0; i < 16; i++) {
        high[i] = low[i] = 0;
      }

      for (i = 0; i < N; i++) {
        var b = rc4.randomByte();
        var l = b % 16;
        var h = (b - l) / 16;

        high[h] += 1;
        low[l] += 1;
      }

      var chih = 0;
      var chil = 0;

      var nps = N/16;
      for (i = 0; i < 16; i++){
        chih += sq(high[i] - nps)/nps;
        chil += sq(low[i] - nps)/nps;
      }

      // console.info("high χ² = " + chih);
      // console.info("low χ² = " + chil);

      return (chi15p1 < chih && chih < chi15p99) &&
        (chi15p1 < chil && chil < chi15p99);
  }

  function chisqurareit(N, n) {
    it("N = " + N + " - " + n + ". run", function () {
      var a = run(N);
      var b = run(N);
      var c = run(N);
      var d = run(N);
      var e = run(N);

      // two may fail
      assert(a + b + c + d + e > 2);
    });
  }

  [1000, 10000, 100000].forEach(function (N) {
    [1, 2, 3].forEach(function (n) {
      chisqurareit(N, n);
    });
  });
});


describe("RC4small", function () {
  it("randomNative returns integers in [0, 15]", function () {
    var rc4 = new RC4.RC4small();
    var N = 1000;

    for (var i = 0; i < N; i++) {
      var r = rc4.randomNative();
      assert(r === (r | 0) && 0 <= r && r <= 15);
    }
  });

  it("randomByte returns integers in [0, 255]", function () {
    var rc4 = new RC4.RC4small();
    var N = 1000;

    for (var i = 0; i < N; i++) {
      var r = rc4.randomByte();
      assert(r === (r | 0) && 0 <= r && r <= 255);
    }
  });

  describe("currentStateString + setStateString", function () {
    it("can be used to reproduce values", function () {
      var rc4 = new RC4.RC4small();
      var state = rc4.currentStateString();
      var N = 100;

      function generate() {
        var result = new Array(N);
        for (var i =0; i < N; i++) {
          result[i] = rc4.randomNative();
        }
        return result;
      }

      var a = generate();
      rc4.setStateString(state);
      var b = generate();

      assert.deepEqual(a, b, "generated sequences should be equal");
    });

    it("throws an error if stateString is invalid", function () {
      assert.throws(function () {
        var rc4 = new RC4.RC4small();
        rc4.setStateString("abc");
      });
    });
  });


});

describe("χ² tests, RC4small", function () {
  var rc4 = new RC4.RC4small();

  function run(N) {
      var i;
      var values = new Array(16);

      for (i = 0; i < 16; i++) {
        values[i] = 0;
      }

      for (i = 0; i < N; i++) {
        var b = rc4.randomNative();
        values[b] += 1;
      }

      var chi = 0;

      var nps = N/16;
      for (i = 0; i < 16; i++){
        chi += sq(values[i] - nps)/nps;
      }

      return (chi15p1 < chi && chi < chi15p99);
  }

  function chisqurareit(N, n) {
    it("N = " + N + " - " + n + ". run", function () {
      var a = run(N);
      var b = run(N);
      var c = run(N);

      // only one may fail
      assert(a || b);
      assert(b || c);
    });
  }

  [1000, 10000, 100000].forEach(function (N) {
    [1, 2, 3].forEach(function (n) {
      chisqurareit(N, n);
    });
  });
});