function upgradableResource(button, buttonData, panel) {
    this.$button = button;

    this.data = buttonData;
    this.cost = buttonData.cost;

    this.player = panel.player;
    this.panel = panel;

    this.level = new Decimal(0);
    this.amount = new Decimal(1);

    this.maxLevel = null;
    if (buttonData.maxLevel) {
        this.maxLevel = buttonData.maxLevel;
    }

    this.$amt = this.$button.find(".upgrade-amt");
    this.$cost = this.$button.find(".upgrade-cost");
    this.$gain = this.$button.find(".resource-gain-amt");
    this.$value = this.$button.find(".upgrade-value");
    this.$autobuyRate = this.$button.find(".autobuy-rate");
    this.$autobuyRateWrapper = this.$button.find(".autobuy-rate-wrapper");

    this.addResources = new Resources(buttonData.addResources);

    this.buttonCallback = buttonData.buttonCallback ? $.proxy(buttonData.buttonCallback, this) : null;
    $(button).click($.proxy(this.activate, this));
};

upgradableResource.prototype.activate = function () {
    if (this.data.autoBuy && this.level.gt(new Decimal(0))) {
        this.autoBuyer.toggle();
    }
    else if (this.level != this.maxLevel) {
        var cost = this.cost(this.level, this.player.resources);
        var times = this.player.calcAvailableBuys(cost, new Decimal(1));
        if (times.gt(new Decimal(0))) {
            this.upgrade(times, cost);
        }
    }
}

upgradableResource.prototype.upgrade = function (amount, cost) {
    this.player.resources = this.player.calcCost(cost, amount);
    this.level = this.level.plus(amount);

    if (this.data.prestigeUpgrade) {
        for (var baseName in this.data.prestigeUpgrade) {
            for (var resourceName in this.data.prestigeUpgrade[baseName]) {
                this.player.panels[baseName].prestigeReset[resourceName] = this.data.prestigeUpgrade[baseName][resourceName];
            }
        }
    }

    if (this.panel.prestigeReset) {
        this.player.setResources(this.panel.prestigeReset);
        this.player.resetAutobuyers();
    }

    if (this.data.autobuyerRateIncrease) {
        for (var panel in this.data.autobuyerRateIncrease) {
            for (var button in this.data.autobuyerRateIncrease[panel]) {
                this.player.panels[panel].$buttons[button].amount =
                    this.player.panels[panel].$buttons[button].amount.times(this.data.autobuyerRateIncrease[panel][button]);
            }
        }
    }

    this.player.addResources(this.addResources.times(amount).times(this.amount));

    if (this.data.autoBuy) {
        this.autoBuyer = new Autobuyer(this.data.autoBuy, this.player);
        this.player.autoBuyers[this.data.autoBuy.button] = this.autoBuyer;
    }

    if (this.data.resourceGainFactor) {
        for (var baseName in this.data.resourceGainFactor) {
            if (!this.player.resourceMultipliers[baseName]) {
                this.player.resourceMultipliers[baseName] = [];
            }
            if (typeof (this.data.resourceGainFactor[baseName]) === 'function') {
                this.player.resourceMultipliers[baseName].push(this.data.resourceGainFactor[baseName](this));
            } else {
                this.player.resourceMultipliers[baseName].push(new Resources(this.data.resourceGainFactor[baseName]));
            }
        }
    }

    if (this.buttonCallback) {
        this.buttonCallback();
    }

};

upgradableResource.prototype.draw = function () {
    var resourceInfo = this.player.gameData.resources;
    this.$amt.html(this.level.toString());
    var cost = this.cost(this.level, this.player.resources);
    this.$cost.html("(" + cost.toString(resourceInfo) + ")");
    if (this.data.addResources) {
        var resourceGain = new Resources();
        for (var resource in this.data.addResources) {
            var baseGain = resourceGain.plus(new Resources(this.player.gameData.resources[resource].resourceGain));
            resourceGain = this.player.calculateSingleResourceGain(baseGain, resource);
        }
        this.$gain.html(resourceGain.toString(this.player.gameData.resources));
    }

    var availableBuys = this.player.calcAvailableBuys(cost, new Decimal(1));
    if (this.data.autoBuy && this.level.gt(new Decimal(0))) {
        this.$button.prop("disabled", false);
        this.$button.toggleClass("autobuyer", true);
        this.$button.toggleClass("autobuyer-enabled", this.autoBuyer.enabled);
        this.$cost.hide();
    }
    else if (this.maxLevel && this.level >= this.maxLevel) {
        this.$button.prop("disabled", true);
        this.$button.addClass("max-level");
    }
    else if (availableBuys.gt(0)) {
        this.$button.prop("disabled", false);
    } else {
        this.$button.prop("disabled", true);
    }
    if (this.data.autoBuy) {
        if (this.level > 0) {
            this.$autobuyRateWrapper.show();
            this.$autobuyRate.html(new Decimal(1).div(this.autoBuyer.rate).toString());
        } else {
            this.$autobuyRateWrapper.hide();
        }
    }
};

upgradableResource.prototype.toggle = function (toggle) {
    this.$button.toggle(toggle);
}
