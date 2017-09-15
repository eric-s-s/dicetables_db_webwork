function makeSciNumArray(strPairsArray){
    return strPairsArray.map(function (t) { return new SciNum(t[0], t[1]); });
}

function getStatsObj(total, sciNumArr){
    var statsObj = new Object();
    var arrSum = sumSciNum(sciNumArr);
    statsObj.occurrences = arrSum.toFancyStr();
    statsObj.oneInChance = total.div(arrSum).toFancyStr();
    var pct = arrSum.div(total).mul(new SciNum(1, 2));
    statsObj.pctChance = pct.toFancyStr();
    statsObj.total = total.toFancyStr();
    return statsObj;
}