function upgradableResource(button, buttonData, player) {
    this.$button = button;
    this.data = buttonData;
    this.cost = new Resources(buttonData.cost);
    this.player = player;
    this.level = new Decimal(0);
    this.$amt = $(button).find(".upgrade-amt");
    this.buttonCallback = buttonData.buttonCallback ? $.proxy(buttonData.buttonCallback, this) : null;
    $(button).click(() => {
        this.upgrade(new Decimal(1));
        if (this.buttonCallback) {
            this.buttonCallback();
        }
    });
};

upgradableResource.prototype.upgrade = function (amt) {
    if (this.player.calcCost(this.cost)) {
        this.level = this.level.plus(amt);
    }
};

upgradableResource.prototype.draw = function () {
    this.$amt.html(this.level.toString());
}