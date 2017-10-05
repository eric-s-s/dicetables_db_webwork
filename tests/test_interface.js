QUnit.test("onPageLoad first table not hidden, others are.", function (assert) {
    $.holdReady(true);
    onPageLoad();
    var allTables = $('.tableRequest');
    var shownTables = $('.tableRequest:visible');
    var hiddentables = $('.tableRequest:hidden');

    assert.equal(shownTables.length, 1, 'only one shown table');
    assert.equal(shownTables[0], allTables[0], 'the shown table is the first table');
    for (var mainIndex = 1; mainIndex < allTables.length; mainIndex++){
        assert.equal(allTables[mainIndex], hiddentables[mainIndex - 1]);
    }
});

QUnit.test("onPageLoad first statsForm not hidden, others are.", function (assert) {
    $.holdReady(true);
    onPageLoad();
    var allTables = $('.statsRequest');
    var shownStats = $('.statsRequest:visible');
    var hiddenStats = $('.statsRequest:hidden');

    assert.equal(shownStats.length, 1, 'only one shown statsForm');
    assert.equal(shownStats[0], allTables[0], 'the shown statsForm is the first one.');
    for (var mainIndex = 1; mainIndex < allTables.length; mainIndex++){
        assert.equal(allTables[mainIndex], hiddenStats[mainIndex - 1]);
    }
});

QUnit.test("onPageLoad first tableObj has data, all others 'data('tableObj') = null", function (assert) {
    $.holdReady(true);
    onPageLoad();
    $('.tableRequest').each(function(index){
        if (index === 0){
            assert.deepEqual($(this).data('tableObj'), fakeAnswer1);
        } else{
            assert.strictEqual($(this).data('tableObj'), null);
        }
    });
});

QUnit.test("onPageLoad first tableObj is graphed", function (assert) {
    $.holdReady(true);
    onPageLoad();
    var graphData = document.getElementById('plotter').data;
    assert.deepEqual(graphData[0].x, fakeAnswer1.data[0]);
    assert.deepEqual(graphData[0].y, fakeAnswer1.data[1]);
    assert.equal(graphData.length, 1);
});

QUnit.test("setUpHiddenForms hides all forms and stores id's in order as data", function (assert) {
    $.holdReady(true);
    var toPlaceIn = $('#answer');
    var placedClass = $('.tableRequest');
    placedClass.each(function () {
        $(this).show();
    });

    setUpHiddenForms(toPlaceIn, placedClass);
    assert.deepEqual(toPlaceIn.data('hiddenForms'), ['table-0', 'table-1', 'table-2']);
    placedClass.each(function () {
        assert.ok($(this).is(':hidden'));
    });

});

QUnit.test("showHiddenForm returns next idstr", function (assert) {
    $.holdReady(true);
    onPageLoad();
    var tableArea = $("#tableRequestArea");
    assert.deepEqual(tableArea.data('hiddenForms'), ['table-1', 'table-2']);
    assert.strictEqual(showHiddenForm(tableArea), 'table-1', 'returns next table');
    assert.strictEqual(showHiddenForm(tableArea), 'table-2', 'returns next table');
    assert.strictEqual(showHiddenForm(tableArea), null, 'out of tables, returns null');
    assert.strictEqual(showHiddenForm(tableArea), null, 'still out of tables, returns null');
});

QUnit.test("showHiddenForm shows next table", function (assert) {
    $.holdReady(true);
    onPageLoad();
    var tableArea = $("#tableRequestArea");
    var table1 = $("#table-1");
    var table2 = $("#table-2");

    assert.ok(table1.is(':hidden'), 'table1 starts hidden');
    assert.ok(table2.is(':hidden'), 'table2 starts hidden');

    showHiddenForm(tableArea);

    assert.ok(table1.is(':visible'), 'table1 visible');
    assert.ok(table2.is(':hidden'), 'table2 hidden');

    showHiddenForm(tableArea);

    assert.ok(table1.is(':visible'), 'table1 visible');
    assert.ok(table2.is(':visible'), 'table2 visible');
});


