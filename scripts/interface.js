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

        var toPlot = document.getElementById('plotter');

        $("#doit").click(function () {
            console.log('clicked');
            $('#hi').text('oh yeah');
            Plotly.plot(toPlot, [{
                x: fakeAnswer.data[0],
                y: fakeAnswer.data[1]
            }], {
                margin: {t: 10}
            });
        });

        $("#basic").text('stddev: ' + 2 + '\nmean: ' + 3.5 + '\nrange: ' + [2, 8]);
        var left = $('#left');
        var right = $('#right');
        left.change(function (){
            var queryArr = getRange(left.val(), right.val());
            console.log(queryArr);
            var answer = getStats(forStats, queryArr);
            $("#answer").text(JSON.stringify(answer));
        });
        right.change(function (){
            var queryArr = getRange(left.val(), right.val());
            console.log(queryArr);
            var answer = getStats(forStats, queryArr);
            $("#answer").text(JSON.stringify(answer));
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
    for (var i = start; i <= stop; i++){
        out.push(i);
    }
    return out;
};