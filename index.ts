import Emitter from './src/utils/Emitter.js';
import ProjectList from './src/components/ProjectList.js';
import ProjectInput from './src/components/ProjectInput.js';


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