function initTest() {
    $.holdReady(true);
    $(".tableRequest").data('tableObj', null);
    $('#tableRequestArea').data('hiddenForms', []);
    $('#statsRequestArea').data('hiddenForms', []);
}

QUnit.test('plotCurrentTables no tables have data', function (assert) {
    initTest();

    plotCurrentTables();
    var graphData = document.getElementById('plotter').data;
    assert.ok(graphData === undefined || graphData.length === 0);
});

QUnit.test('plotCurrentTables removes data that is not a table', function (assert) {
    initTest();

    var graphDiv = document.getElementById('plotter');
    Plotly.newPlot(graphDiv, [{x:[1,2,3], y:[4, 5, 6]}]);
    assert.equal(graphDiv.data.length, 1, 'confirm it has graph data');

    plotCurrentTables();

    assert.equal(graphDiv.data.length, 0, 'confirm it no graph data');
});

QUnit.test('plotCurrentTables tables have data', function (assert) {
    initTest();

    $("#table-0").data('tableObj', fakeAnswer3);
    $('#table-1').data('tableObj', fakeAnswer1);
    plotCurrentTables();
    var graphData = document.getElementById('plotter').data;
    assert.equal(graphData.length, 2);
    assert.equal(graphData[0].x, fakeAnswer3.data[0]);
    assert.equal(graphData[0].y, fakeAnswer3.data[1]);
    assert.equal(graphData[1].x, fakeAnswer1.data[0]);
    assert.equal(graphData[1].y, fakeAnswer1.data[1]);
});

QUnit.test('plotCurrentTables tables gets new min and max', function (assert) {
    initTest();

    $("#table-0").data('tableObj', fakeAnswer3);
    $('#table-1').data('tableObj', fakeAnswer1);
    plotCurrentTables();
    assert.deepEqual(fakeAnswer3.range, [1, 16]);
    assert.deepEqual(fakeAnswer1.range, [3, 12]);

    $('.statsInput').each(function (){
        assert.equal(this.min, 1);
        assert.equal(this.max, 16);
    });
});

QUnit.test('getRangesForStats sets min/max/value to 0 if data is empty', function (assert) {
    initTest();
    plotCurrentTables(); // set up empty data.
    assert.equal(document.getElementById('plotter').data.length, 0);
    getRangesForStats();
    $('.statsInput').each(function() {
        assert.equal(this.value, 0);
        assert.equal(this.min, 0);
        assert.equal(this.max, 0);
    });
});

QUnit.test('getRangesForStats sets min/max/value to single x val if all data has same val.', function (assert) {
    initTest();
    var allStat = $('.statsInput');
    var graphDiv = document.getElementById('plotter');

    Plotly.newPlot(graphDiv, [{x:[1], y:[100]}, {x:[1], y:[-100]}, {x:[1], y:[-100]}]);
    getRangesForStats();
    allStat.each(function() {
        assert.equal(this.value, 1, 'positive number');
        assert.equal(this.min, 1, 'positive number');
        assert.equal(this.max, 1, 'positive number');
    });

    Plotly.newPlot(graphDiv, [{x:[-1], y:[100]}, {x:[-1], y:[-100]}, {x:[-1], y:[-100]}]);
    getRangesForStats();
    allStat.each(function() {
        assert.equal(this.value, -1, 'negative number');
        assert.equal(this.min, -1, 'negative number');
        assert.equal(this.max, -1, 'negative number');
    });
});

QUnit.test('getRangesForStats sets min/value to min x. max to max x', function (assert) {
    initTest();
    var allStat = $('.statsInput');
    var graphDiv = document.getElementById('plotter');

    Plotly.newPlot(graphDiv, [{x:[1, 2], y:[1, -1]}, {x:[2, 5], y:[-2, 2]}, {x:[3, 4], y:[-3, 3]}]);
    getRangesForStats();
    allStat.each(function() {
        assert.equal(this.value, 1, 'positive number');
        assert.equal(this.min, 1, 'positive number');
        assert.equal(this.max, 5, 'positive number');
    });

    Plotly.newPlot(graphDiv, [{x:[-1, -2], y:[1, -1]}, {x:[-2, -5], y:[-2, 2]}, {x:[-3, -4], y:[-3, 3]}]);
    getRangesForStats();
    allStat.each(function() {
        assert.equal(this.value, -5, 'negative number');
        assert.equal(this.min, -5, 'negative number');
        assert.equal(this.max, -1, 'negative number');
    });
});

