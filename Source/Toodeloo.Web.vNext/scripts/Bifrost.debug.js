var Bifrost = Bifrost || {};
(function(global, undefined) {
	Bifrost.extend = function extend(destination, source) {
    	return $.extend(destination, source);
	};
})(window);
var Bifrost = Bifrost || {};
Bifrost.namespace = function (ns, content) {
    var parent = window;
    var parts = ns.split('.');
    $.each(parts, function (index, part) {
        if (!Object.prototype.hasOwnProperty.call(parent, part)) {
            parent[part] = {};
        }
        parent = parent[part];
    });

	if( typeof content === "object" ) {
		Bifrost.extend(parent, content);
	}
};
function TypeInfo(obj) {
	var target = obj;

	try {
		var funcNameRegex = /function (.{1,})\(/;
		var results = (funcNameRegex).exec((target).constructor.toString());
		this.name = (results && results.length > 1) ? results[1] : "";
	} catch( e ) {
		this.name = "unknown";
	}
}

Bifrost.namespace("Bifrost", {
	TypeInfo: {
		create : function() {
			if( typeof this.typeDefinition === "undefined" ) {
				throw new Bifrost.MissingTypeDefinition();
			}
			var dependencies = Bifrost.functionParser.parse(this.typeDefinition);
			if( dependencies.length == 0 ) {
				return new this.typeDefinition();
			} else {
				
				// A little note to self for how this should come together : 
				// - Add a options parameter to create so that we can hand it dependencies manually - nice for testing
				// - Add greater flexibility to solving - not only require
				// 		- require being one solver
				//		- namespace solving
				
				var resolvedDependencies = [];
				var a = this.typeDefinition;
				resolvedDependencies.push(a);
				$.each(dependencies, function(index, dependency) {
					var resolvedDependency = require(dependency);
					resolvedDependencies.push(resolvedDependency);
				});
				return new (a.bind.apply(a,resolvedDependencies))();
			}
		},
		
		getFor: function(obj) {
			var typeInfo = new TypeInfo(obj);
			return typeInfo;
		}
	}
});
Bifrost.namespace("Bifrost", {
	TypePrototype: {
	},
});
Bifrost.namespace("Bifrost", {
	Type : function(typeDefinition) {
		
		if( typeDefinition == null || typeof typeDefinition == "undefined" ) {
			throw new Bifrost.MissingClassDefinition();
		}
		if( typeof typeDefinition === "object") { 
			throw new Bifrost.ObjectLiteralNotAllowed();
		}
		
		var result = function() {
			typeDefinition.prototype = Bifrost.TypePrototype;
			this.typeDefinition = typeDefinition;
		}
		result.prototype = Bifrost.TypeInfo;
		
		return new result();
	}
});


Bifrost.namespace("Bifrost");

Bifrost.DefinitionMustBeFunction = function(message) {
    this.prototype = Error.prototype;
	this.name = "DefinitionMustBeFunction";
    this.message = message || "Definition must be function";
}

Bifrost.MissingName = function(message) {
	this.prototype = Error.prototype;
	this.name = "MissingName";
	this.message = message || "Missing name";
}

Bifrost.Exception = (function(global, undefined) {
	function throwIfNameMissing(name) {
		if( !name || typeof name == "undefined" ) throw new Bifrost.MissingName();
	}
	
	function throwIfDefinitionNotAFunction(definition) {
		if( typeof definition != "function" ) throw new Bifrost.DefinitionMustBeFunction();
	}

	function getExceptionName(name) {
		var lastDot = name.lastIndexOf(".");
		if( lastDot == -1 && lastDot != name.length ) return name;
		return name.substr(lastDot+1);
	}
	
	function defineAndGetTargetScope(name) {
		var lastDot = name.lastIndexOf(".");
		if( lastDot == -1 ) {
			return global;
		}
		
		var ns = name.substr(0,lastDot);
		Bifrost.namespace(ns);
		
		var scope = global;
        var parts = ns.split('.');
		$.each(parts, function(index, part) {
			scope = scope[part];
		});
		
		return scope;
	}
	
	return {
		define: function(name, defaultMessage, definition) {
			throwIfNameMissing(name);
			
			var scope = defineAndGetTargetScope(name);
			var exceptionName = getExceptionName(name);
			
			var exception = function(message) {
				this.name = exceptionName;
				this.message = message || defaultMessage;
			}
			exception.prototype = Error.prototype;
			
			if( definition && typeof definition != "undefined" ) {
				throwIfDefinitionNotAFunction(definition);
				
				definition.prototype = Error.prototype;
				exception.prototype = new definition();
			}
			
			scope[exceptionName] = exception;
		}
	};
})(window);
Bifrost.namespace("Bifrost");
Bifrost.Exception.define("Bifrost.LocationNotSpecified","Location was not specified");
Bifrost.Exception.define("Bifrost.InvalidUriFormat", "Uri format specified is not valid");
Bifrost.Exception.define("Bifrost.ObjectLiteralNotAllowed", "Object literal is not allowed");
Bifrost.Exception.define("Bifrost.MissingClassDefinition", "Class definition was not specified");
Bifrost.Exception.define("Bifrost.MissingTypeDefinition", "Type definition was not specified");
Bifrost.namespace("Bifrost", {
	Guid : {
       	create: function() {
	    	function S4() {
	        	return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
	    	}
           	return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
       	},
    	empty: "00000000-0000-0000-0000-000000000000"
	}
});

Bifrost.namespace("Bifrost", {
    isNumber: function (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    }
});

Bifrost.namespace("Bifrost");
Bifrost.hashString = (function() {
	return {
		decode: function(a) {
		    if (a == "") return { };
			a = a.replace("/?","").split('&');

		    var b = { };
		    for (var i = 0; i < a.length; ++i) {
		        var p = a[i].split('=');
		        if (p.length != 2) continue;
		
				var value = decodeURIComponent(p[1].replace( /\+/g , " "));
				var valueAsFloat = parseFloat(value);
				if( !isNaN(valueAsFloat) ) {
					value = valueAsFloat;
				}
		        b[p[0]] = value;
		    }
		    return b;
		}
	}
})();

Bifrost.namespace("Bifrost");
Bifrost.Uri = (function(window, undefined) {
	/* parseUri JS v0.1, by Steven Levithan (http://badassery.blogspot.com)
	Splits any well-formed URI into the following parts (all are optional):
	----------------------
	• source (since the exec() method returns backreference 0 [i.e., the entire match] as key 0, we might as well use it)
	• protocol (scheme)
	• authority (includes both the domain and port)
	    • domain (part of the authority; can be an IP address)
	    • port (part of the authority)
	• path (includes both the directory path and filename)
	    • directoryPath (part of the path; supports directories with periods, and without a trailing backslash)
	    • fileName (part of the path)
	• query (does not include the leading question mark)
	• anchor (fragment)
	*/
	function parseUri(sourceUri){
	    var uriPartNames = ["source","protocol","authority","domain","port","path","directoryPath","fileName","query","anchor"];
	    var uriParts = new RegExp("^(?:([^:/?#.]+):)?(?://)?(([^:/?#]*)(?::(\\d*))?)?((/(?:[^?#](?![^?#/]*\\.[^?#/.]+(?:[\\?#]|$)))*/?)?([^?#/]*))?(?:\\?([^#]*))?(?:#(.*))?").exec(sourceUri);
	    var uri = {};

	    for(var i = 0; i < 10; i++){
	        uri[uriPartNames[i]] = (uriParts[i] ? uriParts[i] : "");
	    }

	    // Always end directoryPath with a trailing backslash if a path was present in the source URI
	    // Note that a trailing backslash is NOT automatically inserted within or appended to the "path" key
	    if(uri.directoryPath.length > 0){
	        uri.directoryPath = uri.directoryPath.replace(/\/?$/, "/");
	    }

	    return uri;
	}	
	
	
	function Uri(location) {
		var self = this;
		this.setLocation = function(location) {
			self.fullPath = location;
			location = location.replace("#","/");
		
			var result = parseUri(location);
		
			if( !result.protocol || typeof result.protocol == "undefined" ) {
				throw new Bifrost.InvalidUriFormat("Uri ('"+location+"') was in the wrong format");
			}

			self.scheme = result.protocol;
			self.host = result.domain;
			self.path = result.path;
			self.anchor = result.anchor;

			self.queryString = result.query;
			self.port = parseInt(result.port);
			self.parameters = Bifrost.hashString.decode(result.query);
			
			self.isSameAsOrigin = (window.location.protocol == result.protocol+":" &&
				window.location.hostname == self.host); 
		}
		
		this.setLocation(location);
	}
	
	function throwIfLocationNotSpecified(location) {
		if( !location || typeof location == "undefined" ) throw new Bifrost.LocationNotSpecified();
	}
	
	
	return {
		create: function(location) {
			throwIfLocationNotSpecified(location);
		
			var uri = new Uri(location);
			return uri;
		},
	};
})(window);
﻿Bifrost.namespace("Bifrost.validation");
Bifrost.Exception.define("Bifrost.validation.OptionsNotDefined", "Option was undefined");
Bifrost.Exception.define("Bifrost.validation.NotANumber", "Value is not a number");
Bifrost.Exception.define("Bifrost.validation.ValueNotSpecified","Value is not specified");
Bifrost.Exception.define("Bifrost.validation.MinNotSpecified","Min is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxNotSpecified","Max is not specified");
Bifrost.Exception.define("Bifrost.validation.MinLengthNotSpecified","Min length is not specified");
Bifrost.Exception.define("Bifrost.validation.MaxLengthNotSpecified","Max length is not specified");
Bifrost.Exception.define("Bifrost.validation.MissingExpression","Expression is not specified");

﻿Bifrost.namespace("Bifrost.validation");
Bifrost.validation.ruleHandlers = (function () {
    return Bifrost.validation.ruleHandlers || { };
})();

﻿Bifrost.namespace("Bifrost.validation");
Bifrost.validation.Rule = (function () {
    function Rule(ruleName, options) {
        var self = this;
        this.handler = Bifrost.validation.ruleHandlers[ruleName];

        options = options || {};

        this.message = options.message || "";
        this.options = {};
        Bifrost.extend(this.options, options);

        this.validate = function (value) {
            return self.handler.validate(value, self.options);
        }
    }

    return {
        create: function (ruleName, options) {
            var rule = new Rule(ruleName, options);
            return rule;
        }
    };
})();
﻿Bifrost.namespace("Bifrost.validation");
Bifrost.validation.Validator = (function () {
    function Validator(options) {
        var self = this;
        this.isValid = ko.observable(true);
        this.message = ko.observable("");
        this.rules = [];
        options = options || {};

        this.setOptions = function (options) {
            for (var property in options) {
                this.rules.push(Bifrost.validation.Rule.create(property, options[property] || {}));
            }
        };

        this.validate = function(value) {
            $.each(self.rules, function(index, rule) {
                if (!rule.validate(value)) {
                    self.isValid(false);
                    self.message(rule.message);
                    return false;
                } else {
                    self.isValid(true);
                    self.message("");
                }
            });
        };

        this.setOptions(options);
    }

    return {
        create: function (options) {
            var validator = new Validator(options);
            return validator;
        },
        applyTo: function (itemOrItems, options) {
            var self = this;

            function applyToItem(item) {
                var validator = self.create(options);
                item.validator = validator;
            }

            if (itemOrItems instanceof Array) {
                $.each(itemOrItems, function (index, item) {

                    applyToItem(item);
                });
            } else {
                applyToItem(itemOrItems);
            }
        },
        applyToProperties: function (item, options) {
            var items = [];

            for (var property in item) {
                if (item.hasOwnProperty(property)) {
                    items.push(item[property]);
                }
            }
            this.applyTo(items, options);
        }
    }
})();

﻿if (typeof ko !== 'undefined') {
    Bifrost.namespace("Bifrost.validation", {
        ValidationSummary: function (commands) {
            var self = this;
            this.commands = commands;
            this.messages = ko.computed(function () {
                var actualMessages = [];
                $.each(self.commands, function (commandIndex, command) {
                    $.each(command.validators, function (validatorIndex, validator) {
                        if (!validator.isValid()) {
                            actualMessages.push(validator.message());
                        }
                    });
                });
                return actualMessages;
            });
        }
    });

    ko.bindingHandlers.validationSummaryFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var target = ko.utils.unwrapObservable(value);
            if (!(target instanceof Array)) {
                target = [target];
            }

            var validationSummary = new Bifrost.validation.ValidationSummary(target);
            ko.applyBindingsToNode(element, { foreach: validationSummary.messages }, validationSummary);
        }
    };
}
﻿if (typeof ko !== 'undefined') {
    ko.bindingHandlers.validationMessageFor = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            var value = valueAccessor();
            var validator = value.validator;

            validator.isValid.subscribe(function (newValue) {
                if (newValue == true) {
                    $(element).hide();
                } else {
                    $(element).show();
                }
            });
            ko.applyBindingsToNode(element, { text: validator.message }, validator);
        }
    };
}
if (typeof ko !== 'undefined') {
    ko.extenders.validation = function (target, options) {
        Bifrost.validation.Validator.applyTo(target, options);
        target.subscribe(function (newValue) {
            target.validator.validate(newValue);
        });

        // Todo : look into aggressive validation
        //target.validator.validate(target());
        return target;
    };
}

