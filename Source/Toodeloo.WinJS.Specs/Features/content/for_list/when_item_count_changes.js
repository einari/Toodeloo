describe("when item count changes", function () {
    var viewModel;
    var publishSpy;

    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.List({
            getAll: function () { return ko.observableArray(); }
        }).viewModel();

        publishSpy = sinon.spy($, "publish");

        viewModel.items.push({ title: "hello" });
    });

    afterEach(function() {
        $.publish.restore();
    });

    it("should publish an item count message", function () {
        expect(publishSpy.calledWith("itemCount", [1])).toBe(true);
    });
});