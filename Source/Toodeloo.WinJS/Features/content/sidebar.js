Bifrost.namespace("Toodeloo.Features.content", {
    Sidebar: function (service) {
        return {
            viewModel: function () {
                var self = this;

                this.title = ko.observable("").extend({
                    validation: {
                        required: {
                            message: "Title is required"
                        },
                        minLength: {
                            length: 5,
                            message: "Must be 5 or more characters"
                        }
                    }
                });

                this.addItem = function () {
                    service.addItem(self.title());
                    $.publish("itemAdded", [self.title()]);
                    self.title("");
                }

                if (this.title.validator) {
                    this.title.validator.validate("");
                }

                return this;
            }
        }
    }
});

require(["toDoService"], function (service) {
    Bifrost.features.featureManager.get("content/sidebar").defineViewModel(Toodeloo.Features.content.Sidebar(service).viewModel);
});