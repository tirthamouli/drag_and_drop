/**
 * Interface for a validator config
 */
type ValidatorConfig = {
    [className: string]: {
      [propName: string]: [
        {
          name: string
          validator: ValidateFunction
        }
      ]
    }
}

/**
 * Format of a validate function
 * Validates an input and returns a boolean
 */
type ValidateFunction = (...args: any[]) => boolean

/**
 * Base validator
 */
const validator : ValidatorConfig = {};

/**
 * Validate function result type
*/
type ValidateFuncResType = {
    valid : boolean,
    details: {
      prop: string,
      invalid: string[]
    }[]
}

/**
 * Adds a new validator to the exisiting validators
 * @param constructorName
 * @param propertyName
 * @param validatorName
 * @param validatorFunction
 */
export function addValidator(
  constructorName: string,
  propertyName: string,
  validatorName: string,
  validatorFunction: ValidateFunction,
) {
  // Step 1: Check if the class already exists
  if (!(constructorName in validator)) {
    // Step 1.1: When there is no class
    validator[constructorName] = {
      [propertyName]: [{
        validator: validatorFunction,
        name: validatorName,
      }],
    };

    // Step 1.2 Return
    return;
  }

  // Step 2: Check if the property has any other validator
  if (
    validator[constructorName][propertyName]
        && validator[constructorName][propertyName].length > 0
  ) {
    // Step 2.2: Push to the existing list of validators
    validator[constructorName][propertyName].push({
      validator: validatorFunction,
      name: validatorName,
    });

    // Step 2.3: Return
    return;
  }

  // Step 3: Create a new validator for the property
  validator[constructorName][propertyName] = [{
    validator: validatorFunction,
    name: validatorName,
  }];
}

/**
 * Validates the given object
 * @param obj
 */
export function validate(
  obj : {
      [props: string]: any
    },
) : ValidateFuncResType {
  // Step 1: Get the class name
  const className = obj.constructor.name;

  // Step 2: Check if this class needs to be validated
  if (!validator[className]) {
    return { valid: true, details: [] };
  }

  // Step 3: Default res
  const res: ValidateFuncResType = { valid: true, details: [] };

  // Step 3: Loop throgh all the properties
  Object.keys(obj).forEach((key) => {
    // Step 3.1: Add a default for the key
    const details: {
        prop: string,
        invalid: string[]
      } = {
        prop: key,
        invalid: [],
      };

    res.details.push(details);

    // Step 3.2: Check if there is any validatator for the key
    if (validator[className][key]) {
      // Step 3.3: Loop through all the validators and mark the invalid validators
      validator[className][key].forEach((val) => {
        if (!val.validator(obj[key])) {
          res.valid = false;
          details.invalid.push(val.name);
        }
      });
    }
  });


  // Step 4: Default return
  return res;
}
