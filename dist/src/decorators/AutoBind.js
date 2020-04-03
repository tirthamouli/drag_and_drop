export default function AutoBind(_, _2, desc) {
    var originalMethod = desc.value;
    var adjustedDescriptor = {
        get: function () {
            return originalMethod.bind(this);
        },
    };
    return adjustedDescriptor;
}
//# sourceMappingURL=AutoBind.js.map