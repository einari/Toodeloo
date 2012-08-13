(function() {
    Bifrost.features.featureManager.get("layout/header").defineViewModel(function () {
		var self = this;
		
		this.itemCount = ko.observable(0);
		
		Bifrost.messaging.messenger.subscribeTo("itemAdded", function() {
			self.itemCount(self.itemCount()+1);
		});
		Bifrost.messaging.messenger.subscribeTo("itemDeleted", function() {
			self.itemCount(self.itemCount()-1);
		});
		Bifrost.messaging.messenger.subscribeTo("itemCountSet", function (e) {
		    self.itemCount(e.count);
		});
	});
})();