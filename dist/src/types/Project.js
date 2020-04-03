var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { MinLength, MaxLength, Required, PositiveNumber, Min, Max, } from '../decorators/Validation.js';
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
export default Project;
//# sourceMappingURL=Project.js.map