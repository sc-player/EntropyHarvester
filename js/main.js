function main() {
    this.lastRender = 0;
    this.dataLoader = new DataLoader();

    var loadedState = this.dataLoader.getCurrentData();

    this.player = new Player(window.data, loadedState);

    var UI = new Ui(this.player, this.dataLoader);
    UI.AttachHandlers();
}

main.prototype.loop = function (timestamp) {
    var elapsed = timestamp - this.lastRender;
    if (elapsed > 50) {
        var elapsedDecimal = new Decimal(elapsed / 1000);
        this.player.calculateResourceGain(elapsedDecimal);
        this.player.calculateAutoBuyers(elapsedDecimal);

        this.player.draw();

        this.player.addTime(elapsed);
        this.dataLoader.saveGameState(this.player.gameState);
        this.lastRender = timestamp;
    }
    window.requestAnimationFrame((ts) => this.loop(ts));
}


$(function () {
    var m = new main();
    window.requestAnimationFrame((ts) => m.loop(ts));
});