// classify bpm

var count_arr = [];
var count_all_arr = [];
var times = 0;

var N_SUM = 20;

process.stdin.resume();
process.stdin.on('data', function(chunk) {
    var count = 0;
    var count_all = 0;

    for (var i = 0, l = chunk.length; i < l; i++) {
        count_all++;
        if (255 <= chunk[i]) {
            count++;
        }
    }
    count_arr[times] = count;
    count_all_arr[times] = count_all;

    if (N_SUM < times) {
        var sum = 0;
        var sum_all = 0;
        for (var i = 0; i < N_SUM; i++) {
            sum += count_arr[times - i];
            sum_all += count_all_arr[times - i];
        }

        var peaks_ratio = sum / sum_all;
        if (peaks_ratio < 0.033) {
            console.log('beat80 (' + peaks_ratio + ')');
        } else {
            console.log('beat140 (' + peaks_ratio + ')');
        }
    }

    times++;
});
