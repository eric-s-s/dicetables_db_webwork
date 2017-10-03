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
}

QUnit.test('plotCurrentTables no tables have data', function (assert) {
    initTest();

    plotCurrentTables();
    var graphData = document.getElementById('plotter').data;
    assert.ok(graphData === undefined || graphData.length === 0);
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



