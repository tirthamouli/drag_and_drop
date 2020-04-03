import { addValidator } from '../utils/Validator.js';
export function Required(target, propertyName) {
    addValidator(target.constructor.name, propertyName, 'required', function (value) {
        if (value) {
            return true;
        }
        return false;
    });
}
export function PositiveNumber(target, propertyName) {
    addValidator(target.constructor.name, propertyName, 'positive number', function (value) {
        if (typeof value === 'number' && value > 0) {
            return true;
        }
        return false;
    });
}
export function MinLength(min) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'min length', function (value) { return value.length >= min; });
    };
}
export function MaxLength(max) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'max length', function (value) { return value.length <= max; });
    };
}
export function Min(min) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'min', function (value) { return value >= min; });
    };
}
export function Max(max) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'max', function (value) { return value <= max; });
    };
}
//# sourceMappingURL=Validation.js.map