describe("when adding employee", function() {
	var viewModel = new ViewModel();
	var cloneCalled = false;
	
	viewModel.currentEmployee.clone = function() {
		cloneCalled = true;
	}
	
	viewModel.add();
	
	it("should create a clone of employee", function() {
		expect(cloneCalled).toBe(false);
	});
});