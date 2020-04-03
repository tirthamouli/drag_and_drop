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
export default Emitter;
//# sourceMappingURL=Emitter.js.map