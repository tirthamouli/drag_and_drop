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
import ProjectItem from "./ProjectItem.js";
import AutoBind from "../decorators/AutoBind.js";
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(host, template, transferEmitter, type) {
        var _this = _super.call(this, host, template) || this;
        _this.type = type;
        _this.list = [];
        _this.transferEmitter = transferEmitter;
        _this.ul = _this.element.querySelector('ul');
        _this.element.id = type + "-projects";
        _this.ul.id = type + "-projects-list";
        _this.element.querySelector('h2').textContent = type.toUpperCase() + " PROJECTS";
        return _this;
    }
    Object.defineProperty(ProjectList.prototype, "projects", {
        get: function () {
            return this.list;
        },
        set: function (value) {
            var _this = this;
            var keepTitles = {};
            var keptTitles = {};
            var deleted = 0;
            value.forEach(function (item, index) {
                keepTitles[item.title] = index;
            });
            this.list.forEach(function (item, index) {
                if (!keepTitles[item.title]) {
                    _this.ul.removeChild(_this.ul.children[index - deleted]);
                    deleted += 1;
                    return;
                }
                keptTitles[item.title] = index - deleted;
            });
            value.forEach(function (item, index) {
                if (keptTitles[item.title] === undefined) {
                    var li = new ProjectItem(_this.ul, document.getElementById('single-project'), item);
                    li.render(_this.ul.children[index]);
                }
                else if (keptTitles[item.title] !== index) {
                    _this.ul.insertBefore(_this.ul.children[keptTitles[item.title]], _this.ul.children[index]);
                }
            });
            this.list = value;
        },
        enumerable: true,
        configurable: true
    });
    ProjectList.prototype.dragOverHandler = function (event) {
        if (event.dataTransfer && event.dataTransfer.types[0] === 'text/plain') {
            event.preventDefault();
            this.ul.classList.add('droppable');
        }
    };
    ProjectList.prototype.dropHandler = function (event) {
        try {
            var title_1 = event.dataTransfer.getData('text/plain');
            if (this.projects.find(function (project) { return project.title === title_1; })) {
                return;
            }
            var otherType = 'finished';
            if (this.type === 'finished') {
                otherType = 'active';
            }
            this.transferEmitter.emit(otherType + ".taken", title_1);
        }
        catch (_error) {
            console.log(_error);
            alert('Something went wrong');
        }
    };
    ProjectList.prototype.dragLeaveHandler = function (_event) {
        this.ul.classList.remove('droppable');
    };
    ProjectList.prototype.droppedEventHandler = function (project) {
        this.projects = __spreadArrays([project], this.projects);
    };
    ProjectList.prototype.takenEventHandler = function (projectTitle) {
        var _this = this;
        var otherType = 'finished';
        if (this.type === 'finished') {
            otherType = 'active';
        }
        this.projects = this.projects.filter(function (project) {
            if (project.title === projectTitle) {
                _this.transferEmitter.emit(otherType + ".dropped", project);
                return false;
            }
            return true;
        });
    };
    ProjectList.prototype.addListeners = function () {
        this.element.addEventListener('dragover', this.dragOverHandler);
        this.element.addEventListener('dragleave', this.dragLeaveHandler);
        this.element.addEventListener('drop', this.dropHandler);
        this.transferEmitter.on(this.type + ".dropped", this.droppedEventHandler);
        this.transferEmitter.on(this.type + ".taken", this.takenEventHandler);
    };
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragOverHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dropHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "dragLeaveHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "droppedEventHandler", null);
    __decorate([
        AutoBind
    ], ProjectList.prototype, "takenEventHandler", null);
    return ProjectList;
}(Component));
export default ProjectList;
//# sourceMappingURL=ProjectList.js.map