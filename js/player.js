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
    this.resources.draw();
    $.each(this.panels, function () {
        this.draw();
    });
}

Player.prototype.addResources = function (resources) {
    this.resources = this.resources.plus(resources);
}

Player.prototype.calcCost = function (resourceCost) {
    return this.resources.minus(resourceCost);
}

Player.prototype.calculateResourceGain = function (elapsed) {
    var gain = new Resources();
    for (var baseName in this.resources.vals) {
        if (this.gameData.resources[baseName].resourceGain) {
            var thisResource = new Resources(this.gameData.resources[baseName].resourceGain);
            gain = gain.plus(thisResource.times(this.resources.vals[baseName]).times(elapsed));
        }
    }
    this.addResources(gain);
}
