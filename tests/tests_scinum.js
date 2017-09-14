QUnit.test( "hello test", function( assert ) {
    assert.ok( 1 == "1", "Passed!" );
});

QUnit.test("new scinum positive", function (assert) {
    var toTestStrs = new SciNum("+1.23", "+456");
    assert.deepEqual(toTestStrs.mantissa, 1.23, "mantissa str ok");
    assert.deepEqual(toTestStrs.power, 456, "power str ok");
    var toTestNums = new SciNum(1.23, 456);
    assert.deepEqual(toTestNums.mantissa, 1.23, "mantissa float ok");
    assert.deepEqual(toTestNums.power, 456, "power int ok");
});

QUnit.test("new scinum negative", function (assert) {
    var toTestStrs = new SciNum("-1.23", "-456");
    assert.deepEqual(toTestStrs.mantissa, -1.23, "mantissa str ok");
    assert.deepEqual(toTestStrs.power, -456, "power str ok");
    var toTestNums = new SciNum(-1.23, -456);
    assert.deepEqual(toTestNums.mantissa, -1.23, "mantissa float ok");
    assert.deepEqual(toTestNums.power, -456, "power int ok");
});

QUnit.test("div pos power", function (assert) {
    var big = new SciNum(2.00, 345);
    var small = new SciNum(4.00, 123);
    assert.deepEqual(big.div(small), new SciNum(5.00, 221), "big over small");
    assert.deepEqual(small.div(big), new SciNum(2, -222), "small over big");
    assert.deepEqual(small.div(small), new SciNum(1, 0), "small over small")
});

QUnit.test("div neg power", function (assert) {
    var big = new SciNum(-2.00, -345);
    var small = new SciNum(-4.00, -123);
    assert.deepEqual(big.div(small), new SciNum(5.00, -223), "big over small");
    assert.deepEqual(small.div(big), new SciNum(2, 222), "small over big");
    assert.deepEqual(small.div(small), new SciNum(1, 0), "small over small")
});

QUnit.test("setting fixedSize", function (assert) {
    var tst = new SciNum(1, 2);
    assert.deepEqual(tst.fixedSize, 4, "start fixedSize");
    tst.fixedSize = 5;
    assert.deepEqual(tst.fixedSize, 5, "new fixedSize");
});

QUnit.test("toString no round", function (assert) {
    var tstPos = new SciNum(1.23, 456);
    var tstNeg = new SciNum(-1.23, -456);
    assert.deepEqual(tstPos.toString(), "1.2300e+456", "pos mantissa, pos power");
    assert.deepEqual(tstNeg.toString(), "-1.2300e-456", "neg mantissa, neg power");
});

QUnit.test("toString regular round", function (assert) {
    var tstPos = new SciNum(1.23456, 456);
    var tstNeg = new SciNum(-1.23456, -456);
    assert.deepEqual(tstPos.toString(), "1.2346e+456", "pos mantissa, pos power");
    assert.deepEqual(tstNeg.toString(), "-1.2346e-456", "neg mantissa, neg power");
});

QUnit.test("toString special round", function (assert) {
    var tstPos = new SciNum(9.999951, 123);
    var tstNeg = new SciNum(-9.999951, -123);
    var tstToZero = new SciNum(-9.999951, -1);
    assert.deepEqual(tstPos.toString(), "1.0000e+124", "pos mantissa, pos power");
    assert.deepEqual(tstNeg.toString(), "-1.0000e-122", "neg mantissa, neg power");
    assert.deepEqual(tstToZero.toString(), "-1.0000e+0", "round to zero power");
});

QUnit.test("toString after setting fixedSize", function (assert) {
    var tst = new SciNum(1.23456, 1);
    tst.fixedSize = 5;
    assert.deepEqual(tst.toString(), "1.23456e+1", "fixedSize 5");
    tst.fixedSize = 3;
    assert.deepEqual(tst.toString(), "1.235e+1", "fixedSize 3");
});

function makeSNArray(numPairs) {
    return numPairs.map(function (el) { return new SciNum(el[0], el[1]); });
}

