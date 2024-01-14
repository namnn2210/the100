function DataBinder(settings) {
    _this = this;
    this.dataBindings = [];
    this.value = settings.model[settings.property];
    this.propertyGet = function () {
        return _this.value;
    };


    this.propertySet = function (value) {
        _this.value = value;
        for (var i = 0; i < _this.dataBindings.length; i++) {
            var binding = _this.dataBindings[i];
            binding.element[binding.attribute] = value;
        }
    };

    Object.defineProperty(settings.model, settings.property, {
        get: this.propertyGet,
        set: this.propertySet
    });
    this.addDataBinding = function (element, property, event) {

        var domElement = document.getElementById(element);

        var binding = {
            element: domElement,
            property: property
        };

        if (event) {
            domElement.addEventListener(event, function () {
                _this.propertySet(domElement[property]);
            });
            binding.event = event;
        }
        this.dataBindings.push(binding);
        domElement[property] = _this.value;
        return _this;
    };
    settings.model[settings.property] = this.value;
}