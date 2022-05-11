$(function () {
    Decimal.config({ precision: 5, toExpNeg: -5, toExpPos: 5 });

    var lastRender = 0

    function loop(timestamp) {
        var elapsed = timestamp - lastRender;
        if (elapsed > 50) {
            var elapsed = new Decimal(elapsed / 1000);
            player.calculateResourceGain(elapsed);
            player.calculateAutoBuyers(elapsed);

            player.draw();

            lastRender = timestamp;
        }
        window.requestAnimationFrame(loop);
    }

    var player = new Player(window.data);
    window.requestAnimationFrame(loop);
});