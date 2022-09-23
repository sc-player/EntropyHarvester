function Autobuyer(autobuyerData, player) {
    this.player = player;
    this.button = player.panels[autobuyerData.panel].$buttons[autobuyerData.button];
    this.enabled = true;
    this.rate = autobuyerData.rate;
    this.reset();
}

Autobuyer.prototype.getRate = function () {
    return (new Decimal(1)).div(this.rate(this.player.gameState));
}

Autobuyer.prototype.toggle = function() {
    this.enabled = !this.enabled;
    if (this.enabled) {
        var rate = this.getRate();
        this.timeLeft = this.timeLeft > rate ? rate : this.timeLeft;
    }
}

Autobuyer.prototype.reset = function() {
    this.timeLeft = this.getRate();
}

Autobuyer.prototype.buy = function (elapsed) {
    this.timeLeft = this.timeLeft.plus(elapsed);
    if (this.enabled) {
        var cost = this.button.cost(this.player.gameState);
        var timesAttempt = this.timeLeft.div(this.getRate()).floor();
        var times = this.player.calcAvailableBuys(cost, timesAttempt);
        if (times.gt(0)) {
            this.button.upgrade(times, cost);
            this.timeLeft = this.timeLeft.minus(this.getRate().times(timesAttempt)); 
        }
    }
}