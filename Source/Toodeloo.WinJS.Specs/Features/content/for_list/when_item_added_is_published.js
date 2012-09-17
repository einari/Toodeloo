describe("when item added is published", function () {
    var viewModel;

    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.List({
            getAll: function () { return ko.observableArray(); }
        }).viewModel();

        $.publish("itemAdded", ["something"]);
    });

    it("should add an item to items", function () {
        expect(viewModel.items()[0].title).toBe("something");
    });
});