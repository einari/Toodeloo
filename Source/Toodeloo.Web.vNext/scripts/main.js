require.config({
	appDir: "/",
	baseUrl: "/scripts",
	optimize: "none",

	paths: {
	    "jquery": "http://ajax.googleapis.com/ajax/libs/jquery/1.7.1/jquery.min",
	    "knockout": "http://cdn.dolittle.com/Knockout/knockout-2.0.0",
		"knockout.mapping": "knockout.mapping-2.0.0",
	    "bifrost": "Bifrost.debug",
	    "order": "http://cdn.dolittle.com/Require/order",
	    "domReady": "http://cdn.dolittle.com/Require/domReady",
	    "text": "http://cdn.dolittle.com/Require/text"
	}
});

// "http://cdn.dolittle.com/Bifrost/Bifrost.debug",

require(
    ["jquery", "knockout"],
	function() {
		require(["jquery.history"],
		    function () {
		        require(["knockout.mapping", "bifrost", "knockout.plugins"],
		            function () {
		                Bifrost.features.uriMapper.add("admin/{feature}/{subFeature}", "/administration/{feature}/{subFeature}", false);
		                Bifrost.features.uriMapper.add("admin/{feature}", "/administration/{feature}", true);

		                Bifrost.features.uriMapper.add("{feature}/{subFeature}", "/Features/{feature}/{subFeature}", false);
		                Bifrost.features.uriMapper.add("{feature}", "/Features/{feature}", true);

		                require([                
		                        "cufon-yui",
				                "cufon-libsans-r-b",
								],
		                        function() {
									//Cufon.replace('h2, h3, h4, h5, h6', { hover: true });
									//Cufon.replace('h1', { color: '-linear-gradient(#3f3f3f, #262626)', hover: false});
		                        }
		                );
		            }
		        );
		    }
		);
	}
);
