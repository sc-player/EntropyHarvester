function Ui(player, dataLoader) {
	this.components = {
		LoadModal: new loadModal(player, dataLoader)
	}
}

Ui.prototype.AttachHandlers = function () {
	this.components.LoadModal.AddHandlers();
}