QUnit.test('getTable assigns tableObj to table according to value', function (assert) {
    initTest();

    var table0 = $("#table-0");
    assert.equal(table0[0].tableQuery.value, 0);
    getTable(table0[0]);
    assert.deepEqual(table0.data('tableObj'), fakeAnswer1);

    table0[0].tableQuery.value = 2;
    getTable((table0[0]));
    assert.deepEqual(table0.data('tableObj'), fakeAnswer3);
});

QUnit.test('getTable plots current tables', function (assert) {
    initTest();

    var graphDiv = document.getElementById('plotter');

    getTable(document.getElementById('table-0'));

    assert.deepEqual(graphDiv.data[0].x, fakeAnswer1.data[0], 'one graph x vals');
    assert.deepEqual(graphDiv.data[0].y, fakeAnswer1.data[1], 'one graph y vals');
    assert.equal(graphDiv.data.length, 1, 'one graph data only one length');

    getTable(document.getElementById('table-1'));

    assert.deepEqual(graphDiv.data[0].x, fakeAnswer1.data[0], 'first graph x vals');
    assert.deepEqual(graphDiv.data[0].y, fakeAnswer1.data[1], 'first graph y vals');

    assert.deepEqual(graphDiv.data[1].x, fakeAnswer2.data[0], 'second graph x vals');
    assert.deepEqual(graphDiv.data[1].y, fakeAnswer2.data[1], 'second graph y vals');

    assert.equal(graphDiv.data.length, 2, 'data length 2');
});

QUnit.test('hideTableForm test all actions', function (assert) {
    initTest();
    var table0 = $('#table-0');
    var table1 = $('#table-1');

    getTable(table0[0]);
    getTable(table1[0]);

    var graphDiv = document.getElementById('plotter');

    hideTableForm('table-0');

    assert.ok(table0.is(':hidden'), 'tableForm is hidden');
    assert.strictEqual(table0.data('tableObj'), null, 'tableForm data set to null');
    assert.equal(graphDiv.data.length, 1, 'graphDiv doesn\'t contain the graph');
    assert.deepEqual(graphDiv.data[0].x, table1.data('tableObj').data[0], 'graphDiv info is table1 info: x');
    assert.deepEqual(graphDiv.data[0].y, table1.data('tableObj').data[1], 'graphDiv info is table1 info: y');
    assert.deepEqual($('#tableRequestArea').data('hiddenForms'), ['table-0'],
        'table put back into hiddenforms (testInit() makes "hiddenForms" an empty list)');

});


QUnit.test('removeStatsTraces removes traces. relies on special "statsGroup" value', function (assert) {
    initTest();
    var group1 = [{x: [1], y: [1], name:'1', statsGroup: 'gp1'}, {x: [2], y: [2], name:'2', statsGroup: 'gp1'}];
    var group2 = [{x: [3], y: [3], name:'3', statsGroup: 'gp2'}, {x: [4], y: [4], name:'4', statsGroup: 'gp2'}];
    var groupNull = [{x: [5], y: [5], name:'5'}, {x: [6], y: [6], name:'6'}];

    var graphDiv = document.getElementById('plotter');
    Plotly.newPlot(graphDiv, group1);
    Plotly.addTraces(graphDiv, group2);
    Plotly.addTraces(graphDiv, groupNull);

    assert.equal(graphDiv.data.length, 6, 'setup complete');

    removeStatsTraces('gp2');
    var expectedNames = ['1', '2', '5', '6'];
    expectedNames.forEach(function (element, index) {
        assert.strictEqual(graphDiv.data[index].name, element, 'confirming remaining traces after removing "gp2"');
    });

    removeStatsTraces('gp1');
    expectedNames = ['5', '6'];
    expectedNames.forEach(function (element, index) {
        assert.strictEqual(graphDiv.data[index].name, element,
            'confirming remaining traces after removing "gp1" & "gp2"');
    });

});

