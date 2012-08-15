Bifrost.namespace("Toodeloo.Features.content", {
    List: function (service) {
        return {
            viewModel: function () {
                var self = this;

                this.items = service.getAll();

                this.items.subscribe(function () {
                    $.publish("itemCount", [self.items().length]);
                });


                $.subscribe("itemAdded", function (title) {
                    self.items.push({ title: title });
                });

                this.deleteItem = function (item) {
                    service.deleteItem(item.id);
                    self.items.remove(item);
                }

                return this;
            }
        }
    }
});

require(["toDoService"], function (service) {
    Bifrost.features.featureManager.get("content/list").defineViewModel(Toodeloo.Features.content.List(service).viewModel);
});


