function Resources(data) {
    this.vals = {
        evoSeeds: new Decimal("0"),
        entropy: new Decimal("0"),
        symbiotes: new Decimal("0"),
        cellTree1: new Decimal("0")
    }
    if (data) {
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
            this.vals[name] = this.vals[name].times((resourceMultiplier instanceof Decimal ? resourceMultiplier : resourceMultiplier.vals[name]) || Decimal(0));
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
    $.each(this.vals, function (name) {
        $(`.${name}-amt`).html(this.toString());
    });
}

Resources.prototype.toString = function (resourceInfo) {
    var res = [];
    for (var name in this.vals) {
        if (this.vals[name].greaterThan(0)) {
            res.push(this.vals[name].toString() + " " + (this.vals[name].greaterThan(1) && resourceInfo[name].pluralLabel ? resourceInfo[name].pluralLabel : resourceInfo[name].label));
        }
    }
    return res.join(", ");
}