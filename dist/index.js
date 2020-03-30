"use strict";
var ProjectInput = (function () {
    function ProjectInput(host, template) {
        this.template = template;
        this.host = host;
    }
    ProjectInput.prototype.render = function () {
        var importedNode = document.importNode(this.template.content, true);
        var element = importedNode.firstElementChild;
        this.host.insertAdjacentElement('afterbegin', element);
    };
    return ProjectInput;
}());
(function () {
    var projectInput = new ProjectInput(document.getElementById('app'), document.getElementById('project-input'));
    projectInput.render();
})();
//# sourceMappingURL=index.js.map