QUnit.test('hideStatsForm all actions', function (assert) {
    initTest();
    var statsArea = $('#statsRequestArea');
    var stats0 = $('#stats-0');

    showHiddenForm(statsArea);

    var group1 = [{x: [3], y: [3], name:'3', statsGroup: 'stats-0'}, {x: [4], y: [4], name:'4', statsGroup: 'stats-0'}];
    var groupNull = [{x: [5], y: [5], name:'5'}, {x: [6], y: [6], name:'6'}];
    var graphDiv = document.getElementById('plotter');
    Plotly.newPlot(graphDiv, group1);
    Plotly.addTraces(graphDiv, groupNull);
    getRangesForStats();

    stats0[0].left.value = '6';
    stats0[0].right.value = '6';

    hideStatsForm('stats-0');

    assert.ok(stats0.is(":hidden"), 'statsForm is now hidden');

    assert.equal(stats0[0].left.min, 3, 'left min reset');
    assert.equal(stats0[0].left.max, 6, 'left max reset');
    assert.equal(stats0[0].left.value, 3, 'left value reset');
    assert.equal(stats0[0].right.min, 3, 'right min reset');
    assert.equal(stats0[0].right.max, 6, 'right max reset');
    assert.equal(stats0[0].right.value, 3, 'right value reset');

    assert.deepEqual(statsArea.data('hiddenForms'), ['stats-0'], 'stats back in hiddenForms');

    assert.equal(graphDiv.data.length, 2, 'graphDiv has correct number of graphs');
    assert.equal(graphDiv.data[0].name, '5', 'graphDiv has correct graphs');
    assert.equal(graphDiv.data[1].name, '6', 'graphDiv has correct graphs');


});

QUnit.test('getRange', function (assert) {
    assert.deepEqual(getRange('8', '9'), [8, 9], 'converts str to int');
    assert.deepEqual(getRange('8', '10'), [8, 9, 10], 'correctly sorts as ints');
    assert.deepEqual(getRange('10', '8'), [8, 9, 10], 'correctly sorts as ints other way');
    assert.deepEqual(getRange('1', '1'), [1], 'single number');
    assert.deepEqual(getRange('1', '-1'), [-1, 0, 1], 'positive to negative');
    assert.deepEqual(getRange('-1', '1'), [-1, 0, 1], 'negative to positive');
});

QUnit.test('statsGraphVals', function (assert) {
    var tableObj = {"repr": "<DiceTable containing [1D4  W:10]>",
        "data": [[1, 2, 3, 4], [10.0, 20.0, 50.0, 20.0]],
        "tableString": "1: 1\n2: 2\n3: 5\n4: 2\n",
        "forSciNum": {"1": ["1.00000", "0"], "2": ["2.00000", "0"], "3": ["5.00000", "0"], "4": ["2.00000", "0"]},
        "range": [1, 4],
        "mean": 2.8,
        "stddev": 0.8718};

    var expected = {x: [1, 2, 3, 4], y: [10.0, 20.0, 50.0, 20.0], type: 'scatter', mode: 'none', fill: 'tozeroy'};

    var toTest = statsGraphVals([1, 2, 3, 4], tableObj);
    assert.deepEqual(toTest, expected, 'all x vals');

    expected.x = [1.52, 2, 3, 4];
    expected.y = [(10*0.48 + 20*0.52), 20.0, 50.0, 20.0];
    toTest = statsGraphVals([2, 3, 4], tableObj);
    assert.deepEqual(toTest, expected, 'query vals higher than min.');

    expected.x = [1, 2, 3, 3.48];
    expected.y = [10.0, 20.0, 50.0, (50 * 0.52 + 20.0 * 0.48)];
    toTest = statsGraphVals([1, 2, 3], tableObj);
    assert.deepEqual(toTest, expected, 'query vals lower than max.');

    expected.x = [2.52, 3, 3.48];
    expected.y = [(20 * 0.48 + 50 * 0.52), 50.0, (50 * 0.52 + 20.0 * 0.48)];
    toTest = statsGraphVals([3], tableObj);
    assert.deepEqual(toTest, expected, 'query vals singleton in middle.');

    expected.x = [1, 1.48];
    expected.y = [10.0, (10 * 0.52 + 20.0 * 0.48)];
    toTest = statsGraphVals([1], tableObj);
    assert.deepEqual(toTest, expected, 'query vals singleton at end.');


});

