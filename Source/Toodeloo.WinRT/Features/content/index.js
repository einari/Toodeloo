Bifrost.namespace("Toodeloo.Features.content", {
    Index: function () {
        return {
            viewModel: function () {
                var self = this;

                this.count = ko.observable(0);

                $.subscribe("itemCount", function (count) {
                    self.count(count);
                });

                return this;
            }
        }
    }
});

require([], function () {
    Bifrost.features.featureManager.get("content/index").defineViewModel(Toodeloo.Features.content.Index().viewModel);
});


