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
    if (this.enabled) {
        while (this.timeLeft > this.rate) {
            if (this.button.upgrade()) {
                this.timeLeft = this.timeLeft.minus(this.rate);
            } else {
                return;
            }
        }
    }
    this.timeLeft = this.timeLeft.plus(elapsed);
}