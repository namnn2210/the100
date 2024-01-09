var Product = function () {
    this.initObject();
};

Product.prototype.initObject = function () {
    var self = this;
    self.action = function () {

        function submitCate() {
            console.log(1111)
        }


        return {
            submitCate: function () {
                submitCate();
            },
        }
    }();
};

