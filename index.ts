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
   * Constructor
   * @param host
   * @param template
   */
  constructor(host: HTMLDivElement, template: HTMLTemplateElement) {
    this.template = template;
    this.host = host;
  }

  /**
   * Renders the elements in the page
   */
  render() {
    // Step 1: Get the imported node
    const importedNode = document.importNode(this.template.content, true);

    // Step 2: Get the html
    const element = importedNode.firstElementChild as HTMLFontElement;

    // Step 3: Insert the node
    this.host.insertAdjacentElement('afterbegin', element);
  }
}


// Initializing
(() => {
  // Step 1: Create a new project instance
  const projectInput = new ProjectInput(
    document.getElementById('app') as HTMLDivElement,
    document.getElementById('project-input') as HTMLTemplateElement,
  );

  // Step 2: Instanciate it
  projectInput.render();
})();
