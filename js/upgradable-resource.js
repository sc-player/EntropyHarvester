function upgradableResource(button, buttonData, player) {
    this.$button = button;

    this.data = buttonData;
    this.cost = new Resources(buttonData.cost);

    this.player = player;

    this.level = new Decimal(0);

    this.$amt = this.$button.find(".upgrade-amt");
    this.$cost = this.$button.find(".upgrade-cost");
    this.$value = this.$button.find(".upgrade-value");
    this.$autobuyRate = this.$button.find(".autobuy-rate");

    this.addResources = new Resources(buttonData.addResources);
    this.resourcesReset = this.data.resourcesReset;

    this.buttonCallback = buttonData.buttonCallback ? $.proxy(buttonData.buttonCallback, this) : null;
    $(button).click($.proxy(this.activate, this));
};

upgradableResource.prototype.activate = function () {
    if (this.data.autoBuy && this.level > 0) {
        this.player.toggleAutobuyer(this.data.autoBuy.button);
    }
    else {
        this.upgrade(new Decimal(1));
    }
}

upgradableResource.prototype.upgrade = function (amt) {
    var newResources = this.player.calcCost(this.cost);
    if (newResources.allPositive()) {
        this.level = this.level.plus(amt);
        this.player.resources = newResources;
        if (this.data.costFactor) {
            this.cost = this.cost.times(new Resources(this.data.costFactor));
        }
        if (this.data.resourcesReset) {
            this.player.setResources(this.data.resourcesReset);
            this.player.resetAutobuyers();
        }
        this.player.addResources(this.addResources);

        if (this.data.autoBuy) {
            this.autoBuyer = this.player.addAutobuyer(this.data.autoBuy);
        }
        if (this.buttonCallback) {
            this.buttonCallback();
        }
        return true;
    } else {
        return false;
    }
};

upgradableResource.prototype.draw = function () {
    var resourceInfo = this.player.gameData.resources;
    this.$amt.html(this.level.toString());
    this.$cost.html("(" + this.cost.toString(resourceInfo) + ")");
    if (this.data.autoBuy && this.level > 0) {
        this.$button.prop("disabled", false);
        this.$button.toggleClass("autobuyer", true);
        this.$button.toggleClass("autobuyer-enabled", this.data.autoBuy.enabled);
        this.$cost.hide();
    }
    else if (this.player.calcCost(this.cost).allPositive()) {
        this.$button.prop("disabled", false);
    } else {
        this.$button.prop("disabled", true);
    }
    if (this.autoBuyer) {
        this.$autobuyRate.html(new Decimal(1).div(this.autoBuyer.rate).toString());
    }
};

upgradableResource.prototype.toggle = function (toggle) {
    this.$button.toggle(toggle);
}