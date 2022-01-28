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

Player.prototype.addAutobuyer = function (autoBuyerData) {
    this.autoBuyers[autoBuyerData.button] = autoBuyerData;
    this.autoBuyers[autoBuyerData.button].timeLeft = new Decimal(0);
    this.autoBuyers[autoBuyerData.button].enabled = true;
    return this.autoBuyers[autoBuyerData.button];
}

Player.prototype.toggleAutobuyer = function (name) {
    this.autoBuyers[name].enabled = !this.autoBuyers[name].enabled;
}

Player.prototype.resetAutobuyers = function () {
    for (var ab in this.autoBuyers) {
        this.autoBuyers[ab].timeLeft = new Decimal(0);
    }
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
    }

    for (var baseName in this.autoBuyers) {
        var autoBuy = this.autoBuyers[baseName];
        if (autoBuy.timeLeft <= 0
            && autoBuy.enabled
            && this.panels[autoBuy.panel].$buttons[autoBuy.button].upgrade(new Decimal(1))) {
            autoBuy.timeLeft = autoBuy.rate;
        }
        else {
            autoBuy.timeLeft = autoBuy.timeLeft.minus(elapsed);
        }
    }
    this.addResources(gain);
}