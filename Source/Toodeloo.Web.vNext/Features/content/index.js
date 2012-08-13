(function () {
    function itemCountSet(count) { this.count = count; }
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
		this.isBusy = ko.observable(true);

		$.ajax({
		    url: "/ToDoItem/GetAll",
		    type: "GET",
		    dataType: "json",
		    complete: function (e) {
		        var result = ko.mapping.fromJSON(e.responseText, {
		            create: function (options) {
		                var item = new Item(options.data.title);
		                item.id = options.data.id;
		                return item;
		            }
		        });
		        self.items(ko.toJS(result));
		        Bifrost.messaging.messenger.publish(new itemCountSet(self.items().length));
		        self.isBusy(false);
		    }
		});
		
		this.addItem = function () {
		    var itemObj = { title: self.itemToCreate.title() };
		    $.ajax({
		        url: "/ToDoItem/Add",
		        type: "POST",
		        dataType: "json",
		        data: JSON.stringify(itemObj),
                contentType: "application/json; charset=utf-8"
    		});


			var item = self.itemToCreate.clone();
			self.items.push(item);
			self.itemToCreate.title("");
			
			Bifrost.messaging.messenger.publish(new itemAdded());
		}
		
		this.deleteItem = function (item) {
		    var itemObj = { id: item.id };
		    $.ajax({
		        url: "/ToDoItem/Remove",
		        type: "POST",
		        dataType: "json",
		        data: JSON.stringify(itemObj),
		        contentType: "application/json; charset=utf-8"
		    });

			self.items.remove(item);
			Bifrost.messaging.messenger.publish(new itemDeleted());
		}
	});
})();