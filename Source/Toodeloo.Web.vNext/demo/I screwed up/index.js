function Employee(firstName, lastName) {
	var self = this;
	
	this.firstName = ko.observable(firstName);
	this.lastName = ko.observable(lastName);

	this.fullName = ko.computed(function() {
		return this.firstName() + " " + this.lastName();
	}, this);
	
	this.clone = function() { 
		var clone = new Employee(self.firstName(), self.lastName());
		return clone;
	}
	
}

function ViewModel() {
	var self = this;
	
	this.employees = ko.observableArray();
	this.currentEmployee = new Employee("","");
	
	this.add = function() {
		var clone = self.currentEmployee.clone();
		self.employees.push(clone);
	}
}

$(function() {
	var viewModel = new ViewModel()
	ko.applyBindings(viewModel);
});