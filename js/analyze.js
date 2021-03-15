function analyze(text) {
    console.log("analyze");
    if(!text) return [];

    var words = text.match(/\w+/g);
    if (words.length === 0) {
        return [];
    }

    var result = words.reduce(function(count, curr_word_raw) {
        var curr_word = curr_word_raw.toLowerCase();
        if (curr_word in count) {
            count[curr_word] = count[curr_word] + 1;
        }else{
            count[curr_word] = 1;
        }
        return count;
    }, {});

    var keys_list = Object.keys(result);
    keys_list.forEach(curr_word => {
        if (keys_list.includes(curr_word.slice(0, -3))) {
            result[curr_word.slice(0, -3)] += result[curr_word];
            delete result[curr_word];
        }
        else if (keys_list.includes(curr_word.slice(0, -2))) {
            result[curr_word.slice(0, -2)] += result[curr_word];
            delete result[curr_word];
        }
        else if (keys_list.includes(curr_word.slice(0, -1))) {
            result[curr_word.slice(0, -1)] += result[curr_word];
            delete result[curr_word];
        }
    });

    result = Object.keys(result).map(function(key){
        return [key, result[key]];
    });

    result.sort(function(a, b){return b[1] - a[1]});

    return result;
}

function wrap_word_with_link(display_word, search_word){
    return "<a href=\"https://scholar.google.com/scholar?as_sdt=0%2C5&q="+ search_word + "&btnG=\" target=\"_blank\">" + display_word + "</a>";
}

function convert_word_to_link(keyword){
    return convert_word_to_element(wrap_word_with_link(keyword, keyword));
}

function convert_word_to_element(word){
    return "<div>" + word + "</div>";
}

function update_analyze_result(result){
    var keywords = "";
    var frequency = "";
    // TODO: we can have the user to set the number of words to be displayed
    var init_num_display = 10;
    var init_upper_bound = 10;
    var result_len = result.length;
    var num_display = Math.min(init_num_display, result_len, init_upper_bound);
    
    // TODO: we can have the user to set the number of words to be auto searched
    var init_top_n = 3;
    var top_n = init_top_n;
    var top_n_words = "";
    stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];
    for (var i = 0; i < num_display; i++) {
        if (isNaN(result[i][0]) && isNaN(parseFloat(result[i][0])) && !stopwords.includes(result[i][0])) {
            keywords += convert_word_to_link(result[i][0]);
            frequency += convert_word_to_element(result[i][1]);
            if(top_n > 0){
                top_n_words += result[i][0] + "+";
                top_n--;
            }
        }else{
            init_num_display++;
            init_upper_bound++;
            num_display = Math.min(init_num_display, result_len, init_upper_bound);
        }
    }
    document.getElementById("keywords").innerHTML = keywords;
    document.getElementById("frequency").innerHTML = frequency;
    if(top_n !== init_top_n){
        top_n_words = top_n_words.slice(0, -1);
        document.getElementById("keywords_title").innerHTML = "Keywords: " + wrap_word_with_link("(auto search)", top_n_words);
    }else{
        document.getElementById("keywords_title").innerHTML = "Keywords: ";
    }
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

document.getElementById("keywordSearchBar").addEventListener("keydown", function(event) {
    let input = document.getElementById("keywordSearchBar")
    if(event.key == "Enter") {
        event.preventDefault();
        let queryToken = String(input.value).split(" ").join("+");
        var elt = wrap_word_with_link(String(input.value), queryToken);
        document.getElementById("keywords").innerHTML += convert_word_to_element(elt);
        document.getElementById("frequency").innerHTML += "<div>temp</div>"
    }
});