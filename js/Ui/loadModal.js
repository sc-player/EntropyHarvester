function loadModal(player, dataLoader) {
    this.player = player;
    this.dataLoader = dataLoader;
}

loadModal.prototype.class = ".load-modal";

loadModal.prototype.AddHandlers = function () {
    var loadModal = this;
    $(this.class).on("show.bs.modal", function (ev) {
        var $this = $(this);
        $this.find(`tr[data-load='${loadModal.dataLoader.currentSaveFile}']`).css({'background-color': 'green'});
    });

    $(this.class).find(".load").click(function () {
        var saveFile = $(this).parent().data("load");
        loadModal.dataLoader.setSaveFile(saveFile);
        window.location.reload();
    });

    $(this.class).find(".reset").click(function () {
        var saveFile = $(this).parent().data("load");
        if (confirm(`Save file ${saveFile} will be permanently deleted. Are you sure?`)) {
            loadModal.dataLoader.resetSaveFile(saveFile);
            window.location.reload();
            debugger;
        }
    });
}