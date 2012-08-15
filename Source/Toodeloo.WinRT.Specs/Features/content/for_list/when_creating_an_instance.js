describe("when creating an instance", function () {
    var viewModel;
    var getAllSpy = sinon.stub().returns(ko.observableArray());

    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.List({
            getAll: getAllSpy
        }).viewModel();
    });

    it("should get all from the todo service", function () {
        expect(getAllSpy.called).toBe(true);
    });
});