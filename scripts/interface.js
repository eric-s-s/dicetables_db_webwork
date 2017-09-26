var fakeAnswer = {
    'original': [[2, 3, 4, 5, 6, 7, 8], [1, 2, 3, 4, 3, 2, 1]],
    'data': [[2, 3, 4, 5, 6, 7, 8], [6.25, 12.5, 18.75, 25.0, 18.75, 12.5, 6.25]],
    'tableString': "2: 1\n3: 2\n4: 3\n5: 4\n6: 3\n7: 2\n8: 1\n",
    'forSciNum': {'2': ['1.00000', '0'],
        '3': ['2.00000', '0'],
        '4': ['3.00000', '0'],
        '5': ['4.00000', '0'],
        '6': ['3.00000', '0'],
        '7': ['2.00000', '0'],
        '8': ['1.00000', '0']},
    'stddev': 2,
    'mean': 3.5,
    'range': [2, 8]

};
$("document").ready(function() {
        var forStats = createSciNumObj(fakeAnswer.forSciNum);


        $("#doit").click(function () {
            console.log('clicked');
            $('#hi').text('oh yeah');
            Plotly.plot('plotter', [{
                x: fakeAnswer.data[0],
                y: fakeAnswer.data[1]
            }], {
                margin: {t: 10}
            });
        });

        $("#basic").text('stddev: ' + 2 + '\nmean: ' + 3.5 + '\nrange: ' + [2, 8]);
        var left = $('#left');
        var right = $('#right');
        $("#getStats").submit(function (event) {
            var queryArr = getRange(left.val(), right.val());
            var startIndex = fakeAnswer.data[0].indexOf(queryArr[0]);
            var stopIndex = fakeAnswer.data[0].indexOf(queryArr[queryArr.length - 1]);
            var yVals = fakeAnswer.data[1].slice(startIndex, stopIndex + 1);
            console.log(queryArr, yVals, startIndex, stopIndex);
            var answer = getStats(forStats, queryArr);
            $("#answer").text(JSON.stringify(answer));
            var plotSpot = document.getElementById('plotter');
            if (plotSpot.data.length > 1) {
                Plotly.deleteTraces('plotter', [-1]);
            }

            if (startIndex !== 0) {
                var beforeVal = (fakeAnswer.data[1][startIndex - 1] + fakeAnswer.data[1][startIndex]) / 2;
                queryArr.unshift(queryArr[0] - 0.5);
                yVals.unshift(beforeVal);
            }
            if (stopIndex !== fakeAnswer.data[1].length - 1){
                var afterVal = (fakeAnswer.data[1][stopIndex + 1] + fakeAnswer.data[1][stopIndex]) / 2;
                queryArr.push(queryArr[queryArr.length - 1] + 0.5);
                yVals.push(afterVal);
            }






            var plotName = answer.pctChance + '%';
            Plotly.plot('plotter', [
                {x: queryArr, y: yVals, type:'scatter', mode: 'none', name: plotName, fill: 'tozeroy'}
                ], {margin: {t:0}});
            event.preventDefault();

        });

    }
);


var getRange = function (left, right) {
    var out = [];
    var stop, start;
    if (left < right) {
        start = left;
        stop = right;
    } else {
        start = right;
        stop = left;
    }
    for (var i = parseInt(start); i <= stop; i++){
        out.push(i);
    }
    return out;
};