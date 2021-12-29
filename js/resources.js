function Resources(data) {
    this.vals = {
        evoSeeds: new Decimal("0"),
        entropy: new Decimal("0"),
        symbiotes: new Decimal("0")
    }
    if (data) {
        Object.assign(this.vals, data);
    }
}

Resources.prototype.addResources = function (newResources) {
    $.each(this.vals, (name) => this.vals[name] = this.vals[name].plus(newResources[name] || new Decimal(0)));
}

Resources.prototype.subtractResources = function(resourceCost){
    var res = new Resources(this.vals);
    $.each(res.vals, (name) => res.vals[name] = res.vals[name].minus(resourceCost.vals[name]));
    return res;
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