// TODO
// function statsGraphName(tableObj, pctString, queryArr) {
//     var tableName = tableObj.repr.slice("<DiceTable containing ".length, -1);
//     var query = (queryArr.length === 1) ? queryArr[0]: queryArr[0] + '-' + queryArr[queryArr.length - 1];
//     return tableName + ': ' + query + '=' + pctString + '%';
// }

// TODO
// function statsGraphColor(matchGraphIndex, statsFormId) {
//     var colorObjs = [
//         {'r': 31, 'g': 119, 'b': 180, 'a': 0.5},
//         {'r': 255, 'g': 127, 'b': 14, 'a': 0.5},
//         {'r': 44, 'g': 160, 'b': 44, 'a': 0.5},
//         {'r': 214, 'g': 39, 'b': 40, 'a': 0.5},
//         {'r': 148, 'g': 103, 'b': 189, 'a': 0.5},
//         {'r': 140, 'g': 86, 'b': 75, 'a': 0.5},
//         {'r': 227, 'g': 119, 'b': 194, 'a': 0.5},
//         {'r': 127, 'g': 127, 'b': 127, 'a': 0.5},
//         {'r': 188, 'g': 189, 'b': 34, 'a': 0.5},
//         {'r': 23, 'g': 190, 'b': 207, 'a': 0.5}
//     ];
//     var rgbaObj = colorObjs[matchGraphIndex];
//     var modValues = [
//         [0, -10, 10], [10, 10, 10], [-10, -10, -10], [-10, 10, -10], [10, -10, 10], [-10, -10, 10],
//         [10, -10, -10], [-10, 10, 10], [10, 10, -10], [10, 0, -10], [-10, 0, 10], [0, 10, -10]
//     ];
//     var mod = modValues[statsFormId.slice(-1)];
//     console.log(mod);
//
//     return 'rgba(' + (rgbaObj.r + mod[0]) + ',' + (rgbaObj.g + mod[1]) + ',' + (rgbaObj.b + mod[2]) +',0.5)';
// }


// TODO
// function plotStats(statsForm) {
//     removeStatsTraces(statsForm.id);
//     var graphDiv = document.getElementById('plotter');
//
//     var queryArr = getRange(statsForm.left.value, statsForm.right.value);
//
//     var statsData = [];
//     var allAnswers = '';
//     var nonNullDataIndex = 0;
//
//     $('.tableRequest').each(function () {
//         var tableObj = $('#' + this.id).data('tableObj');
//         if (tableObj !== null) {
//
//             var forStats = createSciNumObj(tableObj.forSciNum);
//             var answer = getStats(forStats, queryArr);
//
//             var traceDatum = statsGraphVals(queryArr, tableObj);
//             traceDatum['name'] = graphDiv.data[nonNullDataIndex].name + ': ' + answer.pctChance + '%';
//             var rgbaObj = colorObjs[nonNullDataIndex];
//
//             traceDatum['fillcolor'] = 'rgba(' + (rgbaObj.r) + ',' + (rgbaObj.g) + ',' + (rgbaObj.b) +',0.5)';
//             traceDatum['statsGroup'] = statsForm.id;
//             nonNullDataIndex++;
//
//             statsData.push(traceDatum);
//             allAnswers += (JSON.stringify(answer) + '\n');
//
//         }
//     });
//
//     Plotly.addTraces(graphDiv, statsData);
//     $("#answer").text(allAnswers);
// }







