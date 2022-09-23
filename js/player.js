function Player(gameData) {
    this.gameData = gameData;
    this.gameState = {
        resources: new Resources({ evoSeeds: new Decimal(1), cellTreeTimer: new Decimal(1) }),
        autoBuyers: {},
        upgrades: {}
    };

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
    this.gameState.resources.draw();
    $.each(this.panels, function () {
        this.draw();
    });
}

Player.prototype.resetAutobuyers = function () {
    for (var ab in this.autoBuyers) {
        this.gameState.autoBuyers[ab].reset();
    }
}

Player.prototype.addResources = function (resources) {
    this.gameState.resources = this.gameState.resources.plus(resources);
}

Player.prototype.setResources = function (resources) {
    this.gameState.resources = resources;
}

Player.prototype.calcAvailableBuys = function (resourceCost, amount){
    var availableBuys = null;
    this.gameState.resources.iter(function (name) {
        if (resourceCost.vals[name].eq(0)) {
            return;
        }
        var thisResourceBuys = this.vals[name].div(resourceCost.vals[name]).floor();
        if (availableBuys == null || availableBuys.gt(thisResourceBuys)) {
            availableBuys = thisResourceBuys;
        }
    });
    return amount.gt(availableBuys) ? availableBuys : amount;
}

Player.prototype.calcCost = function (resourceCost, availableBuys) {
    var cost = resourceCost.times(availableBuys);
    return this.gameState.resources.minus(cost);
}

Player.prototype.calculateResourceGain = function (elapsed) {
    var gain = new Resources();
    var player = this;
    this.gameState.resources.iter(function (name) {
        var thisResource = player.getResourceGain(name);

        if (thisResource) {
            gain = gain.plus(thisResource.times(player.gameState.resources.vals[name]));
        }
    });
    this.addResources(gain.times(elapsed));
}

Player.prototype.calculateAutoBuyers = function(elapsed){
    for (var baseName in this.gameState.autoBuyers) {
        this.gameState.autoBuyers[baseName].buy(elapsed);
    }
}

Player.prototype.getResourceGain = function (resource) {
    return this.gameData.resources[resource]?.resourceGain ? this.gameData.resources[resource].resourceGain(this.gameState) : new Resources();
}