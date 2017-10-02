QUnit.test("document ready first table not hidden, others are.", function (assert) {
    var allTables = $('.tableRequest');
    var shownTables = $('.tableRequest:visible');
    var hiddentables = $('.tableRequest:hidden');

    assert.equal(shownTables.length, 1, 'only one shown table');
    assert.equal(shownTables[0], allTables[0], 'the shown table is the first table');
    for (var mainIndex = 1; mainIndex < allTables.length; mainIndex++){
        assert.equal(allTables[mainIndex], hiddentables[mainIndex - 1]);
    }
});

QUnit.test("document ready first statsForm not hidden, others are.", function (assert) {
    var allTables = $('.statsRequest');
    var shownStats = $('.statsRequest:visible');
    var hiddenStats = $('.statsRequest:hidden');

    assert.equal(shownStats.length, 1, 'only one shown statsForm');
    assert.equal(shownStats[0], allTables[0], 'the shown statsForm is the first one.');
    for (var mainIndex = 1; mainIndex < allTables.length; mainIndex++){
        assert.equal(allTables[mainIndex], hiddenStats[mainIndex - 1]);
    }
});
