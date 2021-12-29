$(function () {
    Decimal.config({ precision: 5 });

    var lastRender = 0

    function loop(timestamp) {
        var elapsed = timestamp - lastRender;
        if (elapsed > 50) {
            player.calculateResourceGain(new Decimal(elapsed / 1000));

            player.draw();

            lastRender = timestamp;
        }
        window.requestAnimationFrame(loop);
    }

    var player = new Player(window.data);
    window.requestAnimationFrame(loop);
});