QUnit.test("helper test function makesSNArray", function (assert) {
    var expected = [new SciNum(1, 2), new SciNum(-3, -4)];
    assert.deepEqual(makeSNArray([[1, 2], [-3, -4]]), expected, "creates array");
});

QUnit.test("sumSciNum maxPower", function (assert) {
    assert.deepEqual(maxPower([]), -Infinity, "empty array not covered");
    assert.deepEqual(maxPower(makeSNArray([[1.1, 2]])), 2, "single element");
    assert.deepEqual(maxPower(makeSNArray([ [1.1, 2], [1.1, 30], [1.1, 20]])), 30, "multi elements");
    assert.deepEqual(maxPower(makeSNArray([ [1.1, -3], [1.1, -2], [1.1, -5] ])), -2, "neg elements");
});

QUnit.test("sumSciNum one element", function (assert) {
    var tstPos = new SciNum(1.23, 45);
    assert.deepEqual(sumSciNum([tstPos]), tstPos, "makes itself pos");
    var tstNeg = new SciNum(-1.23, -45);
    assert.deepEqual(sumSciNum([tstNeg]), tstNeg, "makes itself neg");
});

QUnit.test("sumSciNum multielements all same power", function (assert) {
    var power = 5;
    var notOverTen = makeSNArray([ [1.1, power], [2.2, power], [3.3, power] ]);
    assert.deepEqual(sumSciNum(notOverTen), new SciNum(6.6, power), "sum of mantissa lt ten");
    var overTen = makeSNArray([ [9.9, power], [9.9, power] ]);
    assert.deepEqual(sumSciNum(overTen), new SciNum(1.98, power + 1), "sum gt ten");
    var overHundred = makeSNArray([ [99, power], [99, power]]);
    assert.deepEqual(sumSciNum(overHundred), new SciNum(1.98, power + 2), "sum gt hundred");
});

QUnit.test("sumSciNum multielements all different power but not over maxPowerDiff", function (assert) {
    var notOverTen = makeSNArray([ [1.1, 4], [2.2, 3], [3.3, 2] ]);
    assert.deepEqual(sumSciNum(notOverTen), new SciNum(1.353, 4), "sum of mantissa lt ten");
    var overTen = makeSNArray([ [9.9, 4], [9.9, 3] ]);
    assert.deepEqual(sumSciNum(overTen), new SciNum(1.089, 5), "sum gt ten");
});

QUnit.test("sumSciNum multielements all different power over maxPowerDiff", function (assert) {
    var notOverTen = makeSNArray([ [1.1, 40], [2.2, 39], [3.3, 24] ]);
    assert.deepEqual(sumSciNum(notOverTen), new SciNum(1.32, 40), "sum of mantissa lt ten");
    var overTen = makeSNArray([ [9.9, 40], [9.9, 39] , [5, 24]]);
    assert.deepEqual(sumSciNum(overTen), new SciNum(1.089, 41), "sum gt ten");
    var onlyOneElCounted = makeSNArray([ [-1, 100], [2, 84], [3, 80], [4, -100]]);
    assert.deepEqual(sumSciNum(onlyOneElCounted), new SciNum(-1, 100), "only one element added");
});

QUnit.test("sumSciNum multielements negative powers negative values", function (assert) {
    var ltOnegtZero = makeSNArray([ [1, -40], [-2, -41], [3, -44] ]);
    assert.deepEqual(sumSciNum(ltOnegtZero), new SciNum(8.003, -41), "sum of mantissa lt one");
    var negNotOverTen = makeSNArray([ [-1, -1], [-2, -2] , [-3, -3]]);
    assert.deepEqual(sumSciNum(negNotOverTen), new SciNum(-1.23, -1), "sum not lt one");
    var negOverTen = makeSNArray([ [-9.9, -1], [-2, -2] , [-3, -3]]);
    assert.deepEqual(sumSciNum(negOverTen), new SciNum(-1.013, 0), "sum not lt one");
});





