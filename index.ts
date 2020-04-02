/* eslint-disable max-classes-per-file */
class Emitter {
  /**
   * Stores all the events
   */
  private events: {
    [event: string]: Function[]
  } = {}

  /**
   * Reacting to an event
   * @param {String} event
   * @param {Function} cb
   */
  on(event: string, cb: Function) {
    // Step 1: Check if event already has already been added
    if (this.events[event]) {
      // Step ii: Insert callback at the end of the array
      this.events[event].push(cb);
    } else {
      // Step i: Create a new array with the callback
      this.events[event] = [cb];
    }

    // Step 3: Return the current added index
    return this.events[event].length - 1;
  }

  /**
   * Call all the callbacks that were given
   * @param event
   */
  emit(event: string, ...args: any[]) {
    // Step 1: Check if event exists
    if (!this.events[event]) {
      return false;
    }


    // Step 2: Get the array and loop throug all the call backs
    this.events[event].forEach((curEvent) => curEvent(...args));

    // Step 3: Return the default
    return true;
  }
}

/**
 * Drag and drop interfaces
 */
interface Draggable {
  dragStartHandler(event: DragEvent): void
}

interface DragTarget {
  dragOverHandler(event: DragEvent): void
  dropHandler(event: DragEvent): void
  dragLeaveHandler(event: DragEvent): void
}

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

/**
 * Stores a project
 */
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

abstract class Component<T extends HTMLElement, U extends HTMLElement> {
  /**
   * The main template for the section
   */
  protected template: HTMLTemplateElement

  /**
   * Position where we are going to render
   */
  protected host: T

  /**
   * The element which we are going to add
   */
  protected element: U

  /**
   * Constructor for the base class
   */
  protected constructor(host: T, template: HTMLTemplateElement) {
    // Step 1: Default
    this.template = template;
    this.host = host;

    // Step 2: Derrived
    const importedNode = document.importNode(this.template.content, true);
    this.element = importedNode.firstElementChild as U;
  }

  /**
   * Renders the elements in the page
   */
  render(before?: U) {
    if (before) {
      this.host.insertBefore(this.element, before);
    } else {
      this.host.insertAdjacentElement('beforeend', this.element);
    }
  }
}

/**
 * A list item in the project
 */
class ProjectItem extends Component<HTMLUListElement, HTMLLIElement> implements Draggable {
  /**
   * The details of the project that it is going to display
   */
  private project: Project

  get person() {
    if (this.project.people === 1) {
      return '1 person assigned';
    }
    return `${this.project.people} people assigned`;
  }

  /**
   * Sets up the values
   * @param host
   * @param template
   * @param project
   */
  constructor(host: HTMLUListElement, template: HTMLTemplateElement, project: Project) {
    // Step 1: Default
    super(host, template);
    this.project = project;

    // Step 2: Setting the values
    (this.element.querySelector('h2')!).textContent = this.project.title;
    (this.element.querySelector('h3')!).textContent = this.person;
    (this.element.querySelector('p')!).textContent = this.project.description;

    // Step 3: Add event listeners
    this.addListeners();
  }

  /**
   * Start drag
   * @param event
   */
  @AutoBind
  dragStartHandler(event: DragEvent) {
    // Step 1: Set the title
    event.dataTransfer!.setData('text/plain', this.project.title);

    // eslint-disable-next-line no-param-reassign
    event.dataTransfer!.effectAllowed = 'move';
  }


  /**
   * Add event listeners
   */
  private addListeners() {
    this.element.addEventListener('dragstart', this.dragStartHandler);
    // this.element.addEventListener('dragend', this.dragEndHandler);
  }
}

/**
 * The list of the projects
 */
class ProjectList extends Component<HTMLDivElement, HTMLUListElement> implements DragTarget {
  /**
   * The main ul to which we are going to append the list item
   */
  private ul: HTMLUListElement

  /**
   * List of the projects
   */
  private list: Project[] = []

  /**
   * The emitter used for transfer
   */
  private transferEmitter: Emitter

  /**
   * Get the project list
   */
  get projects() {
    return this.list;
  }

  /**
   * Set the project list and change dom accordingly
   */
  set projects(value: Project[]) {
    // Step 1: Remove elements which are not needed
    const keepTitles: {[property: string]: number} = {};
    const keptTitles: {[property: string]: number} = {};
    let deleted = 0;

    value.forEach((item, index) => {
      keepTitles[item.title] = index;
    });
    this.list.forEach((item, index) => {
      if (!keepTitles[item.title]) {
        this.ul.removeChild(this.ul.children[index - deleted]);
        deleted += 1;
        return;
      }
      keptTitles[item.title] = index - deleted;
    });

    // Step 2: Add or move items at the correct index
    value.forEach((item, index) => {
      if (keptTitles[item.title] === undefined) {
        // Add the item
        const li = new ProjectItem(
          this.ul,
          document.getElementById('single-project') as HTMLTemplateElement,
          item,
        );
        li.render(this.ul.children[index] as HTMLLIElement);
      } else if (keptTitles[item.title] !== index) {
        // Move the item here
        this.ul.insertBefore(this.ul.children[keptTitles[item.title]], this.ul.children[index]);
      }
    });

    // Step 3: Update the list
    this.list = value;
  }

