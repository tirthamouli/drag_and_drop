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
import Component from './BaseComponent.js';
import AutoBind from '../decorators/AutoBind.js';
var ProjectItem = (function (_super) {
    __extends(ProjectItem, _super);
    function ProjectItem(host, template, project) {
        var _this = _super.call(this, host, template) || this;
        _this.project = project;
        (_this.element.querySelector('h2')).textContent = _this.project.title;
        (_this.element.querySelector('h3')).textContent = _this.person;
        (_this.element.querySelector('p')).textContent = _this.project.description;
        _this.addListeners();
        return _this;
    }
    Object.defineProperty(ProjectItem.prototype, "person", {
        get: function () {
            if (this.project.people === 1) {
                return '1 person assigned';
            }
            return this.project.people + " people assigned";
        },
        enumerable: true,
        configurable: true
    });
    ProjectItem.prototype.dragStartHandler = function (event) {
        event.dataTransfer.setData('text/plain', this.project.title);
        event.dataTransfer.effectAllowed = 'move';
    };
    ProjectItem.prototype.addListeners = function () {
        this.element.addEventListener('dragstart', this.dragStartHandler);
    };
    __decorate([
        AutoBind
    ], ProjectItem.prototype, "dragStartHandler", null);
    return ProjectItem;
}(Component));
export default ProjectItem;
//# sourceMappingURL=ProjectItem.js.map