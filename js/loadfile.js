document.getElementById("uploadButton").onchange = function() {
    console.log("Uploading...")
    var file = document.getElementById("uploadButton").files[0];
    var extension = file.name.substring(file.name.lastIndexOf('.')); console.log(extension);
    var validFileType = ".txt";
    if (validFileType.toLowerCase().indexOf(extension) < 0) {
        alert("please select valid file type. The supported file types are .txt");
        return false;
    } else {
        var fileReader = new FileReader();
        fileReader.onload = function (e) {
            var text = e.target.result;
            document.getElementById("text").value = text;
            var x = document.getElementById("text");
        }
        fileReader.readAsText(file, "UTF-8");
}

}