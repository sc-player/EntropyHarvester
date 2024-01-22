function DataLoader() {
    this.currentSaveFile = localStorage.getItem(this.currentSaveFileKey) || 1;
    this.gameData = this.loadGameState(this.currentSaveFile);
    this.reloading = false;
}

DataLoader.prototype.currentSaveFileKey = `EntropyHarvester.CurrentSaveFile`;
DataLoader.prototype.getFullSaveFileKey = (saveFile) => `EntropyHarvester.SaveFile.${saveFile}`;

DataLoader.prototype.saveGameState = function (data) {
    if (this.reloading) {
        return;
    }
    var toSave = this.encode(data);
    localStorage.setItem(this.getFullSaveFileKey(this.currentSaveFile), toSave);
}

DataLoader.prototype.setSaveFile = function(saveFile){
    localStorage.setItem(this.currentSaveFileKey, saveFile);
    this.reloading = true;
}

DataLoader.prototype.resetSaveFile = function (saveFile) {
    localStorage.removeItem(this.getFullSaveFileKey(saveFile));
    this.reloading = true;
}

DataLoader.prototype.getCurrentData = function(){
    return this.gameData;
}

DataLoader.prototype.loadGameState = function (saveFile) {
    var toDecode = localStorage.getItem(this.getFullSaveFileKey(saveFile));
    return toDecode ? this.decode(toDecode) : new gameState();
}

DataLoader.prototype.encode = function (data) {
    return btoa(JSON.stringify(data));
}

DataLoader.prototype.decode = function (string) {
    var parsed = atob(string);
    return new gameState(JSON.parse(parsed));
}