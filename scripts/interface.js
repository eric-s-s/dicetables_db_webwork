


var currentTables = {};
var tableIDs = [];
for (var i = 0; i <10; i++) {tableIDs.push('table-' + i);}

$("document").ready(function() {



    tableIDs.forEach(function (id) {
        $('#' + id).hide();
    });

    showTableForm();
    getTable($('#table-0')[0]);


    $(".tableEnquiry").submit(function (event) {
        event.preventDefault();
        getTable(this);

    });



    $('#more').click(function () {
            showTableForm();
    });

    $("#basic").text('stddev: ' + fakeAnswer1.stddev + '\nmean: ' + fakeAnswer1.mean + '\nrange: ' + fakeAnswer1.range);
    $("#getStats").submit(function (event) {
        event.preventDefault();
        plotStats(this);
    });
});


function hideTableForm(idStr) {
    var theForm = $('#' + idStr);
    theForm.hide();
    theForm[0].reset();
    tableIDs.push(idStr);
    tableIDs.sort();
    delete currentTables[idStr];
    plotCurrentTables();
}

function showTableForm() {
    if (tableIDs.length > 0) {
        var idStr = tableIDs.shift();
        $('#' + idStr).show();
        currentTables[idStr] = undefined;
    }
}



function plotCurrentTables () {
    var plotOrder = Object.keys(currentTables);
    plotOrder.sort();
    var plotData = [];
    for (var i = 0; i < plotOrder.length; i++) {
        var dataObj = currentTables[plotOrder[i]];
        if (dataObj !== undefined) {
            var datum = {
                x: dataObj.data[0],
                y: dataObj.data[1],
                name: dataObj.repr.slice("<DiceTable containing ".length, -1)
            };
            plotData.push(datum);
        }
    }
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
    currentTables[formObj.id] = fakeList[index];
    plotCurrentTables();
}


function plotStats(statsForm) {

    var graphDiv = document.getElementById('plotter');

    var toRemove = [];
    for (var i=countPlottedTables(); i < graphDiv.data.length; i++) {toRemove.push(i)}
    Plotly.deleteTraces(graphDiv, toRemove);

    var queryArr = getRange(statsForm.left.value, statsForm.right.value);

    var statsData = [];
    var allAnswers = '';

    var plotOrder = Object.keys(currentTables);
    plotOrder.sort();
    for (var index = 0; index < plotOrder.length; index++){
        var tableObj = currentTables[plotOrder[index]];
        if (tableObj !== undefined) {
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

            var forStats = createSciNumObj(tableObj.forSciNum);
            var answer = getStats(forStats, queryArr);
            var plotName = graphDiv.data[index].name + ': ' + answer.pctChance + '%';

            allAnswers += (JSON.stringify(answer) + '\n');

            var traceDatum = {x: xVals, y: yVals, type: 'scatter', mode: 'none', name: plotName, fill: 'tozeroy', fillcolor: colorsRGBA[index]};
            statsData.push(traceDatum);
        }
    }
    Plotly.addTraces(graphDiv, statsData);
    $("#answer").text(allAnswers);
}

var getRange = function (left, right) {
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
};

function countPlottedTables() {
    var count = 0;
    Object.values(currentTables).forEach(function (el) {if (el !== undefined) {count++;}});
    return count;
}