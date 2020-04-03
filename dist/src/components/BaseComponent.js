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
export default Component;
//# sourceMappingURL=BaseComponent.js.map