var data = {
    panels: {
        intro: {
            class: "intro-panel",
            buttons: {
                startButton: {
                    cost: {
                        evoSeeds: new Decimal(1)
                    },
                    addResources: {
                        entropy: new Decimal(10)
                    },
                    buttonCallback: function () {
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
                    addResources: {
                        symbiotes: new Decimal(1)
                    },
                    buttonCallback: function () {
                        if (this.player.resources.vals.symbiotes.equals(new Decimal(10))) {
                            this.player.panels.cellTree.open();
                        }
                    }
                },
            },
            openCallback: function () {
                $(".resources-panel.entropy").show();
                $(".resources-panel.symbiotes").show();
            },
        },
        cellTree: {
            class: "cellTree-panel",
            buttons: {
                cellTree1Button: {
                    cost: {
                        entropy: new Decimal(1000)
                    },
                    costFactor: {
                        entropy: new Decimal(100)
                    },
                    addResources: {
                        cellTree1: new Decimal(1)
                    }
                }
            }
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
        },
        cellTree1: {
            label: "Self Replicating Genetic Code",
            resourceGain: {
                symbiotes: new Decimal(1)
            }
        }
    }
}