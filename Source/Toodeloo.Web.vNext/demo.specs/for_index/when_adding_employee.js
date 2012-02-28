describe("when adding employee", function() {
	var viewModel = new ViewModel();
	var cloneCalled = false;
	
	viewModel.currentEmployee.clone = function() {
		cloneCalled = true;
	}
	viewModel.add();
	
	it("should add clone current employee", function() {
		expect(cloneCalled).toBe(true);
	});
	
	it("should add an element to employees", function() {
		expect(viewModel.employees().length).toBe(1);
	});
});