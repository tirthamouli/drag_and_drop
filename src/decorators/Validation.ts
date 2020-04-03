import { addValidator } from '../utils/Validator.js';

/**
 * Required decorater, property cannot have falsy value
 * @param target
 * @param propertyName
 */
export function Required(target: object, propertyName: string) {
  addValidator(target.constructor.name, propertyName, 'required', (value) => {
    if (value) {
      return true;
    }
    return false;
  });
}

/**
 * Positive number validator, property must be a number and greater than 0
 * @param target
 * @param propertyName
 */
export function PositiveNumber(target: object, propertyName: string) {
  addValidator(target.constructor.name, propertyName, 'positive number', (value) => {
    if (typeof value === 'number' && value > 0) {
      return true;
    }
    return false;
  });
}

/**
 * Checks weather the min length criterion is met
 * @param min
 */
export function MinLength(min: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'min length', (value: string) => value.length >= min);
  };
}

/**
 * Checks weather the max length criterion is met
 * @param min
 */
export function MaxLength(max: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'max length', (value: string) => value.length <= max);
  };
}

/**
   * Checks weather the max length criterion is met
   * @param min
   */
export function Min(min: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'min', (value: number) => value >= min);
  };
}

/**
   * Checks weather the max length criterion is met
   * @param min
   */
export function Max(max: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'max', (value: number) => value <= max);
  };
}
