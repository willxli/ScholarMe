function analyze(text) {
    if(!text) return [];

    var words = text.match(/\w+/g);
    if (words.length === 0) {
        return [];
    }

    // TODO: add a stop words list
    var result = words.reduce(function(count, curr_word) {
        if (curr_word in count) {
            count[curr_word] = count[curr_word] + 1;
        }else{
            count[curr_word] = 1;
        }
        return count;
    }, {});

    result = Object.keys(result).map(function(key){
        return [key, result[key]];
    });

    result.sort(function(a, b){return b[1] - a[1]});

    return result;
}

function convert_word_to_link(keyword){
    return convert_word_to_element("<a href=\"https://scholar.google.com/scholar?as_sdt=0%2C5&q="+ keyword + "&btnG=\" target=\"_blank\">" + keyword + "</a>");
}

function convert_word_to_element(word){
    return "<p>" + word + "</p>";
}

function update_analyze_result(result){
    var keywords = "";
    var frequency = "";
    // TODO: we can have the user to set the number of words to be displayed
    var num_display = 20;
    num_display = Math.min(num_display, result.length);
    for (var i = 0; i < num_display; i++) {
        keywords += convert_word_to_link(result[i][0]);
        frequency += convert_word_to_element(result[i][1]);
    }
    document.getElementById("keywords").innerHTML = keywords;
    document.getElementById("frequency").innerHTML = frequency;
}

document.getElementById("analyzeButton").onclick = function() {
    var result = analyze(document.getElementById("textBox").value);
    update_analyze_result(result);
}

document.getElementById("resetButton").onclick = function() {
    document.getElementById("textBox").value = "";
    update_analyze_result([]);
}