var validator = {};
export function addValidator(constructorName, propertyName, validatorName, validatorFunction) {
    var _a;
    if (!(constructorName in validator)) {
        validator[constructorName] = (_a = {},
            _a[propertyName] = [{
                    validator: validatorFunction,
                    name: validatorName,
                }],
            _a);
        return;
    }
    if (validator[constructorName][propertyName]
        && validator[constructorName][propertyName].length > 0) {
        validator[constructorName][propertyName].push({
            validator: validatorFunction,
            name: validatorName,
        });
        return;
    }
    validator[constructorName][propertyName] = [{
            validator: validatorFunction,
            name: validatorName,
        }];
}
export function validate(obj) {
    var className = obj.constructor.name;
    if (!validator[className]) {
        return { valid: true, details: [] };
    }
    var res = { valid: true, details: [] };
    Object.keys(obj).forEach(function (key) {
        var details = {
            prop: key,
            invalid: [],
        };
        res.details.push(details);
        if (validator[className][key]) {
            validator[className][key].forEach(function (val) {
                if (!val.validator(obj[key])) {
                    res.valid = false;
                    details.invalid.push(val.name);
                }
            });
        }
    });
    return res;
}
//# sourceMappingURL=Validator.js.map