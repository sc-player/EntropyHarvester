function gamePanel(panelData, player) {
    this.data = panelData;
    this.$panel = $(`.game-panel.${panelData.class}`);

    this.player = player;

    this.$buttons = {};
    var that = this;
    this.$panel.find(".upgrade-button").each(function(){
        var $this = $(this);
        var buttonName = $this.data("name");
        that.$buttons[buttonName] = new upgradableResource($this, panelData.buttons[buttonName], player);
    });
    this.openCallback = panelData.openCallback ? $.proxy(panelData.openCallback, this) : null;
}

gamePanel.prototype.open = function () {
    this.$panel.show();
    if (this.openCallback) {
        this.openCallback();
    }
}

gamePanel.prototype.close = function () {
    this.$panel.hide();
}

gamePanel.prototype.draw = function () {
    $.each(this.$buttons, function () {
        this.draw();
    });
}