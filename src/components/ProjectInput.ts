/* eslint-disable import/extensions */
import Component from './BaseComponent';
import ProjectList from './ProjectList';
import AutoBind from '../decorators/AutoBind';
import Project from '../types/Project';
import { validate } from '../utils/Validator';

/**
 * Project input class
 */
export default class ProjectInput extends Component<HTMLDivElement, HTMLFormElement> {
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
