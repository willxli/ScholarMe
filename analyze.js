function analyze(text) {
    var words = text.match(/\w+/g);
    var result = words.reduce(function(count, curr_word) {
        if (curr_word in count) {
            count[curr_word] = count[curr_word] + 1;
        }else{
            count[curr_word] = 1;
        }
        return count;
    }, {});

    result = Object.keys(dict).map(function(key){
        return [key, result[key]];
    });

    result.sort(function(a, b){return b[1] - a[1]});

    return result;
}

function convert_word_to_link(keyword){
    return "<a href=\"https://scholar.google.com/scholar?as_sdt=0%2C5&q="+ keyword + "&btnG=\">" + keyword + "</a>";
}

function update_analyze_result(result){
    var keywords = "";
    var frequency = "";
    result.forEach(element => {
        keywords += convert_word_to_link(element[0]);
        keywords += "\n";
        frequency += element[1];
        frequency += "\n";
    });
    document.getElementById("keywords").value = keywords;
    document.getElementById("frequency").value = frequency;
}

document.getElementById("analyzeButton").onclick = function() {
    var result = analyze(document.getElementById("textBox").value);
    update_analyze_result(result);
}

document.getElementById("resetButton").onclick = function() {
    document.getElementById("textBox").value = "";
    update_analyze_result([]);
}