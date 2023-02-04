function Resources(data, defaultVal = 0) {
    this.vals = {
        evoSeeds: new Decimal(defaultVal),
        entropy: new Decimal(defaultVal),
        symbiotes: new Decimal(defaultVal),
        cellTreeTimer: new Decimal(defaultVal),
        currentCellTreeTime: new Decimal(defaultVal)
    }
    if (data) {
        for (var name in data) {
            data[name] = new Decimal(data[name]);
        }
        Object.assign(this.vals, data);
    }
}

Resources.prototype.iter = function (callback) {
    $.each(this.vals, callback.bind(this));
    return this;
}

Resources.prototype.plus = function (newResources) {
    return new Resources(this.vals)
        .iter(function (name) {
            this.vals[name] = this.vals[name].plus(newResources.vals[name] || new Decimal(0));
        });
}

Resources.prototype.minus = function (resourceCost) {
    return new Resources(this.vals)
        .iter(function (name) {
            this.vals[name] = this.vals[name].minus(resourceCost.vals[name] || new Decimal(0));
        });
}

Resources.prototype.times = function (resourceMultiplier) {
    return new Resources(this.vals)
        .iter(function (name) {
            var value = resourceMultiplier instanceof Decimal ? resourceMultiplier : resourceMultiplier.vals[name];
            this.vals[name] = this.vals[name].times(value || Decimal(1));
        });
}

Resources.prototype.set = function (resources) {
    return new Resources(this.vals)
        .iter(function (name){
            if (resources[name]) {
                this.vals[name] = resources[name];
            }
        });
}

Resources.prototype.allPositive = function () {
    for (const name in this.vals) {
        if (this.vals[name].lessThan(new Decimal(0))) {
            return false;
        }
    }
    return true;
}

Resources.prototype.draw = function () {
    var that = this;
    $.each(this.vals, function (name) {
        $(`.${name}-amt`).html(that.displayValue(this));
    });
}

Resources.prototype.toString = function (resourceInfo) {
    var res = [];
    for (var name in this.vals) {
        if (this.vals[name].greaterThan(0) && resourceInfo[name].label) {
            res.push(this.displayValue(this.vals[name]) + " " + (this.vals[name].greaterThan(1) && resourceInfo[name].pluralLabel ? resourceInfo[name].pluralLabel : resourceInfo[name].label));
        }
    }
    return res.join(", ");
}

Resources.prototype.displayValue = function (val) {
    return val.toPrecision(5).replace(/(\.[0-9]*[1-9])0*|(\.0*)/, "$1");
}