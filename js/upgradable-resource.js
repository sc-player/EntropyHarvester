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
    this.$value = this.$button.find(".upgrade-value");
    this.$valueWrapper = this.$button.find(".upgrade-value-wrapper");
    this.$cost = this.$button.find(".upgrade-cost");
    this.$gain = this.$button.find(".resource-gain-amt");
    this.$value = this.$button.find(".upgrade-value");
    this.$autobuyRate = this.$button.find(".autobuy-rate");
    this.$autobuyRateWrapper = this.$button.find(".autobuy-rate-wrapper");

    if (buttonData.addResources) {
        this.addResources = buttonData.addResources;
    }

    this.buttonCallback = buttonData.buttonCallback ? $.proxy(buttonData.buttonCallback, this) : null;
    $(button).click($.proxy(this.activate, this));
};

upgradableResource.prototype.activate = function () {
    if (this.data.autoBuy && this.level.gt(new Decimal(0))) {
        this.autoBuyer.toggle();
    }
    else if (this.level != this.maxLevel) {
        var cost = this.cost(this.player.gameState);
        var times = this.player.calcAvailableBuys(cost, new Decimal(1));
        if (times.gt(new Decimal(0))) {
            this.upgrade(times, cost);
        }
    }
}

upgradableResource.prototype.updateLastCalcedValue = function (name, calc) {
    return function (gameState, currentMultipliers) {
        var res = calc(gameState, currentMultipliers);
        gameState.upgrades[name].lastCalced = res;
        return res;
    }
}

upgradableResource.prototype.upgrade = function (amount, cost) {
    this.player.setResources(this.player.calcCost(cost, amount));
    this.level = this.level.plus(amount);

    if (this.addResources) {
        var newResources = this.addResources(this.player.gameState);
        this.player.addResources(newResources.times(amount));
    } else if (this.data.autoBuy) {
        this.autoBuyer = new Autobuyer(this.data.autoBuy, this.player);
        this.player.gameState.autoBuyers[this.data.autoBuy.button] = this.autoBuyer;
        this.player.gameState.upgrades[this.data.name] = { level: this.level };
    }
    if (this.player.gameState.upgrades[this.data.name]) {
        this.player.gameState.upgrades[this.data.name].level = this.level;
    } else if(this.data.getValue) {
        this.player.gameState.upgrades[this.data.name] = {
            level: this.level,
            calc: this.updateLastCalcedValue(this.data.name, this.data.getValue),
            lastCalced: new Decimal()
        };
    }

    if (this.panel.prestigeReset) {
        var resources = this.panel.prestigeReset(this.player.gameState);
        this.player.setResources(resources);
        this.player.resetAutobuyers();
    }

    if (this.buttonCallback) {
        this.buttonCallback(this.player.gameState);
    }
};

upgradableResource.prototype.draw = function () {
    var player = this.player;
    var resourceInfo = this.player.gameData.resources;
    this.$amt.html(this.level.toString());
    if (player.gameState.upgrades[this.data.name]?.lastCalced) {
        this.$valueWrapper.show();
        this.$value.html(Resources.prototype.displayValue(player.gameState.upgrades[this.data.name].lastCalced));
    } else {
        this.$valueWrapper.hide();
    }
    var cost = this.cost(this.player.gameState);
    this.$cost.html("(" + cost.toString(resourceInfo) + ")");
    if (this.data.addResources) {
        var newResources = this.addResources(this.player.gameState);
        var resourceGain = new Resources();
        newResources.iter(function (resource) {
            resourceGain = resourceGain.plus(player.getResourceGain(resource));
        });
        this.$gain.html(resourceGain.toString(resourceInfo));
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
            this.$autobuyRate.html(Resources.prototype.displayValue(this.autoBuyer.rate(this.player.gameState)));
        } else {
            this.$autobuyRateWrapper.hide();
        }
    }
};

upgradableResource.prototype.toggle = function (toggle) {
    this.$button.toggle(toggle);
}
