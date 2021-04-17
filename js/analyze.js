var top_n_words = []; // Declared globally to give manually entered words proper priority.
var words_displayed = [];
var stopwords = ['i','me','my','myself','we','our','ours','ourselves','you','your','yours','yourself','yourselves','he','him','his','himself','she','her','hers','herself','it','its','itself','they','them','their','theirs','themselves','what','which','who','whom','this','that','these','those','am','is','are','was','were','be','been','being','have','has','had','having','do','does','did','doing','a','an','the','and','but','if','or','because','as','until','while','of','at','by','for','with','about','against','between','into','through','during','before','after','above','below','to','from','up','down','in','out','on','off','over','under','again','further','then','once','here','there','when','where','why','how','all','any','both','each','few','more','most','other','some','such','no','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'];

var text_area = document.getElementById("textBox");
var text_block = null;
var input_text = "";

{
	const urlParams = new URLSearchParams(window.location.search);
	if (urlParams.has("text")) {
		console.log("found parameter \"text\"");
		input_text = urlParams.get("text");
		text_area.value = input_text;
	}
}

// Porter stemmer in Javascript. Few comments, but it's easy to follow against the rules in the original
// paper, in
//
//  Porter, 1980, An algorithm for suffix stripping, Program, Vol. 14,
//  no. 3, pp 130-137,
//
// see also http://www.tartarus.org/~martin/PorterStemmer

// Release 1 be 'andargor', Jul 2004
// Release 2 (substantially revised) by Christopher McKenzie, Aug 2009

// https://stackoverflow.com/questions/15794411/is-there-a-way-to-include-word-variants-past-tense-gerund-when-checking-for-a

var stemmer = (function(){
	var step2list = {
			"ational" : "ate",
			"tional" : "tion",
			"enci" : "ence",
			"anci" : "ance",
			"izer" : "ize",
			"bli" : "ble",
			"alli" : "al",
			"entli" : "ent",
			"eli" : "e",
			"ousli" : "ous",
			"ization" : "ize",
			"ation" : "ate",
			"ator" : "ate",
			"alism" : "al",
			"iveness" : "ive",
			"fulness" : "ful",
			"ousness" : "ous",
			"aliti" : "al",
			"iviti" : "ive",
			"biliti" : "ble",
			"logi" : "log"
		},

		step3list = {
			"icate" : "ic",
			"ative" : "",
			"alize" : "al",
			"iciti" : "ic",
			"ical" : "ic",
			"ful" : "",
			"ness" : ""
		},

		c = "[^aeiou]",          // consonant
		v = "[aeiouy]",          // vowel
		C = c + "[^aeiouy]*",    // consonant sequence
		V = v + "[aeiou]*",      // vowel sequence

		mgr0 = "^(" + C + ")?" + V + C,               // [C]VC... is m>0
		meq1 = "^(" + C + ")?" + V + C + "(" + V + ")?$",  // [C]VC[V] is m=1
		mgr1 = "^(" + C + ")?" + V + C + V + C,       // [C]VCVC... is m>1
		s_v = "^(" + C + ")?" + v;                   // vowel in stem

	return function (w) {
		var 	stem,
			suffix,
			firstch,
			re,
			re2,
			re3,
			re4,
			origword = w;

		if (w.length < 3) { return w; }

		firstch = w.substr(0,1);
		if (firstch == "y") {
			w = firstch.toUpperCase() + w.substr(1);
		}

		// Step 1a
		re = /^(.+?)(ss|i)es$/;
		re2 = /^(.+?)([^s])s$/;

		if (re.test(w)) { w = w.replace(re,"$1$2"); }
		else if (re2.test(w)) {	w = w.replace(re2,"$1$2"); }

		// Step 1b
		re = /^(.+?)eed$/;
		re2 = /^(.+?)(ed|ing)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			re = new RegExp(mgr0);
			if (re.test(fp[1])) {
				re = /.$/;
				w = w.replace(re,"");
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1];
			re2 = new RegExp(s_v);
			if (re2.test(stem)) {
				w = stem;
				re2 = /(at|bl|iz)$/;
				re3 = new RegExp("([^aeiouylsz])\\1$");
				re4 = new RegExp("^" + C + v + "[^aeiouwxy]$");
				if (re2.test(w)) {	w = w + "e"; }
				else if (re3.test(w)) { re = /.$/; w = w.replace(re,""); }
				else if (re4.test(w)) { w = w + "e"; }
			}
		}

		// Step 1c
		re = /^(.+?)y$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(s_v);
			if (re.test(stem)) { w = stem + "i"; }
		}

		// Step 2
		re = /^(.+?)(ational|tional|enci|anci|izer|bli|alli|entli|eli|ousli|ization|ation|ator|alism|iveness|fulness|ousness|aliti|iviti|biliti|logi)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step2list[suffix];
			}
		}

		// Step 3
		re = /^(.+?)(icate|ative|alize|iciti|ical|ful|ness)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			suffix = fp[2];
			re = new RegExp(mgr0);
			if (re.test(stem)) {
				w = stem + step3list[suffix];
			}
		}

		// Step 4
		re = /^(.+?)(al|ance|ence|er|ic|able|ible|ant|ement|ment|ent|ou|ism|ate|iti|ous|ive|ize)$/;
		re2 = /^(.+?)(s|t)(ion)$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			if (re.test(stem)) {
				w = stem;
			}
		} else if (re2.test(w)) {
			var fp = re2.exec(w);
			stem = fp[1] + fp[2];
			re2 = new RegExp(mgr1);
			if (re2.test(stem)) {
				w = stem;
			}
		}

		// Step 5
		re = /^(.+?)e$/;
		if (re.test(w)) {
			var fp = re.exec(w);
			stem = fp[1];
			re = new RegExp(mgr1);
			re2 = new RegExp(meq1);
			re3 = new RegExp("^" + C + v + "[^aeiouwxy]$");
			if (re.test(stem) || (re2.test(stem) && !(re3.test(stem)))) {
				w = stem;
			}
		}

		re = /ll$/;
		re2 = new RegExp(mgr1);
		if (re.test(w) && re2.test(w)) {
			re = /.$/;
			w = w.replace(re,"");
		}

		// and turn initial Y back to y

		if (firstch == "y") {
			w = firstch.toLowerCase() + w.substr(1);
		}

		return w;
	}
})();



