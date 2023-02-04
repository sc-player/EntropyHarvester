function dataLoader() {
    
}

dataLoader.prototype.getFullSaveFileKey = (saveFile) => `EntropyHarvester.SaveFile.${saveFile}`;

dataLoader.prototype.save = function (saveFile, data) {
    var toSave = this.encode(data);
    localStorage.setItem(this.getFullSaveFileKey(saveFile), toSave);
}

dataLoader.prototype.load = function (saveFile) {
    var toDecode = localStorage.getItem(this.getFullSaveFileKey(saveFile));
    return toDecode ? this.decode(toDecode) : null;
}

dataLoader.prototype.encode = function (data) {
    return btoa(JSON.stringify(data));
}

dataLoader.prototype.decode = function (string) {
    var parsed = atob(string);
    return new gameState(JSON.parse(parsed));
}