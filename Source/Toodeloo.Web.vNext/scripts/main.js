require.config({
	appDir: "/",
	baseUrl: "/scripts",
	optimize: "none",

	paths: {
	    "jquery": "jquery.min",
	    "knockout": "knockout-2.0.0",
		"knockout.mapping": "knockout.mapping-2.0.0",
	    "bifrost": "Bifrost.debug",
	    "order": "order",
	    "domReady": "domReady",
	    "text": "text"
	}
});

require(
    ["jquery", "knockout"],	function() {
		require(["jquery.history"], function () {
		        require(["knockout.mapping", "bifrost", "knockout.plugins"], function () {
		                Bifrost.features.featureMapper.add("admin/{feature}/{subFeature}", "/administration/{feature}/{subFeature}", false);
		                Bifrost.features.featureMapper.add("admin/{feature}", "/administration/{feature}", true);

		                Bifrost.features.featureMapper.add("{feature}/{subFeature}", "/Features/{feature}/{subFeature}", false);
		                Bifrost.features.featureMapper.add("{feature}", "/Features/{feature}", true);

		                require(["cufon-yui","cufon-libsans-r-b"], function() {
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
