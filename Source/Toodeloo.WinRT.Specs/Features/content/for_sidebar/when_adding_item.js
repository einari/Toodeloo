describe("when adding item", function () {
    var viewModel;
    var addItemSpy = sinon.stub();
    var publishSpy;


    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.Sidebar({
            addItem: addItemSpy
        }).viewModel();

        publishSpy = sinon.spy($, "publish");
        viewModel.title("Hello");
        viewModel.addItem();
    });

    afterEach(function () {
        $.publish.restore();
    });

    it("should call service", function () {
        expect(addItemSpy.calledWith("Hello")).toBe(true);
    });

    it("should publish an item added message", function () {
        expect(publishSpy.calledWith("itemAdded", ["Hello"])).toBe(true);
    });
});