﻿Bifrost.namespace("Bifrost.validation");
Bifrost.validation.validationService = (function () {
    function extendProperties(target, validators) {
        for (var property in target) {
            if ("extend" in target[property] && typeof target[property].extend === "function") {
                target[property].extend({ validation: {} });
                validators.push(target[property].validator);
            } else if (typeof target[property] === "object") {
                extendProperties(target[property], validators);
            }
        }
    }

    return {
        applyRulesToProperties: function (properties, rules) {
            for (var rule in rules) {
                var path = rule.split(".");
                var member = properties;
                for (var i in path) {
                    var step = path[i];
                    if (step in member) {
                        member = member[step];
                    } else {
                        throw "Error applying validation rules: " + step + " is not a member of " + member + " (" + rule + ")";
                    }
                }

                if (member.validator !== undefined) {
                    member.validator.setOptions(rules[rule]);
                }
            }
        },
        applyForCommand: function (command) {
            command.validators = [];
            extendProperties(command.parameters, command.validators);
            $.getJSON("/Validation/GetForCommand?name=" + command.name, function (e) {
                Bifrost.validation.validationService.applyRulesToProperties(command.parameters, e.properties);
            });
        }
    }
})();
﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.required = {
    validate: function (value, options) {
        return !(typeof value == "undefined" || value == "");
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.minLength = {
    validate: function (value, options) {
        if (typeof options === "undefined" || typeof options.length === "undefined") {
            throw {
                message: "length is not specified for the minLength validator"
            }
        }

        if (typeof value === "undefined") {
            return false;

        }

        return value.length >= options.length;
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.maxLength = {
    validate: function (value, options) {
        if (typeof options === "undefined" || typeof options.length === "undefined") {
            throw {
                message: "length is not specified for the maxLength validator"
            }
        }

        if (typeof value === "undefined") {
            return false;
        }

        return value.length <= options.length;
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.range = {
    isNumber: function (number) {
        return !isNaN(parseFloat(number)) && isFinite(number);
    },
    throwIfOptionsUndefined: function (options) {
        if (typeof options === "undefined") {
            throw new Bifrost.validation.OptionsNotDefined();
        }
    },
    throwIfMinUndefined: function (options) {
        if (typeof options.min === "undefined") {
            throw new Bifrost.validation.MinNotSpecified();
        }
    },
    throwIfMaxUndefined: function (options) {
        if (typeof options.max === "undefined") {
            throw new Bifrost.validation.MaxNotSpecified();
        }
    },
    throwIfNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    validate: function (value, options) {
        this.throwIfNotANumber(value);
        this.throwIfOptionsUndefined(options);
        this.throwIfMaxUndefined(options);
        this.throwIfMinUndefined(options);

        if (typeof value === "undefined") {
            return false;
        }

        return value <= options.max && value >= options.min;
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.lessThan = {
    throwIfOptionsUndefined: function (options) {
        if (typeof options === "undefined") {
            throw new Bifrost.validation.OptionsNotDefined();
        }
    },
    throwIfValueUndefined: function (options) {
        if (typeof options.value === "undefined") {
            throw new Bifrost.validation.ValueNotSpecified();
        }
    },
    throwIfNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    validate: function (value, options) {
        this.throwIfNotANumber(value);
        this.throwIfOptionsUndefined(options);
        this.throwIfValueUndefined(options);
        if (typeof value === "undefined") {
            return false;
        }
        return parseFloat(value) < parseFloat(options.value);
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.greaterThan = {
    throwIfOptionsUndefined: function (options) {
        if (!options || typeof options === "undefined") {
            throw new Bifrost.validation.OptionsNotDefined();
        }
    },
    throwIfValueUndefined: function (options) {
        if (typeof options.value === "undefined") {
            throw new Bifrost.validation.ValueNotSpecified();
        }
    },
    throwIfNotANumber: function (value) {
        if (!Bifrost.isNumber(value)) {
            throw new Bifrost.validation.NotANumber("Value " + value + " is not a number");
        }
    },

    validate: function (value, options) {
        this.throwIfNotANumber(value);
        this.throwIfOptionsUndefined(options);
        this.throwIfValueUndefined(options);
        if (typeof value === "undefined") {
            return false;
        }
        return parseFloat(value) > parseFloat(options.value);
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");
Bifrost.validation.ruleHandlers.email = {
    regex : /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/,

    validate: function (value, options) {
        return (value.match(this.regex) == null) ? false : true;
    }
};

﻿Bifrost.namespace("Bifrost.validation.ruleHandlers");

Bifrost.validation.ruleHandlers.regex = {
    throwIfOptionsUndefined: function (options) {
        if (typeof options === "undefined") {
            throw new Bifrost.validation.OptionsNotDefined();
        }
    },

    throwIfExpressionMissing: function (options) {
        if (!options.expression) {
            throw new Bifrost.validation.MissingExpression();
        }
    },

    validate: function (value, options) {
        this.throwIfOptionsUndefined(options);
        this.throwIfExpressionMissing(options);

        return (value.match(options.expression) == null) ? false : true;
    }
};

if (typeof ko !== 'undefined') {
    ko.bindingHandlers.command = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
			var value = valueAccessor();
			var command;
			var contextBound = false;
			if( typeof value.canExecute === "undefined" ) {
				command = value.target;
				
				command.parameters = command.parameters || {};
				var parameters = value.parameters || {};
				
				for( var parameter in parameters ) {
					var parameterValue = parameters[parameter];
					
					if( command.parameters.hasOwnProperty(parameter) &&
						ko.isObservable(command.parameters[parameter]) ) {
						command.parameters[parameter](parameterValue);
					} else {
						command.parameters[parameter] = ko.observable(parameterValue);
					}
				}
				contextBound = true;
			} else {
				command = value;
			}
            ko.applyBindingsToNode(element, { click: function() {
				// TODO: Investigate further - idea was to support a "context-sensitive" way of dynamically inserting 
				// parameters before execution of the command
				/*
				if( !contextBound ) {
					command.parameters = command.parameters || {};					
					for( var parameter in command.parameters ) {
						if( viewModel.hasOwnProperty(parameter) ) {
							var parameterValue = viewModel[parameter];
							if( ko.isObservable(command.parameters[parameter]) ) {
								command.parameters[parameter](parameterValue);
							} else {
								command.parameters[parameter] = parameterValue;								
							}
						}
					}
				}
				*/
	
				command.execute();
			}}, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.commands");
Bifrost.commands.Command = (function (window) {
    function Command(options) {
        var self = this;
        this.name = options.name;
        this.hasError = false;
        this.isBusy = ko.observable(false);
        this.canExecute = ko.observable(true);
        this.id = Bifrost.Guid.create();
        this.result = Bifrost.commands.CommandResult.create();
        this.validatorsList = [];
        this.successfullyExcecuted = function () {
            if (self.hasResult()) {
                return self.result.success === true;
            }
        };

        this.hasResult = function () {
            return typeof self.result !== "undefined" && !self.result.isEmpty();
        };

        this.options = {
            beforeExecute: function () {
            },
            error: function () {
            },
            success: function () {
            },
            complete: function () {
            }
        };
        // Todo: add an overrideWith or similar that will always pick the one that is not undefined!
        // add validation check for "type" based on source, if not function for instance in the merger
        // exception!
        Bifrost.extend(this.options, options);

        this.parameters = options.parameters || {};


        this.initialize = function () {
            if (typeof self.viewModel === "undefined") {
                self.viewModel = window;
            }

            //TODO: create a list of validators to loop through  //DONE
            Bifrost.validation.validationService.applyForCommand(self);

            //TODO: loop through list of validations, not parameters object //DONE
            self.parametersAreValid = ko.computed(function () {
                for (var property in this.validatorsList) {
                    if (this.validatorsList[property].validator &&
						this.validatorsList[property].validator.isValid() == false) {
                        return false;
                    }
                }
                return true;
            }, self);
        };

        this.validator = Bifrost.validation.Validator.create({ required: true });

        this.validate = function () {
            self.validator.validate(true);
            if (self.validator.isValid()) {
                //TODO: loop through list of validations, not parameters object //DONE
                for (var property in self.validatorsList) {
                    if (self.validatorsList[property].validator) {
                        self.validatorsList[property].validator.validate(self.validatorsList[property]());
                    }
                }
            }
        };

        this.applyValidationMessageToMembers = function (members, message) {
            for (var j = 0; j < members.length; j++) {

                var path = members[j].split(".");
                var member = self.parameters;
                for (var i in path) {
                    var step = path[i];
                    step = step.charAt(0).toLowerCase() + step.substring(1);
                    if (step in member) {
                        member = member[step];
                    } else {
                        throw "Error applying validation results: " + step + " is not a member of " + member + " (" + rule + ")";
                    }
                }


                //TODO: split on . and find object in parameters object //DONE
                if (typeof message === "string" && "validator" in member) {
                    member.validator.isValid(false);
                    member.validator.message(message);
                }
            }
        };

        this.applyValidationMessageToCommand = function (message) {
            self.validator.isValid(false);
            var newMessage = self.validator.message();
            newMessage = newMessage.length == 0 ? message : newMessage + ", " + message;
            self.validator.message(newMessage);
        };

        this.applyServerValidation = function (validationResults) {
            for (var i = 0; i < validationResults.length; i++) {
                var validationResult = validationResults[i];
                var message = validationResult.errorMessage;
                var memberNames = validationResult.memberNames;
                if (memberNames.length > 0) {
                    //one (or more) of the parameters has an error, so apply the error to those
                    self.applyValidationMessageToMembers(memberNames, message);
                } else {
                    //the command needs a validator we can apply this message to.
                    self.applyValidationMessageToCommand(message);
                }
            }
        };

        this.execute = function () {



            if (self.onBeforeExecute() === false) {
                return;
            }

            Bifrost.commands.commandCoordinator.handle(self, {
                error: function (e) {
                    self.onError(e);
                },
                complete: function () {
                    self.onComplete();
                }
            });
        };

        this.onBeforeExecute = function () {

            self.hasError = false;

            self.validate();
            if (!self.parametersAreValid()) {
                return false;
            }

            self.options.beforeExecute.call(self.viewModel, self);

            if (!self.canExecute.call(self.viewModel)) {
                return false;
            }
            self.isBusy(true);

            return true;
        };

        this.onError = function () {
            self.hasError = true;
            if (self.result.hasOwnProperty("validationResults")) {
                self.applyServerValidation(self.result.validationResults);
            }
            self.options.error.call(self.viewModel, self.result);
        };

        this.onSuccess = function () {
            self.hasError = false;
            self.options.success.call(self.viewModel, self.result);
        };

        this.onComplete = function () {
            if (!self.hasError) {
                self.options.complete.call(self.viewModel, self.result);
            }
            self.isBusy(false);
        };
    }

    return {
        create: function (options) {
            var command = new Command(options);
            command.initialize();
            return command;
        }
    };
})(window);

Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandDescriptor = (function () {
    function CommandDescriptor(name, id, commandParameters) {
        this.Name = name;
        //recursively create JSON from mix of objects and knockout observables/computed values
        var commandContent = ko.toJS(commandParameters);
        commandContent.Id = id;
        this.Command = ko.toJSON(commandContent);
    };

    return {
        createFrom: function (command) {
            var commandDescriptor = new CommandDescriptor(command.name, command.id, command.parameters);
            return commandDescriptor;
        }
    };
})();

Bifrost.namespace("Bifrost.commands");
Bifrost.commands.commandCoordinator = (function () {
    var baseUrl = "/CommandCoordinator";
    function sendToHandler(url, data, completeHandler) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            contentType: 'application/json; charset=utf-8',
            complete: completeHandler
        });
    }

    function handleCommandCompletion(jqXHR, command, commandResult) {
        if (jqXHR.status === 200) {
            command.result = Bifrost.commands.CommandResult.createFrom(commandResult);
            command.hasExecuted = true;
            if (command.result.success === true) {
                command.onSuccess();
            } else {
                command.onError();
            }
        } else {
            command.result.success = false;
            command.result.exception = {
                Message: jqXHR.responseText,
                details: jqXHR
            };
            command.onError();
        }
        command.onComplete();
    }

    return {
        handle: function (command) {


            var methodParameters = {
                commandDescriptor: JSON.stringify(Bifrost.commands.CommandDescriptor.createFrom(command))
            };

            sendToHandler(baseUrl + "/Handle", JSON.stringify(methodParameters), function (jqXHR) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(jqXHR.responseText);
                handleCommandCompletion(jqXHR, command, commandResult);
            });
        },
        handleForSaga: function (saga, commands) {
            var commandDescriptors = [];

            $.each(commands, function (index, command) {
                commandDescriptors.push(Bifrost.commands.CommandDescriptor.createFrom(command));
            });

            var methodParameters = {
                sagaId: saga.id,
                commandDescriptors: JSON.stringify(commandDescriptors)
            };

            sendToHandler(baseUrl + "/HandleForSaga", JSON.stringify(methodParameters), function (jqXHR) {
                var commandResultArray = $.parseJSON(jqXHR.responseText);

                $.each(commandResultArray, function (commandResultIndex, commandResult) {
                    $.each(commands, function (commandIndex, command) {
                        if (command.id === commandResult.commandId) {
                            handleCommandCompletion(jqXHR, command, commandResult);
                            return false;
                        }
                    });
                });
            });
        }
    };
})();

Bifrost.namespace("Bifrost.commands");
Bifrost.commands.CommandResult = (function () {
    function CommandResult(existing) {
        var self = this;
        this.isEmpty = function () {
            return self.commandId === Bifrost.Guid.empty;
        };

        if (typeof existing !== "undefined") {
            Bifrost.extend(this, existing);
        } else {
            this.commandName = "";
            this.commandId = Bifrost.Guid.empty;
            this.validationResult = [];
            this.success = true;
            this.invalid = false;
            this.exception = undefined;
        }
    }

    return {
        create: function() {
            var commandResult = new CommandResult();
            return commandResult;
        },
        createFrom: function (result) {
            var existing = typeof result === "string" ? $.parseJSON(result) : result;
            var commandResult = new CommandResult(existing);
            return commandResult;
        }
    };
})();
Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.Saga = (function () {
    function Saga() {
        var self = this;

        this.executeCommands = function (commands) {

            var canExecuteSaga = true;
            
            $.each(commands, function (index, command) {
                if (command.onBeforeExecute() === false) {
                    canExecuteSaga = false;
                    return false;
                }
            });

            if (canExecuteSaga === false) {
                return;
            }
            Bifrost.commands.commandCoordinator.handleForSaga(self, commands, {
                error: function (e) {
                },
                complete: function (e) {
                }
            });
        }
    }

    return {
        create: function (configuration) {
            var saga = new Saga();
            Bifrost.extend(saga, configuration);
            return saga;
        }
    }
})();

Bifrost.namespace("Bifrost.sagas");
Bifrost.sagas.sagaNarrator = (function () {
    var baseUrl = "/SagaNarrator";
    // Todo : abstract away into general Service code - look at CommandCoordinator.js for the other copy of this!s
    function post(url, data, completeHandler) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'json',
            data: data,
            contentType: 'application/json; charset=utf-8',
            complete: completeHandler
        });
    }

    function isRequestSuccess(jqXHR, commandResult) {
        if (jqXHR.status === 200) {
            if (commandResult.success === true) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
        return true;
    }

    return {
        conclude: function (saga, success, error) {
            var methodParameters = {
                sagaId: saga.Id
            };
            post(baseUrl + "/Conclude", JSON.stringify(methodParameters), function (jqXHR) {
                var commandResult = Bifrost.commands.CommandResult.createFrom(jqXHR.responseText);
                var isSuccess = isRequestSuccess(jqXHR, commandResult);
                if (isSuccess == true && typeof success === "function") {
                    success(saga);
                }
                if (isSuccess == false && typeof error === "function") {
                    error(saga);
                }
            });
        }
    }
})();

Bifrost.namespace("Bifrost.features");
Bifrost.features.UriNotSpecified = function(message) {
	this.prototype = Error.prototype;
	this.name = "UriNotSpecified";
	this.message = message || "Uri was not specified";
}
Bifrost.features.MappedUriNotSpecified = function(message) {
	this.prototype = Error.prototype;
	this.name = "MappedUriNotSpecified";
	this.message = message || "Mapped Uri was not specified";
}
Bifrost.namespace("Bifrost.features");
Bifrost.features.FeatureMapping = (function () {
	function throwIfUriNotSpecified(uri) {
		if(!uri || typeof uri === "undefined") {
			throw new Bifrost.features.UriNotSpecified();
		}
	}
	
	function throwIfMappedUriNotSpecified(mappedUri) {
		if(!mappedUri || typeof mappedUri === "undefined") {
			throw new Bifrost.features.MappedUriNotSpecified();
		}
	}
	
    function FeatureMapping(uri, mappedUri, isDefault) {

		throwIfUriNotSpecified(uri);
		throwIfMappedUriNotSpecified(mappedUri);

        var uriComponentRegex = /\{[a-zA-Z]*\}/g
        var components = uri.match(uriComponentRegex) || [];
        var uriRegex = new RegExp(uri.replace(uriComponentRegex, "([\\w.]*)"));

        this.uri = uri;
        this.mappedUri = mappedUri;
        this.isDefault = isDefault || false;

        this.matches = function (uri) {
            var match = uri.match(uriRegex);
            if (match) {
                return true;
            }
            return false;
        }

        this.resolve = function (uri) {
            var match = uri.match(uriRegex);
            var result = mappedUri;
            $.each(components, function (i, c) {
                result = result.replace(c, match[i + 1]);
            });

            return result;
        }
    }

    return {
        create: function (uri, mappedUri, isDefault) {
            var featureMapping = new FeatureMapping(uri, mappedUri, isDefault);
            return featureMapping;
        }
    }
})();

Bifrost.namespace("Bifrost.features");
Bifrost.features.featureMapper = (function () {
    var mappings = [];

    return {
        clear: function () {
            mappings = [];
        },

        add: function (uri, mappedUri, isDefault) {
            var FeatureMapping = Bifrost.features.FeatureMapping.create(uri, mappedUri, isDefault);
            mappings.push(FeatureMapping);
        },

        getFeatureMappingFor: function (uri) {
            var found;
            $.each(mappings, function (i, m) {
                if (m.matches(uri)) {
                    found = m;
                    return false;
                }
            });

            if (typeof found !== "undefined") {
                return found;
            }

            throw {
                name: "ArgumentError",
                message: "URI (" + uri + ") could not be mapped"
            }
        },

        resolve: function (uri) {
            try {
                var FeatureMapping = Bifrost.features.featureMapper.getFeatureMappingFor(uri);
                return FeatureMapping.resolve(uri);
            } catch (e) {
                return "";
            }
        },

        allMappings: function () {
            var allMappings = new Array();
            allMappings = allMappings.concat(mappings);
            return allMappings;
        }
    }
})();
Bifrost.namespace("Bifrost.features");
Bifrost.features.ViewModel = (function(window, undefined) {	
	function ViewModel() {
		var self = this;
		
		this.uriChangedSubscribers = [];
		this.activatedSubscribers = [];
		
		this.messenger = Bifrost.messaging.messenger;
		this.uri = Bifrost.Uri.create(window.location.href);
		this.queryParameters = {
			define: function(parameters) {
				Bifrost.extend(this,parameters);
			}
		}
		
		this.uriChanged = function(callback) {
			self.uriChangedSubscribers.push(callback);
		}
		
		this.activated = function(callback) {
			self.activatedSubscribers.push(callback);
		}
		
		
		this.onUriChanged = function(uri) {
			$.each(self.uriChangedSubscribers, function(index, callback) {
				callback(uri);
			});
		}
		
		this.onActivated = function() {
			if( typeof self.handleUriState !== "undefined" ) {
				self.handleUriState();
			}
			
			$.each(self.activatedSubscribers, function(index, callback) {
				callback();
			});
		}

		if(typeof History !== "undefined" && typeof History.Adapter !== "undefined") {
			this.handleUriState = function() {
				var state = History.getState();
				
				self.uri.setLocation(state.url);
				
				for( var parameter in self.uri.parameters ) {
					if( self.queryParameters.hasOwnProperty(parameter) && 
						typeof self.uri.parameters[parameter] != "function") {
						
						if( typeof self.queryParameters[parameter] == "function" ) {
							self.queryParameters[parameter](self.uri.parameters[parameter]);
						} else {
							self.queryParameters[parameter] = self.uri.parameters[parameter];
						}
					}
				}
				
				self.onUriChanged(self.uri);
			}
			
			History.Adapter.bind(window,"statechange", function() {
				self.handleUriState();
			});		
			
			$(function() {
				self.handleUriState();
			});
		}
	}
	
	return {
		baseFor : function(f) {
			if( typeof f === "function" ) {
				f.prototype = new ViewModel();
			}
		}
	};
})(window);
Bifrost.namespace("Bifrost.features");
Bifrost.features.ViewModelDefinition = (function () {
    function ViewModelDefinition(target, options) {
        var self = this;
        this.target = target;
        this.options = {
            isSingleton: false
        }
        Bifrost.extend(this.options, options);

        this.getInstance = function () {
			var instance = null;
            if (self.options.isSingleton) {
                if (!self.instance) {
                    self.instance = new self.target();
                }

                instance = self.instance;
            } else {
				instance = new self.target();
			}
			instance.onActivated();
            return instance;
        };
    }

    return {
        define: function (target, options) {
			Bifrost.features.ViewModel.baseFor(target);
            var viewModel = new ViewModelDefinition(target, options);
            return viewModel;
        }
    }
})();
Bifrost.namespace("Bifrost.features");
Bifrost.features.Feature = (function () {
    function Feature(name, path, isDefault) {
        var self = this;
        this.loaded = false;
        this.renderTargets = [];
        this.name = name;
        this.path = path;
        this.isDefault = isDefault;

        if (isDefault) {
            this.viewPath = path + "/view.html";
            this.viewModelpath = path + "/viewModel.js";
        } else {
            this.viewPath = path + ".html";
            this.viewModelpath = path + ".js";
        }

        this.load = function () {
            var actualViewPath = "text!" + self.viewPath + "!strip";
            var actualViewModelPath = self.viewModelpath;

            require([actualViewPath, actualViewModelPath], function (v) {
                self.view = v;

                $.each(self.renderTargets, function (i, r) {
                    self.actualRenderTo(r);
                });

                self.renderTargets = [];

                self.loaded = true;
            });
        }

        this.defineViewModel = function (viewModel, options) {
            self.viewModelDefinition = Bifrost.features.ViewModelDefinition.define(viewModel, options);
        }

        this.renderTo = function (target) {
            if (self.loaded === false) {
                self.renderTargets.push(target);
            } else {
                self.actualRenderTo(target);
            }
        }

        this.actualRenderTo = function (target) {
			$(target).empty();
            $(target).append(self.view);

			if( self.viewModelDefinition ) {
            	var viewModel = self.viewModelDefinition.getInstance();
            	ko.applyBindings(viewModel, target);
			}

            Bifrost.features.featureManager.hookup(function (a) { return $(a, $(target)); });
        }
    }

    return {
        create: function (name, path, isDefault) {
            var feature = new Feature(name, path, isDefault);
            return feature;
        }
    }
})();

Bifrost.namespace("Bifrost.features");
Bifrost.features.featureManager = (function () {
    var allFeatures = {};

    return {
        get: function (name) {
            name = name.toLowerCase();

            if (typeof allFeatures[name] !== "undefined") {
                return allFeatures[name];
            }

            var FeatureMapping = Bifrost.features.featureMapper.getFeatureMappingFor(name);
            var path = FeatureMapping.resolve(name);
            var feature = Bifrost.features.Feature.create(name, path, FeatureMapping.isDefault);
            allFeatures[name] = feature;
            feature.load();            
            return feature;
        },
        hookup: function ($) {
            $("[data-feature]").each(function () {
                var target = $(this)[0];
                var name = $(this).attr("data-feature");
                var feature = Bifrost.features.featureManager.get(name);
                feature.renderTo(target);
            });
        },
        all: function () {
            return allFeatures;
        }
    }
})();
(function ($) {
    $(function () {
		Bifrost.navigation.navigationManager.hookup();
        Bifrost.features.featureManager.hookup($);
    });
})(jQuery);



if (typeof ko !== 'undefined') {
    ko.bindingHandlers.feature = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
        },
        update: function (element, valueAccessor, allBindingAccessor, viewModel) {
			var featureName = valueAccessor()();
			var feature = Bifrost.features.featureManager.get(featureName);
			
			$(element).empty();
			
			var container = $("<div/>");
			$(element).append(container);
			
			feature.renderTo(container[0]);
        }
    };
}

Bifrost.namespace("Bifrost.messaging");
Bifrost.messaging.messenger = (function() {
	var subscribers = [];
	
	return {
		publish: function(message) {
			var messageTypeName = message.constructor.name;
			if( subscribers.hasOwnProperty(messageTypeName)) {
				$.each(subscribers[messageTypeName].subscribers, function(index, item) {
					item(message);
				});
			}
		},
	
		subscribeTo: function(messageType, subscriber) {
			var subscribersByMessageType;
			
			if( subscribers.hasOwnProperty(messageType)) {
				subscribersByMessageType = subscribers[messageType];
			} else {
				subscribersByMessageType = {subscribers:[]};
				subscribers[messageType] = subscribersByMessageType;
			}
			
			subscribersByMessageType.subscribers.push(subscriber);
		}
	}
})();
if (typeof ko !== 'undefined') {
    ko.bindingHandlers.navigateTo = {
        init: function (element, valueAccessor, allBindingAccessor, viewModel) {
            ko.applyBindingsToNode(element, { 
				click: function() {
					var featureName = valueAccessor()();
					History.pushState({feature:featureName},$(element).attr("title"),"/"+featureName);
				} 
			}, viewModel);
        }
    };
}
Bifrost.namespace("Bifrost.navigation", {
    navigationManager: {
        hookup: function () {
            $("body").click(function (e) {
                var href = e.target.href;
                if (typeof href == "undefined") {
                    var closestAnchor = $(e.target).closest("a")[0];
                    if (!closestAnchor) {
                        return;
                    }
                    href = closestAnchor.href;
                }
                if (href.indexOf("#") > 0) {
                    href = href.substr(0, href.indexOf("#"));
                }

                if (href.length == 0) {
                    href = "/";
                }
                var targetUri = Bifrost.Uri.create(href);
                if (targetUri.isSameAsOrigin) {
                    var target = targetUri.path;
                    while (target.indexOf("/") == 0) {
                        target = target.substr(1);
                    }
                    e.preventDefault();
                    var queryString = targetUri.queryString.length > 0 ? "?" + targetUri.queryString : "";
                    History.pushState({}, "", "/" + target + queryString);
                }
            });
        }
    }
});
/*
@depends utils/extend.js
@depends utils/namespace.js
@depends utils/TypeInfo.js
@depends utils/TypePrototype.js
@depends utils/Type.js
@depends utils/Exception.js
@depends utils/exceptions.js
@depends utils/guid.js
@depends utils/isNumber.js
@depends utils/hashString.js
@depends utils/Uri.js
@depends validation/exceptions.js
@depends validation/ruleHandlers.js
@depends validation/Rule.js
@depends validation/Validator.js
@depends validation/validationSummaryFor.js
@depends validation/validationMessageFor.js
@depends validation/validation.js
@depends validation/validationService.js
@depends validation/required.js
@depends validation/minLength.js
@depends validation/maxLength.js
@depends validation/range.js
@depends validation/lessThan.js
@depends validation/greaterThan.js
@depends validation/email.js
@depends validation/regex.js
@depends commands/bindingHandlers.js
@depends commands/Command.js
@depends commands/CommandDescriptor.js
@depends commands/CommandCoordinator.js
@depends commands/CommandResult.js
@depends sagas/Saga.js
@depends sagas/sagaNarrator.js
@depends features/exceptions.js
@depends features/FeatureMapping.js
@depends features/featureMapper.js
@depends features/ViewModel.js
@depends features/ViewModelDefinition.js
@depends features/Feature.js
@depends features/featureManager.js
@depends features/loader.js
@depends features/featureBindingHandler.js
@depends messaging/messenger.js
@depends navigation/navigateTo.js
@depends navigation/navigationManager.js
*/


