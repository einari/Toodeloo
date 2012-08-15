require.config({
	appDir: "/",
	baseUrl: "/js",
	optimize: "none",

	paths: {
	    "jquery": "jquery-1.7.1.min",
	    "knockout": "knockout-2.0.0",
		"knockout.mapping": "knockout.mapping-2.0.0",
	    "bifrost": "Bifrost.debug",
	    "order": "order",
	    "domReady": "domReady",
	    "text": "text",
        "toDoService": "services/realToDoService"
	}
});

require(["jquery", "knockout"],	function() {
		require(["knockout.mapping", "bifrost", "knockout.plugins", "pubsub"], function () {
		        Bifrost.features.featureMapper.add("{feature}/{subFeature}", "/Features/{feature}/{subFeature}", false);
		        Bifrost.features.featureMapper.add("{feature}", "/Features/{feature}", true);
		    }
		);
	}
);
