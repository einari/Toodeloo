(function() {
	function itemAdded() {}
	function itemDeleted() {}
	
    Bifrost.features.featureManager.get("content/index").defineViewModel(function () {
		function Item(title) {
			var self = this;
			this.title = ko.observable(title).extend({
				validation: {
					required: {
						message:"Title is required"
					},
					minLength: {
						length: 5,
						message:"Must 5 or more"
					}
				}
			});
			this.title.validator.validate(title);
			
			this.clone = function() {
				return new Item(self.title());
			}
		}
	
		var self = this;
		this.itemToCreate = new Item("");
				
		this.items = ko.observableArray();
		
		this.addItem = function() {			
			var item = self.itemToCreate.clone();
			self.items.push(item);
			self.itemToCreate.title("");
			
			Bifrost.messaging.messenger.publish(new itemAdded());
		}
		
		this.deleteItem = function(item) {
			self.items.remove(item);
			Bifrost.messaging.messenger.publish(new itemDeleted());
		}
	});
})();