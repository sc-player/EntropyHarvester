$(function () {
    var lastRender = 0;

    function loop(timestamp) {
        var elapsed = timestamp - lastRender;
        if (elapsed > 50) {
            var elapsedDecimal = new Decimal(elapsed / 1000);
            player.calculateResourceGain(elapsedDecimal);
            player.calculateAutoBuyers(elapsedDecimal);
            
            player.draw();

            player.addTimeAndSave(elapsed);
            lastRender = timestamp;
        }
        window.requestAnimationFrame(loop);
    }

    var loadedState = dataLoader.prototype.load(1)

    var player = new Player(window.data, loadedState);
    window.requestAnimationFrame(loop);
});