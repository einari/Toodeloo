
	function Employee(firstName, lastName) {
		var self = this;
		
		this.firstName = ko.observable(firstName);
		this.lastName = ko.observable(lastName);
		
		this.fullName = ko.computed(function() {
			return this.firstName() + " " + this.lastName();
		},this);
		
		this.clone = function() {
			return new Employee(self.firstName(), self.lastName());
		}
	}
	
	
	function ViewModel() {
		var self = this;
		
		this.employees = ko.observableArray();
		this.currentEmployee = new Employee("","");
		
		this.add = function() {
			self.employees.push(self.currentEmployee.clone());
		}
	}
	
	$(function() {
		ko.applyBindings(new ViewModel());
	})
