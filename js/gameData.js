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

    var prestiges = {
        d1: {
            entropy: new Decimal(10),
            symbiotes: new Decimal(0),
            cellTreeTimer: new Decimal(1),
            currentCellTreeTime: new Decimal(0)
        }
    };

    return {
        panels: {
            intro: {
                class: "intro-panel",
                buttons: {
                    startButton: {
                        name: "startButton",
                        label: "Click to Begin",
                        amount: new Decimal(1),
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
                        amount: new Decimal(1),
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
                prestige: prestiges.d1,
                buttons: {
                    cellTree1Button: {
                        name: "cellTree1Button",
                        label: "Self Replicating Genetic Code",
                        desc: "Autobuy Symbiotes",
                        autobuy: true,
                        amount: new Decimal(1),
                        cost: {
                            entropy: new Decimal(500)
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
                        amount: new Decimal(1),
                        upgradeLevel: true,
                        cost: {
                            entropy: new Decimal(1000)
                        },
                        costFactor: {
                            entropy: new Decimal(10)
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
                        maxLevel: new Decimal(1),
                        amount: new Decimal(1),
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
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree4Button.toggle(true);
                        }
                    },
                    cellTree4Button: {
                        name: "cellTree4Button",
                        label: "Biological Membrane",
                        desc: "Double Symbiote Entropy Production",
                        hidden: "hidden",
                        upgradeLevel: true,
                        amount: new Decimal(1),
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
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree5Button.toggle(true);
                        }
                    },
                    cellTree5Button: {
                        name: "cellTree5Button",
                        label: "Genetic Drift",
                        desc: "Increase Entropy Gain Based on time since last cell tree reset",
                        hidden: "hidden",
                        upgradeLevel: true,
                        amount: new Decimal(1),
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
                                    var time = resources.vals.currentCellTreeTime;
                                    return new Resources({
                                        entropy: time.gt(new Decimal(0)) ? new Decimal(1).plus(
                                            time.div(
                                                time.pow(
                                                    (new Decimal(1)).div(resource.level.plus(new Decimal(1)))
                                                )
                                            ).div(new Decimal(10))
                                        ) : 1
                                    }, 1);
                                };
                            }
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree6Button.toggle(true);
                        }
                    },
                    cellTree6Button: {
                        name: "cellTree6Button",
                        label: "Previous Generations",
                        desc: "Start with symbiotes",
                        hidden: "hidden",
                        maxLevel: new Decimal(1),
                        amount: new Decimal(1),
                        cost: {
                            entropy: new Decimal(3000000)
                        },
                        prestigeUpgrade: {
                            cellTree: {
                                symbiotes: new Decimal(10)
                            }
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree7Button.toggle(true);
                        }
                    },
                    cellTree7Button: {
                        name: "cellTree7Button",
                        label: "Advanced Genetic Code",
                        desc: "Gain extra symbiotes when buying",
                        hidden: "hidden",
                        upgradeLevel: true,
                        amount: new Decimal(1),
                        cost: {
                            entropy: new Decimal(10).pow(new Decimal(10))
                        },
                        costFactor: {
                            entropy: new Decimal(100000)
                        },
                        autobuyerRateIncrease: {
                            d1: {
                                symbioteButton: new Decimal(1.1)
                            }
                        }
                    }
                }
            }
        },
        resources: resources
    }
}();