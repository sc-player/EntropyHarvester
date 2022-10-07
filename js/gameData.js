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
                var base = new Resources({ entropy: C.entropy.baseGain });

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
                return new Resources({ currentCellTreeTime: C[1] });
            }
        },
        currentCellTreeTime: {}
    };

    var prestiges = {
        d1: function (gameState) {
            return new Resources({
                entropy: C.entropy.startBase,
                symbiotes: gameState.upgrades.cellTree6Button ? gameState.upgrades.cellTree6Button.calc(gameState) : C[0],
                cellTreeTimer: C[1],
                currentCellTreeTime: C[0]
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
                            return new Resources({ evoSeeds: C.evoSeed.startBase });
                        },
                        addResources: function (gameState) {
                            return new Resources({ entropy: C.entropy.startBase });
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
                            var softCapStart = C.symbiotes.softCapStart;
                            var costMultiplier = gameState.resources.vals.symbiotes.gt(softCapStart)
                                ? gameState.resources.vals.symbiotes.pow(C.symbiotes.softCapBase).div(softCapStart).minus(C.symbiotes.softCapAdjustment)
                                : C[0];
                            return new Resources({
                                entropy: costMultiplier.add(C.symbiotes.baseCost)
                            });
                        },
                        addResources: function (gameState) {
                            return new Resources({
                                symbiotes: gameState.upgrades.cellTree7Button ? gameState.upgrades.cellTree7Button.calc(gameState) : C.symbiotes.baseGain
                            });
                        },
                        buttonCallback: function (gameState) {
                            if (gameState.resources.vals.symbiotes.gte(C.symbiotes.cellTreeOpen)) {
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
                        cost: function () {
                            return new Resources({ entropy: C.cellTree1Button.baseCost });
                        },
                        autoBuy: {
                            rate: function (gameState) {
                                return gameState.upgrades.cellTree2Button ?
                                    gameState.upgrades.cellTree2Button.calc(gameState) :
                                    C[1];
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
                            var level = gameState.upgrades.cellTree2Button?.level || C[0];
                            return new Resources({ entropy: C.cellTree2Button.baseCost.times(C.cellTree2Button.costMultiplier.pow(level)) });
                        },
                        getValue: function (gameState) {
                            return C.cellTree2Button.multiplier.pow(gameState.upgrades.cellTree2Button.level);
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
                        maxLevel: C.cellTree3Button.maxLevel,
                        multiplier: true,
                        cost: function () {
                            return new Resources({ entropy: C.cellTree3Button.baseCost });
                        },
                        getValue: function (gameState) {
                            var res = C[1];
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
                                    res = res.plus(gameState.upgrades[upgradesToCheck[buttonName]].level.times(C.cellTree3Button.multiplier));
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
                            var level = gameState.upgrades.cellTree4Button?.level || C[0];
                            return new Resources({ entropy: C.cellTree4Button.baseCost.times(C.cellTree4Button.costMultiplier.pow(level)) });
                        },
                        getValue: function (gameState) {
                            return C.cellTree4Button.multiplier.pow(gameState.upgrades.cellTree4Button.level);
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
                            var level = gameState.upgrades.cellTree5Button?.level || C[0];
                            return new Resources({ entropy: C.cellTree5Button.baseCost.times(C.cellTree5Button.costMultiplier.pow(level)) });
                        },
                        getValue: function (gameState) {
                            var time = gameState.resources.vals.currentCellTreeTime;
                            return time.gt(C[0]) ? C[1].plus(
                                time.div(
                                    time.pow(
                                        C.cellTree5Button.divisionAdjuster.div(gameState.upgrades.cellTree5Button.level.plus(C.cellTree5Button.divisionAdjuster))
                                    )
                                ).div(C.cellTree5Button.mainDivisor)
                            ) : C[1];
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
                        maxLevel: C.cellTree6Button.maxLevel,
                        resources: true,
                        cost: function () {
                            return new Resources({ entropy: C.cellTree6Button.baseCost });
                        },
                        getValue: function () {
                            return C.cellTree6Button.baseSymbioteGain;
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
                            var level = gameState.upgrades.cellTree7Button?.level || C[0];
                            return new Resources({ entropy: C.cellTree7Button.baseCost.times(C.cellTree7Button.costMultiplier.pow(level)) });
                        },
                        getValue: function (gameState) {
                            return C.cellTree7Button.multiplier.pow(gameState.upgrades.cellTree7Button.level);
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
                        maxLevel: C.cellTree8Button.maxLevel,
                        cost: function () {
                            return new Resources({ entropy: C.cellTree8Button.baseCost });
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