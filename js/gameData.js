var data = {
    panels: {
        intro: {
            class: "intro-panel",
            buttons: {
                startButton: {
                    cost: {
                        evoSeeds: new Decimal(1)
                    },
                    buttonCallback: function () {
                        this.player.resources.addResources({ entropy: new Decimal(10) });
                        this.player.panels.intro.close();
                        $(".resources-panel.evoSeeds").hide();
                        this.player.panels.d1.open();
                    }
                }
            },
            openCallback: function () {
                $(".resources-panel.evoSeeds").show();
            }
        },
        d1: {
            class: "d1-panel",
            buttons: {
                symbioteButton: {
                    cost: {
                        entropy: new Decimal(10)
                    },
                    buttonCallback: function () {
                        this.player.resources.addResources({ symbiotes: new Decimal(1) });
                    }
                },
            },
            openCallback: function () {
                $(".resources-panel.entropy").show();
            },
        }
    },
    resources: {
        evoSeeds: {
            label: "Evolution Seed",
            pluralLabel: "Evolution Seeds"
        },
        entropy: {
            label: "Entropy"
        },
        symbiotes: {
            label: "Symbiote",
            pluralLabel: "Symbiotes",
            resourceGain: {
                entropy: new Decimal(1)
            }
        }
    }
}