function analyze(text, pattern = /\w+/g) {
    console.log("analyze");
    if(!text) return [];

    var words = text.match(pattern);
    if (words === null || words.length === 0) {
        return [];
    }

    var result = words.reduce(function(count, curr_word_raw) {
        var curr_word = curr_word_raw.toLowerCase();
        if (curr_word in count) {
            count[curr_word] += 1;
        }else{
            count[curr_word] = 1;
        }
        return count;
    }, {});

    var keys_list = Object.keys(result);
    var stem_list = {};
    
    keys_list.forEach(curr_word => {
        var curr_word_stem = stemmer(curr_word);
        if (curr_word_stem in stem_list) {
            var last_word = stem_list[curr_word_stem];
            if (last_word.length > curr_word.length && last_word != curr_word_stem) {
                stem_list[curr_word_stem] = curr_word;
                result[curr_word] += result[last_word];
                delete result[last_word];
            }
            else {
                result[last_word] += result[curr_word];
                delete result[curr_word];
            }
        }
        else {
            stem_list[curr_word_stem] = curr_word;
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

function convert_word_to_link(keyword, cls="word"){
    return convert_word_to_element(wrap_word_with_link(keyword, keyword), cls);
}

function convert_word_to_element(word, cls){
    return "<div class=\"" + cls + "\">" + word + "</div>";
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
    
    top_n_words = [];
    words_displayed = [];

    for (var i = 0; i < num_display; i++) {
        if (isNaN(result[i][0]) && isNaN(parseFloat(result[i][0])) && !stopwords.includes(result[i][0]) && result[i][0].length > 1) {
            words_displayed.push(result[i][0]);
            word = convert_word_to_link(result[i][0]) + convert_word_to_element(result[i][1], "freq");
            keywords += convert_word_to_element(word, "keyword");
            if(top_n > 0){
                top_n_words.push(result[i][0]);
                top_n--;
            }
        }else{
            init_num_display++;
            init_upper_bound++;
            num_display = Math.min(init_num_display, result_len, init_upper_bound);
        }
    }
    
    document.getElementById("keywords_div").innerHTML = keywords;

    if(top_n !== init_top_n){
        var top_n_words_str = top_n_words[0];
        for (var i = 1; i < top_n_words.length; i++) {
            top_n_words_str += "+" + top_n_words[i];
        }
        document.getElementById("keywords_title").innerHTML = "Keywords: " + wrap_word_with_link("(auto search)", top_n_words_str);
    }else{
        document.getElementById("keywords_title").innerHTML = "Keywords: ";
    }
}

function reset_variables() {
	top_n_words = [];
	words_displayed = [];
	input_text = "";
	text_block = null;
    update_analyze_result([]);
}

function enable_edit() {
	text_area.value = input_text;
	document.getElementById("textBox").replaceWith(text_area);
}

function disable_edit() {
	if (input_text !== text_area.value){
		reset_variables();
	}

	text_block = document.createElement("div");
	text_block.id = "textBox";
	input_text = text_area.value;
	text_block.innerHTML = input_text;
	text_block.style = "background-color:WhiteSmoke";

	text_block.onclick = function() {
		enable_edit();
	};

	document.getElementById("textBox").replaceWith(text_block);
}

document.getElementById("analyzeButton").onclick = function() {
    console.log("analyzeButton clicked");
	disable_edit();
    var result = analyze(input_text);
    update_analyze_result(result);
}



document.getElementById("resetButton").onclick = function() {
	reset_variables();
	enable_edit();
}

document.getElementById("keywordSearchBar").addEventListener("keydown", function(event) {
    if(event.key == "Enter") {
        event.preventDefault();
        var input = document.getElementById("keywordSearchBar");
        var word = String(input.value);
		
		disable_edit();

		pattern = new RegExp("\\b" + word + "\\b", 'g');
		text_block.innerHTML = input_text.replace(pattern, "<span style=\"background-color:yellow\">" + word + "</span>");
        
        // Add manually entered keyword if it isn't already in keyword list
        if (words_displayed.includes(word) == false)
        {
            words_displayed.push(word);
            var result = analyze(input_text, pattern);
			if (result === []) {
				return;
			}
            var queryToken = word.split(" ").join("+");
            var elt = wrap_word_with_link(word, queryToken);
            console.log(elt);
            var div_context = convert_word_to_element(elt, "word");
            if (result.length === 0) {
                div_context += convert_word_to_element("0<i> (manual) </i>", "freq");
            }
            else {
                div_context += convert_word_to_element(result[0][1].toString() + "<i> (manual) </i>", "freq");
            }
            document.getElementById("keywords_div").innerHTML += convert_word_to_element(div_context, "keyword");
            if (top_n_words.includes(word) == false) {
                top_n_words.push(word);
                var top_n_words_str = top_n_words[0];
                for (var i = 1; i < top_n_words.length; i++) {
                    top_n_words_str += "+" + top_n_words[i];
                }
                document.getElementById("keywords_title").innerHTML = "Keywords: " + wrap_word_with_link("(auto search)", top_n_words_str);
            }
        }
        
        event.currentTarget.value = '';
    }
});