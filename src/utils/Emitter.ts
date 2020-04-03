/**
 * Emitter which we will use to emit events
 */
export default class Emitter {
    /**
     * Stores all the events
     */
    private events: {
      [event: string]: Function[]
    } = {}

    /**
     * Reacting to an event
     * @param {String} event
     * @param {Function} cb
     */
    on(event: string, cb: Function) {
      // Step 1: Check if event already has already been added
      if (this.events[event]) {
        // Step ii: Insert callback at the end of the array
        this.events[event].push(cb);
      } else {
        // Step i: Create a new array with the callback
        this.events[event] = [cb];
      }

      // Step 3: Return the current added index
      return this.events[event].length - 1;
    }

    /**
     * Call all the callbacks that were given
     * @param event
     */
    emit(event: string, ...args: any[]) {
      // Step 1: Check if event exists
      if (!this.events[event]) {
        return false;
      }


      // Step 2: Get the array and loop throug all the call backs
      this.events[event].forEach((curEvent) => curEvent(...args));

      // Step 3: Return the default
      return true;
    }
}
