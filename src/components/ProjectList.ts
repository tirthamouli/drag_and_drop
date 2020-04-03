import Component from './BaseComponent.js';
import Emitter from '../utils/Emitter.js';
import ProjectItem from './ProjectItem.js';
import Project from '../types/Project.js';
import AutoBind from '../decorators/AutoBind.js';
import { DragTarget } from '../types/DragAndDrop.js';


/**
 * The list of the projects
 */
export default class ProjectList extends
  Component<HTMLDivElement, HTMLUListElement> implements DragTarget {
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
