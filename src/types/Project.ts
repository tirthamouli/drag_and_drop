import {
  MinLength, MaxLength, Required, PositiveNumber, Min, Max,
} from '../decorators/Validation';

/**
 * Stores a project
 */
export default class Project {
    /**
     * Title of a project
     */
    @MinLength(5)
    @MaxLength(100)
    @Required
    title = ''

    /**
     * Description of a project
     */
    @MinLength(10)
    @MaxLength(255)
    @Required
    description = ''

    /**
     * Number of people in the project
     */
    @Max(10)
    @Min(2)
    @PositiveNumber
    @Required
    people = 0

    /**
     * Constructor of a project
     * @param title
     * @param description
     * @param people
     */
    constructor(title: string, description: string, people: number) {
      this.title = title;
      this.description = description;
      this.people = people;
    }
}
