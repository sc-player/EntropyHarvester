function Player(gameData) {
    this.gameData = gameData;
    this.resources = new Resources({ evoSeeds: new Decimal(1) });

    this.panels = {};
    for (var panelName in gameData.panels) {
        this.panels[panelName] = new gamePanel(data.panels[panelName], this);
    };
    this.showCorrectPanels();
}

Player.prototype.showCorrectPanels = function () {
    this.panels.intro.open();
}

Player.prototype.draw = function () {
    var resourceInfo = this.gameData.resources;
    this.resources.draw(resourceInfo);
    $.each(this.panels, function () {
        this.draw(resourceInfo);
    });
}

Player.prototype.calcCost = function (resourceCost) {
    return this.resources.subtractResources(resourceCost);
}

Player.prototype.calculateResourceGain = function (elapsed) {
    var gain = new Resources();
    for (var baseName in this.resources.vals) {
        if (this.gameData.resources[baseName].resourceGain) {
            var thisResource = this.gameData.resources[baseName].resourceGain;
            $.each(thisResource, (gainedName) => {
                gain.addResources({ [gainedName]: thisResource[gainedName].times(this.resources.vals[baseName]).times(elapsed) });
            });
        }
    }
    this.resources.addResources(gain.vals);
}