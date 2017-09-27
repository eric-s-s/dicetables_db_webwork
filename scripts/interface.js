


$("document").ready(function() {
        var forStats = createSciNumObj(fakeAnswer1.forSciNum);

        Plotly.plot('plotter', [{
                x: fakeAnswer1.data[0],
                y: fakeAnswer1.data[1]
            }], {
                margin: {t: 10}// , xaxis: {fixedrange: true}, yaxis: {fixedrange: true}
            });

        $("#basic").text('stddev: ' + fakeAnswer1.stddev + '\nmean: ' + fakeAnswer1.mean + '\nrange: ' + fakeAnswer1.range);
        var left = $('#left');
        var right = $('#right');
        $(".tableEnquiry").submit(function (event){
            event.preventDefault();
            console.log(this.id)
        });


        $('#more').click(function () {
            var useArea = $('#enquiryArea');
            var newForm = $("<form></form>");
            var rmButton = $("<button type='button'>rm</button>");
            var inputTxt = $("<input type=\"text\" name=\"bob\" title=\"get table\"/>");
            var submitButton = $("<button type='submit'>submit</button>");
            newForm.append([rmButton, inputTxt, submitButton]);
            useArea.append(newForm);
            rmButton.on('click', function () {
                $(this).parent().remove();
                console.log(useArea);
            });
            newForm.submit(function (event) {
                event.preventDefault();
                console.log($(this).children('[name="bob"]')[0].value);
            })
        });



        $("#getStats").submit(function (event) {
            var queryArr = getRange(left.val(), right.val());
            var startIndex = fakeAnswer1.data[0].indexOf(queryArr[0]);
            var stopIndex = fakeAnswer1.data[0].indexOf(queryArr[queryArr.length - 1]);
            var yVals = fakeAnswer1.data[1].slice(startIndex, stopIndex + 1);
            var answer = getStats(forStats, queryArr);
            $("#answer").text(JSON.stringify(answer));
            var plotSpot = document.getElementById('plotter');
            if (plotSpot.data.length > 1) {
                Plotly.deleteTraces('plotter', [-1]);
            }

            if (startIndex !== 0) {
                var beforeVal = (fakeAnswer1.data[1][startIndex - 1] + fakeAnswer1.data[1][startIndex]) / 2;
                queryArr.unshift(queryArr[0] - 0.5);
                yVals.unshift(beforeVal);
            }
            if (stopIndex !== fakeAnswer1.data[1].length - 1){
                var afterVal = (fakeAnswer1.data[1][stopIndex + 1] + fakeAnswer1.data[1][stopIndex]) / 2;
                queryArr.push(queryArr[queryArr.length - 1] + 0.5);
                yVals.push(afterVal);
            }


            var plotName = answer.pctChance + '%';
            Plotly.addTraces('plotter', [
                {x: queryArr, y: yVals, type:'scatter', mode: 'none', name: plotName, fill: 'tozeroy'}
                ]);

            event.preventDefault();

        });

    }
);


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