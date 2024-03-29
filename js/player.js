function Player(gameData, loadedState) {
    this.gameData = gameData;
    this.gameState = loadedState || new gameState();

    this.autoBuyers = {};
    this.panels = {};
    for (var panelName in gameData.panels) {
        this.panels[panelName] = new gamePanel(data.panels[panelName], this);
    };

    this.gameTimer = $(".game-timer")
    this.showCorrectPanels();
}

Player.prototype.openPanel = function (name) {
    if (!this.gameState.openPanels.includes(name)) {
        this.gameState.openPanels.push(name);
    }
    this.panels[name].open();
}

Player.prototype.closePanel = function (name) {
    this.gameState.openPanels = this.gameState.openPanels.filter(p => p !== name);
    this.panels[name].close();
}

Player.prototype.showCorrectPanels = function () {
    for (var name in this.panels) {
        this.panels[name].close();
    }
    for (var name in this.gameState.openPanels) {
        this.panels[this.gameState.openPanels[name]].open();
    }
}

Player.prototype.draw = function () {
    this.gameState.resources.draw();
    this.drawGameTimer();
    $.each(this.panels, function () {
        this.draw();
    });
}

Player.prototype.drawGameTimer = function () {
    this.gameTimer.html();
}

Player.prototype.addTime = function (elapsed) {
    this.gameState.gameTime = new Date(this.gameState.gameTime + elapsed);
}

Player.prototype.resetAutobuyers = function () {
    for (var ab in this.autoBuyers) {
        this.autoBuyers[ab].reset();
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
    for (var baseName in this.autoBuyers) {
        this.autoBuyers[baseName].buy(elapsed);
    }
}

Player.prototype.getResourceGain = function (resource) {
    return this.gameData.resources[resource]?.resourceGain ?
        this.gameData.resources[resource].resourceGain(this.gameState) :
        new Resources();
}