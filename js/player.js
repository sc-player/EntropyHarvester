function Player(gameData) {
    this.gameData = gameData;
    this.resources = new Resources({ evoSeeds: new Decimal(1) });
    this.resourceMultipliers = {};
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
    var player = this;
    this.resources.iter(function (name) {
        var thisResource = player.getResourceGain(name);

        if (thisResource) {
            gain = gain.plus(player.calculateSingleResourceGain(thisResource, name).times(player.resources.vals[name]));
        }
    });

    this.addResources(gain.times(elapsed));
}

Player.prototype.calculateAutoBuyers = function(elapsed){
    for (var baseName in this.autoBuyers) {
        var autoBuy = this.autoBuyers[baseName];
        if (autoBuy.timeLeft <= 0) {
            if (autoBuy.enabled) {
                var upgraded = this.autoBuy(autoBuy);
                if (upgraded) {
                    autoBuy.timeLeft = autoBuy.rate;
                }
            }
        }
        else {
            autoBuy.timeLeft = autoBuy.timeLeft.minus(elapsed);
        }
    }
}

Player.prototype.autoBuy = function (autoBuy) {
    return this.panels[autoBuy.panel].$buttons[autoBuy.button].upgrade();
}

Player.prototype.getResourceGain = function (resource) {
    return this.gameData.resources[resource]?.resourceGain ?
        new Resources(this.gameData.resources[resource].resourceGain) :
        null;
}

Player.prototype.calculateSingleResourceGain = function (thisResource, name) {
    var player = this;
    if (this.resourceMultipliers[name]) {
        var thisMultiplier = this.resourceMultipliers[name].reduce(function (prev, curr) {
            console.log(player.resourceMultipliers);
            if (typeof (curr) === 'function') {
                return prev.times(curr(player.resources))
            } else {
                return prev.times(curr);
            }
        }, new Resources({}, 1));
        thisResource = thisResource.times(thisMultiplier);
    }
    return thisResource;
}