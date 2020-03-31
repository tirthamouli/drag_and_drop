"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
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
        MinLength(50),
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
var ProjectInput = (function () {
    function ProjectInput(host, template) {
        this.template = template;
        this.host = host;
        var importedNode = document.importNode(this.template.content, true);
        this.form = importedNode.firstElementChild;
        this.title = this.form.querySelector('#title');
        this.description = this.form.querySelector('#description');
        this.people = this.form.querySelector('#people');
    }
    ProjectInput.prototype.getUserInput = function () {
        var title = this.title.value.trim();
        var description = this.description.value.trim();
        var people = this.people.value.trim();
        var project = new Project(title, description, +people);
        var check = validate(project);
        if (check.valid) {
            return [project.title, project.description, project.people];
        }
        console.log(check.details);
        throw new Error('Invalid Input');
    };
    ProjectInput.prototype.submitForm = function (event) {
        event.preventDefault();
        try {
            var _a = this.getUserInput(), title = _a[0], description = _a[1], people = _a[2];
            console.log(title, description, people);
        }
        catch (error) {
            console.log(error);
        }
    };
    ProjectInput.prototype.addListeners = function () {
        this.form.addEventListener('submit', this.submitForm);
    };
    ProjectInput.prototype.render = function () {
        this.host.insertAdjacentElement('afterbegin', this.form);
    };
    __decorate([
        AutoBind
    ], ProjectInput.prototype, "submitForm", null);
    return ProjectInput;
}());
(function () {
    var projectInput = new ProjectInput(document.getElementById('app'), document.getElementById('project-input'));
    projectInput.render();
    projectInput.addListeners();
    console.log(validator);
})();
//# sourceMappingURL=index.js.map