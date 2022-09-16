function Autobuyer(autobuyerData, player) {
    this.button = player.panels[autobuyerData.panel].$buttons[autobuyerData.button];
    this.timeLeft = autobuyerData.rate;
    this.enabled = true;
    this.rate = autobuyerData.rate;
}

Autobuyer.prototype.toggle = function() {
    this.enabled = !this.enabled;
    if (this.enabled) {
        this.timeLeft = this.timeLeft > this.rate ? this.rate : this.timeLeft;
    }
}

Autobuyer.prototype.reset = function() {
    this.timeLeft = this.rate;
}

Autobuyer.prototype.buy = function (elapsed) {
    this.timeLeft = this.timeLeft.plus(elapsed);
    if (this.enabled) {
        var cost = this.button.cost(this.button.level, this.button.player.resources);
        var timesAttempt = this.timeLeft.div(this.rate).floor();
        var times = this.button.player.calcAvailableBuys(cost, timesAttempt);
        if (times.gt(0)) {
            this.button.upgrade(times, cost);
            this.timeLeft = this.timeLeft.minus(this.rate.times(timesAttempt)); 
        }
    }
}