var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
import Component from "./BaseComponent.js";
import AutoBind from "../decorators/AutoBind.js";
import Project from "../types/Project.js";
import { validate } from "../utils/Validator.js";
var ProjectInput = (function (_super) {
    __extends(ProjectInput, _super);
    function ProjectInput(host, template, projectList) {
        var _this = _super.call(this, host, template) || this;
        _this.title = _this.element.querySelector('#title');
        _this.description = _this.element.querySelector('#description');
        _this.people = _this.element.querySelector('#people');
        _this.projectList = projectList;
        return _this;
    }
    ProjectInput.prototype.getUserInput = function () {
        var title = this.title.value.trim();
        var description = this.description.value.trim();
        var people = this.people.value.trim();
        var project = new Project(title, description, +people);
        var check = validate(project);
        if (check.valid) {
            return project;
        }
        throw new Error('Invalid Input');
    };
    ProjectInput.prototype.clearInputs = function () {
        this.title.value = '';
        this.description.value = '';
        this.people.value = '';
    };
    ProjectInput.prototype.submitForm = function (event) {
        event.preventDefault();
        try {
            var project = this.getUserInput();
            this.projectList.projects = __spreadArrays([project], this.projectList.projects);
            this.clearInputs();
        }
        catch (error) {
            console.log(error);
        }
    };
    ProjectInput.prototype.addListeners = function () {
        this.element.addEventListener('submit', this.submitForm);
    };
    __decorate([
        AutoBind
    ], ProjectInput.prototype, "submitForm", null);
    return ProjectInput;
}(Component));
export default ProjectInput;
//# sourceMappingURL=ProjectInput.js.map