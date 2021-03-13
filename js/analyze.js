function analyze(text) {
    console.log("analyze");
    console.log(text);
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
    return "<div>" + word + "</div>";
}

function update_analyze_result(result){
    var keywords = "";
    var frequency = "";
    // TODO: we can have the user to set the number of words to be displayed
    var init_num_display = 10;
    var result_len = result.length;
    var num_display = Math.min(init_num_display, result_len, 10);
    stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];
    for (var i = 0; i < num_display; i++) {
        if (!stopwords.includes(result[i][0].toLowerCase())) {
            keywords += convert_word_to_link(result[i][0]);
            frequency += convert_word_to_element(result[i][1]);
        }else{
            init_num_display++;
            num_display = Math.min(init_num_display, result_len, 10);
        }
    }
    document.getElementById("keywords").innerHTML = keywords;
    document.getElementById("frequency").innerHTML = frequency;
}

document.getElementById("analyzeButton").onclick = function() {
    console.log("analyzeButton clicked");
    var result = analyze(document.getElementById("textBox").value);
    update_analyze_result(result);
}

document.getElementById("resetButton").onclick = function() {
    document.getElementById("textBox").value = "";
    update_analyze_result([]);
}