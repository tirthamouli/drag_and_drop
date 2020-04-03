import Emitter from "./src/utils/Emitter.js";
import ProjectList from "./src/components/ProjectList.js";
import ProjectInput from "./src/components/ProjectInput.js";
var root = document.getElementById('app');
var transferEmitter = new Emitter();
var activeProjects = new ProjectList(root, document.getElementById('project-list'), transferEmitter, 'active');
var projectInput = new ProjectInput(root, document.getElementById('project-input'), activeProjects);
var finishedProjects = new ProjectList(root, document.getElementById('project-list'), transferEmitter, 'finished');
projectInput.addListeners();
activeProjects.addListeners();
finishedProjects.addListeners();
projectInput.render();
activeProjects.render();
finishedProjects.render();
//# sourceMappingURL=index.js.map