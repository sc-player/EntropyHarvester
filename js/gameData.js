var data = function () {
    var resources = {
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
        cellTreeTimer: {
            resourceGain: {
                currentCellTreeTime: new Decimal(1)
            }
        },
        currentCellTreeTime: {}
    };



    return {
        panels: {
            intro: {
                class: "intro-panel",
                buttons: {
                    startButton: {
                        name: "startButton",
                        label: "Click to Begin",
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
                        name: "symbioteButton",
                        label: "Symbiote",
                        resourceGenerator: true,
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
                        name: "cellTree1Button",
                        label: "Self Replicating Genetic Code",
                        desc: "Autobuy Symbiotes",
                        autobuy: true,
                        cost: {
                            entropy: new Decimal(500)
                        },
                        resourcesReset: {
                            entropy: new Decimal(10),
                            symbiotes: new Decimal(0),
                            currentCellTreeTime: new Decimal(0)
                        },
                        autoBuy: {
                            rate: new Decimal(1),
                            panel: "d1",
                            button: "symbioteButton"
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree2Button.toggle(true);
                            this.$button.find(".symbiote-autobuy-rate").html("1");
                        }
                    },
                    cellTree2Button: {
                        name: "cellTree2Button",
                        label: "Nutrient Absorption",
                        desc: "Double Symbiote Autobuy Speed",
                        hidden: "hidden",
                        upgradeLevel: true,
                        cost: {
                            entropy: new Decimal(1000)
                        },
                        costFactor: {
                            entropy: new Decimal(10)
                        },
                        resourcesReset: {
                            entropy: new Decimal(10),
                            symbiotes: new Decimal(0),
                            currentCellTreeTime: new Decimal(0)
                        },
                        buttonCallback: function () {
                            this.player.autoBuyers.symbioteButton.rate = this.player.autoBuyers.symbioteButton.rate.div(new Decimal(2));
                            this.player.panels.cellTree.$buttons.cellTree3Button.toggle(true);
                        }
                    },
                    cellTree3Button: {
                        name: "cellTree3Button",
                        label: "Metabolism",
                        desc: "Increase symbiote production based on bought upgrades",
                        hidden: "hidden",
                        maxLevel: 1,
                        cost: {
                            entropy: new Decimal(5000)
                        },
                        resourceGainFactor: {
                            symbiotes: function (upgradableResource) {
                                var cellTreePanel = upgradableResource.player.panels.cellTree;
                                return function (resources) {
                                    var res = new Resources({
                                        entropy: new Decimal(1)
                                    });
                                    for (var buttonName in cellTreePanel.$buttons) {
                                        res = res.plus(new Resources({
                                            entropy: cellTreePanel.$buttons[buttonName].level.times(new Decimal(0.25))
                                        }));
                                    }
                                    return res;
                                }
                            }
                        },
                        resourcesReset: {
                            entropy: new Decimal(10),
                            symbiotes: new Decimal(0),
                            currentCellTreeTime: new Decimal(0)
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree4Button.toggle(true);
                        }
                    },
                    cellTree4Button: {
                        name: "cellTree4Button",
                        label: "Biological Membrane",
                        desc: "Double Symbiote Production",
                        hidden: "hidden",
                        upgradeLevel: true,
                        cost: {
                            entropy: new Decimal(15000)
                        },
                        costFactor: {
                            entropy: new Decimal(20)
                        },
                        resourceGainFactor: {
                            symbiotes: {
                                entropy: new Decimal(2)
                            }
                        },
                        resourcesReset: {
                            entropy: new Decimal(10),
                            symbiotes: new Decimal(0),
                            currentCellTreeTime: new Decimal(0)
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree5Button.toggle(true);
                        }
                    },
                    cellTree5Button: {
                        name: "cellTree5Button",
                        label: "Genetic Deviation",
                        desc: "Increase Symbiote Entropy Gain Based on time since last cell tree reset",
                        hidden: "hidden",
                        upgradeLevel: true,
                        cost: {
                            entropy: new Decimal(100000)
                        },
                        costFactor: {
                            entropy: new Decimal(10000)
                        },
                        resourceGainFactor: {
                            symbiotes: function (upgradableResource) {
                                var resource = upgradableResource;
                                return function (resources) {
                                    return new Resources({
                                        entropy: resources.vals.symbiotes.gt(new Decimal(0))
                                            ? resources.vals.currentCellTreeTime.div(new Decimal(10))
                                                .toPower(resource.level.div(resource.level.plus(new Decimal(5))))
                                            : new Decimal(1)
                                    }, 1);
                                };
                            }
                        },
                        resourcesReset: {
                            entropy: new Decimal(10),
                            symbiotes: new Decimal(0),
                            currentCellTreeTime: new Decimal(0)
                        },
                    }
                }
            }
        },
        resources: resources
    }
}();