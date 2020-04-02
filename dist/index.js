"use strict";
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
var Emitter = (function () {
    function Emitter() {
        this.events = {};
    }
    Emitter.prototype.on = function (event, cb) {
        if (this.events[event]) {
            this.events[event].push(cb);
        }
        else {
            this.events[event] = [cb];
        }
        return this.events[event].length - 1;
    };
    Emitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        if (!this.events[event]) {
            return false;
        }
        this.events[event].forEach(function (curEvent) { return curEvent.apply(void 0, args); });
        return true;
    };
    return Emitter;
}());
var validator = {};
function addValidator(constructorName, propertyName, validatorName, validatorFunction) {
    var _a;
    if (!(constructorName in validator)) {
        validator[constructorName] = (_a = {},
            _a[propertyName] = [{
                    validator: validatorFunction,
                    name: validatorName,
                }],
            _a);
        return;
    }
    if (validator[constructorName][propertyName]
        && validator[constructorName][propertyName].length > 0) {
        validator[constructorName][propertyName].push({
            validator: validatorFunction,
            name: validatorName,
        });
        return;
    }
    validator[constructorName][propertyName] = [{
            validator: validatorFunction,
            name: validatorName,
        }];
}
function validate(obj) {
    var className = obj.constructor.name;
    if (!validator[className]) {
        return { valid: true, details: [] };
    }
    var res = { valid: true, details: [] };
    Object.keys(obj).forEach(function (key) {
        var details = {
            prop: key,
            invalid: [],
        };
        res.details.push(details);
        if (validator[className][key]) {
            validator[className][key].forEach(function (val) {
                if (!val.validator(obj[key])) {
                    res.valid = false;
                    details.invalid.push(val.name);
                }
            });
        }
    });
    return res;
}
function Required(target, propertyName) {
    addValidator(target.constructor.name, propertyName, 'required', function (value) {
        if (value) {
            return true;
        }
        return false;
    });
}
function PositiveNumber(target, propertyName) {
    addValidator(target.constructor.name, propertyName, 'positive number', function (value) {
        if (typeof value === 'number' && value > 0) {
            return true;
        }
        return false;
    });
}
function MinLength(min) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'min length', function (value) { return value.length >= min; });
    };
}
function MaxLength(max) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'max length', function (value) { return value.length <= max; });
    };
}
function Min(min) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'min', function (value) { return value >= min; });
    };
}
function Max(max) {
    return function (target, propertyName) {
        addValidator(target.constructor.name, propertyName, 'max', function (value) { return value <= max; });
    };
}
var Project = (function () {
    function Project(title, description, people) {
        this.title = '';
        this.description = '';
        this.people = 0;
        this.title = title;
        this.description = description;
        this.people = people;
    }
    __decorate([
        MinLength(5),
        MaxLength(100),
        Required
    ], Project.prototype, "title", void 0);
    __decorate([
        MinLength(10),
        MaxLength(255),
        Required
    ], Project.prototype, "description", void 0);
    __decorate([
        Max(10),
        Min(2),
        PositiveNumber,
        Required
    ], Project.prototype, "people", void 0);
    return Project;
}());
function AutoBind(_, _2, desc) {
    var originalMethod = desc.value;
    var adjustedDescriptor = {
        get: function () {
            return originalMethod.bind(this);
        },
    };
    return adjustedDescriptor;
}
var Component = (function () {
    function Component(host, template) {
        this.template = template;
        this.host = host;
        var importedNode = document.importNode(this.template.content, true);
        this.element = importedNode.firstElementChild;
    }
    Component.prototype.render = function (before) {
        if (before) {
            this.host.insertBefore(this.element, before);
        }
        else {
            this.host.insertAdjacentElement('beforeend', this.element);
        }
    };
    return Component;
}());
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
(function () {
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
})();
//# sourceMappingURL=index.js.map