  /**
   * Constructor
   */
  constructor(host: HTMLDivElement, template: HTMLTemplateElement, transferEmitter: Emitter, private type: 'active' | 'finished') {
    // Step 1: Default
    super(host, template);
    this.transferEmitter = transferEmitter;

    // Step 2: Derrived
    this.ul = this.element.querySelector('ul') as HTMLUListElement;

    // Step 3: Adding content
    this.element.id = `${type}-projects`;
    this.ul.id = `${type}-projects-list`;
    (this.element.querySelector('h2') as HTMLHeadingElement).textContent = `${type.toUpperCase()} PROJECTS`;
  }

  /**
   * What happens when dragged over
   * @param event
   */
  @AutoBind
  dragOverHandler(event: DragEvent) {
    if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
      event.preventDefault();
      this.ul.classList.add('droppable');
    }
  }

  /**
   * What happens when dropped
   * @param event
   */
  @AutoBind
  dropHandler(event: DragEvent) {
    try {
      // Step 1: Get the data title
      const title = event.dataTransfer!.getData('text/plain') as string;

      // Step 2: Check if title is already present
      if (this.projects.find((project) => project.title === title)) {
        // No need to move
        return;
      }

      // Step 3: Get the other type
      let otherType = 'finished';
      if (this.type === 'finished') {
        otherType = 'active';
      }

      // Step 4: Take project from other type
      this.transferEmitter.emit(`${otherType}.taken`, title);
    } catch (_error) {
      // eslint-disable-next-line no-alert
      console.log(_error);
      alert('Something went wrong');
    }
  }

  /**
   * What happens when drag left
   * @param event
   */
  @AutoBind
  dragLeaveHandler(_event: DragEvent) {
    this.ul.classList.remove('droppable');
  }

  /**
   * When something is dropped
   * @param project
   */
  @AutoBind
  droppedEventHandler(project: Project) {
    this.projects = [project, ...this.projects];
  }

  /**
   * Remove the project from project list
   * @param projectTitle
   */
  @AutoBind
  takenEventHandler(projectTitle: string) {
    // Step 1: Get the other type
    let otherType = 'finished';
    if (this.type === 'finished') {
      otherType = 'active';
    }

    // Step 1: Remove the project
    this.projects = this.projects.filter((project) => {
      if (project.title === projectTitle) {
        this.transferEmitter.emit(`${otherType}.dropped`, project);
        return false;
      }
      return true;
    });
  }

  /**
   * Adding listener
   */
  addListeners() {
    this.element.addEventListener('dragover', this.dragOverHandler);
    this.element.addEventListener('dragleave', this.dragLeaveHandler);
    this.element.addEventListener('drop', this.dropHandler);
    this.transferEmitter.on(`${this.type}.dropped`, this.droppedEventHandler);
    this.transferEmitter.on(`${this.type}.taken`, this.takenEventHandler);
  }
}

/**
 * Project input class
 */
class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
   * The active projects list
   */
  private projectList: ProjectList

  /**
   * Constructor
   * @param host
   * @param template
   */
  constructor(
    host: HTMLDivElement,
    template: HTMLTemplateElement,
    projectList: ProjectList,
  ) {
    // Step 1: Defaults
    super(host, template);

    // Step 2: Derrived
    this.title = this.element.querySelector('#title') as HTMLInputElement;
    this.description = this.element.querySelector('#description') as HTMLTextAreaElement;
    this.people = this.element.querySelector('#people') as HTMLInputElement;
    this.projectList = projectList;
  }

  /**
   * Validate user inputs
   */
  private getUserInput() {
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
      return project;
    }

    throw new Error('Invalid Input');
  }

  /**
   * Clears the input
   */
  private clearInputs() {
    this.title.value = '';
    this.description.value = '';
    this.people.value = '';
  }

  /**
   * Submit handler
   */
  @AutoBind
  private submitForm(event: Event) {
    // Step 1: Prevent defaults
    event.preventDefault();

    try {
      // Step 1: Add new project
      const project = this.getUserInput();
      this.projectList.projects = [project, ...this.projectList.projects];

      // Step 2: Remove the values
      this.clearInputs();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log(error);
    }
  }

  /**
   * Adds all the event listeners
   */
  addListeners() {
    this.element.addEventListener('submit', this.submitForm);
  }
}


// Initializing
(() => {
  // Step 1: Get the root
  const root = document.getElementById('app') as HTMLDivElement;

  // Step 2: Event emitter for transfer
  const transferEmitter = new Emitter();

  // Step 2: DOM initializers
  const activeProjects = new ProjectList(
    root,
    document.getElementById('project-list') as HTMLTemplateElement,
    transferEmitter,
    'active',
  );
  const projectInput = new ProjectInput(
    root,
    document.getElementById('project-input') as HTMLTemplateElement,
    activeProjects,
  );
  const finishedProjects = new ProjectList(
    root,
    document.getElementById('project-list') as HTMLTemplateElement,
    transferEmitter,
    'finished',
  );


  // Step 2: Add event listeners
  projectInput.addListeners();
  activeProjects.addListeners();
  finishedProjects.addListeners();


  // Step 2: Instantiate it and add the event listeners
  projectInput.render();

  activeProjects.render();
  finishedProjects.render();
})();
