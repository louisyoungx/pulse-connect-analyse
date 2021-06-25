list = [165,165,163,165,161,160,163,165,166,165,163,161,164,168,169,167,163,168,198,269,315,332,326,312,289,262,240,229,223,210,199,195,197,198,206,214,223,226,223,215,203,192,186,183,180,176,176,175,177,177,
    177,178,179,178,173,171,172,176,200,261,315,335,333,317,293,264,241,227,214,204,197,190,191,194,202,212,219,220,218,211,201,191,186,184,181,181,184,182,185,184,183,183,185,185,183,184,184,183,183,181,
    188,233,296,332,340,327,302,272,245,228,223,216,206,195,188,186,191,197,204,207,204,201,195,188,182,176,174,172,175,176,177,178,176,174,172,169,167,167,167,167,166,168,164,167,167,167,168,167,168,177,
    230,292,320,324,313,290,257,234,222,216,210,200,194,193,192,196,202,210,213,211,206,198,193,190,191,191,188,188,187,184,183,183,184,185,186,183,179,178,180,180,176,176,172,174,174,176,187,238,293,317,
    318,306,284,255,232,218,210,205,195,189,189,193,199,207,213,215,212,207,199,191,186,184,183,182,181,178,176,176,178,182,182,182,181,181,176,176,186,226,286,313,318,310,291,266,242,227,219,212,206,201,
    199,201,204,209,215,220,220,215,209,202,197,190,187,188,188,188,187,189,192,193,194,193,191,189,188,188,191,194,196,196,201,227,283,317,325,318,302,276,251,236,230,223,218,209,205,203,205,209,216,219,
    218,216,212,210,208,207,202,200,200,199,200,201,203,207,206,204,202,200,201,202,202,204,205,204,202,202,204,203,209,254,295,310,307,294,272,246,230,222,219,215,207,199,198,200,205,210,212,215,212,209]


// 标准偏差
function standardDeviation(values){
    const avg = average(values);

    const squareDiffs = values.map(function (value) {
        const diff = value - avg;
        const sqrDiff = diff * diff;
        return sqrDiff;
    });

    const avgSquareDiff = average(squareDiffs);
    const stdDev = Math.sqrt(avgSquareDiff);
    return stdDev;
}

// // 滤波
// function smooth(data, fps) {
//     var heartSignal = AudioProcessor.savitzkyGolay(data, Math.round(fps/2)*2+1, 3);
//     heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/4)*2+1, 3);
//     var breathSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps)*2+1, 3);
//     heartSignal = numeric.sub(heartSignal, breathSignal);
//     heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/4)*2+1, 3);
//     heartSignal = AudioProcessor.savitzkyGolay(heartSignal, Math.round(fps/8)*2+1, 3);
//     return heartSignal;
// }

// 求幅值平均值
function average(data){
    const sum = data.reduce(function (sum, value) {
        return sum + value;
    }, 0);
    const avg = sum / data.length;
    return avg;
}

// 心率计数
function countHeartBeats(heartSignal) {
    let currentMaximum = 0;
    let beats = 0;
    const mean = average(heartSignal);
    const sthreshold = 0.2 * standardDeviation(heartSignal);
    for (let i = 0; i < heartSignal.length; i++) {
        if (heartSignal[i] > mean+sthreshold) {
            heartSignal[i] = mean+sthreshold;
            if (!currentMaximum) {
                currentMaximum = 1;
                beats += 1;
            }
        }
        else {
            currentMaximum = 0;
        }
    }
    console.log(mean+sthreshold)
    return beats;
}
var heartbeats = countHeartBeats(list)
console.log(heartbeats)

function calculateHeartRate(heartBeats, time){
    return (heartBeats/time) * 60
}

heartRate = calculateHeartRate(heartbeats, 7)
console.log(heartRate)
