/**
 * This module will create a "standard" plot:
 * - simulation data drawn with lines
 * - "experimental" data drawn with markers only and can have tooltips with the values
 */
define([
	// The dojo/dom module is required by this module, so it goes
	// in this list of dependencies.
	'dojo/dom',

	// Wait until the DOM is ready
	"dojo/domReady!"
], function(dom) {
	// Once all modules in the dependency list have loaded, this
	// function is called to define the demo/myModule module.
	//
	// The dojo/dom module is passed as the first argument to this
	// function; additional modules in the dependency list would be
	// passed in as subsequent arguments.

	// global variables
	var AllEntities = {};
	

	// This returned object becomes the defined value of this module
	return {
		// just print out a message to the console
		message: function(msg) {
			console.log(msg);
		},
		
		// this will set up all the required callbacks
		registerEntities: function(diagramObjectId, entities) {
			var obj = dom.byId(diagramObjectId);
			var doc = obj.getSVGDocument();
			for (var name in entities)
			{
				var id = entities[name].id;
				var svg = doc.getElementById(id);
				
				//this is to make sure the menu disappears once the screen is clicked off the menu on the 
				//window. I attempted to use another mouse event in order to avoid down reusing code, but it 
				//didn't function the same.
				window.addEventListener("click", function(e){
					require(["dojo/dom-construct", "dojo/dom", "dojo/on", "dojo/domReady!"],
					function(domConstruct, dom, on){	
						domConstruct.empty("menus");	
					});
				});
				window.addEventListener("contextmenu", function(e){
					require(["dojo/dom-construct", "dojo/dom", "dojo/on", "dojo/domReady!"],
					function(domConstruct, dom, on){								
						domConstruct.empty("menus");								
					});
				});
				
				//This set of functions highlights the entity when the mouse is plaed over it, before 
				//resetting the stroke value after a short delay. Note that it occasionally gets stuck 
				//highlighted, for reasons I don't yet understand
				svg.addEventListener("mouseenter", function(e){
					//Set a variables that allow access to the properties we want
					var entity = AllEntities[diagramObjectId][e.srcElement.id];
					var a = document.getElementById("diagram1");
					var innerElement=a.contentDocument;
					var elementId=innerElement.getElementById(entity.id);
					var originalStroke=elementId.style.stroke
					//Change the stroke value, and then reset it after a certain period of time
				    elementId.style.stroke="00ffff";
					setTimeout(function() {
						elementId.style.stroke= originalStroke;
						}, 750);
				} );
				
				svg.addEventListener("click", function(e) {
					var entity = AllEntities[diagramObjectId][e.srcElement.id];
					console.debug(entity);
					alert("This would do something for clicking on the object: " + entity.id);
				}, false);
				svg.addEventListener("contextmenu", function(e) {
					var entity = AllEntities[diagramObjectId][e.srcElement.id];
					console.debug(entity);
					//This next line prevents a default menu from popping up when the 
					//entity is right clicked.
					e.preventDefault();
					
					//empty the DOM element containing any previous menus
					require(["dojo/dom-construct", "dojo/dom", "dojo/on", "dojo/domReady!"],
						function(domConstruct, dom){								
								domConstruct.empty("menus");								
							});
							
				    //create a new menu
					require(["dijit/Menu", "dijit/MenuItem", "dijit/PopupMenuItem", "dijit/MenuSeparator", "dojo/domReady!"], 
					function(Menu, MenuItem, PopupMenuItem, MenuSeparator){
						// create the Menu container
							var menu = new Menu({
								//targetNodeIds:["menus"]
							});
							
						//create menu items
							menu.addChild(new MenuItem({
								onClick: function(){alert(entity.id+" Action 1 was clicked")},
								label: (entity.id + " Action 1")
							}));

							menu.addChild(new MenuItem({
								label: (entity.id+" Action 2")
							}));

							menu.addChild(new MenuItem({
								onClick: function(){alert("This would bring up a graph or something")},
								label: (entity.id+" Action 3")
							}));
	
							menu.addChild(new MenuSeparator());
							
							var submenu = new Menu();
							
							submenu.addChild(new MenuItem({
								label:("Other "+entity.id+" Action 1")
							}));
							
							submenu.addChild(new MenuItem({
								label: ("Other "+entity.id+" Action 2")
							}));
							
							menu.addChild(new PopupMenuItem({
								label: "Other Actions",
								popup: submenu
							}));
						  
							menu.placeAt("menus");
							menu.startup();
						});
												
					//alert("This would pop up a context menu for the object: " + entity.id);
					// see https://dojotoolkit.org/reference-guide/1.10/dijit/Menu.html to get started...
				}, false);				
			}
			AllEntities[diagramObjectId] = entities;
		}
	};
});