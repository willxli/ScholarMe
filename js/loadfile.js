var JSON_UPLOAD_TARGET_KEY = "TNGSGS_target";

document.getElementById("uploadButton").onclick = function() {
    document.getElementById("uploadInput").click();
}

document.getElementById("uploadInput").onchange = function() {
    console.log("Uploading...")
    var file = this.files[0];
    var extension = file.name.substring(file.name.lastIndexOf('.'));
    console.log(file.name)
    console.log(extension);
    if (extension === ".txt") {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var text = e.target.result;
            document.getElementById("textBox").value = text;
        }
        fileReader.readAsText(file, "UTF-8");
    }
    else if(extension === ".json") {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var text = e.target.result;
            var json_obj = JSON.parse(text);
            if (!json_obj.hasOwnProperty(JSON_UPLOAD_TARGET_KEY)){
                // TODO: need to change the hint for the user about JSON_UPLOAD_TARGET_KEY
                alert("If you want to specify an area of the json, you can add the key \"" + JSON_UPLOAD_TARGET_KEY + "\" on levels of the json file. The key's corresponding value refers to which key you want to select on that level.");
            }
            else {
                while (json_obj.hasOwnProperty(JSON_UPLOAD_TARGET_KEY)){
                    console.log(JSON_UPLOAD_TARGET_KEY + ": " + json_obj[JSON_UPLOAD_TARGET_KEY]);
                    json_obj = json_obj[json_obj[JSON_UPLOAD_TARGET_KEY]];
                }
                text = JSON.stringify(json_obj, null, 2);
            }
            document.getElementById("textBox").value = text;
        }
        fileReader.readAsText(file, "UTF-8");
    }
    else {
        alert("Please select valid file type. The supported file types are .txt, .json");
        return false;
    }
    document.getElementById("upload").innerHTML += file.name;
    return true;
}