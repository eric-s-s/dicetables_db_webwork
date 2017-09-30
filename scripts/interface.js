
$("document").ready(function() {



    var allTableForms = $('.tableRequest');

    allTableForms.submit(function (event) {
        event.preventDefault();
        getTable(this);
    });
    allTableForms.data('tableObj', null);
    var hiddenTables = [];
    allTableForms.each(function () {
        $(this).hide();
        hiddenTables.push(this.id)
    });
    hiddenTables.sort();

    $('#enquiryArea').data('hiddenTables', hiddenTables);

    var idStr = showTableForm();
    getTable(document.getElementById(idStr));

    $('#more').click(function () {
            showTableForm();
    });

    $("#basic").text('stddev: ' + fakeAnswer1.stddev + '\nmean: ' + fakeAnswer1.mean + '\nrange: ' + fakeAnswer1.range);
    $("#stats-1").submit(function (event) {
        event.preventDefault();
        plotStats(this);
    });
});


function hideTableForm(idStr) {
    var theForm = $('#' + idStr);
    theForm.hide();
    theForm.data('tableObj', null);
    theForm[0].reset();
    var hiddenTables = $('#enquiryArea').data('hiddenTables');
    hiddenTables.push(idStr);
    hiddenTables.sort();
    plotCurrentTables();
}

function showTableForm() {
    var hiddentTables = $('#enquiryArea').data('hiddenTables');
    if (hiddentTables.length > 0) {
        var idStr = hiddentTables.shift();
        $('#' + idStr).show();
        return idStr;
    }
    return null;
}



function plotCurrentTables () {
    var plotData = [];
    $('.tableRequest').each( function () {
        var tableObj = $('#' + this.id).data('tableObj');
        if (tableObj !== null) {
            var datum = {
                x: tableObj.data[0],
                y: tableObj.data[1],
                name: tableObj.repr.slice("<DiceTable containing ".length, -1)
            };
            plotData.push(datum);
        }
    });
    var graphDiv = document.getElementById('plotter');
    Plotly.newPlot(graphDiv, plotData, {margin: {t: 1}});
    getRangesForStats();
}

function getRangesForStats() {
    var data = document.getElementById('plotter').data;
    var min = Infinity;
    var max = -Infinity;
    data.forEach(function (el) {
        var xVals = el.x;
        min = Math.min(min, xVals[0]);
        max = Math.max(max, xVals[xVals.length - 1]);
    });
    if (min === Infinity || max === -Infinity) {min = 0; max = 0;}
    $('.statsInput').attr({'min': min, 'value': min, 'max': max});
}

function getTable(formObj) {
    var index = formObj.tableQuery.value % fakeList.length;
    $('#' + formObj.id).data('tableObj', fakeList[index]);
    plotCurrentTables();
}



function plotStats(statsForm) {
    removeStatsTraces(statsForm);
    var graphDiv = document.getElementById('plotter');

    var queryArr = getRange(statsForm.left.value, statsForm.right.value);

    var statsData = [];
    var allAnswers = '';
    var nonNullDataIndex = 0;

    $('.tableRequest').each(function () {
        var tableObj = $('#' + this.id).data('tableObj');
        if (tableObj !== null) {

            var forStats = createSciNumObj(tableObj.forSciNum);
            var answer = getStats(forStats, queryArr);

            var traceDatum = statsGraphVals(queryArr, tableObj);
            traceDatum['name'] = graphDiv.data[nonNullDataIndex].name + ': ' + answer.pctChance + '%';
            var rgbaObj = colorObjs[nonNullDataIndex];

            traceDatum['fillcolor'] = 'rgba(' + (rgbaObj.r) + ',' + (rgbaObj.g) + ',' + (rgbaObj.b) +',0.5)';
            traceDatum['statsGroup'] = statsForm.id;
            nonNullDataIndex++;

            statsData.push(traceDatum);
            allAnswers += (JSON.stringify(answer) + '\n');

        }
    });

    Plotly.addTraces(graphDiv, statsData);
    $("#answer").text(allAnswers);
}


function removeStatsTraces(statsForm) {
    var graphDiv = document.getElementById('plotter');
    var toRemove = [];
    for (var i = 0; i < graphDiv.data.length; i++) {
        if (graphDiv.data[i].statsGroup === statsForm.id) {
            toRemove.push(i);
        }
    }
    Plotly.deleteTraces(graphDiv, toRemove);
}


function getRange (left, right) {
    var leftInt = parseInt(left);
    var rightInt = parseInt(right);
    var out = [];
    var stop, start;
    if (leftInt < rightInt) {
        start = leftInt;
        stop = rightInt;
    } else {
        start = rightInt;
        stop = leftInt;
    }
    for (var i = start; i <= stop; i++){
        out.push(i);
    }
    return out;
}


function statsGraphVals(queryArr, tableObj) {
    var start = Math.max(queryArr[0], tableObj.range[0]);
    var stop = Math.min(queryArr[queryArr.length - 1], tableObj.range[1]);
    var startIndex = tableObj.data[0].indexOf(start);
    var stopIndex = tableObj.data[0].indexOf(stop);
    var xVals = tableObj.data[0].slice(startIndex, stopIndex + 1);
    var yVals = tableObj.data[1].slice(startIndex, stopIndex + 1);
    if (start > tableObj.range[0]) {
        var beforeVal = (tableObj.data[1][startIndex - 1] + tableObj.data[1][startIndex]) / 2;
        xVals.unshift(start - 0.5);
        yVals.unshift(beforeVal);
    }
    if (stop < tableObj.range[1]) {
        var afterVal = (tableObj.data[1][stopIndex + 1] + tableObj.data[1][stopIndex]) / 2;
        xVals.push(stop + 0.5);
        yVals.push(afterVal);
    }
    return {x: xVals, y: yVals, type: 'scatter', mode: 'none', fill: 'tozeroy'};
}
