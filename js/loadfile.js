document.getElementById("uploadButton").onclick = function() {
    document.getElementById("uploadInput").click();
}

document.getElementById("uploadInput").onchange = function() {
    console.log("Uploading...")
    var file = this.files[0];
    var extension = file.name.substring(file.name.lastIndexOf('.'));
    console.log(file.name)
    console.log(extension);
    if (extension !== ".txt") {
        alert("please select valid file type. The supported file types are .txt");
        return false;
    } else {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var text = e.target.result;
            document.getElementById("textBox").value = text;
        }
        fileReader.readAsText(file, "UTF-8");
    }
    document.getElementById("upload").innerHTML += file.name;
    return true;
}