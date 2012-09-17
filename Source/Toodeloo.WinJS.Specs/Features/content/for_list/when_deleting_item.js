describe("when deleting item", function () {
    var viewModel;
    var deleteItemSpy = sinon.stub();

    
    beforeEach(function () {
        viewModel = new Toodeloo.Features.content.List({
            getAll: function () { return ko.observableArray(); },
            deleteItem: deleteItemSpy
        }).viewModel();

        viewModel.deleteItem({id:5});
    });

    it("should call service", function () {
        expect(deleteItemSpy.calledWith(5)).toBe(true);
    });
});