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
    Component.prototype.render = function () {
        this.host.insertAdjacentElement('beforeend', this.element);
    };
    return Component;
}());
var ProjectList = (function (_super) {
    __extends(ProjectList, _super);
    function ProjectList(host, template, type) {
        var _this = _super.call(this, host, template) || this;
        _this.type = type;
        _this.list = [];
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
            var liList = this.ul.children;
            var keepTitles = {};
            var keptTitles = {};
            var deleted = 0;
            value.forEach(function (item, index) {
                keepTitles[item.title] = index;
            });
            this.list.forEach(function (item, index) {
                if (!keepTitles[item.title]) {
                    _this.ul.removeChild(liList[index]);
                    deleted += 1;
                    return;
                }
                keptTitles[item.title] = index - deleted;
            });
            value.forEach(function (item, index) {
                if (keptTitles[item.title] === undefined) {
                    var li = document.createElement('li');
                    li.textContent = item.title;
                    _this.ul.insertBefore(li, _this.ul.children[index]);
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
    var activeProjects = new ProjectList(root, document.getElementById('project-list'), 'active');
    var projectInput = new ProjectInput(root, document.getElementById('project-input'), activeProjects);
    var finishedProjects = new ProjectList(root, document.getElementById('project-list'), 'finished');
    projectInput.render();
    projectInput.addListeners();
    activeProjects.render();
    finishedProjects.render();
})();
//# sourceMappingURL=index.js.map