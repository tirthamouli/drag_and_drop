import Component from './BaseComponent';
import AutoBind from '../decorators/AutoBind';
import { Draggable } from '../types/DragAndDrop';
import Project from '../types/Project';

/**
 * A list item in the project
 */
export default class ProjectItem extends Component<HTMLUListElement, HTMLLIElement>
  implements Draggable {
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
