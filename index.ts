/* eslint-disable max-classes-per-file */

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
 * Adds a new validator to the exisiting validators
 * @param constructorName
 * @param propertyName
 * @param validatorName
 * @param validatorFunction
 */
function addValidator(
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
 * Validates the given object
 * @param obj
 */
function validate(
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

/**
 * Required decorater, property cannot have falsy value
 * @param target
 * @param propertyName
 */
function Required(target: object, propertyName: string) {
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
function PositiveNumber(target: object, propertyName: string) {
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
function MinLength(min: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'min length', (value: string) => value.length >= min);
  };
}

/**
 * Checks weather the max length criterion is met
 * @param min
 */
function MaxLength(max: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'max length', (value: string) => value.length <= max);
  };
}

/**
 * Checks weather the max length criterion is met
 * @param min
 */
function Min(min: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'min', (value: number) => value >= min);
  };
}

/**
 * Checks weather the max length criterion is met
 * @param min
 */
function Max(max: number) {
  return (target: object, propertyName: string) => {
    addValidator(target.constructor.name, propertyName, 'max', (value: number) => value <= max);
  };
}

class Project {
  /**
   * Title of a project
   */
  @MinLength(5)
  @MaxLength(100)
  @Required
  title = ''

  /**
   * Description of a project
   */
  @MinLength(10)
  @MaxLength(255)
  @Required
  description = ''

  /**
   * Number of people in the project
   */
  @Max(10)
  @Min(2)
  @PositiveNumber
  @Required
  people = 0

  /**
   * Constructor of a project
   * @param title
   * @param description
   * @param people
   */
  constructor(title: string, description: string, people: number) {
    this.title = title;
    this.description = description;
    this.people = people;
  }
}


/**
 * Automatically binds any method to the current object with which it is called
 * @param target
 * @param propertyName
 * @param desc
 */
function AutoBind(_: any, _2: string, desc: TypedPropertyDescriptor<any>) {
  // Step 1: Get the original value
  const originalMethod = desc.value;

  // Step 2: Set the adjusted descriptor
  const adjustedDescriptor : TypedPropertyDescriptor<any> = {
    get() {
      return originalMethod.bind(this);
    },
  };

  // Step 3: Return the adjusted descriptor
  return adjustedDescriptor;
}

class ProjectList {
  /**
   * The main template for the section
   */
  private template: HTMLTemplateElement

  /**
   * Position where we are going to render
   */
  private host: HTMLDivElement

  /**
   * The main section where we will display the list
   */
  private section: HTMLElement

  /**
   * The main ul to which we are going to append the list item
   */
  private ul: HTMLUListElement

  /**
   * Constructor
   */
  constructor(host: HTMLDivElement, template: HTMLTemplateElement, private type: 'active' | 'finished') {
    // Step 1: Default
    this.template = template;
    this.host = host;

    // Step 2: Derrived
    const importedNode = document.importNode(this.template.content, true);
    this.section = importedNode.firstElementChild as HTMLElement;
    this.ul = this.section.querySelector('ul') as HTMLUListElement;

    // Step 3: Adding content
    this.section.id = `${type}-projects`;
    this.ul.id = `${type}-projects-list`;
    (this.section.querySelector('h2') as HTMLHeadingElement).textContent = `${type.toUpperCase()} PROJECTS`;
  }

  /**
   * Renders the elements in the page
   */
  render() {
    this.host.insertAdjacentElement('beforeend', this.section);
  }
}

/**
 * Project input class
 */
class ProjectInput {
  /**
   * The main template for the form
   */
  private template: HTMLTemplateElement

  /**
   * Position where we are going to render
   */
  private host: HTMLDivElement

  /**
   * The main form
   */
  private form: HTMLFormElement

  /**
   * The title input
   */
  private title: HTMLInputElement

  /**
   * The description text area
   */
  private description: HTMLTextAreaElement

  /**
   * The number of people in the project
   */
  private people: HTMLInputElement

  /**
   * Constructor
   * @param host
   * @param template
   */
  constructor(host: HTMLDivElement, template: HTMLTemplateElement) {
    // Step 1: Defaults
    this.template = template;
    this.host = host;

    // Step 2: Derrived
    const importedNode = document.importNode(this.template.content, true);
    this.form = importedNode.firstElementChild as HTMLFormElement;
    this.title = this.form.querySelector('#title') as HTMLInputElement;
    this.description = this.form.querySelector('#description') as HTMLTextAreaElement;
    this.people = this.form.querySelector('#people') as HTMLInputElement;
  }

  /**
   * Validate user inputs
   */
  private getUserInput():[string, string, number] {
    // Step 1: Get all the values
    const title = this.title.value.trim();
    const description = this.description.value.trim();
    const people = this.people.value.trim();

    // Step 2: Create a new project
    const project = new Project(title, description, +people);

    // Step 3: Validate the inputs
    const check = validate(project);

    // Step 4: Check if valid
    if (check.valid) {
      return [project.title, project.description, project.people];
    }

    console.log(check.details);
    throw new Error('Invalid Input');
  }

  /**
   * Submit handler
   */
  @AutoBind
  private submitForm(event: Event) {
    // Step 1: Prevent defaults
    event.preventDefault();

    try {
      const [title, description, people] = this.getUserInput();
      console.log(title, description, people);
    } catch (error) {
      console.log(error);
    }
  }

  /**
   * Adds all the event listeners
   */
  addListeners() {
    this.form.addEventListener('submit', this.submitForm);
  }

  /**
   * Renders the elements in the page
   */
  render() {
    this.host.insertAdjacentElement('afterbegin', this.form);
  }
}


// Initializing
(() => {
  // Step 1: Get the root
  const root = document.getElementById('app') as HTMLDivElement;

  // Step 1: DOM initializers
  const projectInput = new ProjectInput(
    root,
    document.getElementById('project-input') as HTMLTemplateElement,
  );
  const activeProjects = new ProjectList(
    root,
    document.getElementById('project-list') as HTMLTemplateElement,
    'active',
  );
  const finishedProjects = new ProjectList(
    root,
    document.getElementById('project-list') as HTMLTemplateElement,
    'finished',
  );


  // Step 2: Instantiate it and add the event listeners
  projectInput.render();
  projectInput.addListeners();

  activeProjects.render();
  finishedProjects.render();
})();
