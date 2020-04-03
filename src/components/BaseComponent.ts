/**
 * The base component which will be extended by every component
 */
export default abstract class Component<T extends HTMLElement, U extends HTMLElement> {
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
