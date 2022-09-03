function gamePanel(panelData, player) {
    this.data = panelData;
    this.$panel = $(`.game-panel.${panelData.class}`);

    this.player = player;

    if (panelData.prestige) {
        this.prestigeReset = panelData.prestige;
    }
    this.$buttons = {};
    var that = this;
    $.each(this.data.buttons, function () {
        var render = Mustache.render(that.$buttonTemplate(), this);
        var $button = $(render);
        that.$panel.append($button);
        var buttonName = $button.data("name");
        that.$buttons[buttonName] = new upgradableResource($button, panelData.buttons[buttonName], that);
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

gamePanel.prototype.$buttonTemplate = function () {
    var template;
    return function () {
        if (!template) {
            template = $("#button-template");
        }
        return template.html();
    }
}();