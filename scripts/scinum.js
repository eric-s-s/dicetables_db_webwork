function SciNum (mantissa, power) {
    this.mantissa = parseFloat(mantissa);
    this.power = parseInt(power);
    this.fixedSize = 4;
    // this.add = function (other) {
    //     var maxPowDiff = 15;
    //     var powDiff = this.power - other.power;
    //     if (powDiff > maxPowDiff){
    //         return new SciNum(this.mantissa, this.power);
    //     } else if (powDiff < -maxPowDiff){
    //         return new SciNum(other.mantissa, other.power);
    //     } else {
    //         var newMantissa;
    //         if (powDiff > 0){
    //             newMantissa = this.mantissa + Math.pow(10, -powDiff) * other.mantissa;
    //             return new SciNum(newMantissa, this.power);
    //         } else {
    //             newMantissa = other.mantissa + Math.pow(10, powDiff) * this.mantissa;
    //             return new SciNum(newMantissa, other.power);
    //         }
    //
    //     }
    // };
    this.div = function (other) {
        var newMantissa = this.mantissa / other.mantissa;
        var newPow = this.power - other.power;
        if (Math.abs(newMantissa) < 1){
            newMantissa *= 10;
            newPow -= 1;
        }
        return new SciNum(newMantissa, newPow);
    };
    this.toString = function () {
        manStr = this.mantissa.toFixed(this.fixedSize);
        powToUse = this.power;
        if (manStr.search("10.") > -1) {
            manStr = manStr.replace("10.", "1.");
            powToUse += 1;
        }
        return manStr + "e" + toSignedStr(powToUse);

    }
}

function toSignedStr(num) {
    return (num < 0 ? "": "+") + num;
}



function sumSciNum(sciNumArray) {
    var maxPow = maxPower(sciNumArray);
    var maxPowerDiff = 15;
    var newMantissa = 0;
    var arrayLen = sciNumArray.length;
    for (var i=0; i < arrayLen; i++) {
        var theNum = sciNumArray[i];
        var powerDiff = maxPow - theNum.power;
        if (powerDiff <= maxPowerDiff){
            newMantissa += theNum.mantissa * Math.pow(10, -powerDiff);
        }
    }
    while (Math.abs(newMantissa) < 1 && newMantissa !== 0) {
        newMantissa *= 10;
        maxPow -= 1;
    }
    while (Math.abs(newMantissa) >= 10) {
        newMantissa /= 10;
        maxPow += 1;
    }
    return new SciNum(newMantissa, maxPow);
}


function maxPower(sciNumArray) {
    return Math.max.apply(null, sciNumArray.map(function (el){return el.power;}))
}