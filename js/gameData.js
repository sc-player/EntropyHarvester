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
            resourceGain: function (gameState) {
                var base = new Resources({ entropy: new Decimal(1) });

                //metabolism
                if (gameState.upgrades.cellTree3Button) {
                    var metabolism = new Resources({
                        entropy: gameState.upgrades.cellTree3Button.calc(gameState, base)
                    });
                    base = base.times(metabolism);
                }

                //nutrient absorption
                if (gameState.upgrades.cellTree4Button) {
                    var nutrientAbsorption = new Resources({
                        entropy: gameState.upgrades.cellTree4Button.calc(gameState, base)
                    });
                    base = base.times(nutrientAbsorption);
                }

                //genetic drift
                if (gameState.upgrades.cellTree5Button) {
                    var geneticDrift = new Resources({
                        entropy: gameState.upgrades.cellTree5Button.calc(gameState, base)
                    });
                    base = base.times(geneticDrift);
                }

                //punnet square
                if (gameState.upgrades.cellTree8Button) {
                    var punnetSquare = new Resources({
                        entropy: gameState.upgrades.cellTree8Button.calc(gameState, base)
                    });
                    base = base.times(punnetSquare);
                }

                return base;
            }
        },
        cellTreeTimer: {
            resourceGain: function () {
                return new Resources({ currentCellTreeTime: new Decimal(1) });
            }
        },
        currentCellTreeTime: {}
    };

    var prestiges = {
        d1: function (gameState) {
            return new Resources({
                entropy: new Decimal(10),
                symbiotes: gameState.upgrades.cellTree6Button ? gameState.upgrades.cellTree6Button.calc(gameState) : new Decimal(0),
                cellTreeTimer: new Decimal(1),
                currentCellTreeTime: new Decimal(0)
            });
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
                        cost: function () {
                            return new Resources({ evoSeeds: new Decimal(1) });
                        },
                        addResources: function(gameState){
                            return new Resources({ entropy: new Decimal(10) });
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
                        cost: function (gameState) {
                            var softCapStart = new Decimal(1e4);
                            var costMultiplier = gameState.resources.vals.symbiotes.gt(softCapStart)
                                ? gameState.resources.vals.symbiotes.pow(new Decimal(1.5)).div(softCapStart).minus(new Decimal(100))
                                : new Decimal(0);
                            return new Resources({
                                entropy: costMultiplier.add(new Decimal(10))
                            });
                        },
                        addResources: function (gameState) {
                            return new Resources({
                                symbiotes: gameState.upgrades.cellTree7Button ? gameState.upgrades.cellTree7Button.calc(gameState) : new Decimal(1)
                            });
                        },
                        buttonCallback: function (gameState) {
                            if (gameState.resources.vals.symbiotes.gte(new Decimal(10))) {
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
                        cost: function(){
                            return new Resources({ entropy: new Decimal(500) });
                        },
                        autoBuy: {
                            rate: function (gameState) {
                                return gameState.upgrades.cellTree2Button ?
                                    gameState.upgrades.cellTree2Button.calc(gameState) :
                                    new Decimal(1);
                            },
                            panel: "d1",
                            button: "symbioteButton"
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree2Button.toggle(true);
                        }
                    },
                    cellTree2Button: {
                        name: "cellTree2Button",
                        label: "Nutrient Absorption",
                        desc: "Double Symbiote Autobuy Speed",
                        hidden: "hidden",
                        upgradeLevel: true,
                        multiplier: true,
                        cost: function (gameState) {
                            var level = gameState.upgrades.cellTree2Button?.level || new Decimal(0);
                            return new Resources({ entropy: (new Decimal(1e3)).times((new Decimal(10)).pow(level)) });
                        },
                        getValue: function (gameState) {
                            return (new Decimal(2)).pow(gameState.upgrades.cellTree2Button.level);
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree3Button.toggle(true);
                        }
                    },
                    cellTree3Button: {
                        name: "cellTree3Button",
                        label: "Metabolism",
                        desc: "Increase symbiote entropy production based on bought upgrades",
                        hidden: "hidden",
                        maxLevel: new Decimal(1),
                        multiplier: true,
                        cost: function () {
                            return new Resources({ entropy: new Decimal(5e3) });
                        },
                        getValue: function (gameState) {
                            var res = new Decimal(1);
                            var upgradesToCheck = [
                                "cellTree1Button",
                                "cellTree2Button",
                                "cellTree3Button",
                                "cellTree4Button",
                                "cellTree5Button",
                                "cellTree6Button",
                                "cellTree7Button",
                                "cellTree8Button",
                            ];
                            for (var buttonName in upgradesToCheck) {
                                if (gameState.upgrades[upgradesToCheck[buttonName]]) {
                                    res = res.plus(gameState.upgrades[upgradesToCheck[buttonName]].level.times(new Decimal(0.25)));
                                }
                            }
                            return res;
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
                        multiplier: true,
                        cost: function (gameState) {
                            var level = gameState.upgrades.cellTree4Button?.level || new Decimal(0);
                            return new Resources({ entropy: (new Decimal(1.5e4)).times((new Decimal(20)).pow(level)) });
                        },
                        getValue: function (gameState) {
                            return (new Decimal(2)).pow(gameState.upgrades.cellTree4Button.level);
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
                        multiplier: true,
                        cost: function (gameState) {
                            var level = gameState.upgrades.cellTree5Button?.level || new Decimal(0);
                            return new Resources({ entropy: (new Decimal(1e5)).times((new Decimal(1e3)).pow(level)) });
                        },
                        getValue: function (gameState) {
                            var time = gameState.resources.vals.currentCellTreeTime;
                            return time.gt(new Decimal(0)) ? new Decimal(1).plus(
                                time.div(
                                    time.pow(
                                        (new Decimal(1)).div(gameState.upgrades.cellTree5Button.level.plus(new Decimal(1)))
                                    )
                                ).div(new Decimal(10))
                            ) : new Decimal(1);
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree6Button.toggle(true);
                        }
                    },
                    cellTree6Button: {
                        name: "cellTree6Button",
                        label: "Previous Generations",
                        desc: "Start with symbiotes:",
                        hidden: "hidden",
                        maxLevel: new Decimal(1),
                        resources: true,
                        cost: function () {
                            return new Resources({ entropy: new Decimal(3e6) });
                        },
                        getValue: function () {
                            return new Decimal(10);
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
                        multiplier: true,
                        cost: function (gameState) {
                            var level = gameState.upgrades.cellTree7Button?.level || new Decimal(0);
                            return new Resources({ entropy: (new Decimal(1e7)).times((new Decimal(5e3)).pow(level)) });
                        },
                        getValue: function (gameState) {
                            return (new Decimal(1.5)).pow(gameState.upgrades.cellTree7Button.level);
                        },
                        buttonCallback: function () {
                            this.player.panels.cellTree.$buttons.cellTree8Button.toggle(true);
                        }
                    },
                    cellTree8Button: {
                        name: "cellTree8Button",
                        label: "Punnett Square",
                        desc: "Entropy gain is squared",
                        hidden: "hidden",
                        multiplier: true,
                        maxLevel: 1,
                        cost: function () {
                            return new Resources({ entropy: new Decimal(1e15) });
                        },
                        getValue: function (gameState, currentMultipliers) {
                            return currentMultipliers.vals.entropy;
                        }
                    }
                }
            }
        },
        resources: resources
    }
}();