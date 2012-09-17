describe("when item count is published", function () {
    var viewModel;

    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.Index({
            getAll: function () { return ko.observableArray(); }
        }).viewModel();

        $.publish("itemCount", [5]);
    });

    it("should add an item to items", function () {
        expect(viewModel.count()).toBe(5);
    });
});