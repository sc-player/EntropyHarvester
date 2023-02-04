function gameState(data) {
    this.gameTime = data?.gameTime || new Date();
    this.resources = data?.resources ? new Resources(data.resources.vals) :
        new Resources({ evoSeeds: new Decimal(1), cellTreeTimer: new Decimal(1) });
    this.upgrades = data?.upgrades ? this.deserializeUpgrades(data.upgrades) : {};
    this.autoBuyers = data?.autoBuyers ? this.deserializeAutoBuyers(data.autoBuyers) : {};
    this.openPanels = data?.openPanels || ["intro"];
    this.buttonsShown = data?.buttonsShown || ["startButton"];
}

gameState.prototype.deserializeUpgrades = function (upgrades) {
    return Object.fromEntries(Object.entries(upgrades).map(([k, v]) => ([
        k, {
            level: new Decimal(v.level),
            lastCalced: new Decimal(v.lastCalced)
        }
    ])));
}

gameState.prototype.deserializeAutoBuyers = function (autoBuyers) {
    return Object.fromEntries(Object.entries(autoBuyers).map(([k, v]) => ([
        k, {
            timeLeft: new Decimal(v.timeLeft)
        }
    ])));
}