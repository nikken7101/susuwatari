// classify bpm

var count_arr = [];
var count_all_arr = [];
var index = 0;

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
    count_arr[index] = count;
    count_all_arr[index] = count_all;

    console.log(count / count_all);

    index++;
});
