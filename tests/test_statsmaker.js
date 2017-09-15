
QUnit.test("makeSciNumArray single element", function (assert) {
    var posVals = [ ["+1", "+2"] ];
    assert.deepEqual(makeSciNumArray(posVals), [new SciNum(1, 2)], "single positive value");
    var negVals = [ ["-1", "-2"] ];
    assert.deepEqual(makeSciNumArray(negVals), [new SciNum(-1, -2)], "single positive value");
});

QUnit.test("makeSciNumArray multiple elements", function (assert) {
    var arrVals = [ ["+1", "+2"] , ["3", "-4"], ["-5.2", "67"], ["-8.9", "-1000"]];
    assert.deepEqual(
        makeSciNumArray(arrVals),
        [new SciNum(1, 2), new SciNum(3, -4), new SciNum(-5.2, 67), new SciNum(-8.9, -1000)],
        "multiple elements"
    );
});

QUnit.test("makeStats positive poswers", function (assert) {
    var arrVals = makeSciNumArray([ [1, 4] , [2, 3]]);
    var total = new SciNum(2.4, 5);
    var expected = {total: "240,000", occurrences: "12,000", oneInChance: "20.00", pctChance: "5.000"};
    assert.deepEqual(
        getStatsObj(total, arrVals),
        expected,
        "first try"
    );
});


