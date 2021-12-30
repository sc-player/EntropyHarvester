function upgradableResource(button, buttonData, player) {
    this.$button = button;

    this.data = buttonData;
    this.cost = new Resources(buttonData.cost);

    this.player = player;

    this.level = new Decimal(0);

    this.$amt = $(button).find(".upgrade-amt");
    this.$cost = $(button).find(".upgrade-cost");
    this.$value = $(button).find(".upgrade-value");

    this.addResources = new Resources(buttonData.addResources);

    this.buttonCallback = buttonData.buttonCallback ? $.proxy(buttonData.buttonCallback, this) : null;
    $(button).click(() => {
        this.upgrade(new Decimal(1));
        this.player.addResources(this.addResources);
        if (this.buttonCallback) {
            this.buttonCallback();
        }
    });
};

upgradableResource.prototype.upgrade = function (amt) {
    var newResources = this.player.calcCost(this.cost);
    if (newResources.allPositive()) {
        this.level = this.level.plus(amt);
        this.player.resources = newResources;
        if (this.data.costFactor) {
            this.cost = this.cost.times(new Resources(this.data.costFactor));
        }
    }
};

upgradableResource.prototype.draw = function () {
    var resourceInfo = this.player.gameData.resources;
    this.$amt.html(this.level.toString());
    this.$cost.html("(" + this.cost.toString(resourceInfo) + ")");
    this.$button.prop("disabled", () => !this.player.calcCost(this.cost).allPositive());
};