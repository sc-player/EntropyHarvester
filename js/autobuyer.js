function Autobuyer(autobuyerData, player) {
    this.player = player;
    this.button = player.panels[autobuyerData.panel].$buttons[autobuyerData.button];
    this.enabled = true;
    this.rate = autobuyerData.rate;
    this.name = autobuyerData.button;
    this.player.gameState.autoBuyers[this.name] = this.player.gameState.autoBuyers[this.name] || {};
}

Autobuyer.prototype.getRate = function () {
    return (new Decimal(1)).div(this.rate(this.player.gameState));
}

Autobuyer.prototype.toggle = function() {
    this.enabled = !this.enabled;
    if (this.enabled) {
        var rate = this.getRate();
        this.player.gameState.autoBuyers[this.name].timeLeft =
            this.player.gameState.autoBuyers[this.name].timeLeft > rate ? rate : this.timeLeft;
    }
}

Autobuyer.prototype.reset = function() {
    this.player.gameState.autoBuyers[this.name].timeLeft = this.getRate();
}

Autobuyer.prototype.buy = function (elapsed) {
    this.player.gameState.autoBuyers[this.name].timeLeft =
        this.player.gameState.autoBuyers[this.name].timeLeft.plus(elapsed);
    if (this.enabled) {
        var cost = this.button.cost(this.player.gameState);
        var timesAttempt = this.player.gameState.autoBuyers[this.name].timeLeft.div(this.getRate()).floor();
        var times = this.player.calcAvailableBuys(cost, timesAttempt);
        if (times.gt(0)) {
            this.player.setResources(this.player.calcCost(cost, times));
            this.button.upgrade(times);
            this.player.gameState.autoBuyers[this.name].timeLeft =
                this.player.gameState.autoBuyers[this.name].timeLeft.minus(this.getRate().times(timesAttempt)); 
        }
    }
}