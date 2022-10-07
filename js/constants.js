var C = {
    0: new Decimal(0),
    1: new Decimal(1),
    10: new Decimal(10),
    evoSeed: {
        startBase: new Decimal(1),
    },

    entropy: {
        startBase: new Decimal(10),
        baseGain: new Decimal(1),
    },

    symbiotes: {
        baseCost: new Decimal(10),
        baseGain: new Decimal(1),
        softCapStart: new Decimal(1e4),
        softCapBase: new Decimal(1.5),
        softCapAdjustment: new Decimal(1e2),
        cellTreeOpen: new Decimal(10)
    },

    cellTree1Button: {
        baseCost: new Decimal(500),
    },

    cellTree2Button: {
        baseCost: new Decimal(1e3),
        costMultiplier: new Decimal(10),
        multiplier: new Decimal(2),
    },

    cellTree3Button: {
        maxLevel: new Decimal(1),
        baseCost: new Decimal(5e3),
        multiplier: new Decimal(0.25),
    },

    cellTree4Button: {
        baseCost: new Decimal(1.5e4),
        costMultiplier: new Decimal(20),
        multiplier: new Decimal(2)
    },

    cellTree5Button: {
        baseCost: new Decimal(1e5),
        costMultiplier: new Decimal(1e3),
        divisionAdjuster: new Decimal(1),
        mainDivisor: new Decimal(10),
    },

    cellTree6Button: {
        maxLevel: new Decimal(1),
        baseCost: new Decimal(3e6),
        baseSymbioteGain: new Decimal(10),
    },

    cellTree7Button: {
        baseCost: new Decimal(1e7),
        costMultiplier: new Decimal(5e3),
        multiplier: new Decimal(1.5)
    },

    cellTree8Button: {
        maxLevel: new Decimal(1),
        baseCost: new Decimal(1e15)
    }
};