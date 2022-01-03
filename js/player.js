function Player(gameData) {
    this.gameData = gameData;
    this.resources = new Resources({ evoSeeds: new Decimal(1) });
    this.autoBuyers = {};

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

Player.prototype.addAutoBuyer = function (autoBuyerData) {
    this.autoBuyers[autoBuyerData.button] = autoBuyerData;
    this.autoBuyers[autoBuyerData.button].timeLeft = new Decimal(0);
}

Player.prototype.addResources = function (resources) {
    this.resources = this.resources.plus(resources);
}

Player.prototype.setResources = function (resources) {
    this.resources = this.resources.set(resources);
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
        if (this.gameData.resources[baseName].autoBuy) {
            var autobuy = this.gameData.resources[baseName].autoBuy;
            if (this.autoBuyers[autobuy.button]) {
                if (this.autoBuyers[autobuy.button].timeLeft <= 0
                    && this.panels[autobuy.panel].$buttons[autobuy.button].upgrade(new Decimal(1))) {
                    this.autoBuyers[autobuy.button].timeLeft = this.autoBuyers[autobuy.button].rate;
                }
                else {
                    this.autoBuyers[autobuy.button].timeLeft = this.autoBuyers[autobuy.button].timeLeft.minus(elapsed);
                }
            }
            
        }
    }
    this.addResources(gain);
}