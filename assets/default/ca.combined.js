/* ----------------------------------------------------------------------
 * js/ca/ca.bookreader.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2011-2012 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initBookReader = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			containerID: 'BookReader',
			bookreader: null,
			docURL: null,
			width: '100%',
			height: '100%',
			page: 1,
			sidebar: false,
			editButton: 'Edit',
			closeButton: 'Close',
			sectionsAreSelectable: false,
			selectionRecordURL: null
		}, options);
		
		 that.bookreader = DV.load(that.docURL, {
			container: '#' + that.containerID,
			width: that.width,
			height: that.height,
			sidebar: that.sidebar,
			page: that.page,
			editButton: that.editButton,
			downloadButton: that.downloadButton,
			closeButton: that.closeButton,
			sectionsAreSelectable: that.sectionsAreSelectable,
			selectionRecordURL: that.selectionRecordURL,
			search: true, text: false
		  });
		
		// --------------------------------------------------------------------------------
		
		return that;
	};	
})(jQuery);

/* ----------------------------------------------------------------------
 * js/ca/ca.browsepanel.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2009-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initBrowsePanel = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			facetUrl: '',
			addCriteriaUrl: '',
			panelCSSClass: 'browseSelectPanel',
			panelID: 'splashBrowsePanel',
			panelContentID: 'splashBrowsePanelContent',
			
			facetSelectID: "browseFacetSelect",
			
			useExpose: true,
			useStaticDiv: false,									/* set if you want to use a visible <div> for the browse panel rather than a show/hide overlay <div> */
			
			isChanging: false,
			browseID: null,
			
			singleFacetValues: {},
			
			exposeBackgroundColor: '#000000',						/* color (in hex notation) of background masking out page content; include the leading '#' in the color spec */
			exposeBackgroundOpacity: 0.5,							/* opacity of background color masking out page content; 1.0 is opaque */
			panelTransitionSpeed: 200
		}, options);
		
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.showBrowsePanel = function(facet, modifyMode, modifyID, grouping, clear, target, options) {
			if (that.singleFacetValues[facet]) {
				document.location = that.addCriteriaUrl + "/facet/" + facet + "/id/" + that.singleFacetValues[facet];
				return true;
			}
			that.isChanging = true;
			if (!facet) { return; }
			
			var panelContentID = (options && options.panelContentID) ? options.panelContentID : that.panelContentID;
			
			if (!that.useStaticDiv) {
				jQuery("#" + that.panelID).fadeIn(that.panelTransitionSpeed, function() { that.isChanging = false; });
			
				if (that.useExpose) { 
					jQuery("#" + that.panelID).expose({api: true, color: that.exposeBackgroundColor, opacity: that.exposeBackgroundOpacity, zIndex: 99999}).load(); 
				}
			}
			if (!modifyID) { modifyID = ''; }
			
			var options = { facet: facet, modify: (modifyMode ? 1 : ''), id: modifyID, grouping: grouping, clear: clear ? 1 : 0 };
			if (that.browseID) { options['browse_id'] = that.browseID; }
			if (target) { options['target'] = target; }
			jQuery("#" + panelContentID).load(that.facetUrl, options);
		}
		
		that.hideBrowsePanel = function() {
			that.isChanging = true;
			var panelContentID = (options && options.panelContentID) ? options.panelContentID : that.panelContentID;
			if (!that.useStaticDiv) {
				jQuery("#" + that.panelID).fadeOut(that.panelTransitionSpeed, function() { that.isChanging = false; });
			
				if (that.useExpose) {
					jQuery.mask.close();
				}
			}
			jQuery("#" + panelContentID).empty();
		}
		
		that.browsePanelIsVisible = function() {
			return (jQuery("#" + that.panelID + ":visible").length > 0) ? true : false;
		}

		// --------------------------------------------------------------------------------
		// Set up handler to trigger appearance of browse panel
		// --------------------------------------------------------------------------------
		jQuery(document).ready(function() {
			jQuery('#' + that.facetSelectID).change(function() { 
				that.showBrowsePanel(jQuery('#' + that.facetSelectID).val());
			}).click(function() { jQuery('#' + that.facetSelectID).attr('selectedIndex', 0); });
			
			// hide browse panel if click is outside of panel
			jQuery(document).click(function(event) {
				var p = jQuery(event.target).parents().map(function() { return this.id; }).get();
				if (!that.isChanging && that.browsePanelIsVisible() && (jQuery.inArray(that.panelID, p) == -1)) {
					that.hideBrowsePanel();
				}
			});
			
			// hide browse panel if escape key is clicked
			jQuery(document).keyup(function(event) {
				if ((event.keyCode == 27) && !that.isChanging && that.browsePanelIsVisible()) {
					that.hideBrowsePanel();
				}
			});
		});
		
		// --------------------------------------------------------------------------------
		
		return that;
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.bundlelisteditor.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
//
// Note: requires jQuery UI.Sortable
//
 
var caUI = caUI || {};

(function ($) {
	caUI.bundlelisteditor = function(options) {
		var that = jQuery.extend({
		
			availableListID: 'bundleDisplayEditorAvailableList',
			toDisplayListID: 'bundleDisplayEditorToDisplayList',
			
			displayItemClass: 'bundleDisplayEditorPlacement',					/* CSS class assigned to each item in the display list */
			displayListClass: 'bundleDisplayEditorPlacementList',				/* CSS class assigned to display list <div> */
		
			availableDisplayList: null,											/* array of bundles that may be displayed */
			initialDisplayList: null,												/* array of bundles to display on load */
			initialDisplayListOrder: null,										/* id's to list display list in; required because Google Chrome doesn't iterate over keys in an object in insertion order [doh] */	
			
			displayBundleListID: null,											/* ID of hidden form element to contain list of selected bundles */
			
			settingsIcon: null
		}, options);
		
		// ------------------------------------------------------------------------------------
		that.initDisplayList = function() {
			if (!that.initialDisplayList) { return; }
			var displayListText = '';
			var usedBundles = {};
			
			jQuery.each(that.initialDisplayListOrder, function(k, v) {
				displayListText += that._formatForDisplay(that.initialDisplayList[v]);
				usedBundles[v.bundle] = true;
			});
			
			jQuery('#' + that.toDisplayListID)
				.html(displayListText)
				.find("input:checked").change();	// trigger change handler to hide anything affected by hideOnSelect option for checkboxes
			
			displayListText = '';
			jQuery.each(that.availableDisplayList, function(k, v) {
				displayListText += that._formatForDisplay(v);
			});
			jQuery('#' + that.availableListID).html(displayListText);
			
			that._makeDisplayListsSortable();
			that._updateBundleListFormElement();
		}
		// ------------------------------------------------------------------------------------
		// sortable lists
		that._makeDisplayListsSortable = function() {
			jQuery("#" + that.availableListID).sortable({ opacity: 0.7, 
				revert: 0.2, 
				scroll: true , 
				connectWith: "#" + that.toDisplayListID,
				update: function(event, ui) {
					that._updateBundleListFormElement();
				}
			});
			
			jQuery("#" + that.toDisplayListID).sortable({ opacity: 0.7, 
				revert: 0.2, 
				scroll: true , 
				connectWith: "#" + that.availableListID,
				update: function(event, ui) {
					that._updateBundleListFormElement();
				}
			});
		}
		// ------------------------------------------------------------------------------------
		that._formatForDisplay = function(placement_info) {
			var label = placement_info.display;
			var bundle = placement_info.bundle;
			var placementID = placement_info.placement_id;
			var settingsForm = '';
            var output;
			
			var id = bundle;
			if (placementID) { 
				settingsForm =  that.initialDisplayList[placementID] ?  that.initialDisplayList[placementID].settingsForm : '';
				id = id + '_' + placementID; 
			} else { 
				settingsForm =  that.availableDisplayList[bundle] ?  that.availableDisplayList[bundle].settingsForm : '';
				id = id + '_0'; 
			}

			output =  "<div id='displayElement_" + id +"' class='" + that.displayItemClass + "'>";
			output += " <div class='bundleDisplayElementSettingsControl'><a href='#' onclick='jQuery(\".elementSettingsUI\").fadeOut(250); jQuery(\"#displayElementSettings_" +  id.replace(/\./g, "\\\\.") +"\").fadeIn(250); return false; '>" + that.settingsIcon + "</a></div>";
			output += "<div style='width:75%'>" + label + " </div>";
			output += "</div>\n";			
			output += "<div id='displayElementSettings_" + id +"' class='elementSettingsUI' style='display: none;'>"+ label + settingsForm + "<a href='#' onclick='jQuery(\"#displayElementSettings_" +  id.replace(/\./g, "\\\\.") +"\").fadeOut(250); return false; '>" + that.settingsIcon + "</a></div>";

			
			return output;
		}
		// ------------------------------------------------------------------------------------
		that._updateBundleListFormElement = function() {
			var bundle_list = [];
			jQuery.each(jQuery('#' + that.toDisplayListID + " div." + that.displayItemClass), function(k, v) { 
				bundle_list.push(jQuery(v).attr('id').replace('displayElement_', ''));
			});
			jQuery('#' + that.displayBundleListID).val(bundle_list.join(';'));
			
			jQuery('#' + that.availableListID + ' .' +  that.displayItemClass + ' .bundleDisplayElementSettingsControl').hide(0);
			jQuery('#' + that.availableListID + ' input').attr('disabled', true);
			
			jQuery('#' + that.toDisplayListID + ' .' +  that.displayItemClass + ' .bundleDisplayElementSettingsControl').show(0);
			jQuery('#' + that.toDisplayListID + ' input').attr('disabled', false);
		}
		// ------------------------------------------------------------------------------------
		
		that.initDisplayList();
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.bundleupdatemanager.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};
var caBundleUpdateManager = null;
(function ($) {
	caUI.initBundleUpdateManager = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			byBundle: {},
			byID: {},
			byPlacementID: {},
			inspectorID: 'widgets',
			
			key: null,
			id: null,
			url: null,
			screen: null
		}, options);
		
		// --------------------------------------------------------------------------------
		// Methods
		// --------------------------------------------------------------------------------
		that.registerBundle = function(id, bundle, placement_id) {
			that.byID[id] = that.byPlacementID[placement_id] = {
				id: id, bundle: bundle, placement_id: placement_id
			};
			if(!that.byBundle[bundle]) { that.byBundle[bundle] = []; }
			that.byBundle[bundle].push(that.byID[id]);
		}
		
		// --------------------------------------------------------------------------------
		that.registerBundles = function(list) {
			var l;
			for(l in list) {
				that.registerBundle(list[l].id, list[l].bundle, list[l].placement_id);
			}
			//console.log("list", list);
		}
		
		// --------------------------------------------------------------------------------
		that.reloadBundle = function(bundle) {
			var b = that.byBundle[bundle];
			if (b) {
				jQuery.each(b, function(k, v) {
					var loadURL = that.url + "/" + that.key + "/" + that.id + "/bundle/" + v.bundle + "/placement_id/" + v.placement_id;
					jQuery("#" + v.id).load(loadURL);
				});
			}
		}
		
		// --------------------------------------------------------------------------------
		that.reloadInspector = function() {
			var loadURL = that.url + "/" + that.key + "/" + that.id + "/bundle/__inspector__";
			jQuery("#" + that.inspectorID).load(loadURL);
		}
		
		// --------------------------------------------------------------------------------
		
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.bundlevisibilty.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */

var caUI = caUI || {};

(function ($) {
	caUI.initBundleVisibilityManager = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			bundles: [],
			cookieJar: jQuery.cookieJar('caBundleVisibility'),
			bundleStates: {},
			bundleDictionaryStates: {}
		}, options);

		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		/**
		 * Register a bundle
		 * @param id
		 * @param force
		 */
		that.registerBundle = function(id, force) {
			that.bundles.push(id);
			var bundleState;

			if(force) { // if override is set, use it
				bundleState = force;
			} else { // otherwise use cookiejar and default to open
				bundleState = (that.cookieJar.get(id) == 'closed') ? 'closed' : 'open';
			}

			that.bundleStates[id] = bundleState;
			that.bundleDictionaryStates[id] = (that.cookieJar.get(id + 'DictionaryEntry') == 'open') ? 'closed' : 'open';	// default to closed

			// actually open/close elements
			if (that.bundleStates[id] == 'closed') {
				that.close(id, true);
			} else {
				that.open(id, true);
			}
			if (that.bundleDictionaryStates[id] == 'closed') {
				that.closeDictionaryEntry(id, true);
			} else {
				that.openDictionaryEntry(id, true);
			}
		};

		// Set initial visibility of all registered bundles
		that.setAll = function() {
			jQuery.each(that.bundles, function(k, id) {
				var container = jQuery("#" + id);

				if(that.bundleStates[id] == 'closed') {
					container.hide();
				} else {
					container.show();
				}
			});
		};

		// Toggle bundle
		that.toggle = function(id) {
			if(that.bundleStates[id] == 'closed') {
				that.open(id);
			} else {
				that.close(id);
			}
			return false;
		};

		// Open bundle
		that.open = function(id, dontAnimate) {
			if (id === undefined) {
				jQuery.each(that.bundles, function(k, id) {
					that.open(id);
				});
			} else {
				var preview_id = id.replace(/[0-9]+\_rel/g, '');
				jQuery("#" + id).slideDown(dontAnimate ? 0 : 250);
				jQuery("#" + preview_id + '_BundleContentPreview').hide();

				if (jQuery("#" + id + 'DictionaryEntry').length && (that.bundleDictionaryStates[id] == 'open')) {
					jQuery("#" + id + 'DictionaryEntry').slideDown(dontAnimate ? 0 : 250);
				}

				that.bundleStates[id] = 'open';
				that.cookieJar.set(id, 'open');

				if (dontAnimate) {
					jQuery("#" + id + "VisToggleButton").rotate({ angle: 180 });
				} else {
					jQuery("#" + id + "VisToggleButton").rotate({ duration:500, angle: 0, animateTo: 180 });
				}
			}
			return false;
		};

		// Close bundle
		that.close = function(id, dontAnimate) {
			if (id === undefined) {
				jQuery.each(that.bundles, function(k, id) {
					that.close(id);
				});
			} else {
				var preview_id = id.replace(/[0-9]+\_rel/g, '');
				jQuery("#" + id).slideUp(dontAnimate ? 0 : 250);
				jQuery("#" + preview_id + '_BundleContentPreview').show();

				if (jQuery("#" + id + 'DictionaryEntry').length && (that.bundleDictionaryStates[id] == 'open')) {
					jQuery("#" + id + 'DictionaryEntry').slideUp(dontAnimate ? 0 : 250);
				}

				that.bundleStates[id] = 'closed';
				that.cookieJar.set(id, 'closed');

				if (dontAnimate) {
					jQuery("#" + id + "VisToggleButton").rotate({ angle: 0 });
				} else {
					jQuery("#" + id + "VisToggleButton").rotate({ duration:500, angle: 180, animateTo: 0 });
				}
			}
			return false;
		};

		// Toggle dictionary entry
		that.toggleDictionaryEntry = function(id) {
			if(that.bundleDictionaryStates[id] == 'closed') {
				that.openDictionaryEntry(id);
			} else {
				that.closeDictionaryEntry(id);
			}
			return false;
		};

		// Open dictionary entry
		that.openDictionaryEntry = function(id, dontAnimate) {
			if (id === undefined) {
				jQuery.each(that.bundles, function(k, id) {
					that.openDictionaryEntry(id);
				});
			} else {
				if (!jQuery("#" + id + 'DictionaryEntry').length) { return false; }
				jQuery("#" + id + 'DictionaryEntry').slideDown(dontAnimate ? 0 : 250);
				that.bundleDictionaryStates[id] = 'open';
				that.cookieJar.set(id + 'DictionaryEntry', 'open');

				if (that.bundleStates[id] == 'closed') {
					that.open(id);
				}

				if (dontAnimate) {
					jQuery("#" + id + "MetadataDictionaryToggleButton").css("opacity", 1.0);
				} else {
					jQuery("#" + id + "MetadataDictionaryToggleButton").animate({ duration:500, opacity: 1.0, animateTo: 0.4 });
				}
			}

			return false;
		};

		// Close dictionary entry
		that.closeDictionaryEntry = function(id, dontAnimate) {
			if (id === undefined) {
				jQuery.each(that.bundles, function(k, id) {
					that.closeDictionaryEntry(id);
				});
			} else {
				if (!jQuery("#" + id + 'DictionaryEntry').length) { return false; }
				jQuery("#" + id + 'DictionaryEntry').slideUp(dontAnimate ? 0 : 250);
				that.bundleDictionaryStates[id] = 'closed';
				that.cookieJar.set(id + 'DictionaryEntry', 'closed');

				if (dontAnimate) {
					jQuery("#" + id + "MetadataDictionaryToggleButton").css("opacity", 0.4);
				} else {
					jQuery("#" + id + "MetadataDictionaryToggleButton").animate({ duration:500, opacity: 0.4, animateTo: 1.0 });
				}
			}
			return false;
		};

		// --------------------------------------------------------------------------------

		return that;
	};

	caBundleVisibilityManager = caUI.initBundleVisibilityManager();
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.checklistbundle.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2015 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initChecklistBundle = function(container, options) {
		var that = jQuery.extend({
			container: container,
			templateValues: [],
			initialValues: {},
			errors: {},
			itemID: '',
			fieldNamePrefix: '',
			templateClassName: 'caItemTemplate',
			itemListClassName: 'caItemList',
			localeClassName: 'labelLocale',
			counter: 0,
			minRepeats: 0,
			maxRepeats: 65535,
			defaultValues: {},
			readonly: 0,
			bundlePreview: ''
		}, options);
		
		that.showUnsavedChangesWarning = function(b) {
			if(typeof caUI.utils.showUnsavedChangesWarning === 'function') {
				if (b === undefined) { b = true; }
				caUI.utils.showUnsavedChangesWarning(b);
			}
		}
		
		that.setupBundle = function(id, initialValues, dontUpdateBundleFormState) {
			// prepare template values
			var templateValues = {};
			
			templateValues.n = id;
			
			// print out any errors
			var errStrs = [];
			if (this.errors && this.errors[id]) {
				var i;
				for (i=0; i < this.errors[id].length; i++) {
					errStrs.push(this.errors[id][i].errorDescription);
				}
			}
			
			templateValues.error = errStrs.join('<br/>');
			templateValues.fieldNamePrefix = this.fieldNamePrefix; // always pass field name prefix to template
			
			// Set default value for new items
			if (!id) {
				jQuery.each(this.defaultValues, function(k, v) {
					if (v && !initialValues[k]) { initialValues[k] = v; }
				});
			}
			
			// replace values in template
			var jElement = jQuery(this.container + ' textarea.' + this.templateClassName).template(templateValues); 
			jQuery(this.container + " ." + this.itemListClassName).append(jElement);

			var that = this;	// for closures
						
			// set up add/delete triggers on check/uncheck of boxes
			jQuery(container + ' input[type=checkbox]').click(function(e) {
				var boundsViolation = !that.checkMaxMin();
				
				if (boundsViolation) {
					jQuery(this).prop('checked', !jQuery(this).prop('checked'));
				} else {
					that.showUnsavedChangesWarning(true);
					if (jQuery(this).prop('checked')) {
						jQuery(jQuery(this).attr('id') + "_delete").remove();
					} else {
						that.deleteValue(jQuery(this).attr('id'));
					}
				}
				
			});
			
			jQuery(container + ' input[type=checkbox]').each(function(i, input) {
				jQuery(input).attr('id', that.fieldNamePrefix + that.templateValues[0] + '_new_' + i);
				jQuery(input).attr('name', that.fieldNamePrefix + that.templateValues[0] + '_new_' + i);
			});
			
			// check current values
			jQuery.each(initialValues, function(i, v) {
				// If they are current rename them to be active values (eg. as if they were separate generic bundle values)
				jQuery(that.container + " input[value=" + (v[that.templateValues[0]]) + "]").prop('checked', true).attr('id', that.fieldNamePrefix + (that.templateValues[0]) + "_" + i).attr('name', that.fieldNamePrefix + (that.templateValues[0]) + "_" + i);
			});
			
			if (this.readonly) {
				jQuery(this.container + " input").prop("disabled", true);
				jQuery(this.container + " select").prop("disabled", true);
			}

			// Add bundle preview value text
			if(this.bundlePreview && (this.bundlePreview.length > 0)) {
				jQuery('#' + this.fieldNamePrefix + 'BundleContentPreview').text(this.bundlePreview);
			}
		}
		
		that.deleteValue = function(id) {
			// Don't bother marking new values as deleted since the absence of a checkbox will prevent them from being submitted
			if (id.indexOf('_new_') == -1) {
				var re = new RegExp("([A-Za-z0-9_\-]+)_([0-9]+)_([0-9]+)_([0-9]+)", "g");
				var res;
				
				if (res = re.exec(id)) {		// is three number checklist elements (attribute_id/attribute_value_id/repeating index #)
					// We *do* have to mark existing values as deleted however, otherwise the attributes will not be removed server-side
					jQuery(this.container).append("<input type='hidden' name='" + res[1] + '_' + res[2] + '_' + res[4] + "_delete' value='1'/>");
				} else {
					re = new RegExp("([A-Za-z0-9_\-]+)_([0-9]+)", "g");
				
					if (res = re.exec(id)) {	// is one-part # (value)
						jQuery(this.container).append("<input type='hidden' name='" + res[1] + '_' + res[2] + "_delete' value='1'/>");
					}
				}
			}
			
			return this;
		};
		
		that.checkMaxMin = function() {
			var numChecked = jQuery(that.container + ' input:checked').length;
			if ((numChecked < that.minRepeats) || (numChecked > that.maxRepeats)) {
				return false;
			}
			return true;
		};
		
		// create empty form
		that.setupBundle('checklist', that.initialValues, true);
		
		return that;
	};
	
	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.dashboard.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initDashboard = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			reorderURL: null,
			
			dashboardClass: 'dashboard',
			landingClass: 'dashboardLanding',
			columnClass: 'column',
			widgetClass: 'portlet',
			widgetRemoveClass: 'dashboardRemoveWidget',
			widgetSettingsClass: 'dashboardWidgetSettingsButton',
			
			addID: 'dashboardAddWidget',
			editID: 'dashboardEditWidget',
			doneEditingID: 'dashboardDoneEditingButton',
			clearID: 'dashboardClearButton',
			welcomeMessageID: 'dashboard_welcome_message',
			editMessageID: 'dashboard_edit_message'
		}, options);
		
		jQuery(document).ready(function() {
			jQuery("." + that.columnClass).sortable({
				connectWith: '.' + that.columnClass,
				stop: function(event, ui) {
					jQuery.getJSON(
						that.reorderURL,
						{
							'sort_column1': jQuery("#dashboard_column_1").sortable('toArray').join(';'), 
							'sort_column2': jQuery("#dashboard_column_2").sortable('toArray').join(';')
						} , 
						function(data) { 
							if(data.status != 'ok') { 
								alert('Error: ' + data.errors.join(';')); 
							}; 
							that.refreshDashboard(true);
						}
					);
				}
			});
	
			jQuery("." + that.columnClass).disableSelection();
			jQuery("." + that.landingClass).disableSelection();
			
			var edit = 0;
			var cookieJar = jQuery.cookieJar('caCookieJar');
			edit = cookieJar.get('caDashboardEdit');
			if (edit == null) { edit = 0; }
			edit = (edit == 0) ? 0 : 1;
			
			that.editDashboard(edit, true);
		});
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		//
		// Refresh dashboard display after a change
		that.refreshDashboard = function(noTransitions) {
			var cookieJar = jQuery.cookieJar('caCookieJar');
		
			// Activate/deactivate "landing" areas if a column is empty
			var allColumnsAreNotEmpty = false;
			jQuery.each(jQuery('.' + that.columnClass), function (index, val) {
				if (parseInt(cookieJar.get('caDashboardEdit')) == 1) {
					jQuery('#'  + val.id + ' .' + that.landingClass).css('display', (jQuery('#'  + val.id + " .portlet").length == 0) ? 'block' : 'none').css('height', '100px');
				} else {
					jQuery('#'  + val.id + ' .' + that.landingClass).css('display', 'none');
				}
				if (jQuery('#'  + val.id + " .portlet").length > 0) { allColumnsAreNotEmpty = true; }
			});
			
			// Show dashboard welcome text if dashboard is empty, hide it if widgets have been added
			
			if (parseInt(cookieJar.get('caDashboardEdit')) == 1) {
				jQuery('#' + that.editMessageID).slideDown(noTransitions ? 0 : 250);
				jQuery('#' + that.welcomeMessageID).hide();
			} else {
				jQuery('#' + that.editMessageID).slideUp(noTransitions ? 0 : 250);
				if (allColumnsAreNotEmpty) {
					jQuery('#' + that.welcomeMessageID).hide();
				} else {
					jQuery('#' + that.welcomeMessageID).show();
				}
				
			}
			
			// Rename widgets with tmp id's in preparation for renumbering 
			// (if we don't rename them we could end up with two widgets with the same id at some point)
			jQuery.each(jQuery('.' + that.columnClass + ' div.portlet:not(.' + that.landingClass + ')'), function (index, val) {
				if (!val.id) { return; }
				jQuery('#'  + val.id).attr('id', val.id + '_tmp');
			});
			
			// Renumber widgets to reflect their true positions; if we are refreshing after a drag-and-drop operation
			// the current id's will not reflect their current location
			var counters = [];
			jQuery.each(jQuery('.' + that.columnClass + ' div.portlet:not(.' + that.landingClass + ')'), function (index, val) {
				if (!val.id) { return; }
				
				var widgetID = jQuery('#'  + val.id).attr('id');
				var tmp = val.id.split('_');
				if (!(col = parseInt(tmp[1]))) { col = 1; }
				if (!(pos = parseInt(tmp[2]))) { pos = 0; }
				
				tmp = jQuery('#' + val.id).parent().attr('id').split('_');
				var currentCol = parseInt(tmp[2]);
				if (!counters[currentCol]) { counters[currentCol] = 0; }
				
				jQuery('#'  + val.id).attr('id', tmp[0] + '_' + currentCol + '_' + counters[currentCol]);
				jQuery('#'  + val.id).data('col', currentCol);
				jQuery('#'  + val.id).data('pos', counters[currentCol]);
				
				counters[currentCol]++;
			});

		}
		
		// --------------------------------------------------------------------------------
		that.editDashboard = function(edit, noTransitions) {
			if (edit === null) { edit = 0; }
			edit = parseInt(edit);
			
			var cookieJar = jQuery.cookieJar('caCookieJar');
			if (edit != 0) {
				jQuery('#' + that.addID).show(0);
				jQuery('#' + that.editID).hide(0);
				jQuery('#' + that.doneEditingID).show(0);
				jQuery('#' + that.clearID).show(0);
				
				jQuery("." + that.columnClass).sortable("enable");
				jQuery('.' + that.widgetRemoveClass).show(0);
				jQuery('.' + that.widgetSettingsClass).show(0);
				
				cookieJar.set('caDashboardEdit', 1);
			} else {
				jQuery('#' + that.addID).hide(0);
				jQuery('#' + that.editID).show(0);
				jQuery('#' + that.doneEditingID).hide(0);
				jQuery('#' + that.clearID).hide(0);
				
				jQuery("." + that.columnClass).sortable("disable");
				jQuery('.' + that.widgetRemoveClass).hide(0);
				jQuery('.' + that.widgetSettingsClass).hide(0);
				
				cookieJar.set('caDashboardEdit', 0);
			}
			
			that.refreshDashboard(noTransitions);
		}
		// --------------------------------------------------------------------------------
		
		return that;
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.directorybrowser.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2013-2015 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initDirectoryBrowser = function(container, options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			container: container,
			
			levelDataUrl: '',
			initDataUrl: '',
			
			name: options.name ? options.name : container.replace(/[^A-Za-z0-9]+/, ''),
			levelWidth: 230,
			browserWidth: 500,
			
			readOnly: false,	// if set to true, no navigation is allowed
			
			displayFiles: false,
			allowFileSelection: false,
			
			initItemID: null,		// if set, hierarchy opens with specified item_id selected
			defaultItemID: null,	// set to default value to show when no initItemID is set; note that initItemID is an ID to open with *and select.* defaultItemID merely specifies an item to open with, but not select.
			
			className: 'directoryBrowserLevel',
			classNameSelected: 'directoryBrowserLevelSelected',
			classNameContainer: 'directoryBrowserContainer',
			
			currentSelectionDisplayID: '',
			currentSelectionDisplayFormat: '%1',
			currentSelectionIDID: '',
			allowSelection: true,
			
			selectOnLoad: false,
			onSelection: null,		/* function to call whenever an item is selected; passed item_id, parent_id, name, formatted display string and type ("FILE" or "DIR") */
			
			displayCurrentSelectionOnLoad: true,
			
			allowDragAndDropUpload: true,
			dragAndDropUploadUrl: null,
			uploadProgressID: null,
			uploadProgressBarID: null,
			uploadProgressStatusID: null,
			uploadProgressMessage: "%1",
			
			indicatorUrl: '',
			openDirectoryIcon: '',
			folderIcon: '',
			fileIcon: '',
			
			hasChildrenIndicator: 'children',	/* name of key in data to use to determine if an item has children */
			
			levelLists: [],
			selectedItemIDs: [],
			
			_numOpenLoads: 0,					// number of AJAX loads pending
			_openLoadsForLevel:[],				// counts of loads pending per-level
			_pageLoadsForLevel:[],				// log of which pages per-level have been loaded already
			_queuedLoadsForLevel: [],			// parameters for pending loads per-level
			
			maxItemsPerHierarchyLevelPage: 100	// maximum number of items to load at one time into a level
		}, options);
		
		if (!that.levelDataUrl) { 
			alert("No level data url specified for " + that.name + "!");
			return null;
		}
		
		// create scrolling container
		jQuery('#' + that.container).append("<div class='" + that.classNameContainer + "' id='" + that.container + "_scrolling_container'></div>");
		
		// --------------------------------------------------------------------------------
		// BEGIN method definitions
		// --------------------------------------------------------------------------------
		// Set up initial state and all levels of hierarchy. The item_id parameter will be used to determine the root
		// of the hierarchy if set. 
		//
		// @param int item_id The database id of the item to be used as the root of the hierarchy. 
		//
		that.setUpHierarchy = function(item_id) {
			if (!item_id) { that.setUpHierarchyLevel(0, '/', 1, null, true); return; }
			that.levelLists = [];
			that.selectedItemIDs = [];
			jQuery.getJSON(that.initDataUrl, { id: item_id}, function(data) {
				if (data.length) {
					that.selectedItemIDs = data.join(';').split(';');
					data.unshift("/");
				} else {
					data = ["/"];
				}
				var l = 0;
				jQuery.each(data, function(i, id) {
					that.setUpHierarchyLevel(i, id, 1, item_id);
					l++;
				});
				that.loadHierarchyLevelData();
				
				jQuery('#' + that.container + '_scrolling_container').animate({scrollLeft: l * that.levelWidth}, 500);
			});
		}
		// --------------------------------------------------------------------------------
		// Clears hierarchy level display
		//
		// @param int level The level to be cleared
		//
		that.clearLevelsStartingAt = function(level) {
			var l = level;
			
			// remove all level divs above the current one
			while(jQuery('#directoryBrowser_' + that.name + '_' + l).length > 0) {
				jQuery('#directoryBrowser_' + that.name + '_' + l).remove();
				that.levelLists[l] = undefined;
				l++;
			}
			
		}
		// --------------------------------------------------------------------------------
		// Initialize a hierarchy level and load data into it for display.
		//
		// @param int level The level of the hierarchy to initialize.
		// @param int item_id The database id of the item for which child items will be loaded into the hierarchy level. This is the "parent" of the level, in other words.
		// @param bool is_init Flag indicating if this is the initial load of the hierarchy browser.
		// @param int selected_item_id The database id of the selected hierarchy item. This is the lowest selected item in the hierarchy; selection of its ancestors is implicit.
		// @param bool fetchData Flag indicating if queue should be processed immediately. Default is false. The queue can be subsequently processed by calling loadHierarchyLevelData().
		//
		that.setUpHierarchyLevel = function (level, item_id, is_init, selected_item_id, fetchData) {
			that._numOpenLoads++;
			if (that._openLoadsForLevel[level]) { return null; }	// load is already open for this level
			that._openLoadsForLevel[level] = true;
			
			// Remove any levels *after* the one we're populating
			that.clearLevelsStartingAt(level);
			
			if (!item_id) { item_id = '/'; }
			if (!is_init) { is_init = 0; }

			// Create div to enclose new level
			var newLevelDivID = 'directoryBrowser_' + that.name + '_' + level;
			var newLevelListID = 'directoryBrowser_' + that.name + '_list_' + level;
			
			if(!is_init) { jQuery('#' + newLevelDivID).remove(); }
			
			var newLevelDiv = "<div class='" + that.className + "' style='left:" + (that.levelWidth * level) + "px;' id='" + newLevelDivID + "'></div>";
			
			// Create new <ul> to display list of items
			var newLevelList = "<ul class='" + that.className + "' id='" + newLevelListID + "'></ul>";
			
			jQuery('#' + that.container + '_scrolling_container').append(newLevelDiv);
			jQuery('#' + newLevelDivID).data('level', level);
			jQuery('#' + newLevelDivID).data('parent_id', item_id);
			jQuery('#' + newLevelDivID).append(newLevelList);
			
			that.showIndicator(newLevelDivID);

			var l = jQuery('#' + newLevelDivID).data('level');
			that._pageLoadsForLevel[l] = [true];
			that.queueHierarchyLevelDataLoad(level, item_id, is_init, newLevelDivID, newLevelListID, selected_item_id, 0, fetchData);
			
			that.levelLists[level] = newLevelDivID;
			
			var cpath = that.selectedItemIDs.slice(0,level);
			
			if (that.allowDragAndDropUpload && that.dragAndDropUploadUrl) {
				jQuery('#' + newLevelDivID).fileupload({
					dataType: 'json',
					url: that.dragAndDropUploadUrl + "?path=" + encodeURIComponent("/" + cpath.join("/")),
					dropZone: jQuery('#' + newLevelDivID),
					singleFileUploads: false,
					done: function (e, data) {
						if (data.result.error) {
							if (that.uploadProgressStatusID) {
								jQuery("#" + that.uploadProgressID).show(250);
								jQuery("#" + that.uploadProgressStatusID).html(data.result.error);
								setTimeout(function() {
									jQuery("#" + that.uploadProgressID).hide(250);
								}, 3000);
							}
						} else {
							var msg = [];
							
							if (data.result.uploadMessage) {
								msg.push(data.result.uploadMessage);
							}
							if (data.result.skippedMessage) {
								msg.push(data.result.skippedMessage);
							}
							jQuery("#" + that.uploadProgressStatusID).html(msg.join('; '));
							setTimeout(function() {
									jQuery("#" + that.uploadProgressID).hide(250);
								}, 3000);
							that.setUpHierarchyLevel(level, item_id, is_init, selected_item_id, true);	// reload file list
						}
					},
					progressall: function (e, data) {
						if (that.uploadProgressID) {
							if (jQuery("#" + that.uploadProgressID).css('display') == 'none') {
								jQuery("#" + that.uploadProgressID).show(250);
							}
							var progress = parseInt(data.loaded / data.total * 100, 10);
							if (that.uploadProgressBarID) {
								jQuery('#' + that.uploadProgressBarID).progressbar("value", progress);
							}
							if (that.uploadProgressStatusID) {
								var msg = that.uploadProgressMessage;
								jQuery("#" + that.uploadProgressStatusID).html(msg.replace("%1", that.formatFilesize(data.loaded) + " (" + progress + "%)"));
							}
						}
					}
				});
			}
			
			return newLevelDiv;
		}
		// --------------------------------------------------------------------------------
		// Queues load of hierarchy data into a level. Unless the fetchData parameter is set to true, data is not actually loaded until
		// loadHierarchyLevelData() is called. This enables you to bundle data loads for several levels into a single AJAX request, improving
		// performance.
		//
		// @param int level The level into which data will be loaded.
		// @param int item_id The database id of the item for which child items will be loaded into the hierarchy level. This is the "parent" of the level, in other words.
		// @param bool is_init Flag indicating if this is the initial load of the hierarchy browser.
		// @param string newLevelDivID The ID of the <div> containing the level
		// @param string newLevelListID The ID of the <ul> containing the level
		// @param int selected_item_id  The database id of the selected hierarchy item. This is the lowest selected item in the hierarchy; selection of its ancestors is implicit.
		// @param int start The offset into the level data to start loading at. For a given level only up to a maximum of {maxItemsPerHierarchyLevelPage} items are fetched per AJAX request. The start parameter is used to control from which item the returned list starts.
		// @param bool fetchData Flag indicating if queue should be processed immediately. Default is false. The queue can be subsequently processed by calling loadHierarchyLevelData().
		//
		that.queueHierarchyLevelDataLoad = function(level, item_id, is_init, newLevelDivID, newLevelListID, selected_item_id, start, fetchData) {
			if(!that._queuedLoadsForLevel[level]) { that._queuedLoadsForLevel[level] = []; }
			that._queuedLoadsForLevel[level].push({
				item_id: item_id, is_init: is_init, newLevelDivID: newLevelDivID, newLevelListID: newLevelListID, selected_item_id: selected_item_id, start: start
			});
			
			if (fetchData) { that.loadHierarchyLevelData(); }
		}
		// --------------------------------------------------------------------------------
		// Load "page" of hierarchy level via AJAX
		//
		that.loadHierarchyLevelData = function() {
			var id_list = [];
			var itemIDsToLevelInfo = {};
			
			var is_init = false;
			var path = [];
			for(var l = 0; l < that._queuedLoadsForLevel.length; l++) {
				for(var i = 0; i < that._queuedLoadsForLevel[l].length; i++) {
					var p = that.selectedItemIDs.slice(0, (l > 0) ? l-1 : 0).join("/");
					
					var item_id = that._queuedLoadsForLevel[l][i]['item_id'];
					id_list.push(p + '/' + ((item_id != '/') ? item_id : '') +':'+that._queuedLoadsForLevel[l][i]['start']);
					
					itemIDsToLevelInfo[l] = {
						level: l,
						newLevelDivID: that._queuedLoadsForLevel[l][i]['newLevelDivID'],
						newLevelListID: that._queuedLoadsForLevel[l][i]['newLevelListID'],
						selected_item_id: that._queuedLoadsForLevel[l][i]['selected_item_id'],
						is_init: that._queuedLoadsForLevel[l][i]['is_init']
					}
					if (that._queuedLoadsForLevel[l][i]['is_init']) { is_init = true; }
					that._queuedLoadsForLevel[l].splice(i,1);
				}
			}
			if (!id_list.length) { return; }
			var start = 0;
			
			var params = { id: id_list.join(';'), init: is_init ? 1 : '', start: start * that.maxItemsPerHierarchyLevelPage, max: that.maxItemsPerHierarchyLevelPage };
			
			jQuery.getJSON(that.levelDataUrl, params, function(dataForLevels) {
				jQuery.each(dataForLevels, function(key, data) {
					var b = key.split("|");
					var tmp = b[0].split(":");
					var item_id = tmp[0];
					var start = tmp[1] ? tmp[1] : 0;
					var level = b[1] ? b[1] : 0;
					
					if (!itemIDsToLevelInfo[level]) { return; }
					var is_init = itemIDsToLevelInfo[level]['is_init'];
					var newLevelDivID = itemIDsToLevelInfo[level]['newLevelDivID'];
					var newLevelListID = itemIDsToLevelInfo[level]['newLevelListID'];
					var selected_item_id = itemIDsToLevelInfo[level]['selected_item_id'];
					
					var foundSelected = false;
					jQuery('#' + newLevelDivID).data('itemCount', data['_itemCount']);
					jQuery.each(data, function(i, item) {
						if (!item) { return; }
						if (item['item_id']) {
							
							if (that.selectedItemIDs[level] == item['item_id']) {
								foundSelected = true;
								if (level >= (that.selectedItemIDs.length - 1)) {
									that.selectItem(level, that.selectedItemIDs[level], jQuery('#' + newLevelDivID).data('parent_id'), item[that.hasChildrenIndicator], item);
								}
							}
						
							var icon = '';
							var countText = '';
							var childCount = 0;
							switch(item.type) {
								case 'FILE':
									if (!that.displayFiles) { return; }
									icon = that.fileIcon;
									break;
								case 'DIR':
									icon = that.folderIcon;
									childCount = ((that.displayFiles) ? item.children : item.subdirectories);
									countText = ' (' + childCount + ')';
									break;
							}
							
							var moreButton = '';
							var item_id_for_css = item['item_id'].replace(/[^A-Za-z0-9_\-]+/g, '_');
							if ((that.openDirectoryIcon) && (item.type == 'DIR')) {
								if (childCount > 0) {
									moreButton = "<div style='float: right;'><a href='#' id='directoryBrowser_" + that.name + '_level_' + level + '_item_' + item_id_for_css + "_open' >" + that.openDirectoryIcon + "</a></div>";
								} else {
									moreButton = "<div style='float: right;'><a href='#' id='directoryBrowser_" + that.name + '_level_' + level + '_item_' + item_id_for_css + "_open'  style='opacity: 0.3;'>" + that.openDirectoryIcon + "</a></div>";
								}
							}
							
							
							if ((item.type == 'FILE') && (!that.allowFileSelection)) {
								jQuery('#' + newLevelListID).append(
									"<li class='" + that.className + "'><a href='#' id='directoryBrowser_" + that.name + '_level_' + level + '_item_' + item_id_for_css + "' class='" + that.className + "' title='" + item.fullname + "' style='opacity: 0.5;'>" + icon +  item.name + "</a></li>"
								);
							} else {
								jQuery('#' + newLevelListID).append(
									"<li class='" + that.className + "'>" + moreButton +"<a href='#' id='directoryBrowser_" + that.name + '_level_' + level + '_item_' + item_id_for_css + "' class='" + that.className + "' title='" + item.fullname + "'>" + icon +  item.name + countText + "</a></li>"
								);
							}
							
							jQuery('#' + newLevelListID + " li:last a").data('item_id', item['item_id']);
							
							if (that.hasChildrenIndicator) {
								jQuery('#' + newLevelListID + " li:last a").data('has_children', item[that.hasChildrenIndicator] ? true : false);
							}
							
							// select
							if ((item.type == 'DIR') || ((item.type == 'FILE') && (that.allowFileSelection))) {
								jQuery('#' + newLevelListID + " li:last a:last").click(function() { 						
									var l = jQuery(this).parent().parent().parent().data('level');
									var item_id = jQuery(this).data('item_id');
									var has_children = jQuery(this).data('has_children');
									that.clearLevelsStartingAt(l+1);
									that.selectItem(l, item_id, jQuery('#' + newLevelDivID).data('parent_id'), has_children, item);
									
									if (has_children) {
										// scroll to new level
										that.setUpHierarchyLevel(l + 1, item_id, 0, undefined, true);
										jQuery('#' + that.container + '_scrolling_container').animate({scrollLeft: l * that.levelWidth}, 500);
									}
									return false;
								});
							}
							
							if (item.type == 'DIR') {
								// open directory navigation
								if (!that.readOnly) { // && (item.children > 0)) {
									jQuery('#' + newLevelListID + " li:last a:first").click(function() { 								
										var l = jQuery(this).parent().parent().parent().parent().data('level');
										var item_id = jQuery(this).data('item_id');
										var has_children = jQuery(this).data('has_children');
										that.selectItem(l, item_id, jQuery('#' + newLevelDivID).data('parent_id'), has_children, item);
									
										// scroll to new level
										that.setUpHierarchyLevel(l + 1, item_id, 0, undefined, true);
										jQuery('#' + that.container + '_scrolling_container').animate({scrollLeft: l * that.levelWidth}, 500);
									
										return false;
									});
								} else {
									jQuery('#' + newLevelListID + " li:last a:first").click(function() { 
										return false;
									});
								}
							}
	
							// Pass item_id to caller if required
							if (is_init && that.selectOnLoad && that.onSelection && is_init && item['item_id'] == selected_item_id) {
								var formattedDisplayString = that.currentSelectionDisplayFormat.replace('%1', item.name);
								that.onSelection(item['item_id'], that.selectedItemIDs.join("/"), item.name, item.type);
							}
						} else {
							if (item.parent_id && (that.selectedItemIDs.length == 0)) { that.selectedItemIDs[0] = item.parent_id; }
						}
					});
					
					var dontDoSelectAndScroll = false;
					if (!foundSelected && that.selectedItemIDs[level]) {
						var p = jQuery('#' + newLevelDivID).data("page");
						if (!p || (p < 0)) { p = 0; }
						p++;
						jQuery('#' + newLevelDivID).data("page", p);
						if (jQuery('#' + newLevelDivID).data('itemCount') > (p * that.maxItemsPerHierarchyLevelPage)) { 
							if (!that._pageLoadsForLevel[level] || !that._pageLoadsForLevel[level][p]) {		// is page loaded?
								if (!that._pageLoadsForLevel[level]) { that._pageLoadsForLevel[level] = []; }
								that._pageLoadsForLevel[level][p] = true;		
						
								that.queueHierarchyLevelDataLoad(level, item_id, is_init, newLevelDivID, newLevelListID, selected_item_id, p * that.maxItemsPerHierarchyLevelPage, true);
							
								dontDoSelectAndScroll = true;	// we're still trying to find selected item so don't try to select it
							}
						}
					} else {
						// Treat sequential page load as init so selected item is highlighted
						is_init = true;
					}
					
					if (!is_init) {
						that.selectedItemIDs[level-1] = item_id;
						var item_id_for_css = item_id.replace(/[^A-Za-z0-9_\-]+/g, '_');
						jQuery('#directoryBrowser_' + that.name + '_' + (level - 1) + ' a').removeClass(that.classNameSelected).addClass(that.className);
						jQuery('#directoryBrowser_' + that.name + '_level_' + (level - 1) + '_item_' + item_id_for_css).addClass(that.classNameSelected);
					} else {
						if ((that.selectedItemIDs[level] !== undefined) && !dontDoSelectAndScroll) {
							var item_id_for_css = that.selectedItemIDs[level].replace(/[^A-Za-z0-9_\-]+/g, '_');
							jQuery('#directoryBrowser_' + that.name + '_level_' + (level) + '_item_' + item_id_for_css).addClass(that.classNameSelected);
							jQuery('#directoryBrowser_' + that.name + '_' + level).scrollTo('#directoryBrowser_' + that.name + '_level_' + level + '_item_' + item_id_for_css);
						}
					}
	
					that._numOpenLoads--;
					that._openLoadsForLevel[level] = false;
					
					// Handle loading of long hierarchy levels via ajax on scroll
					var selected_item_id_cl = selected_item_id;
					jQuery('#' + newLevelDivID).scroll(function () { 
						var curPage = jQuery('#' + newLevelDivID).data("page");
						if (!curPage) { curPage = 0; }
					   if (jQuery('#' + newLevelDivID).scrollTop() >= ((curPage * jQuery('#' + newLevelDivID).height()) - 10)) {
						  // get page #
						  var p = Math.ceil(jQuery('#' + newLevelDivID).scrollTop()/jQuery('#' + newLevelDivID).height());
						  if (p < 0) { p = 0; }
						  if (jQuery('#' + newLevelDivID).data('itemCount') <= (p * that.maxItemsPerHierarchyLevelPage)) { 
							return;
						  }
						  
						  jQuery('#' + newLevelDivID).data("page", p);
						  var l = jQuery('#' + newLevelDivID).data('level');
						  if (!that._pageLoadsForLevel[l] || !that._pageLoadsForLevel[l][p]) {		// is page loaded?
							if (!that._pageLoadsForLevel[l]) { that._pageLoadsForLevel[l] = []; }
							that._pageLoadsForLevel[l][p] = true;		
								 	
							that.queueHierarchyLevelDataLoad(l, item_id, false, newLevelDivID, newLevelListID, selected_item_id_cl, p * that.maxItemsPerHierarchyLevelPage, true);
						  }
					   }
					});
					
					that.hideIndicator(newLevelDivID);
					
					// try to load any outstanding level pages
					that.loadHierarchyLevelData();
				});
			});
		}
		// --------------------------------------------------------------------------------
		// Records user selection of an item
		//
		// @param int level The level where the selected item resides
		// @param int item_id The database id of the selected item
		// @param int parent_id The database id of the parent of the selected item
		// @param bool has_children Flag indicating if the selected item has child items or not
		// @param Object item A hash containing details, including the name, of the selected item
		//
		that.selectItem = function(level, item_id, parent_id, has_children, item) {
			if (!that.allowSelection) return false;
			
			// set current selection display
			var formattedDisplayString = that.currentSelectionDisplayFormat.replace('%1', item.name);
			
			if (that.currentSelectionDisplayID) {
				jQuery('#' + that.currentSelectionDisplayID).html(formattedDisplayString);
			}
			
			if (that.currentSelectionIDID) {
				jQuery('#' + that.currentSelectionIDID).attr('value', item_id);
			}
			
			while(that.selectedItemIDs.length > level) {
				that.selectedItemIDs.pop();
			}
			that.selectedItemIDs.push(item_id);
			
			var item_id_for_css = item_id.replace(/[^A-Za-z0-9_\-]+/g, '_');
			jQuery('#directoryBrowser_' + that.name + '_' + level + ' a').removeClass(that.classNameSelected).addClass(that.className);
			jQuery('#directoryBrowser_' + that.name + '_level_' + level + '_item_' + item_id_for_css).addClass(that.classNameSelected);
		
			if (that.onSelection) {
				that.onSelection(item_id, that.selectedItemIDs.join("/"), item.name, item.type);
			}
		}
		// --------------------------------------------------------------------------------
		// Display spinning progress indicator in specified level <div> 
		//
		// @param string newLevelDivID The ID of the <div> containing the level
		//
		that.showIndicator = function(newLevelDivID) {
			if (!that.indicatorUrl) { return; }
			if (jQuery('#' + newLevelDivID + ' img._indicator').length > 0) {
				jQuery('#' + newLevelDivID + ' img._indicator').show();
				return;
			}
			var level = jQuery('#' + newLevelDivID).data('level');
			
			var indicator = document.createElement('img');
			indicator.src = that.indicatorUrl;
			indicator.className = '_indicator';
			indicator.style.position = 'absolute';
			indicator.style.left = '50%';
			indicator.style.top = '50%';
			jQuery('#' + newLevelDivID).append(indicator);
		}
		// --------------------------------------------------------------------------------
		// Convert file size in bytes to display format 
		//
		// @param string The file size in bytes
		//
		that.formatFilesize = function(filesize) {
			if (filesize >= 1073741824) {
				filesize = that.formatNumber(filesize / 1073741824, 2, '.', '') + ' Gb';
			} else { 
				if (filesize >= 1048576) {
					filesize = that.formatNumber(filesize / 1048576, 2, '.', '') + ' Mb';
				} else { 
					if (filesize >= 1024) {
						filesize = that.formatNumber(filesize / 1024, 0) + ' Kb';
					} else {
						filesize = that.formatNumber(filesize, 0) + ' bytes';
					};
				};
			};
			return filesize;
		};
		
		that.formatNumber = function formatNumber( number, decimals, dec_point, thousands_sep ) {
			// http://kevin.vanzonneveld.net
			// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
			// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
			// +     bugfix by: Michael White (http://crestidg.com)
			// +     bugfix by: Benjamin Lupton
			// +     bugfix by: Allan Jensen (http://www.winternet.no)
			// +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)    
			// *     example 1: number_format(1234.5678, 2, '.', '');
			// *     returns 1: 1234.57     
 
			var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
			var d = dec_point == undefined ? "," : dec_point;
			var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
			var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
 
			return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
		}
		// --------------------------------------------------------------------------------
		// Remove spinning progress indicator from specified level <div> 
		//
		// @param string newLevelDivID The ID of the <div> containing the level
		//
		that.hideIndicator = function(newLevelDivID) {
			jQuery('#' + newLevelDivID + ' img._indicator').hide();		// hide loading indicator
		}
		// --------------------------------------------------------------------------------
		// Returns database id (the primary key in the database, *NOT* the DOM ID) of currently selected item
		//
		that.getSelectedItemID = function() {
			return that.selectedItemIDs[that.selectedItemIDs.length - 1];
		}
		// --------------------------------------------------------------------------------
		// Returns the number of levels that are currently displayed
		//
		that.numLevels = function() {
			return that.levelLists.length;
		}
		// --------------------------------------------------------------------------------
		// END method definitions
		// --------------------------------------------------------------------------------
		//
		// Initialize before returning object
		that.setUpHierarchy(that.initItemID ? that.initItemID : that.defaultItemID);
		
		return that;
		// --------------------------------------------------------------------------------
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.displaytemplateparser.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * This source code is free and modifiable under the terms of
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */

var caUI = caUI || {};

(function ($) {
	caUI.initDisplayTemplateParser = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({

		}, options);


		that.unitTable = {
			// Length
			'"': "in", "”": "in", "in.": "in", "inch": "in", "inches": "in",
			"'": "ft", "’": "ft", "ft.": "ft", "foot": "ft", "feet": "ft",
			"m.": "m", "meter": "m", "meters": "m", "metre": "m", "metres": "m", "mt": "m",
			"cm.": "cm", "centimeter": "cm", "centimeters": "cm", "centimetre": "cm", "centimetres": "cm",
			"mm.": "mm", "millimeter": "mm", "millimeters": "mm", "millimetre": "mm", "millimetres": "mm",
			"k": "kilometer", "km": "kilometer", "kilometers": "kilometer", "kilometre": "kilometer", "kilometres": "kilometer",
			"pt": "point", "pt.": "point",
			"mile": "miles", "mi" : "miles",

			// Weight
			"lbs": "pounds", "lb": "pounds", "lb.": "pounds", "pound": "pounds",
			"kg": "kilograms", "kg.": "kilograms", "kilo": "kilograms", "kilos": "kilograms", "kilogram": "kilograms",
			"g": "grams", "g.": "grams", "gr": "grams", "gr.": "grams", "gram": "grams",
			"mg": "milligrams", "mg.": "milligrams", "milligram": "milligrams",
			"oz": "ounces", "oz.": "ounces", "ounce": "ounces",
			"tons": "ton", "tonne": "ton", "tonnes": "ton", "t": "ton", "t." : "ton"
		};
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.processDependentTemplate = function(template, values) {
			var t = template;

			// get tags from template
			var tagRegex = /\^([\/A-Za-z0-9]+\[[\@\[\]\=\'A-Za-z0-9\.\-\/]+|[A-Za-z0-9_\.:\/]+[%]{1}[^ \^\t\r\n\"\'<>\(\)\{\}\/]*|[A-Za-z0-9_\.~:\/]+)/g;
			var tagList = template.match(tagRegex);
			var unitRegex = /[\d\.\,]+(.*)$/;

			jQuery.each(tagList, function(i, tag) {
				var tagProc = tag.replace("^", "");
				if(tag.indexOf("~") === -1) {
					var selected = jQuery('select' + values[tagProc] + ' option:selected');
					if (selected.length) {
						t=t.replace(tag, selected.text());
					} else {
						t=t.replace(tag, jQuery(values[tagProc]).val());
					}
				} else {
					var tagBits = tag.split(/\~/);
					var tagRoot = tagBits[0].replace("^", "");
					var cmd = tagBits[1].split(/\:/);
					switch(cmd[0].toLowerCase()) {
						case 'units':
							var val = jQuery(values[tagRoot]).val();
							val = that.convertFractionalNumberToDecimal(val);

							var unitBits = val.match(unitRegex);
							if (!unitBits || unitBits.length < 2) {
								t = t.replace(tag, val);
								break;
							}
							var units = unitBits[1].trim();

							if (that.unitTable[units]) {
								val = val.replace(units, that.unitTable[units]);
							}

							try {
								var qty = new Qty(val);
								if(cmd[1] == units) { // do not round if unit is unchanged!
									t=t.replace(tag, qty.to(cmd[1]).toString());
								} else {
									t=t.replace(tag, qty.to(cmd[1]).toPrec(0.01).toString());
								}
							} catch(e) {
								// noop - replace tag with existing value
								t=t.replace(tag, val);
							}
							break;
					}
				}
			});

			// Process <ifdef> tags
			var $h = jQuery("<div>" + t + "</div>");
			jQuery.each(tagList, function(k, tag) {
				var tagBits = tag.split(/\~/);
				var tagRoot = tagBits[0].replace("^", "");
				var val = jQuery(values[tagRoot]).val();

				if(val && (val.length > 0)) {
					jQuery.each($h.find("ifdef[code=" + tagRoot + "]"), function(k, v) {
						jQuery(v).replaceWith(jQuery(v).html());
					});
				} else {
					$h.find("ifdef[code=" + tagRoot + "]").remove();
				}
			});
			return $h.html().trim();
		};
		// --------------------------------------------------------------------------------
		// helpers
		// --------------------------------------------------------------------------------
		that.convertFractionalNumberToDecimal = function(fractionalExpression, locale) {
			if(!fractionalExpression) { return ''; }
			// convert ascii fractions (eg. 1/2) to decimal
			var matches;
			if (matches = fractionalExpression.match(/^([\d]*)[ ]*([\d]+)\/([\d]+)/)) {
				var val = '';
				if (parseFloat(matches[2]) > 0) {
					val = parseFloat(matches[2])/parseFloat(matches[3]);
				}

				val += parseFloat(matches[1]);

				fractionalExpression = fractionalExpression.replace(matches[0], val);
			}

			return fractionalExpression;
		};

		// --------------------------------------------------------------------------------

		return that;
	};

	caDisplayTemplateParser = caUI.initDisplayTemplateParser();
})(jQuery);

/* ----------------------------------------------------------------------
 * js/ca/ca.genericbundle.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2008-2015 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initBundle = function(container, options) {
		var that = jQuery.extend({
			container: container,
			addMode: 'append',
			templateValues: [],
			initialValues: {},
			initialValueOrder: [],
			forceNewValues: [],
			errors: {},
			itemID: '',
			fieldNamePrefix: '',
			templateClassName: 'caItemTemplate',
			initialValueTemplateClassName: 'caItemTemplate',
			itemListClassName: 'caItemList',
			listItemClassName: 'caRelatedItem',
			itemClassName: 'labelInfo',
			localeClassName: 'labelLocale',
			addButtonClassName: 'caAddItemButton',
			deleteButtonClassName: 'caDeleteItemButton',
			showOnNewIDList: [],
			hideOnNewIDList: [],
			enableOnNewIDList: [],
			disableOnExistingIDList: [],
			counter: 0,
			minRepeats: 0,
			maxRepeats: 65535,
			showEmptyFormsOnLoad: 1,
			onInitializeItem: null,
			onItemCreate: null,	/* callback function when a bundle item is created */
			onAddItem: null,
			incrementLocalesForNewBundles: true,
			defaultValues: {},
			bundlePreview: '',
			readonly: 0,
			
			// ajax loading of content
			totalValueCount: null,
			partialLoadUrl: null,
			loadFrom: 0,
			loadSize: 5,
			partialLoadMessage: "Load next %",
			partialLoadIndicator: null,
			onPartialLoad: null,	// called after partial data load is completed
			
			placementID: null,
			interstitialPrimaryTable: null,	/* table and id for record from which interstitial was launched */
			interstitialPrimaryID: null,
			
			sortInitialValuesBy: null,
			firstItemColor: null,
			lastItemColor: null,
			
			isSortable: false,
			listSortOrderID: null,
			listSortItems: null // if set, limits sorting to items specified by selector
		}, options);
		
		if (that.maxRepeats == 0) { that.maxRepeats = 65535; }
		
		if (!that.readonly) {
			jQuery(container + " ." + that.addButtonClassName).on('click', null, {}, function(e) {
				that.addToBundle();
				that.showUnsavedChangesWarning(true);	
				
				e.preventDefault();
				return false;
			});
		} else {
			that.showEmptyFormsOnLoad = 0;
			jQuery(container + " ." + that.addButtonClassName).css("display", "none");
		}
		
		that.showUnsavedChangesWarning = function(b) {
			if(caUI && caUI.utils && typeof caUI.utils.showUnsavedChangesWarning === 'function') {
				if (b === undefined) { b = true; }
				caUI.utils.showUnsavedChangesWarning(b);
			}
		}
		
		that.appendToInitialValues = function(initialValues) {
			jQuery.each(initialValues, function(i, v) {
				that.initialValues[i] = v;
				that.addToBundle(i, v, true);
				return true;
			});
			that.updateBundleFormState();
		}
		
		that.loadNextValues = function() {
			if (!that.partialLoadUrl) { return false; }
			
			jQuery.getJSON(that.partialLoadUrl, { start: that.loadFrom, limit: that.loadSize }, function(data) {
				jQuery(that.container + " ." + that.itemListClassName + ' #' + that.fieldNamePrefix + '__busy').remove();
				jQuery(that.container + " ." + that.itemListClassName + ' #' + that.fieldNamePrefix + '__next').remove();
				that.loadFrom += that.loadSize;
				that.appendToInitialValues(data);
				
				jQuery(that.container + " ." + that.itemListClassName).scrollTo('+=' + jQuery(that.container + " ." + that.itemListClassName + ' div:first').height() + 'px', 250);
				
				if (that.onPartialLoad) { 
					that.onPartialLoad.call(data);
				}
				
				if (that.partialLoadUrl && (that.totalValueCount > that.loadFrom)) {
					that.addNextValuesLink();
				}
		
				that._updateSortOrderListIDFormElement();
			});
		}
		
		that.addNextValuesLink = function() {
			var end = (that.loadFrom + that.loadSize)
			if (end > that.totalValueCount) { end = that.totalValueCount % that.loadSize; } else { end = that.loadSize; }
			
			var msg = that.partialLoadMessage.replace("%", end + "/" + that.totalValueCount);
			jQuery(that.container + " ." + that.itemListClassName).append("<div class='caItemLoadNextBundles'><a href='#' id='" + that.fieldNamePrefix + "__next' class='caItemLoadNextBundles'>" + msg + "</a><span id='" + that.fieldNamePrefix + "__busy' class='caItemLoadNextBundlesLoadIndicator'>" + that.partialLoadIndicator + "</span></div>");
			jQuery(that.container + " ." + that.itemListClassName + ' #' + that.fieldNamePrefix + '__next').on('click', function(e) {
				jQuery(that.container + " ." + that.itemListClassName + ' #' + that.fieldNamePrefix + '__busy').show();
				that.loadNextValues();
				e.preventDefault();
				return false;
			});
		}
		
		that.addToBundle = function(id, initialValues, dontUpdateBundleFormState) {
			// prepare template values
			var cnt, templateValues = {};
			var isNew = false;
			if (initialValues && !initialValues['_handleAsNew']) {
				// existing item
				templateValues.n = id;
				jQuery.extend(templateValues, initialValues);
				
				jQuery.each(this.templateValues, function(i, v) {
					if (templateValues[v] == null) {  templateValues[v] = ''; }
				});
			} else {
				// new item
				if (!initialValues) {
					initialValues = {};
					jQuery.each(this.templateValues, function(i, v) {
						templateValues[v] = '';
					});
				} else {
					jQuery.extend(templateValues, initialValues);
					
					// init all unset template placeholders to empty string
					jQuery.each(this.templateValues, function(i, v) {
						if (templateValues[v] == null) {  templateValues[v] = ''; }
					});

					if (initialValues['_errors']) {
						this.errors[id] = initialValues['_errors'];
					}
				}
				templateValues.n = 'new_' + this.getCount();
				templateValues.error = '';
				isNew = true;
			}
					
			var defaultLocaleSelectedIndex = false;
			if (isNew && this.incrementLocalesForNewBundles) {
				// set locale_id for new bundles
				// find unused locale
				var localeList = jQuery.makeArray(jQuery(this.container + " select." + this.localeClassName + ":first option"));
				for(i=0; i < localeList.length; i++) {
					if (jQuery(this.container + " select." + this.localeClassName + " option:selected[value=" + localeList[i].value + "]").length > 0) { 
						continue; 
					}
					
					defaultLocaleSelectedIndex = i;
					break;
				}
			}
			
			// print out any errors
			var errStrs = [];
			if (this.errors && this.errors[id]) {
				var i;
				for (i=0; i < this.errors[id].length; i++) {
					errStrs.push(this.errors[id][i].errorDescription);
				}
			}
			
			templateValues.error = errStrs.join('<br/>');
			templateValues.fieldNamePrefix = this.fieldNamePrefix; // always pass field name prefix to template
			
			// Set default value for new items
			if (!id) {
				jQuery.each(this.defaultValues, function(k, v) {
					if (v && !templateValues[k]) { templateValues[k] = v; }
				});
			}
			
			// replace values in template
			var jElement = jQuery(this.container + ' textarea.' + (isNew ? this.templateClassName : this.initialValueTemplateClassName)).template(templateValues); 
			
			if ((this.addMode == 'prepend') && isNew) {	// addMode only applies to newly created bundles
				jQuery(this.container + " ." + this.itemListClassName).prepend(jElement);
			} else {
				jQuery(this.container + " ." + this.itemListClassName).append(jElement);
			}
			
			if (!dontUpdateBundleFormState && $.fn['scrollTo']) {	// scroll to newly added bundle
				jQuery(this.container + " ." + this.itemListClassName).scrollTo("999999px", 250);
			}

			if (this.onInitializeItem && (initialValues && !initialValues['_handleAsNew'])) {
				this.onInitializeItem(id, initialValues, this, isNew);
			}

			var that = this;	// for closures
			
			// set defaults in SELECT elements
			var selects = jQuery.makeArray(jQuery(this.container + " select"));

			// assumes name of fields is:
			// {fieldNamePrefix} + {fieldname} + {_} + {row id number}
			var i;
			var fieldRegex = new RegExp(this.fieldNamePrefix + "([A-Za-z0-9_\-]+)_([0-9]+)");
			for(i=0; i < selects.length; i++) {
				var element_id = selects[i].id;
				
				var info = element_id.match(fieldRegex);
				if (info && info[2] && (parseInt(info[2]) == id)) {
					if (!this.initialValues[id]) {
						console.log("err", this.initialValues, this.initialValues[id], id, info, info[1]);
					}
					if (typeof(this.initialValues[id][info[1]]) == 'boolean') {
						this.initialValues[id][info[1]] = (this.initialValues[id][info[1]]) ? '1' : '0';
					}
					jQuery(this.container + " #" + element_id + " option[value=" + this.initialValues[id][info[1]] +"]").prop('selected', true);
				}
			}
			
			// set defaults in CHECKBOX elements
			var checkboxes = jQuery.makeArray(jQuery(this.container + " input[type=checkbox]"));

			// assumes name of fields is:
			// {fieldNamePrefix} + {fieldname} + {_} + {row id number}
			var i;
			var fieldRegex = new RegExp(this.fieldNamePrefix + "([A-Za-z0-9_\-]+)_([0-9]+)");
			for(i=0; i < checkboxes.length; i++) {
				var element_id = checkboxes[i].id;
				
				var info = element_id.match(fieldRegex);
				if (info && info[2] && (parseInt(info[2]) == id)) {
					jQuery(this.container + " #" + element_id).prop('checked', false);
					if (typeof(this.initialValues[id][info[1]]) == 'boolean') {
						this.initialValues[id][info[1]] = (this.initialValues[id][info[1]]) ? '1' : '0';
					}
					jQuery(this.container + " #" + element_id + "[value=" + this.initialValues[id][info[1]] +"]").prop('checked', true);
				}
			}
			
			// set defaults in RADIO elements
			var radios = jQuery.makeArray(jQuery(this.container + " input[type=radio]"));

			// assumes name of fields is:
			// {fieldNamePrefix} + {fieldname} + {_} + {row id number} + {_} + {checkbox sequence number - eg. 0, 1, 2}
			var i;
			var fieldRegex = new RegExp(this.fieldNamePrefix + "([A-Za-z0-9_\-]+)_([0-9]+)_([0-9]+)");
			for(i=0; i < radios.length; i++) {
				var element_id = radios[i].id;
				var info = element_id.match(fieldRegex);
				if (info && info[2] && (parseInt(info[2]) == id)) {
					if (typeof(this.initialValues[id][info[1]]) == 'boolean') {
						this.initialValues[id][info[1]] = (this.initialValues[id][info[1]]) ? '1' : '0';
					}
					jQuery(this.container + " #" + element_id + "[value=" + this.initialValues[id][info[1]] +"]").prop('checked', true);
				}
			}
			
			
			// Do show/hide on creation of new item
			if (isNew) {
				var curCount = this.getCount();
				if (this.showOnNewIDList.length > 0) {
					jQuery.each(this.showOnNewIDList, function(i, show_id) { 
						jQuery(that.container + ' #' + show_id +'new_' + curCount).show(); }
					);
				}
				if (this.hideOnNewIDList.length > 0) {
					jQuery.each(this.hideOnNewIDList, function(i, hide_id) { 
						jQuery(that.container + ' #' + hide_id +'new_' + curCount).hide();}
					);
				}
				
				if (this.enableOnNewIDList.length > 0) {
					jQuery.each(this.enableOnNewIDList, 
						function(i, enable_id) { 
							jQuery(that.container + ' #' + enable_id +'new_' + curCount).prop('disabled', false); 
						}
					);
				}
			} else {
				if (this.disableOnExistingIDList.length > 0) {
					jQuery.each(this.disableOnExistingIDList, 
						function(i, disable_id) { 
							jQuery(that.container + ' #' + disable_id + id).prop('disabled', true); 
						}
					);
				}
			}
		
			// attach interstitial edit button
			if (this.interstitialButtonClassName) {
				if (!this.readonly && ('hasInterstitialUI' in initialValues) && (initialValues['hasInterstitialUI'] == true)) {
					jQuery(this.container + " #" +this.itemID + templateValues.n + " ." + this.interstitialButtonClassName).on('click', null,  {}, function(e) { 
						// Trigger interstitial edit panel
						var u = options.interstitialUrl + "/relation_id/" + initialValues['relation_id'] + "/placement_id/" + that.placementID + "/n/" + templateValues.n + "/field_name_prefix/" + that.fieldNamePrefix;
						if (that.interstitialPrimaryTable && that.interstitialPrimaryID) {	// table and id for record from which interstitial was launched
							u +=  "/primary/" + that.interstitialPrimaryTable + "/primary_id/" + that.interstitialPrimaryID;
						}
						options.interstitialPanel.showPanel(u);
						jQuery('#' + options.interstitialPanel.getPanelContentID()).data('panel', options.interstitialPanel);
						e.preventDefault();
						return false; 
					});
				} else {
					jQuery(this.container + " #" +this.itemID + templateValues.n + " ." + this.interstitialButtonClassName).css("display", "none");
				}
			}
		
			// attach delete button
			if (!this.readonly) {
				jQuery(this.container + " #" +this.itemID + templateValues.n + " ." + this.deleteButtonClassName).on('click', null, {}, function(e) { that.deleteFromBundle(templateValues.n); e.preventDefault(); return false; });
			} else {
				jQuery(this.container + " #" +this.itemID + templateValues.n + " ." + this.deleteButtonClassName).css("display", "none");
			}
			
			// set default locale for new
			if (isNew) {
				if (defaultLocaleSelectedIndex !== false) {
					if (jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option:eq(" + defaultLocaleSelectedIndex + ")").length) {
						// There's a locale drop-dow to mess with
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option:eq(" + defaultLocaleSelectedIndex + ")").prop('selected', true);
					} else {
						// No locale drop-down, or it somehow doesn't include the locale we want
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).after("<input type='hidden' name='" + this.fieldNamePrefix + "locale_id_" + templateValues.n + "' value='" + that.defaultLocaleID + "'/>");
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).remove();
					}
				} else {
					if (jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option[value=" + that.defaultLocaleID + "]").length) {
						// There's a locale drop-dow to mess with
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option[value=" + that.defaultLocaleID + "]").prop('selected', true);
					} else {
						// No locale drop-down, or it somehow doesn't include the locale we want
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).after("<input type='hidden' name='" + this.fieldNamePrefix + "locale_id_" + templateValues.n + "' value='" + that.defaultLocaleID + "'/>");
						jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).remove();
					}
				}
			}

			// Add bundle preview value text
			if(this.bundlePreview.length > 0) {
				jQuery('#' + this.fieldNamePrefix + 'BundleContentPreview').text(this.bundlePreview);
			}
			
			if(this.onAddItem) {
				this.onAddItem(id ? id : templateValues.n, this, isNew);
			}
			
			this.incrementCount();
			if (!dontUpdateBundleFormState) { this.updateBundleFormState(); }
			
			if (this.onItemCreate) {
				this.onItemCreate(templateValues.n, this.initialValues[id]);
			}
			
			if (this.readonly) {
				jQuery(this.container + " input").prop("disabled", true);
				jQuery(this.container + " textarea").prop("disabled", true);
				jQuery(this.container + " select").prop("disabled", true);
			}
			
			return this;
		};
		
		that.updateBundleFormState = function() {
			// enforce min repeats option (hide "delete" buttons if there are only x # repeats)
			if (this.getCount() <= this.minRepeats) {
				jQuery(this.container + " ." + this.deleteButtonClassName).hide();	
			} else {
				jQuery(this.container + " ." + this.deleteButtonClassName).show(200);
			}
			
			// enforce max repeats option (hide "add" button after a certain # of repeats)
			if (this.getCount() >= this.maxRepeats) {
				jQuery(this.container + " ." + this.addButtonClassName).hide();	
			} else {
				jQuery(this.container + " ." + this.addButtonClassName).show();
			}
			
			// colorize
			if ((options.firstItemColor) || (options.lastItemColor)) {
				jQuery(this.container + " ." + options.listItemClassName).css('background-color', '');
				if (options.firstItemColor) {
					jQuery(this.container + " ." + options.listItemClassName + ":first").css('background-color', '#' + options.firstItemColor);
				}
				if (options.lastItemColor) {
					jQuery(this.container + " ." + options.listItemClassName + ":last").css('background-color', '#' + options.lastItemColor);
				}
			}
			return this;
		};
		
		that.deleteFromBundle = function(id) {
			jQuery(this.container + ' #' + this.itemID + id).remove();
			jQuery(this.container).append("<input type='hidden' name='" + that.fieldNamePrefix + id + "_delete' value='1'/>");
			
			this.decrementCount();
			this.updateBundleFormState();
			
			that.showUnsavedChangesWarning(true);
			
			return this;
		};
			
		that.getCount = function() {
			return this.counter;
		};
			
		that.incrementCount = function() {
			this.counter++;
		};
			
		that.decrementCount = function() {
			this.counter--;
		};
		
		that._updateSortOrderListIDFormElement = function() {
			if (!that.listSortOrderID) { return false; }
			var sort_list = [];
			jQuery.each(jQuery(that.container + " ." + that.itemListClassName + " ." + that.itemClassName), function(k, v) { 
				sort_list.push(jQuery(v).attr('id').replace(that.itemID, ''));
			});
			jQuery('#' + that.listSortOrderID).val(sort_list.join(';'));
			
			return true;
		}
		
		// create initial values
		var initalizedCount = 0;
		var initialValuesSorted = [];
		
		// create an array so we can sort
		if (!that.initialValueOrder || !that.initialValueOrder.length) {
			jQuery.each(that.initialValues, function(k, v) {	
				that.initialValueOrder.push(k);
			});
		}
		jQuery.each(that.initialValueOrder, function(i, k) {
			var v = that.initialValues[k];
			v['_key'] = k;
			initialValuesSorted.push(v);
		});
		
		// perform configured sort
		if (that.sortInitialValuesBy) {
			initialValuesSorted.sort(function(a, b) { 
				return a[that.sortInitialValuesBy] - b[that.sortInitialValuesBy];
			});
		}
		
		// create the bundles
		jQuery.each(initialValuesSorted, function(k, v) {
			that.addToBundle(v['_key'], v, true);
			initalizedCount++;
		});
		
		that.loadFrom = initalizedCount;
		
		// add 'forced' new values (typically used to pre-add new items to the bundle when, for example,
		// in a previous action the add failed)
		if (!that.forceNewValues) { that.forceNewValues = []; }
		jQuery.each(that.forceNewValues, function(k, v) {
			v['_handleAsNew'] = true;
			that.addToBundle('new_' + k, v, true);
			initalizedCount++;
		});
		
		// force creation of empty forms if needed
		if ((initalizedCount <= that.minRepeats) && (that.minRepeats > 0)) {
			// empty forms to meet minimum count
			var i;
			for(i = initalizedCount; i < that.minRepeats; i++) {
				that.addToBundle(null, null, true);
				initalizedCount++;
			}
		} 
			// empty form to show user on load
		if (that.showEmptyFormsOnLoad > that.maxRepeats) { that.showEmptyFormsOnLoad = that.maxRepeats; }
		if (that.showEmptyFormsOnLoad > 0) {
			var j;
			for(j=0; j < (that.showEmptyFormsOnLoad - initalizedCount); j++) {
				that.addToBundle(null, null, true);
			}
		}
		
		if (that.isSortable) {
			var opts = { 
				opacity: 0.7, 
				revert: 0.2, 
				scroll: true, 
				forcePlaceholderSize: true,
				update: function(event, ui) {
					that._updateSortOrderListIDFormElement();
					that.showUnsavedChangesWarning(true);
				}
			};
			
			if (that.listSortItems) {
				opts['items'] = that.listSortItems;
			}
			opts['stop'] = function(e, ui) {
				that.updateBundleFormState();
			};
			
			jQuery(that.container + " .caItemList").sortable(opts);
			that._updateSortOrderListIDFormElement();
		}
		
		that.updateBundleFormState();
		
		if (that.partialLoadUrl && (that.totalValueCount > that.loadFrom)) {
			that.addNextValuesLink();
		}
		
		return that;
	};
	
	
})(jQuery);

/* ----------------------------------------------------------------------
 * js/ca/ca.genericpanel.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initPanel = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			panelID: 'caPanel',							/* id of enclosing panel div */
			panelContentID: 'caPanelContent',			/* id of div within enclosing panel div that contains content */
	
			useExpose: true,
			exposeBackgroundColor: '#000000',
			exposeBackgroundOpacity: 0.5,
			panelTransitionSpeed: 200,
			allowMobileSafariZooming: false,
			mobileSafariViewportTagID: '_msafari_viewport',
			mobileSafariInitialZoom: "1.0",
			mobileSafariMinZoom: "1.0",
			mobileSafariMaxZoom: "10.0",
			mobileSafariDeviceWidth:  "device-width",
			mobileSafariDeviceHeight:  "device-height",
			mobileSafariUserScaleable: false,
			onOpenCallback: null,
			onCloseCallback: null,
			callbackData: null,
			
			center: false,
			centerHorizontal: false,
			centerVertical : false,
			
			isChanging: false,
			clearOnClose: false
		}, options);
		
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.showPanel = function(url, onCloseCallback, clearOnClose, postData, callbackData) {
			that.setZoom(that.allowMobileSafariZooming);
			that.isChanging = true;
			
			
			if (that.center || that.centerHorizontal) {
				jQuery('#' + that.panelID).css("left", ((jQuery(window).width() - jQuery('#' + that.panelID).width())/2) + "px");
			}
			
			if (that.center || that.centerVertical) {
				jQuery('#' + that.panelID).css("top", ((jQuery(window).height() - jQuery('#' + that.panelID).height())/2) + "px");
			}
			
			jQuery('#' + that.panelID).fadeIn(that.panelTransitionSpeed, function() { that.isChanging = false; });
			
			if (that.useExpose) { 
				jQuery('#' + that.panelID).expose({api: true, color: that.exposeBackgroundColor , opacity: that.exposeBackgroundOpacity, closeOnClick : false, closeOnEsc: true}).load(); 
			}
			
			that.callbackData = callbackData;
			if (onCloseCallback) {
				that.onCloseCallback = onCloseCallback;
			}
			
			// Apply close behavior to selected elements
			if (!postData) { postData = {}; }
			if (url) {
				jQuery('#' + that.panelContentID).load(url, postData, that.closeButtonSelector ? function() {			
					jQuery(that.closeButtonSelector).click(function() {
						that.hidePanel();
					})
				} : null);
				that.clearOnClose = (clearOnClose == undefined) ? true : clearOnClose;
			} else {
				if (clearOnClose != undefined) { that.clearOnClose = clearOnClose; }
			}
			
			if (that.onOpenCallback) {
				that.onOpenCallback(url, that.callbackData);
			}
		}
		
		that.hidePanel = function(opts) {
			if (that.onCloseCallback) {
				that.onCloseCallback(that.callbackData);
			}
			that.setZoom(false);
			that.isChanging = true;
			jQuery('#' + that.panelID).fadeOut(that.panelTransitionSpeed, function() { that.isChanging = false; });
			
			if (that.useExpose && (!opts || !opts.dontCloseMask)) {
				jQuery.mask.close();
			}
			
			if (that.clearOnClose) {
				jQuery('#' + that.panelContentID).empty();
				that.clearOnClose = false;
			}
		}
		
		that.panelIsVisible = function() {
			return (jQuery('#' + that.panelID + ':visible').length > 0) ? true : false;
		}
		
		that.getPanelID = function() {
			return that.panelID;
		}
		
		that.getPanelContentID = function() {
			return that.panelContentID;
		}
		
		// --------------------------------------------------------------------------------
		// Mobile Safari zooming
		// --------------------------------------------------------------------------------
		that.setZoom = function(allow) {
			if (allow) {
				jQuery('#' + that.mobileSafariViewportTagID).attr('content','width=' + that.mobileSafariDeviceWidth + ', height=' + that.mobileSafariDeviceHeight + ', initial-scale=' + that.mobileSafariInitialZoom + ', minimum-scale=' + that.mobileSafariMinZoom + ', maximum-scale=' + that.mobileSafariMaxZoom + ', user-scalable=' + (that.mobileSafariUserScaleable ? 'yes' : 'no') + '');
			} else {
				jQuery('#' + that.mobileSafariViewportTagID).attr('content', 'width=' + that.mobileSafariDeviceWidth + ', height=' + that.mobileSafariDeviceHeight + ', initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=yes');
			}
		}

		// --------------------------------------------------------------------------------
		// Set up handler to trigger appearance of panel
		// --------------------------------------------------------------------------------
		jQuery(document).ready(function() {
			// hide panel if click is outside of panel
			//jQuery(document).click(function(event) {
			//	var p = jQuery(event.target).parents().map(function() { return this.id; }).get();
			//	if (!that.isChanging && that.panelIsVisible() && (jQuery.inArray(that.panelID, p) == -1)) {
				//	that.hidePanel();
			//	}
			//});
			
			// hide panel if escape key is clicked
			jQuery(document).keyup(function(event) {
				if ((event.keyCode == 27) && !that.isChanging && that.panelIsVisible()) {
					that.hidePanel();
				}
			});
		});
		
		// --------------------------------------------------------------------------------
		
		return that;
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.googlemaps.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initGoogleMap = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			map: null,
			id: 'map',
			mapType: 'TERRAIN',
			
			navigationControl: true,
  			mapTypeControl: true,
 			scaleControl: true,
 			zoomControl: true
		}, options);
		
		that.infoWindow = new google.maps.InfoWindow({ disableAutoPan: false, maxWidth: 300 } );
		that.map = new google.maps.Map(document.getElementById(that.id), { disableDefaultUI: true, mapTypeId: google.maps.MapTypeId[that.mapType], navigationControl: that.navigationControl, mapTypeControl: that.mapTypeControl, scaleControl: true, zoomControl: that.zoomControl });
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.openMarkerInfoWindow = function(marker) {
			var markerLatLng = marker.getPosition();
			
			if(marker.ajaxContentUrl.length > 0) {
				that.infoWindow.setContent('Loading...');
				jQuery.ajax(marker.ajaxContentUrl, { success: function(data, textStatus, jqXHR) { that.infoWindow.setContent(data); that.infoWindow.open(that.map, marker); }})
			} else {
				that.infoWindow.setContent(marker.content);
			}
			that.infoWindow.open(that.map, marker);
		};
		// --------------------------------------------------------------------------------
		that.openPathInfoWindow = function(latlng, path) {
			that.infoWindow.setContent(path.content);
			that.infoWindow.setPosition(latlng);
			that.infoWindow.open(that.map);
		};
		// --------------------------------------------------------------------------------
		that.makeMarker = function(lat, lng, label, content, ajaxContentUrl, options) {
			var pt = new google.maps.LatLng(lat, lng);
		
			var opts = {
				position: pt,
				map: that.map,
				title: label + ' ',
				content: label + ' ' + content + ' ',
				ajaxContentUrl: ajaxContentUrl
			};
			if (options && options.icon) { opts['icon'] = options.icon; }
			var marker = new google.maps.Marker(opts);
			
			google.maps.event.addListener(marker, 'click', function(e) { that.openMarkerInfoWindow(marker); });
			
			return marker;
		};
		// --------------------------------------------------------------------------------
		that.makePath = function(pathArray, label, content, opts) {
			var path = new google.maps.Polyline(opts);
			path.setPath(pathArray);
			path.setMap(that.map);
			path.label = label;
			path.content = content;
			
			google.maps.event.addListener(path, 'click', function(e) { that.openPathInfoWindow(e.latLng, path); });
			return path;
		};
		// --------------------------------------------------------------------------------
		that.closeInfoWindow = function() { 
			that.infoWindow.close(); 
		}
		// --------------------------------------------------------------------------------
		that.fitBounds = function(n, s, e, w) {
			that.map.fitBounds(new google.maps.LatLngBounds(new google.maps.LatLng(s,w), new google.maps.LatLng(n,e)));
		}
		// --------------------------------------------------------------------------------
		
		// Add self to div containing map; this is useful for external callers
		jQuery("#" + that.id).data('mapInstance', that);
		return that;
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.hierbrowser.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2009-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.
 *
 * This source code is free and modifiable under the terms of
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */

var caUI = caUI || {};

(function ($) {
	caUI.initHierBrowser = function(container, options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			container: container,

			uiStyle: 'horizontal',	// 'horizontal' [default] means side-to-side scrolling browser; 'vertical' means <select>-based vertically oriented browser.
			//  The horizontal browser requires more space but it arguably easier and more pleasant to use with large hierarchies.
			//  The vertical browser is more compact and works well with smaller hierarchies

			bundle: '',

			levelDataUrl: '',
			initDataUrl: '',
			editUrl: '',

			editUrlForFirstLevel: '',
			editDataForFirstLevel: '',	// name of key in data to use for item_id in first level, if different from other levels
			dontAllowEditForFirstLevel: false,

			name: options.name ? options.name : container.replace(/[^A-Za-z0-9]+/, ''),
			levelWidth: 230,
			browserWidth: 500,

			readOnly: false,	// if set to true, no navigation is allowed

			initItemID: null,		// if set, hierarchy opens with specified item_id selected
			defaultItemID: null,	// set to default value to show when no initItemID is set; note that initItemID is an ID to open with *and select.* defaultItemID merely specifies an item to open with, but not select.
			useAsRootID: null,		// if set to an item_id, that is used at the root of the display hierarchy

			className: 'hierarchyBrowserLevel',
			classNameSelected: 'hierarchyBrowserLevelSelected',
			classNameContainer: 'hierarchyBrowserContainer',

			currentSelectionDisplayID: '',
			currentSelectionDisplayFormat: '%1',
			currentSelectionIDID: '',
			allowSelection: true,

			allowExtractionFromHierarchy: false,
			extractFromHierarchyButtonIcon: null,
			extractFromHierarchyMessage: null,

			selectOnLoad: false,
			onSelection: null,		/* function to call whenever an item is selected; passed item_id, parent_id, name, formatted display string and type_id */

			autoShrink: false,
			autoShrinkMaxHeightPx: 180,
			autoShrinkAnimateID: '',

			/* how do we treat disabled items in the browser? can be
			 *  - 'disable' : list items default behavior - i.e. show the item but don't make it a clickable link
			 *  - 'hide' : completely hide them from the browser
			 *  - 'full' : don't treat disabled items any differently
			 */
			disabledItems: 'disable',

			displayCurrentSelectionOnLoad: true,
			typeMenuID: '',

			indicatorUrl: '',
			editButtonIcon: '',
			disabledButtonIcon: '',

			hasChildrenIndicator: 'has_children',	/* name of key in data to use to determine if an item has children */
			alwaysShowChildCount: true,

			levelDivs: [],
			levelLists: [],
			selectedItemIDs: [],

			_numOpenLoads: 0,					// number of AJAX loads pending
			_openLoadsForLevel:[],				// counts of loads pending per-level
			_pageLoadsForLevel:[],				// log of which pages per-level have been loaded already
			_queuedLoadsForLevel: [],			// parameters for pending loads per-level

			maxItemsPerHierarchyLevelPage: 500	// maximum number of items to load at one time into a level
		}, options);

		if (!that.levelDataUrl) {
			alert("No level data url specified for " + that.name + "!");
			return null;
		}

		if (!jQuery.inArray(that.uiStyle, ['horizontal', 'vertical'])) { that.uiStyle = 'horizontal'; }		// verify the uiStyle is valid

		if (that.uiStyle == 'horizontal') {
			// create scrolling container
			jQuery('#' + that.container).append("<div class='" + that.classNameContainer + "' id='" + that.container + "_scrolling_container'></div>");
		} else {
			if (that.uiStyle == 'vertical') {
				jQuery('#' + that.container).append("<div class='" + that.classNameContainer + "' id='" + that.container + "_select_container'></div>");
			}
		}

		if (that.typeMenuID) {
			jQuery('#' + that.typeMenuID).hide();
		}

		// --------------------------------------------------------------------------------
		// BEGIN method definitions
		// --------------------------------------------------------------------------------
		// Set up initial state and all levels of hierarchy. The item_id parameter will be used to determine the root
		// of the hierarchy if set. If it is omitted then the useAsRootID option value will be used.
		//
		// @param int item_id The database id of the item to be used as the root of the hierarchy. If omitted the useAsRootID option value is used, or if that is not available whatever root the server decides to use.
		//
		that.setUpHierarchy = function(item_id) {
			if (!item_id) { that.setUpHierarchyLevel(0, that.useAsRootID ? that.useAsRootID : 0, 1, null, true); return; }
			that.levelDivs = [];
			that.levelLists = [];
			that.selectedItemIDs = [];
			jQuery.getJSON(that.initDataUrl, { id: item_id, bundle: that.bundle}, function(data, e, x) {
				if (data.length) {
					that.selectedItemIDs = data.join(';').split(';');

					if (that.useAsRootID > 0) {
						that.selectedItemIDs.shift();
						if (jQuery.inArray(that.useAsRootID, data) == -1) {
							data.unshift(that.useAsRootID);
						}
					} else {
						data.unshift(0);
					}
				} else {
					data = [that.useAsRootID ? that.useAsRootID : 0];
				}

				if (data[0] == data[1]) {	// workaround for jQuery(?) but that replicates first item of list in json array
					data.shift();
				}
				var l = 0;
				jQuery.each(data, function(i, id) {
					that.setUpHierarchyLevel(i, id, 1, item_id);
					l++;
				});
				that.loadHierarchyLevelData();

				if (that.uiStyle == 'horizontal') {
					jQuery('#' + that.container + '_scrolling_container').animate({scrollLeft: l * that.levelWidth}, 500);
				}
			});
		}
		// --------------------------------------------------------------------------------
		// Clears hierarchy level display
		//
		// @param int level The level to be cleared
		//
		that.clearLevelsStartingAt = function(level) {
			var l = level;

			// remove all level divs above the current one
			while(jQuery('#hierBrowser_' + that.name + '_' + l).length > 0) {
				jQuery('#hierBrowser_' + that.name + '_' + l).remove();
				that.levelDivs[l] = undefined;
				that.levelLists[l] = undefined;
				l++;
			}

		}
		// --------------------------------------------------------------------------------
		// Initialize a hierarchy level and load data into it for display.
		//
		// @param int level The level of the hierarchy to initialize.
		// @param int item_id The database id of the item for which child items will be loaded into the hierarchy level. This is the "parent" of the level, in other words.
		// @param bool is_init Flag indicating if this is the initial load of the hierarchy browser.
		// @param int selected_item_id The database id of the selected hierarchy item. This is the lowest selected item in the hierarchy; selection of its ancestors is implicit.
		// @param bool fetchData Flag indicating if queue should be processed immediately. Default is false. The queue can be subsequently processed by calling loadHierarchyLevelData().
		//
		that.setUpHierarchyLevel = function (level, item_id, is_init, selected_item_id, fetchData) {
			that._numOpenLoads++;
			if (that._openLoadsForLevel[level]) { return null; }	// load is already open for this level
			that._openLoadsForLevel[level] = true;

			// Remove any levels *after* the one we're populating
			that.clearLevelsStartingAt(level);

			if (!item_id) { item_id = 0; }
			if (!is_init) { is_init = 0; }

			// Create div to enclose new level
			var newLevelDivID = 'hierBrowser_' + that.name + '_' + level;
			var newLevelListID = 'hierBrowser_' + that.name + '_list_' + level;

			if(!is_init) { jQuery('#' + newLevelDivID).remove(); }

			if (that.uiStyle == 'horizontal') {
				var newLevelDiv = "<div class='" + that.className + "' style='left:" + (that.levelWidth * level) + "px;' id='" + newLevelDivID + "'></div>";

				// Create new <ul> to display list of items
				var newLevelList = "<ul class='" + that.className + "' id='" + newLevelListID + "'></ul>";

				jQuery('#' + that.container + '_scrolling_container').append(newLevelDiv);
				jQuery('#' + newLevelDivID).data('level', level);
				jQuery('#' + newLevelDivID).data('parent_id', item_id);
				jQuery('#' + newLevelDivID).append(newLevelList);

				var selected_item_id_cl = selected_item_id;

				jQuery('#' + newLevelDivID).scroll(function () {
					if((jQuery('#' + newLevelDivID).scrollTop() + jQuery('#' + newLevelDivID).height()) >= (jQuery('#' + newLevelDivID).prop('scrollHeight'))) {
						var p = jQuery('#' + newLevelDivID).data("page");

						if ((p === undefined) || (p == 0)) { p = 0; }	// always start with page one
						p++;

						// Are we at the end of the list?
						if (jQuery('#' + newLevelDivID).data('itemCount') <= (p * that.maxItemsPerHierarchyLevelPage)) {
							return false;
						}

						jQuery('#' + newLevelDivID).data("page", p);
						var l = jQuery('#' + newLevelDivID).data('level');

						if (!that._pageLoadsForLevel[l] || !that._pageLoadsForLevel[l][p]) {		// is page loaded?
							if (!that._pageLoadsForLevel[l]) { that._pageLoadsForLevel[l] = []; }
							that._pageLoadsForLevel[l][p] = true;
							that.queueHierarchyLevelDataLoad(l, item_id, false, newLevelDivID, newLevelListID, selected_item_id_cl, p * that.maxItemsPerHierarchyLevelPage, true);
						}
					}
				});

				that.showIndicator(newLevelDivID);
			} else {
				if (that.uiStyle == 'vertical') {
					// Create new <select> to display list of items
					var newLevelList = "<select class='" + that.className + "' id='" + newLevelListID + "' name='" + newLevelListID + "' style='width: "+ (that.browserWidth - 32) + "px;'></select>";	// allow 24 pixels for spinner
					var newLevelDiv = "<div class='" + that.className + "' id='" + newLevelDivID + "'>" + newLevelList;
					if (level > 0) { newLevelDiv += "<br/>⬆</div>"; }

					jQuery('#' + that.container + '_select_container').prepend(newLevelDiv);
					jQuery('#' + newLevelDivID).data('level', level);
					jQuery('#' + newLevelDivID).data('parent_id', item_id);
					jQuery('#' + newLevelListID).change(function() {
						var item_id = jQuery("#" + newLevelListID + " option:selected").val();
						if (!item_id) {
							that.clearLevelsStartingAt(level + 1);
						} else {
							that.setUpHierarchyLevel(level + 1, item_id, 0, undefined, true);
							that.selectItem(level, item_id, jQuery('#' + newLevelDivID).data('parent_id'), 0, {});
						}
					});
					that.showIndicator(newLevelDivID);

					// add first "choose something" item
					if (level > 0) {
						jQuery("#" + newLevelListID).append(jQuery("<option></option>").val('').html('-'));
					}

					jQuery("#" + newLevelDivID).parent().parent().scrollTo("0px");
				}
			}
			var l = jQuery('#' + newLevelDivID).data('level');
			that._pageLoadsForLevel[l] = [true];
			that.queueHierarchyLevelDataLoad(level, item_id, is_init, newLevelDivID, newLevelListID, selected_item_id, 0, fetchData);

			that.levelDivs[level] = newLevelDivID;
			that.levelLists[level] = newLevelListID;
			return newLevelDiv;
		}
		// --------------------------------------------------------------------------------
		// Queues load of hierarchy data into a level. Unless the fetchData parameter is set to true, data is not actually loaded until
		// loadHierarchyLevelData() is called. This enables you to bundle data loads for several levels into a single AJAX request, improving
		// performance.
		//
		// @param int level The level into which data will be loaded.
		// @param int item_id The database id of the item for which child items will be loaded into the hierarchy level. This is the "parent" of the level, in other words.
		// @param bool is_init Flag indicating if this is the initial load of the hierarchy browser.
		// @param string newLevelDivID The ID of the <div> containing the level
		// @param string newLevelListID The ID of the <ul> containing the level
		// @param int selected_item_id  The database id of the selected hierarchy item. This is the lowest selected item in the hierarchy; selection of its ancestors is implicit.
		// @param int start The offset into the level data to start loading at. For a given level only up to a maximum of {maxItemsPerHierarchyLevelPage} items are fetched per AJAX request. The start parameter is used to control from which item the returned list starts.
		// @param bool fetchData Flag indicating if queue should be processed immediately. Default is false. The queue can be subsequently processed by calling loadHierarchyLevelData().
		//
		that.queueHierarchyLevelDataLoad = function(level, item_id, is_init, newLevelDivID, newLevelListID, selected_item_id, start, fetchData) {
			if(!that._queuedLoadsForLevel[level]) { that._queuedLoadsForLevel[level] = []; }
			that._queuedLoadsForLevel[level].push({
				item_id: item_id, is_init: is_init, newLevelDivID: newLevelDivID, newLevelListID: newLevelListID, selected_item_id: selected_item_id, start: start
			});

			if (fetchData) { that.loadHierarchyLevelData(); }
		}
		// --------------------------------------------------------------------------------
		// Load "page" of hierarchy level via AJAX
		//
		that.loadHierarchyLevelData = function() {
			if (that.isLoadingLevel) { return; }
			that.isLoadingLevel = true;

			var id_list = [];
			var itemIDsToLevelInfo = {};
			var is_init = false;
			for(var l = 0; l < that._queuedLoadsForLevel.length; l++) {
				for(var i = 0; i < that._queuedLoadsForLevel[l].length; i++) {
					id_list.push(that._queuedLoadsForLevel[l][i]['item_id']+':'+that._queuedLoadsForLevel[l][i]['start']);
					itemIDsToLevelInfo[that._queuedLoadsForLevel[l][i]['item_id']] = {
						level: l,
						newLevelDivID: that._queuedLoadsForLevel[l][i]['newLevelDivID'],
						newLevelListID: that._queuedLoadsForLevel[l][i]['newLevelListID'],
						selected_item_id: that._queuedLoadsForLevel[l][i]['selected_item_id'],
						is_init: that._queuedLoadsForLevel[l][i]['is_init']
					}
					if (that._queuedLoadsForLevel[l][i]['is_init']) { is_init = true; }
					that._queuedLoadsForLevel[l].splice(i,1);
				}
			}

			if (is_init) {
				// attempt to renumber levels if required (sometimes first level is suppressed)
				var needsLevelShift = true;
				for(var k in itemIDsToLevelInfo) {
					if (itemIDsToLevelInfo[k]['level'] === 0) {
						needsLevelShift = false;
						break;
					}
				}

				if (needsLevelShift) {
					for(var k in itemIDsToLevelInfo) {
						var oldLevel = itemIDsToLevelInfo[k]['level'];
						var newLevel = oldLevel - 1;
						var re = new RegExp("_" + oldLevel + "$");
						itemIDsToLevelInfo[k]['newLevelDivID'] = itemIDsToLevelInfo[k]['newLevelDivID'].replace(re, "_" + newLevel);
						itemIDsToLevelInfo[k]['newLevelListID'] = itemIDsToLevelInfo[k]['newLevelListID'].replace(re, "_" + newLevel);
						itemIDsToLevelInfo[k]['level']--;
					}
				}
			}

			if (!id_list.length) { that.isLoadingLevel = false; return; }

			var start = 0;
			jQuery.getJSON(that.levelDataUrl, { id: id_list.join(';'), bundle: that.bundle, init: is_init ? 1 : '', root_item_id: that.selectedItemIDs[0] ? that.selectedItemIDs[0] : '', start: start * that.maxItemsPerHierarchyLevelPage, max: (that.uiStyle == 'vertical') ? 0 : that.maxItemsPerHierarchyLevelPage }, function(dataForLevels) {
				var longestLevel = 0;
				jQuery.each(dataForLevels, function(key, data) {
					var tmp = key.split(":");
					var item_id = tmp[0];

					if (!itemIDsToLevelInfo[item_id]) { return; }
					var level = itemIDsToLevelInfo[item_id]['level'];

					var is_init = itemIDsToLevelInfo[item_id]['is_init'];
					var newLevelDivID = itemIDsToLevelInfo[item_id]['newLevelDivID'];
					var newLevelListID = itemIDsToLevelInfo[item_id]['newLevelListID'];
					var selected_item_id = itemIDsToLevelInfo[item_id]['selected_item_id'];

					var foundSelected = false;
					jQuery('#' + newLevelDivID).data('itemCount', data['_itemCount']);

					for(var i in data['_sortOrder']) {
						var item = data[data['_sortOrder'][i]];
						if (!item) { continue; }
						if (!item.name) { item.name = '??? ' + item['item_id']; }
						if (item['item_id']) {
							if ((is_init) && (level == 0) && (!that.selectedItemIDs[0])) {
								that.selectedItemIDs[0] = item['item_id'];
							}
							if (that.selectedItemIDs[level] == item['item_id']) {
								foundSelected = true;
							}
							if (that.uiStyle == 'horizontal') {
								var moreButton = '';
								if (that.editButtonIcon) {
									if (item.children > 0) {
										moreButton = "<div style='float: right;'><a href='#' id='hierBrowser_" + that.name + '_level_' + level + '_item_' + item['item_id'] + "_edit' >" + that.editButtonIcon + "</a></div>";
									} else {
										moreButton = "<div style='float: right;'><a href='#' id='hierBrowser_" + that.name + '_level_' + level + '_item_' + item['item_id'] + "_edit'  class='noChildren'>" + that.disabledButtonIcon + "</a></div>";
									}
								}

								if ((level > 0) && (that.allowExtractionFromHierarchy) && (that.initItemID == item['item_id']) && that.extractFromHierarchyButtonIcon) {
									moreButton += "<div style='float: right; margin-right: 5px; opacity: 0.3;' id='hierBrowser_" + that.name + "_extract_container'><a href='#' id='hierBrowser_" + that.name + "_extract'>" + that.extractFromHierarchyButtonIcon + "</a></div>";
								}

								var skipNextLevelNav = false;
								if ((item.is_enabled !== undefined) && (parseInt(item.is_enabled) === 0)) {
									switch (that.disabledItems) {
										case 'full':
											jQuery('#' + newLevelListID).append(
												"<li class='" + that.className + "'>" + moreButton + "<a href='#' id='hierBrowser_" + that.name + '_level_' + level + '_item_' + item['item_id'] + "' class='" + that.className + "'>"  +  item.name + "</a></li>"
											);
											break;
										case 'hide': // item is hidden -> noop
											skipNextLevelNav = true; // skip adding the "navigate to the next level" code
											break;
										case 'disabled':
										default:
											jQuery('#' + newLevelListID).append(
												"<li class='" + that.className + "'>" + moreButton +  item.name + "</li>"
											);
											break;
									}
								} else if ((!((level == 0) && that.dontAllowEditForFirstLevel))) {
									jQuery('#' + newLevelListID).append(
										"<li class='" + that.className + "'>" + moreButton +"<a href='#' id='hierBrowser_" + that.name + '_level_' + level + '_item_' + item['item_id'] + "' class='" + that.className + "'>"  +  item.name + "</a></li>"
									);
								} else {
									jQuery('#' + newLevelListID).append(
										"<li class='" + that.className + "'>" + moreButton + "<a href='#' id='hierBrowser_" + that.name + '_level_' + level + '_item_' + item['item_id'] + "' class='" + that.className + "'>"  +  item.name + "</a></li>"
									);
								}

								if(!skipNextLevelNav) {
									jQuery('#' + newLevelListID + " li:last a").data('item_id', item['item_id']);
									jQuery('#' + newLevelListID + " li:last a").data('item', item);
									if(that.editDataForFirstLevel) {
										jQuery('#' + newLevelListID + " li:last a").data(that.editDataForFirstLevel, item[that.editDataForFirstLevel]);
									}

									if (that.hasChildrenIndicator) {
										jQuery('#' + newLevelListID + " li:last a").data('has_children', item[that.hasChildrenIndicator] ? true : false);
									}
								}

								// edit button, if .. (trying to make this readable ...)
								if (
									(!((level == 0) && that.dontAllowEditForFirstLevel)) // this is not the first level or it is but we allow editing the first level, AND ..
									&&
									(
										(item.is_enabled === undefined) || 		// the item doesn't have a is_enabled property (e.g. places) OR ...
										(parseInt(item.is_enabled) === 1) || 	// it's enabled OR ...
										((parseInt(item.is_enabled) === 0) && that.disabledItems == 'full') // it's disabled, but the render mode tells us to not treat disabled items differently
									)
								) {
									var editUrl = '';
									var editData = 'item_id';
									if (that.editUrlForFirstLevel && (level == 0)) {
										editUrl = that.editUrlForFirstLevel;
										if(that.editDataForFirstLevel) {
											editData = that.editDataForFirstLevel;
										}
									} else {
										editUrl = that.editUrl;
									}
									if (editUrl) {
										jQuery('#' + newLevelListID + " li:last a:last").click(function() {
											jQuery(document).attr('location', editUrl + jQuery(this).data(editData));
											return false;
										});
									} else {
										jQuery('#' + newLevelListID + " li:last a:last").click(function() {
											var l = jQuery(this).parent().parent().parent().data('level');
											var item_id = jQuery(this).data('item_id');
											var has_children = jQuery(this).data('has_children');
											that.selectItem(l, item_id, jQuery('#' + newLevelDivID).data('parent_id'), has_children, jQuery(this).data('item'));
											return false;
										});
									}
								}

								// hierarchy forward navigation
								if (!that.readOnly) {
									jQuery('#' + newLevelListID + " li:last a:first").click(function() {
										var l = jQuery(this).parent().parent().parent().parent().data('level');
										var item_id = jQuery(this).data('item_id');
										var has_children = jQuery(this).data('has_children');
										that.selectItem(l, item_id, jQuery('#' + newLevelDivID).data('parent_id'), has_children, jQuery(this).data('item'));

										// scroll to new level
										that.setUpHierarchyLevel(l + 1, item_id, 0, undefined, true);
										jQuery('#' + that.container + '_scrolling_container').animate({scrollLeft: l * that.levelWidth}, 500);

										return false;
									});
								}

								if (that.readOnly) {
									jQuery('#' + newLevelListID + " li:first a").click(function() {
										return false;
									});
								}

								if ((that.allowExtractionFromHierarchy) && (that.extractFromHierarchyButtonIcon)) {
									jQuery('#' + newLevelListID + ' #hierBrowser_' + that.name + '_extract').unbind('click.extract').bind('click.extract', function() {
										that.extractItemFromHierarchy(item['item_id'], item);
									});
								}
							} else {
								if (that.uiStyle == 'vertical') {
									jQuery("#" + newLevelListID).append(jQuery("<option></option>").val(item.item_id).text(item.name));
								}
							}
							// Pass item_id to caller if required
							if (is_init && that.selectOnLoad && that.onSelection && item['item_id'] == selected_item_id) {
								var formattedDisplayString = that.currentSelectionDisplayFormat.replace('%1', item.name);
								that.onSelection(item['item_id'], item.parent_id, item.name, formattedDisplayString, item.type_id);
							}
						} else {
							if (item.parent_id && (that.selectedItemIDs.length == 0)) { that.selectedItemIDs[0] = item.parent_id; }
						}
					}//);

					var dontDoSelectAndScroll = false;
					if (!foundSelected && that.selectedItemIDs[level]) {
						var p = jQuery('#' + newLevelDivID).data("page");
						if (!p || (p < 0)) { p = 0; }

						jQuery('#' + newLevelDivID).data("page", p);
						if (jQuery('#' + newLevelDivID).data('itemCount') > (p * that.maxItemsPerHierarchyLevelPage)) {
							if (!that._pageLoadsForLevel[level] || !that._pageLoadsForLevel[level][p]) {		// is page loaded?
								if (!that._pageLoadsForLevel[level]) { that._pageLoadsForLevel[level] = []; }
								that._pageLoadsForLevel[level][p] = true;

								that.queueHierarchyLevelDataLoad(level, item_id, false, newLevelDivID, newLevelListID, selected_item_id, p * that.maxItemsPerHierarchyLevelPage, true);

								dontDoSelectAndScroll = true;	// we're still trying to find selected item so don't try to select it
							}
						}
					} else {
						// Treat sequential page load as init so selected item is highlighted
						is_init = true;
					}



					if (that.uiStyle == 'horizontal') {
						if (!is_init) {
							that.selectedItemIDs[level-1] = item_id;
							jQuery('#' + newLevelListID + ' a').removeClass(that.classNameSelected).addClass(that.className);
							jQuery('#hierBrowser_' + that.name + '_' + (level - 1) + ' a').removeClass(that.classNameSelected).addClass(that.className);
							jQuery('#hierBrowser_' + that.name + '_level_' + (level - 1) + '_item_' + item_id).addClass(that.classNameSelected);
						} else {
							if ((that.selectedItemIDs[level] !== undefined) && !dontDoSelectAndScroll) {
								jQuery('#hierBrowser_' + that.name + '_level_' + (level) + '_item_' + that.selectedItemIDs[level]).addClass(that.classNameSelected);
								jQuery('#hierBrowser_' + that.name + '_' + level).scrollTo('#hierBrowser_' + that.name + '_level_' + level + '_item_' + that.selectedItemIDs[level]);
							}
						}
					} else {
						if (that.uiStyle == 'vertical') {
							if(jQuery("#" + newLevelListID + " option").length <= ((level > 0) ? 1 : 0)) {
								jQuery("#" + newLevelListID).parent().remove();
							} else {
								if (is_init) {
									if (that.selectedItemIDs[level] !== undefined) {
										jQuery("#" + newLevelListID + " option[value=" + that.selectedItemIDs[level] + "]").prop('selected', 1);
									}
								}

								if(
									(!is_init && (jQuery("#" + newLevelListID + " option").length == 1))
										||
										(is_init && ((jQuery("#" + newLevelListID + " option").length == 1) || ((that.selectedItemIDs.length <= 1) && (level == 0))))
									) {
									that.setUpHierarchyLevel(level + 1, jQuery("#" + newLevelListID + " option:first").val(), 0, undefined, true);
								}
							}
						}
					}

					that._numOpenLoads--;
					that._openLoadsForLevel[level] = false;

					that.updateTypeMenu();

					// Handle loading of long hierarchy levels via ajax on scroll
					if (that.uiStyle == 'horizontal') {

					}
					that.hideIndicator(newLevelDivID);
				});

				// resize to fit items
				if((that.uiStyle == 'horizontal') && that.autoShrink && that.autoShrinkAnimateID) {
					var container = jQuery('#' + that.autoShrinkAnimateID);
					if(jQuery(container).is(':visible')) { // don't resize if the thing isn't visible
						var newHeight = 0; // start with 0 and make it bigger as needed

						// for each level
						for(var k in that.levelLists) {
							if(!that.levelLists.hasOwnProperty(k)) { continue; }
							// if the level warrants making the container bigger, do it
							var potentialHeight = jQuery('#' + that.levelLists[k]).height();
							if(newHeight < potentialHeight) {
								newHeight = potentialHeight;
							}
						}

						if(newHeight > that.autoShrinkMaxHeightPx) {
							newHeight = that.autoShrinkMaxHeightPx;
						}
						container.animate({ height: newHeight + 'px'}, 500);
					}
				}

				that.isLoadingLevel = false;

				// try to load any outstanding level pages
				that.loadHierarchyLevelData();
			});
		}
		// --------------------------------------------------------------------------------
		// Updates type menu and "add" message associated with hierarchy browser based upon
		// current state of the hierarchy browser
		//
		that.updateTypeMenu = function() {
			if ((that._numOpenLoads == 0) && that.currentSelectionDisplayID) {
				var selectedID = that.getSelectedItemID();
				var l = that.numLevels();
				while(l >= 0) {
					if (that.displayCurrentSelectionOnLoad && (jQuery('#hierBrowser_' + that.name + '_level_' + l + '_item_' + selectedID).length > 0)) {
						if (that.currentSelectionDisplayID) {
							jQuery('#' + that.currentSelectionDisplayID).html(that.currentSelectionDisplayFormat.replace('%1', jQuery('#hierBrowser_' + that.name + '_level_' + l + '_item_' + selectedID).html()));
						}
						break;
					}
					l--;
				}

				if ((that._numOpenLoads == 0) && that.typeMenuID) {
					jQuery('#' + that.typeMenuID).show(300);
				}
			}
		}
		// --------------------------------------------------------------------------------
		// Records user selection of an item
		//
		// @param int level The level where the selected item resides
		// @param int item_id The database id of the selected item
		// @param int parent_id The database id of the parent of the selected item
		// @param bool has_children Flag indicating if the selected item has child items or not
		// @param Object item A hash containing details, including the name, of the selected item
		//
		that.selectItem = function(level, item_id, parent_id, has_children, item) {
			if (!that.allowSelection) return false;

			// set current selection display
			var formattedDisplayString = that.currentSelectionDisplayFormat.replace('%1', item.name);

			if (that.currentSelectionDisplayID) {
				jQuery('#' + that.currentSelectionDisplayID).html(formattedDisplayString);
			}

			if (that.currentSelectionIDID) {
				jQuery('#' + that.currentSelectionIDID).attr('value', item_id);
			}

			if (that.onSelection) {
				that.onSelection(item_id, parent_id, item.name, formattedDisplayString, item.type_id);
			}

			while(that.selectedItemIDs.length > level) {
				that.selectedItemIDs.pop();
			}
			that.selectedItemIDs.push(item_id);
			jQuery("#hierBrowser_" + that.name + "_extract_container").css('opacity', 0.3);
			jQuery('#hierBrowser_' + that.name + '_' + level + ' a').removeClass(that.classNameSelected).addClass(that.className);
			jQuery('#hierBrowser_' + that.name + '_level_' + level + '_item_' + item_id).addClass(that.classNameSelected);
		}
		// --------------------------------------------------------------------------------
		//  Support for UI display when moving item in one hierarchy into another hierarchy (aka item "extraction).
		//
		// @param int item_id The database id of the item to extract
		// @param Object item A hash containing details, including the name, of the item to be extracted
		//
		that.extractItemFromHierarchy = function(item_id, item) {
			if (that.currentSelectionDisplayID) {
				jQuery('#' + that.currentSelectionDisplayID).html(that.extractFromHierarchyMessage);
			}

			if (that.currentSelectionIDID) {
				jQuery('#' + that.currentSelectionIDID).attr('value', "X");		// X=extract
			}
			jQuery("#hierBrowser_" + that.name + "_extract_container").css('opacity', 1.0);

			if (that.onSelection) {
				that.onSelection(item_id, null, item.name, that.extractFromHierarchyMessage, null);
			}
		}
		// --------------------------------------------------------------------------------
		// Display spinning progress indicator in specified level <div>
		//
		// @param string newLevelDivID The ID of the <div> containing the level
		//
		that.showIndicator = function(newLevelDivID) {
			if (!that.indicatorUrl) { return; }
			if (jQuery('#' + newLevelDivID + ' img._indicator').length > 0) {
				jQuery('#' + newLevelDivID + ' img._indicator').show();
				return;
			}
			var level = jQuery('#' + newLevelDivID).data('level');
			if (that.uiStyle == 'vertical') {
				var indicator = document.createElement('img');
				indicator.src = that.indicatorUrl;
				indicator.className = '_indicator';
				if (level == 0) { jQuery('#' + newLevelDivID).append("<br/>"); }
				jQuery('#' + newLevelDivID).append(indicator);
			} else {
				var indicator = document.createElement('img');
				indicator.src = that.indicatorUrl;
				indicator.className = '_indicator';
				indicator.style.position = 'absolute';
				indicator.style.left = '50%';
				indicator.style.top = '50%';
				jQuery('#' + newLevelDivID).append(indicator);
			}
		}
		// --------------------------------------------------------------------------------
		// Remove spinning progress indicator from specified level <div>
		//
		// @param string newLevelDivID The ID of the <div> containing the level
		//
		that.hideIndicator = function(newLevelDivID) {
			jQuery('#' + newLevelDivID + ' img._indicator').hide();		// hide loading indicator
		}
		// --------------------------------------------------------------------------------
		// Returns database id (the primary key in the database, *NOT* the DOM ID) of currently selected item
		//
		that.getSelectedItemID = function() {
			return that.selectedItemIDs[that.selectedItemIDs.length - 1];
		}
		// --------------------------------------------------------------------------------
		// Returns the number of levels that are currently displayed
		//
		that.numLevels = function() {
			return that.levelDivs.length;
		}
		// --------------------------------------------------------------------------------
		// END method definitions
		// --------------------------------------------------------------------------------
		//
		// Initialize before returning object
		that.setUpHierarchy(that.initItemID ? that.initItemID : that.defaultItemID);

		return that;
		// --------------------------------------------------------------------------------
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.idnochecker.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2009-2011 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initIDNoChecker = function(options) {
		var that = jQuery.extend({
			errorIcon: null,
			processIndicator: null,
			idnoStatusID: 'idnoStatus',
			lookupUrl: null,
			searchUrl: null,
			idnoFormElementIDs: [],
			separator: '.',
			row_id: null,
			context_id: null,
			
			singularAlreadyInUseMessage: 'Identifier is already in use',
			pluralAlreadyInUseMessage: 'Identifier is already in use %1 times'
		}, options);
		
		
		that.checkIDNo = function() { 
			jQuery('#' + that.idnoStatusID).html((that.processIndicator ? '<img src=\'' + that.processIndicator + '\' border=\'0\'/>' : ''));
			var ids = jQuery.makeArray(jQuery(that.idnoFormElementIDs.join(',')));
			
			var vals = [];
			jQuery.each(ids, function() {
				vals.push(this.value);
			});
			var idno = vals.join(that.separator);
			jQuery.getJSON(that.lookupUrl, { n: idno, id: that.row_id, _context_id: that.context_id }, 
				function(data) {
					if (
						(
							(data.length > 1) &&
							(jQuery.inArray(that.row_id, data) === -1)
						) ||
						(
							(data.length == 1) &&
							(parseInt(data) != parseInt(that.row_id))
						)
					) {
						var msg;
						if (data.length == 1) {
							msg = that.singularAlreadyInUseMessage;
						} else {
							msg = that.pluralAlreadyInUseMessage.replace('%1', '' + data.length);
						}
						if (that.searchUrl) {
							msg = "<a href='" + that.searchUrl + idno + "'>" + msg + "</a>";
						}
						jQuery('#' + that.idnoStatusID).html((that.errorIcon ? '<img src=\'' + that.errorIcon + '\' border=\'0\'/> ' : '') + msg).show(0);
					} else{
						jQuery('#' + that.idnoStatusID).html('').hide(0);
					}
				}
			);
		}
		
		jQuery(that.idnoFormElementIDs.join(',')).bind('change keyup', that.checkIDNo);
		
		that.checkIDNo();
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.imagescroller.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2008-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initImageScroller = function(scrollingImageList, container, options) {
		var that = jQuery.extend({
			scrollingImageList: scrollingImageList,
			curScrollImageIndex: options.startImage	? options.startImage : 0,				// initial image to display
			scrollingImageLookAhead: options.lookAhead ? options.lookAhead : 3,				// number of images to preload following current image
			scrollingImageScrollSpeed: options.scrollSpeed ? options.scrollSpeed : 0.25,	// time (in seconds) each scroll takes
			containerWidth: options.containerWidth ? options.containerWidth : 400,			// height of DIV containing images
			containerHeight: options.containerHeight ? options.containerHeight : 400,		// width of DIV containing images
			container: container ? container : 'scrollingImages',
			
			imageCounterID: options.imageCounterID,
			imageZoomLinkID: options.imageZoomLinkID,
			imageZoomLinkImg: options.imageZoomLinkImg,
			
			counterLabel: options.counterLabel ? options.counterLabel : '',
			imageTitleID: options.imageTitleID ? options.imageTitleID : '',
			
			noVertCentering: options.noVertCentering,
			noHorizCentering: options.noHorizCentering,

			noImageLink: options.noImageLink,
			
			scrollingImageClass: options.scrollingImageClass ? options.scrollingImageClass : 'imageScrollerImage',
			scrollingImageIDPrefix: options.scrollingImageIDPrefix ? options.scrollingImageIDPrefix : 'imageScrollerImage',
			
			initialIndex: 0
			
		}, options);
		
		// methods
		that.getCurrentIndex = function() {
			return this.curScrollImageIndex;
		}
		that.scrollToNextImage = function() {
			this.scrollToImage(1);
		}
		that.scrollToPreviousImage = function() {
			that.scrollToImage(-1);
		}
		that.scrollToImage = function(offset, dontUseEffects) {
			var targetImageIndex = that.curScrollImageIndex + offset;
			if ((targetImageIndex < 0) || (targetImageIndex >= that.scrollingImageList.length)) { return false; }
			
			// create new image container divs if needed
			var i;
			var maxImageIndex = targetImageIndex + that.scrollingImageLookAhead;
			if (maxImageIndex >= that.scrollingImageList.length) { maxImageIndex = that.scrollingImageList.length - 1; }
			var minImageImage = targetImageIndex - that.scrollingImageLookAhead;
			if (minImageImage < 0) { minImageImage = 0; }
			
			for(i=minImageImage; i <= maxImageIndex; i++) {
				if (jQuery("#" + that.scrollingImageIDPrefix + i).length == 0) {
					var horizCentering, vertCentering, linkOpenTag, linkCloseTag;
					if (that.noHorizCentering) { horizCentering = ''; } else { horizCentering = 'margin-left: ' + ((that.containerWidth - that.scrollingImageList[i].width)/2) + 'px;'; }
					if (that.noVertCentering) { vertCentering = ''; } else { vertCentering = 'margin-top: ' + ((that.containerHeight - that.scrollingImageList[i].height)/2) + 'px;'; }
					if (!that.noImageLink) { linkOpenTag = '<a href="' + that.scrollingImageList[i].link + '" '+(that.scrollingImageList[i].onclick ? 'onclick="' + that.scrollingImageList[i].onclick + '"' : '') + ' '+(that.scrollingImageList[i].rel ? 'rel="' + that.scrollingImageList[i].rel + '"' : '') + '>'; linkCloseTag = '</a>'} else { linkOpenTag = linkCloseTag = ""; }
					jQuery('#' + that.container).append('<div class="' + that.scrollingImageClass + '" id="' + that.scrollingImageIDPrefix + i + '" style="'+horizCentering + ' ' + vertCentering +'">'+ linkOpenTag +'<img src="' + that.scrollingImageList[i].url+ '" width="' + that.scrollingImageList[i].width + '" height ="' + that.scrollingImageList[i].height + '" border=\'0\'>'+ linkCloseTag +'</div>');
					jQuery('#' + that.scrollingImageIDPrefix + i).css('left', (that.containerWidth * i)  + "px");
				}
			}
			
			// do scroll
			if (dontUseEffects) {
				jQuery('#' + that.container).css('left', (targetImageIndex * -1 * that.containerWidth) + "px");
			} else {
				jQuery('#' + that.container).animate(
					{
						left: (targetImageIndex * -1 * that.containerWidth) + "px"
					},
					that.scrollingImageScrollSpeed * 1000
				);
			}
			if (that.imageTitleID) {
				jQuery('#' + that.imageTitleID).html(that.scrollingImageList[targetImageIndex].title);
			}
			
			if (that.imageCounterID) {
				jQuery('#' + that.imageCounterID).html((that.counterLabel) + (targetImageIndex + 1) + "/" + that.scrollingImageList.length);
			}
			that.curScrollImageIndex = targetImageIndex;
			if (that.imageZoomLinkID) {
				jQuery('#' + that.imageZoomLinkID).html('<a href="#" '+(that.scrollingImageList[targetImageIndex].onclickZoom ? 'onclick="' + that.scrollingImageList[targetImageIndex].onclickZoom + '"' : '') + '>' + that.imageZoomLinkImg + '</a>');
			}
		}
		
		that.scrollToImage(that.initialIndex, true);
		
		return that;
	};
	
	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.labelbundle.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2008-2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initLabelBundle = function(container, options) {
		var that = jQuery.extend({
			container: container,
			mode: 'preferred',
			templateValues: [],
			initialValues: {},
			forceNewValues: [],
			labelID: 'Label_',
			fieldNamePrefix: '',
			localeClassName: 'caLabelLocale',
			templateClassName: 'caLabelTemplate',
			labelListClassName: 'caLabelList',
			addButtonClassName: 'caAddLabelButton',
			deleteButtonClassName: 'caDeleteLabelButton',
			
			defaultLocaleID: null,
			bundlePreview: '',
			readonly: 0,
			
			counter: 0
		}, options);
		
		if (!that.readonly) {
			jQuery(container + " ." + that.addButtonClassName).click(function() {
				that.addLabelToLabelBundle(container);
				that.showUnsavedChangesWarning(true);	
				
				return false;
			});
		} else {
			jQuery(container + " ." + that.addButtonClassName).css("display", "none");
		}	
		that.showUnsavedChangesWarning = function(b) {
			if(typeof caUI.utils.showUnsavedChangesWarning === 'function') {
				if (b === undefined) { b = true; }
				caUI.utils.showUnsavedChangesWarning(b);
			}
		}
		
		that.addLabelToLabelBundle = function(id, initialValues, forceNew) {
			if (forceNew == undefined) { forceNew = false; }
			
			// prepare template values
			var cnt, templateValues = {};
			var isNew = false;
			if (initialValues) {
				// existing label (if forced to be "new" we ignore the id
				templateValues.n = (!forceNew) ? id : 'new_' + this.getCount();
				jQuery.extend(templateValues, initialValues);
			} else {
				// new label
				initialValues = {};
				jQuery.each(this.templateValues, function(i, v) {
					templateValues[v] = '';
				});
				templateValues.n = 'new_' + this.getCount();
				isNew = true;
			}
			templateValues.fieldNamePrefix = this.fieldNamePrefix; // always pass field name prefix to template
			
			var jElement = jQuery(this.container + ' textarea.' + this.templateClassName).template(templateValues); 
			jQuery(this.container + " ." + this.labelListClassName).append(jElement);
			
			var that = this;	// for closures
			
			// attach delete button
			if (!that.readonly) {
				jQuery(this.container + " #" + this.fieldNamePrefix+this.labelID + templateValues.n + " ." + this.deleteButtonClassName).click(function() { that.deleteLabelFromLabelBundle(templateValues.n); return false; });
			} else {
				jQuery(this.container + " #" + this.fieldNamePrefix+this.labelID + templateValues.n + " ." + this.deleteButtonClassName).css("display", "none");
			}
			
			// set locale_id
			// find unused locale
			var localeList = jQuery.makeArray(jQuery(this.container + " select." + this.localeClassName + ":first option"));
			
			var defaultLocaleSelectedIndex = 0;
			for(i=0; i < localeList.length; i++) {
				if (!isNew) {
					if (localeList[i].value !== templateValues.locale_id) { continue; }
				} else {
					if (jQuery(this.container + " select." + this.localeClassName + " option:selected[value=" + localeList[i].value + "]").length > 0) { 
						if(jQuery(this.container + " select." + this.localeClassName).length > 1) {
							continue; 
						}
					}
				}
				
				defaultLocaleSelectedIndex = i;
				if (isNew && localeList[i].value == options.defaultLocaleID) {
					break;
				}
			}
			
			// set default values for <select> elements
			var i;
			for (i=0; i < this.templateValues.length; i++) {
				if (this.templateValues[i] === 'locale_id') { continue; }
				if (jQuery(this.container + " select#" + this.fieldNamePrefix + this.templateValues[i] + "_" + id).length) {
					jQuery(this.container + " select#" + this.fieldNamePrefix + this.templateValues[i] + "_" + id + " option[value=" + templateValues[this.templateValues[i]] +"]").prop('selected', true);
				}
			}
			if(!templateValues.locale_id) { templateValues.locale_id = that.defaultLocaleID; }
			
			if (isNew) {
				if (jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option:eq(" + defaultLocaleSelectedIndex + ")").length) {
					// There's a locale drop-dow to mess with
					jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option:eq(" + defaultLocaleSelectedIndex + ")").prop('selected', true);
				} else {
					// No locale drop-down, or it somehow doesn't include the locale we want
					jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).after("<input type='hidden' name='" + this.fieldNamePrefix + "locale_id_" + templateValues.n + "' value='" + that.defaultLocaleID + "'/>");
					jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).remove();
					
				}
			} else {
				jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n +" option:eq(" + defaultLocaleSelectedIndex + ")").prop('selected', true);
			
				// attach onchange function to locale_id
				jQuery(this.container + " #" + this.fieldNamePrefix + "locale_id_" + templateValues.n).change(function() { that.updateLabelBundleFormState(); });
			}

			// Add bundle preview value text
			if(this.bundlePreview.length > 0) {
				var selector;
				if(this.mode == 'preferred') {
					selector = '#' + this.fieldNamePrefix + 'Labels_BundleContentPreview';
				} else {
					selector = '#' + this.fieldNamePrefix + 'NPLabels_BundleContentPreview';
				}

				jQuery(selector).text(this.bundlePreview);
			}
			
			this.updateLabelBundleFormState();
			
			this.incrementCount();
			return this;
		};
		
		that.updateLabelBundleFormState = function() {
			switch(this.mode) {
				case 'preferred':
					// make locales already labeled non-selectable (preferred mode only)
					var tmp = jQuery.makeArray(jQuery(this.container + " ." + this.labelListClassName + " select." + this.localeClassName +" option:selected"));
					var selectedLocaleIDs = [];
					var i;
					for(i=0; i < tmp.length; i++) {
						selectedLocaleIDs.push(tmp[i].value);
					}
					var localeSelects = jQuery.makeArray(jQuery(this.container + " ." + this.labelListClassName + " select." + this.localeClassName +""));
					
					for(i=0; i < localeSelects.length; i++) {
						var selectedLocaleID = localeSelects[i].options[localeSelects[i].selectedIndex].value;
						var j;
						for (j=0; j < localeSelects[i].options.length; j++) {
							if ((jQuery.inArray(localeSelects[i].options[j].value, selectedLocaleIDs) >= 0) && (localeSelects[i].options[j].value != selectedLocaleID)) {
								localeSelects[i].options[j].disabled = true;
							} else {
								localeSelects[i].options[j].disabled = false;
							}
						}
					}
					
					
					// remove "add" button if all locales have a label (preferred mode only)
					
					var numLabels = jQuery(this.container + " ." + this.labelListClassName + " > div").length;
					tmp = jQuery.makeArray(jQuery(this.container + " ." + this.labelListClassName + " select." + this.localeClassName + ":first"));
					if ((numLabels > 0) && (!tmp || !tmp[0] || tmp[0].options.length <= jQuery(this.container + " ." + this.labelListClassName + " div select." + this.localeClassName ).length)) {
						// no more
						jQuery(this.container + " ." + this.addButtonClassName).hide();
					} else {
						jQuery(this.container + " ." + this.addButtonClassName).show(200);			
					}
					break;
				default:
					// noop
					break;
			}
			
			if (this.readonly) {
				jQuery(this.container + " input").prop("disabled", true);
				jQuery(this.container + " select").prop("disabled", true);
			}
			
			return this;
		};
		
		that.deleteLabelFromLabelBundle = function(id) {
			jQuery(this.container + ' #' + this.fieldNamePrefix + 'Label_' + id).remove();
			jQuery(this.container).append("<input type='hidden' name='" + that.fieldNamePrefix + "Label_" + id + "_delete' value='1'/>");
			this.updateLabelBundleFormState();
			
			that.showUnsavedChangesWarning(true);	
		
			return this;
		};
			
		that.getCount = function() {
			
			return this.counter;
		};
			
		that.incrementCount = function() {
			this.counter++;
		};
		
		// create initial values
		
		var initalizedLabelCount = 0;
		jQuery.each(that.initialValues, function(k, v) {
			that.addLabelToLabelBundle(k, v);
			initalizedLabelCount++;
		});
		
		// add forced values
		jQuery.each(that.forceNewValues, function(k, v) {
			that.addLabelToLabelBundle(k, v, true);
			initalizedLabelCount++;
		});
		
		if (initalizedLabelCount == 0) {
			that.addLabelToLabelBundle();
		}
		
		
		that.updateLabelBundleFormState();
		return that;
	};
	
	
})(jQuery);

/* ----------------------------------------------------------------------
 * js/ca/ca.objectcheckin.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initObjectCheckinManager = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			
			transactionListContainerID: 'transactionListContainer',
			transactionSubmitContainerID: 'transactionSubmitContainer',
			transactionResultsContainerID: 'transactionResultsContainer',
			
			autocompleteID: 'objectAutocomplete',
			
			itemList: [],
			
			searchURL: null,
			getInfoURL : null,
			saveTransactionURL: null,
			loadWidgetURL: null,
			
			removeButtonIcon: '(X)',
			
			cookieJar: jQuery.cookieJar('caBundleVisibility')
		}, options);
		
		jQuery('#' + that.transactionListContainerID).hide();
		jQuery('#' + that.transactionSubmitContainerID).hide();
		jQuery('#' + that.transactionResultsContainerID).hide();
		
		jQuery('#' + that.autocompleteID).autocomplete( { 
				source: that.searchURL,
				minLength: 3, delay: 800, html: true,
				response: function(event, ui) {
					if ((ui.content.length == 1) && (ui.content[0].id > 0)) {
						ui.item = ui.content[0];
						jQuery(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
						jQuery(this).autocomplete('close');
					}
				},
				select: function(event, ui) {
					var checkout_id = ui.item.id;
					if (parseInt(checkout_id)) {
						if (checkout_id <= 0) {
							jQuery('#' + that.autocompleteID).val('');	// reset autocomplete to blank
							return false;
						}
						
						// is it already on the list?
						var alreadySelected = false;
						jQuery.each(that.itemList, function(k, v) {
							if (v['checkout_id'] == checkout_id) { 
								alreadySelected = true;
								jQuery('#' + that.autocompleteID).val('');	// reset autocomplete to blank
								return false;
							}
						});
						if (alreadySelected) { return false; }
						
						// get checkout info
						jQuery.getJSON(
							that.getInfoURL + '/checkout_id/' + checkout_id,
							{}, function(data) {
								// on success add to transactionList display
								var _disp = '<div class="caLibraryTransactionListItemContainer"><div class="caLibraryTransactionListItemMedia">' + data.media + '</div><div class="caLibraryTransactionListItemName">' + data.title + "</div>";
								_disp += '<div class="caLibraryTransactionListItemBorrower">' + data.borrower + "</div>";
								
								// add note field
								_disp += '<div class="caLibraryTransactionListItemNotesContainer"><div class="caLibraryTransactionListItemNotesLabel">Notes</div><textarea name="note" id="note_' + checkout_id + '" rows="2" cols="90"></textarea></div>';
								
								// add remove button
								_disp += '<div class="caLibraryTransactionListItemRemoveButton"><a href="#" id="itemRemove_' + checkout_id + '" data-checkout_id="' + checkout_id + '">' + that.removeButtonIcon + '</a>';
								
								// support removal of items
								jQuery('#' + that.transactionListContainerID + ' .transactionList').append("<li id='item_" + checkout_id + "'>" + _disp + "</li>");
								jQuery('#itemRemove_' + checkout_id).on('click', function() {
									var checkout_id_to_delete = jQuery(this).data('checkout_id');
									jQuery('li#item_' + checkout_id_to_delete).remove();
									
									var newItemList = [];
									jQuery.each(that.itemList, function(k, v) {
										if (v['checkout_id'] != checkout_id_to_delete) {
											newItemList.push(v);
										}
									});
									that.itemList = newItemList;
									if (that.itemList.length == 0) {
										jQuery('#' + that.transactionListContainerID).hide();
										jQuery('#' + that.transactionSubmitContainerID).hide();
									}
								});
								that.itemList.push({
									checkout_id: checkout_id
								});
								
								if (that.itemList.length > 0) {
									jQuery('#' + that.transactionSubmitContainerID).show();
									jQuery('#' + that.transactionListContainerID).show();
								} else {
									jQuery('#' + that.transactionSubmitContainerID).hide();
									jQuery('#' + that.transactionListContainerID).hide();
								}
								
								// reset autocomplete to blank
								jQuery('#' + that.autocompleteID).val('');
							}
						);
					}
				}
			}).click(function() { this.select(); }).focus();
			
			jQuery('#transactionSubmit').on('click', function(e) {
				// marshall transaction data and submit
				if (that.itemList.length > 0) {
					jQuery.each(that.itemList, function(k, v) {
						var checkout_id = v['checkout_id'];
						var note = jQuery('#note_' + checkout_id).val();
						if (note) {
							that.itemList[k]['note'] = note;
						}
					});				
			
					jQuery.ajax({
						url: that.saveTransactionURL,
						type: 'POST',
						dataType: 'json',
						data: { user_id: that.user_id, item_list: JSON.stringify(that.itemList) },
						success: function(data) {
								//console.log('Success', data);
						
								// clear item list
								jQuery('#' + that.transactionListContainerID + ' .transactionList li').remove();
								that.itemList = [];
								jQuery('#' + that.transactionSubmitContainerID).hide();
								jQuery('#' + that.transactionListContainerID).hide();
								jQuery('#' + that.autocompleteID).focus();
						
								// clear transaction results
								jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses li').remove();
								jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors li').remove();
						
								// show results of transaction submission
								if (data.checkins) {
									jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses li').remove();
									jQuery.each(data.checkins, function(k, v) {
										jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses').append("<li>" + v + "</li>");
									});
								}
								if (data.errors) {
									jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors li').remove();
									jQuery.each(data.errors, function(k, v) {
										jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors').append("<li>" + v + "</li>");
									});
								}
								
								// reload left-hand side widget with new details
								if (that.loadWidgetURL) { jQuery('#widgets').load(that.loadWidgetURL); }
								
								jQuery('#' + that.transactionResultsContainerID).fadeIn(250);
								setTimeout(function() {
									jQuery('#' + that.transactionResultsContainerID).fadeOut(250);
								}, 5000);
							},
						error: function( jqxhr, textStatus, error ) {
								var err = textStatus + ", " + error;
								console.log( "Request Failed: " + err );
							}
					});
				}
			});
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.xxx = function(id) {
			
		}
		
		
		// --------------------------------------------------------------------------------
		
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.objectcheckout.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initObjectCheckoutManager = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			user_id: null,
			
			transactionListContainerID: 'transactionListContainer',
			transactionSubmitContainerID: 'transactionSubmitContainer',
			transactionResultsContainerID: 'transactionResultsContainer',
			
			autocompleteID: 'objectAutocomplete',
			
			itemList: [],
			
			searchURL: null,
			getInfoURL : null,
			saveTransactionURL: null,
			loadWidgetURL: null,
			
			removeButtonIcon: '(X)',
			
			cookieJar: jQuery.cookieJar('caBundleVisibility')
		}, options);
		
		jQuery('#' + that.transactionListContainerID).hide();
		jQuery('#' + that.transactionSubmitContainerID).hide();
		jQuery('#' + that.transactionResultsContainerID).hide();
		
		jQuery('#' + that.autocompleteID).autocomplete( { 
				source: that.searchURL,
				minLength: 3, delay: 800, html: true,
				response: function(event, ui) {
					if ((ui.content.length == 1) && (ui.content[0].id > 0)) {
						ui.item = ui.content[0];
						jQuery(this).data('ui-autocomplete')._trigger('select', 'autocompleteselect', ui);
						jQuery(this).autocomplete('close');
					}
				},
				select: function(event, ui) {
					var object_id = ui.item.id;
					if (parseInt(object_id)) {
						if (object_id <= 0) {
							jQuery('#' + that.autocompleteID).val('');	// reset autocomplete to blank
							return false;
						}
					
						var due_date = ui.item.due_date;
						
						// is it already on the list?
						var alreadySelected = false;
						jQuery.each(that.itemList, function(k, v) {
							if (v['object_id'] == object_id) { 
								alreadySelected = true;
								jQuery('#' + that.autocompleteID).val('');	// reset autocomplete to blank
								return false;
							}
						});
						if (alreadySelected) { return false; }
						
						// get object info
						jQuery.getJSON(
							that.getInfoURL,
							{object_id: object_id, user_id: that.user_id}, function(data) {
								// on success add to transactionList display
								
								var _disp = '<div class="caLibraryTransactionListItemContainer"><div class="caLibraryTransactionListItemMedia">' + data.media + '</div><div class="caLibraryTransactionListItemName">' + data.title + "</div>";
								
								
								// Status values:
								// 	0 = available; 1 = out; 2 = out with reservations; 3 = available with reservations
								//
								_disp += '<div>Status: ' + data.status_display + '</div>';
								
								if (data.storage_location) {
									_disp += '<div>Location: ' + data.storage_location + '</div>';
								}
								
								// Show reservation details if item is not available and reserved by user other than the current one or not out with current user
								if (
									((data.status == 1) || (data.status == 2))
									&&
									!data.isOutWithCurrentUser && !data.isReservedByCurrentUser
								) {
									if ((that.user_id != data.current_user_id) && ((data.status == 1) || (data.status == 2))) {
										_disp += '<div class="caLibraryTransactionListItemWillReserve">' + data.reserve_display_label + ' (' + data.holder_display_label + ')</div>';
									}
									if ((that.user_id != data.current_user_id) && (data.status == 3)) {
										_disp += '<div class="caLibraryTransactionListItemWillReserve">' + data.reserve_display_label + '</div>';
									}
								}
								
								// Show notes and due date if item is available
								if ((data.status == 0) || (data.status == 3)) {
									// add note field
									_disp += '<div class="caLibraryTransactionListItemNotesContainer"><div class="caLibraryTransactionListItemNotesLabel">' + data.notes_display_label + '</div><textarea name="note" id="note_' + object_id + '" rows="2" cols="90"></textarea></div>';
								
									if (((data.status == 0) || (data.status == 3)) && (data.config.allow_override_of_due_dates == 1)) {	// item available so allow setting of due date
										_disp += '<div class="caLibraryTransactionListItemDueDateContainer"><div class="caLibraryTransactionListItemDueDateLabel">' + data.due_on_display_label + '</div><input type="text" name="due_date" id="dueDate_' + object_id + '" value="' + data.config.default_checkout_date + '" size="10"/></div>';
									}
								} else {
									_disp += '<br style="clear: both;"/>';
								}
								
								// remove button
								_disp += '<div class="caLibraryTransactionListItemRemoveButton"><a href="#" id="itemRemove_' + object_id + '" data-object_id="' + object_id + '">' + that.removeButtonIcon + '</a></div>';
								
								// support removal of items
								jQuery('#' + that.transactionListContainerID + ' .transactionList').append("<li id='item_" + object_id + "'>" + _disp + "</li>");
								jQuery('#itemRemove_' + object_id).on('click', function() {
									var object_id_to_delete = jQuery(this).data('object_id');
									jQuery('li#item_' + object_id_to_delete).remove();
									
									var newItemList = [];
									jQuery.each(that.itemList, function(k, v) {
										if (v['object_id'] != object_id_to_delete) {
											newItemList.push(v);
										}
									});
									that.itemList = newItemList;
									if (that.itemList.length == 0) {
										jQuery('#' + that.transactionSubmitContainerID).hide();
										jQuery('#' + that.transactionListContainerID).hide();
									}
								});
								that.itemList.push({
									object_id: object_id, due_date: null
								});
								jQuery('#dueDate_' + object_id).datepicker({minDate: 0, dateFormat: 'yy-mm-dd'});
								
								if(that.itemList.length > 0) {
									jQuery('#' + that.transactionSubmitContainerID).show();
									jQuery('#' + that.transactionListContainerID).show();
								} else {
									jQuery('#' + that.transactionSubmitContainerID).hide();
									jQuery('#' + that.transactionListContainerID).hide();
								}
								
								// reset autocomplete to blank
								jQuery('#' + that.autocompleteID).val('');
							}
						);
					}
				}
			}).click(function() { this.select(); }).focus();
			
			jQuery('#transactionSubmit').on('click', function(e) {
				// marshall transaction data and submit
				if (that.itemList.length > 0) {
					jQuery.each(that.itemList, function(k, v) {
						var object_id = v['object_id'];
						var due_date = jQuery('#dueDate_' + object_id).val();
						if (due_date) {
							that.itemList[k]['due_date'] = due_date;
						}
						var note = jQuery('#note_' + object_id).val();
						if (note) {
							that.itemList[k]['note'] = note;
						}
					});				
			
					jQuery.ajax({
						url: that.saveTransactionURL,
						type: 'POST',
						dataType: 'json',
						data: { user_id: that.user_id, item_list: JSON.stringify(that.itemList) },
						success: function(data) {
								//console.log('Success', data);
						
								// clear item list
								jQuery('#' + that.transactionListContainerID + ' .transactionList li').remove();
								that.itemList = [];
								jQuery('#' + that.transactionSubmitContainerID).hide();
								jQuery('#' + that.transactionListContainerID).hide();
								jQuery('#' + that.autocompleteID).focus();
						
								// clear transaction results
								jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses li').remove();
								jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors li').remove();
						
								// show results of transaction submission
								if (data.checkouts) {
									jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses li').remove();
									jQuery.each(data.checkouts, function(k, v) {
										jQuery('#' + that.transactionResultsContainerID + ' .transactionSuccesses').append("<li>" + v + "</li>");
									});
								}
								if (data.errors) {
									jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors li').remove();
									jQuery.each(data.errors, function(k, v) {
										jQuery('#' + that.transactionResultsContainerID + ' .transactionErrors').append("<li>" + v + "</li>");
									});
								}
								
								// reload left-hand side widget with new details for user
								if (that.loadWidgetURL && that.user_id) { jQuery('#widgets').load(that.loadWidgetURL, {user_id: that.user_id}); }
								
								jQuery('#' + that.transactionResultsContainerID).fadeIn(250);
								setTimeout(function() {
									jQuery('#' + that.transactionResultsContainerID).fadeOut(250);
								}, 5000);
							},
						error: function( jqxhr, textStatus, error ) {
								var err = textStatus + ", " + error;
								console.log( "Request Failed: " + err );
							}
					});
				}
			
		});
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.xxx = function(id) {
			
		}
		
		
		// --------------------------------------------------------------------------------
		
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.quickaddform.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

//
// TODO: Finish up error handling
//

(function ($) {
	caUI.initQuickAddFormHandler = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			formID: null,
			formErrorsPanelID: null,
			formTypeSelectID: null,
			
			fileUploadUrl: null,
			saveUrl: null,
			
			headerText: "QuickAdd",
			saveText: "Saved record: %1",
			sendingFilesText: "Sending files (%1)",
			sendingDataText: "Processing form",
			busyIndicator: '',
			
			_files: {}
		}, options);
		
		// Grab files on change
		jQuery("#" + that.formID).on('change', 'input[type=file]', function(e) { 
			that._files[jQuery(e.target).prop('name')] = e.target.files; 
		});
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.save = function(e) {
			jQuery("#" + that.formID).find(".quickAddProgress").html(that.sendingDataText);
		
			// Force CKEditor text into form elements where we can grab it
			jQuery.each(CKEDITOR.instances, function(k, instance) {
				instance.updateElement();
			});
			
			var formData = jQuery("#" + that.formID).serializeObject();
			
			// Added "forced relationship" settings if available
			var relatedID = jQuery("#" + that.formID).parent().data('relatedID');
			var relatedTable = jQuery("#" + that.formID).parent().data('relatedTable');
			var relationshipType = jQuery("#" + that.formID).parent().data('relationshipType');
			jQuery.extend(formData, {relatedID: relatedID, relatedTable: relatedTable, relationshipType: relationshipType });
			
			if(Object.keys(that._files).length > 0) {
				jQuery("#" + that.formID).find(".quickAddProgress").html((that.busyIndicator ? that.busyIndicator + ' ' : '') + that.sendingFilesText.replace("%1", "0%"));
				
				// Copy files in form into a FormData instance
				var fileData = new FormData();
				jQuery.each(that._files, function(k, v) {
					fileData.append(k, v[0]); // only grab the first file out of each file <input>; assume no multiples
				});
				$.ajax({
					url: that.fileUploadUrl,
					type: 'POST',
					data: fileData,
					cache: false,
					dataType: 'json',
					processData: false, // don't let jQuery try to process the files
					contentType: false, // set content type to false as jQuery will tell the server its a query string request
					xhr: function() {
						var jqXHR = new window.XMLHttpRequest();
						jqXHR.upload.addEventListener("progress", function(e){
							if (e.lengthComputable) {  
								var percentComplete = Math.round((e.loaded / e.total) * 100);
								jQuery("#" + that.formID).find(".quickAddProgress").html((that.busyIndicator ? that.busyIndicator + ' ' : '') + that.sendingFilesText.replace("%1", percentComplete + "%"));
							}
						}, false); 
						return jqXHR;
					},
					success: function(data, textStatus, jqXHR) {
						if(typeof data.error === 'undefined') {
							// success... add file paths to form data
							jQuery.each(data, function(k, v) {
								formData[k] = v;
							});

							// call function to process the form
							that.post(e, formData);
						} else {
							// handle errors here
							that.setErrors(["Service error " + data.error]);
							jQuery("#" + that.formID).find(".quickAddProgress").empty();
						}
					},
					error: function(jqXHR, textStatus, errorThrown) {
						// handle errors here
						that.setErrors(["Network error " + textStatus]);
						jQuery("#" + that.formID).find(".quickAddProgress").empty();
					}
				});
			} else {
				// no files; just submit the form data
				that.post(e, formData);
			}
		};
		
		that.post = function(e, formData) {
			jQuery("#" + that.formID).find(".quickAddProgress").html((that.busyIndicator ? that.busyIndicator + ' ' : '') + that.sendingDataText);
			jQuery.post(that.saveUrl, formData, function(resp, textStatus) {
				if (resp.status == 0) {
					var inputID = jQuery("#" + that.formID).parent().data('autocompleteInputID');
					var itemIDID = jQuery("#" + that.formID).parent().data('autocompleteItemIDID');
					var typeIDID = jQuery("#" + that.formID).parent().data('autocompleteTypeIDID');
					var relationbundle = jQuery("#" + that.formID).parent().data('relationbundle');
				
					jQuery('#' + inputID).val(resp.display);
					jQuery('#' + itemIDID).val(resp.id);
					jQuery('#' + typeIDID).val(resp.type_id);
					
					if(relationbundle) { relationbundle.select(null, resp); }
					jQuery.jGrowl(that.saveText.replace('%1', resp.display), { header: that.headerText }); 
					jQuery("#" + that.formID).parent().data('panel').hidePanel();
					
					if(formData['relatedID'] && caBundleUpdateManager) { 
						caBundleUpdateManager.reloadBundle('ca_objects_location'); 
						caBundleUpdateManager.reloadBundle('ca_objects_history'); 
						caBundleUpdateManager.reloadInspector(); 
					}
				} else {
					// error
					that.setErrors(resp.errors);
				}
				jQuery("#" + that.formID).find(".quickAddProgress").empty();
			}, "json");
		};
		
		that.setErrors = function(errors) {
			var content = '<div class="notification-error-box rounded"><ul class="notification-error-box">';
			for(var e in errors) {
				content += '<li class="notification-error-box">' + e + '</li>';
			}
			content += '</ul></div>';
			
			jQuery("#" + that.formErrorsPanelID).html(content).slideDown(200);
			
			var quickAddClearErrorInterval = setInterval(function() {
				jQuery("#" + that.formErrorsPanelID).slideUp(500);
				clearInterval(quickAddClearErrorInterval);
			}, 3000);
		};
		
		that.switchForm = function() {
			jQuery.each(CKEDITOR.instances, function(k, instance) {
				instance.updateElement();
			});
			jQuery("#" + that.formID + " input[name=type_id]").val(jQuery("#" + that.formTypeSelectID).val());
			var formData = jQuery("#" + that.formID).serializeObject();
			jQuery("#" + that.formID).parent().load(that.formUrl, formData);
			
		};
		
		// --------------------------------------------------------------------------------
		
		return that;
	};
	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.relationbundle.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2009-2015 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	$.widget("ui.relationshipLookup", $.ui.autocomplete, {
		_renderItem: function( ul, item ) {
			var li = jQuery("<li>")
				.attr("data-value", item.value)
				.append(jQuery("<a>").html(item.label))
				.appendTo(ul);
			
			if (item.id <= 0) {
				jQuery(li).find("a").removeClass().addClass("quickaddMenuItem");
				jQuery(li).removeClass().addClass("quickaddMenuItem");
			}
			return li;
		}
	});
	caUI.initRelationBundle = function(container, options) {
		options.onInitializeItem = function(id, values, options) { 
			jQuery("#" + options.itemID + id + " select").css('display', 'inline');
			var i, typeList, types = [], lists = [];
			
			var item_type_id = values['item_type_id'];
			
			// use type map to convert a child type id to the parent type id used in the restriction
			if (options.relationshipTypes && options.relationshipTypes['_type_map'] && options.relationshipTypes['_type_map'][item_type_id]) { item_type_id = options.relationshipTypes['_type_map'][item_type_id]; }
			
			if (options.relationshipTypes && (typeList = options.relationshipTypes[item_type_id])) {
				for(i=0; i < typeList.length; i++) {
					types.push({type_id: typeList[i].type_id, typename: typeList[i].typename, direction: typeList[i].direction});
				}
			} 
			
			var extraParams = {};
			
			// restrict to lists (for ca_list_items lookups)
			if (options && options.lists && options.lists.length) {
				if (!options.extraParams) { options.extraParams = {}; }
				if(typeof options.lists != 'object') { options.lists = [options.lists]; }
				options.extraParams.lists = options.lists.join(";");
			}

			// restrict to search expression
			if (options && options.restrictToSearch && options.restrictToSearch.length) {
				if (!options.extraParams) { options.extraParams = {}; }
				if (typeof options.restrictToSearch != 'string') { options.restrictToSearch = ''; }
				options.extraParams.restrictToSearch = options.restrictToSearch;
			}
			
			// restrict to types (for all lookups) - limits lookup to specific types of items (NOT relationship types)
			if (options && options.types && options.types.length) {
				if (!options.extraParams) { options.extraParams = {}; }
				if(typeof options.types != 'object') { options.types = [options.types]; }
				options.extraParams.types = options.types.join(";");
			}
			
			// look for null
			if (options.relationshipTypes && (typeList = options.relationshipTypes['NULL'])) {
				for(i=0; i < typeList.length; i++) {
					types.push({type_id: typeList[i].type_id, typename: typeList[i].typename, direction: typeList[i].direction});
				}
			}
			
			if (caUI && caUI.utils && caUI.utils.showUnsavedChangesWarning) {
				// Attached change handler to form elements in relationship
				jQuery('#' + options.itemID + id + ' select, #' + options.itemID + id + ' input, #' + options.itemID + id + ' textarea').not('.dontTriggerUnsavedChangeWarning').change(function() { caUI.utils.showUnsavedChangesWarning(true); });
			}
		};
		
		options.onAddItem = function(id, options, isNew) {
			if (!isNew) { return; }
			
			var autocompleter_id = options.itemID + id + ' #' + options.fieldNamePrefix + 'autocomplete' + id;

			jQuery('#' + autocompleter_id).relationshipLookup( 
				jQuery.extend({ minLength: ((parseInt(options.minChars) > 0) ? options.minChars : 3), delay: 800, html: true,
					source: function( request, response ) {
						$.ajax({
							url: options.autocompleteUrl,
							dataType: "json",
							data: jQuery.extend(options.extraParams, { term: request.term }),
							success: function( data ) {
								response(data);
							}
						});
					}, 
					select: function( event, ui ) {
						if (options.autocompleteOptions && options.autocompleteOptions.onSelect) {
							if (!options.autocompleteOptions.onSelect(autocompleter_id, ui.item)) { return false; }
						}
						
						if(!parseInt(ui.item.id) && options.quickaddPanel) {
							var panelUrl = options.quickaddUrl;
							//if (ui.item._query) { panelUrl += '/q/' + escape(ui.item._query); }
							if (options && options.types) {
								if(Object.prototype.toString.call(options.types) === '[object Array]') {
									options.types = options.types.join(",");
								}
								if (options.types.length > 0) {
									panelUrl += '/types/' + options.types;
								}
							}
							//if (options.fieldNamePrefix && (options.fieldNamePrefix.length > 0)) {
							//	panelUrl += '/field_name_prefix/' + options.fieldNamePrefix;
							//}
							options.quickaddPanel.showPanel(panelUrl, null, null, {q: ui.item._query, field_name_prefix: options.fieldNamePrefix});
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('autocompleteInputID', autocompleter_id);
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('autocompleteItemIDID', options.itemID + id + ' #' + options.fieldNamePrefix + 'id' + id);
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('autocompleteTypeIDID', options.itemID + id + ' #' + options.fieldNamePrefix + 'type_id' + id);
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('panel', options.quickaddPanel);
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('relationbundle', that);
					
							jQuery('#' + options.quickaddPanel.getPanelContentID()).data('autocompleteInput', jQuery("#" + options.autocompleteInputID + id).val());
					
							jQuery("#" + options.autocompleteInputID + id).val('');
							
							event.preventDefault();
							return;
						} else {
							if(!parseInt(ui.item.id) || (ui.item.id <= 0)) {
								jQuery('#' + autocompleter_id).val('');  // no matches so clear text input
								event.preventDefault();
								return;
							}
						}
						options.select(id, ui.item);
						
						jQuery('#' + autocompleter_id).val(jQuery.trim(ui.item.label.replace(/<\/?[^>]+>/gi, '')));
						event.preventDefault();
					},
					change: function( event, ui ) {
						// If nothing has been selected remove all content from autocompleter text input
						if(!jQuery('#' + options.itemID + id + ' #' + options.fieldNamePrefix + 'id' + id).val()) {
							jQuery('#' + autocompleter_id).val('');
						}
					}
				}, options.autocompleteOptions)
			).on('click', null, {}, function() { this.select(); });
		};
		
		options.select = function(id, data) {
			if (!id) { id = 'new_' + (that.getCount() - 1); } // default to current "new" option
			var item_id = data.id;
			var type_id = (data.type_id) ? data.type_id : '';
			if (parseInt(item_id) < 0) { return; }
			
			jQuery('#' + options.itemID + id + ' #' + options.fieldNamePrefix + 'id' + id).val(item_id);
			jQuery('#' + options.itemID + id + ' #' + options.fieldNamePrefix + 'type_id' + id).css('display', 'inline');
			var i, typeList, types = [];
			var default_type = 0;
			
			if (jQuery('#' + options.itemID + id + ' select[name=' + options.fieldNamePrefix + 'type_id' + id + ']').data('item_type_id') == type_id) {
				// noop - don't change relationship types unless you have to
			} else {
				if (options.relationshipTypes && (typeList = options.relationshipTypes[type_id])) {
					for(i=0; i < typeList.length; i++) {
						types.push({type_id: typeList[i].type_id, typename: typeList[i].typename, direction: typeList[i].direction, rank: typeList[i].rank });
						
						if (parseInt(typeList[i].is_default) === 1) {
							default_type = (typeList[i].direction ? typeList[i].direction : '') + typeList[i].type_id;
						}
					}
				} 
				// look for null (these are unrestricted and therefore always displayed)
				if (options.relationshipTypes && (typeList = options.relationshipTypes['NULL'])) {
					for(i=0; i < typeList.length; i++) {
						types.push({type_id: typeList[i].type_id, typename: typeList[i].typename, direction: typeList[i].direction, rank: typeList[i].rank });
						
						if (parseInt(typeList[i].is_default) === 1) {
							default_type = (typeList[i].direction ? typeList[i].direction : '') + typeList[i].type_id;
						}
					}
				}
				
				types.sort(function(a,b) {
					a.rank = parseInt(a.rank);
					b.rank = parseInt(b.rank);
					if (a.rank != b.rank) {
						return (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0);
					} 
					return (a.typename > b.typename) ? 1 : ((b.typename > a.typename) ? -1 : 0);
				});
				
				jQuery('#' + options.itemID + id + ' select#' + options.fieldNamePrefix + 'type_id' + id + ' option').remove();	// clear existing options
				jQuery.each(types, function (i, t) {
					var type_direction = (t.direction) ? t.direction+ "_" : '';
					jQuery('#' + options.itemID + id + ' select#' + options.fieldNamePrefix + 'type_id' + id).append("<option value='" + type_direction + t.type_id + "'>" + t.typename + "</option>");
				});
				
				// select default
				jQuery('#' + options.itemID + id + ' select#' + options.fieldNamePrefix + 'type_id' + id + " option[value=\"" + default_type + "\"]").prop('selected', true);
			
				// set current type
				jQuery('#' + options.itemID + id + ' select#' + options.fieldNamePrefix + 'type_id' + id).data('item_type_id', type_id);
			}
			that.showUnsavedChangesWarning(true);
		};
		
		options.sort = function(key) {
			var indexedValues = {};
			jQuery.each(jQuery(that.container + ' .bundleContainer .' + that.itemListClassName + ' .roundedRel'), function(k, v) {
				var id_string = jQuery(v).attr('id');
				if (id_string) {
					var indexKey;
					if(key == 'name') {
						indexKey = jQuery('#' + id_string + ' .itemName').text() + "/" + id_string;
					} else {
						if (key == 'type') {
							indexKey = jQuery('#' + id_string + ' .itemType').text() + "/" + id_string;
						} else {
							if (key == 'idno') {
								indexKey = jQuery('#' + id_string + ' .itemIdno').text() + "/" + id_string;
							} else {
                                alert(id_string);
								indexKey = id_string;
							}
						}
					}
					indexedValues[indexKey] = v;
				}
				jQuery(v).detach();
			});
			indexedValues = caUI.utils.sortObj(indexedValues, true);
			
			var whatsLeft = jQuery(that.container + ' .bundleContainer .' + that.itemListClassName).html();
			jQuery(that.container + ' .bundleContainer .' + that.itemListClassName).html('');
			jQuery.each(indexedValues, function(k, v) {
				jQuery(that.container + ' .bundleContainer .' + that.itemListClassName).append(v);
				var id_string = jQuery(v).attr('id');
				that.setDeleteButton(id_string);
			});
			
			jQuery(that.container + ' .bundleContainer .' + that.itemListClassName).append(whatsLeft);
			
			caUI.utils.showUnsavedChangesWarning(true);
			that._updateSortOrderListIDFormElement();
		};
	
		options.setDeleteButton = function(rowID) {
			var curRowID = rowID;
			if (!rowID) { return; }
			var n = rowID.split("_").pop();
			jQuery('#' + rowID + ' .caDeleteItemButton').on('click', null, {},
				function(e) { that.deleteFromBundle(n); e.preventDefault(); return false; }
			);
		};
		
		var that = caUI.initBundle(container, options);
		
		return that;
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.seteditor.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
//
// Note: requires jQuery UI.Sortable
//
 
var caUI = caUI || {};

(function ($) {
	caUI.seteditor = function(options) {
		var that = jQuery.extend({
			setID: null,
			table_num: null,
			fieldNamePrefix: null,
			setEditorID: 'setItemEditor',
			setItemListID: 'setItemList',	
			setNoItemWarningID: 'setNoItemsWarning',
			setItemAutocompleteID: 'setItemAutocompleter',
			rowIDListID: 'setRowIDList',
			
			lookupURL: null,
			itemInfoURL: null,
			editSetItemsURL: null,			// url of set item editor (without item_id parameter key or value)
			
			editSetItemButton: null,		// html to use for edit set item button
			
			initialValues: null,
			initialValueOrder: null,			/* id's to list display list in; required because Google Chrome doesn't iterate over keys in an object in insertion order [doh] */	
		
		}, options);
		
		
		// ------------------------------------------------------------------------------------
		that.initSetEditor = function() {
			
			// setup autocompleter
			jQuery('#' + that.setItemAutocompleteID).autocomplete(
				{
					source: that.lookupURL,
					minLength: 3, max: 50, html: true,
					select: function(event, ui) {
						jQuery.getJSON(that.itemInfoURL, {'set_id': that.setID, 'table_num': that.table_num, 'row_id': ui.item.id} , 
							function(data) { 
								if(data.status != 'ok') { 
									alert("Error getting item information");
								} else {
									that.addItemToSet(data.row_id, data, true, true);
									jQuery('#' + that.setItemAutocompleteID).attr('value', '');
								}
							}
						);
					}
				}
			);
			
			// add initial items
			if (that.initialValues) {
				jQuery.each(that.initialValueOrder, function(k, v) {
					that.addItemToSet(that.initialValues[v].row_id, that.initialValues[v], false);
				});
			}
			
			that.refresh();
		}
		// ------------------------------------------------------------------------------------
		// Adds item to set editor display
		that.addItemToSet = function(rowID, valueArray, isNew, prepend) {
			if (isNew) { 
				var id_list = that.getRowIDs();
				if(jQuery.inArray(rowID, id_list) != -1) {	// don't allow dupes
					return false;
				}
			}
			var repHTML = valueArray.representation_url || '';
			if (repHTML && that.editSetItemsURL) {
				repHTML = '<div style="margin-left: 25px; background-image: url(\'' +  repHTML + '\'); width: ' + valueArray.representation_width + 'px; height: ' + valueArray.representation_height + 'px;"> </div>';
			}
			
			var itemID = valueArray['item_id'];
			var rID = rowID + ((itemID > 0) ? "_" + itemID : "");
			console.log("item=" + itemID, rowID, rID, repHTML);
			
			var editLinkHTML = '';
			if ((that.editSetItemButton) && (itemID > 0)) {
				editLinkHTML = '<div style="float: left;"><a href="' + that.editSetItemsURL + '/item_id/' + valueArray['item_id'] + '" title="' + that.editSetItemToolTip +'" class="setItemEditButton">' + that.editSetItemButton + '</a></div> ';
			}
			
			var itemHTML = "<li class='setItem' id='" + that.fieldNamePrefix + "setItem" + rID +"'><div id='" + that.fieldNamePrefix + "setItemContainer" + rID + "' class='imagecontainer'>";
			if (itemID > 0)  { itemHTML += "<div class='remove'><a href='#' class='setDeleteButton' id='" + that.fieldNamePrefix + "setItemDelete" + itemID + "'>&nbsp;</a></div>"; }
			itemHTML += "<div class='setItemThumbnail'>" + editLinkHTML + repHTML + "</div><div class='setItemCaption'>" + valueArray.set_item_label + " [<span class='setItemIdentifier'>" + valueArray.idno + "</span>]</div><div class='setItemIdentifierSortable'>" + valueArray.idno_sort + "</div></div><br style='clear: both;'/></li>";
			
			if (prepend) {
				jQuery('#' + that.fieldNamePrefix + that.setItemListID).prepend(itemHTML);
			} else {
				jQuery('#' + that.fieldNamePrefix + that.setItemListID).append(itemHTML);
			}
			
			if (itemID > 0) { that.setDeleteButton(rowID, itemID); }
			
			if (isNew) { 
				that.refresh(); 
				caUI.utils.showUnsavedChangesWarning(true);
			}
			return true;
		}
		// ------------------------------------------------------------------------------------
		that.setDeleteButton = function(rowID, itemID) {
			var rID = rowID + ((itemID > 0) ? "_" + itemID : "");
			jQuery('#' + that.fieldNamePrefix + "setItemDelete" + itemID).click(
				function() {
					jQuery('#' + that.fieldNamePrefix + "setItem" + rID).fadeOut(250, function() { 
						jQuery('#' + that.fieldNamePrefix + "setItem" + rID).remove(); 
						that.refresh();
					});
					caUI.utils.showUnsavedChangesWarning(true);
					return false;
				}
			);
		}
		// ------------------------------------------------------------------------------------
		// Returns list of item row_ids in user-defined order
		that.getRowIDs = function() {
			var id_list = [];
			jQuery.each(jQuery('#' + that.fieldNamePrefix + that.setItemListID + ' .setItem'), function(k, v) {
				var id_string = jQuery(v).attr('id');
				if (id_string) { 
					id_list.push(id_string.replace(that.fieldNamePrefix + 'setItem', ''));
				}
			});
			return id_list;
		}
		// ------------------------------------------------------------------------------------
		that.refresh = function() {
			jQuery('#' + that.fieldNamePrefix + that.setItemListID).sortable({ opacity: 0.7, 
				revert: true, 
				scroll: true,
				update: function() {
					that.refresh();
					caUI.utils.showUnsavedChangesWarning(true);
				}
			});
			
			// set warning if no items on load
			jQuery('#' + that.fieldNamePrefix + that.setItemListID + ' li.setItem').length ? jQuery('#' + that.fieldNamePrefix + that.setNoItemWarningID).hide() : jQuery('#' + that.fieldNamePrefix + that.setNoItemWarningID).show();
			jQuery('#' + that.rowIDListID).val(that.getRowIDs().join(';'));
		}
		// ------------------------------------------------------------------------------------
		that.sort = function(key) {
			var indexedValues = {};
			var indexKeyClass = null;
			switch(key) {
				case 'name':
					indexKeyClass = 'setItemCaption';
					break;
				case 'idno':
					indexKeyClass = 'setItemIdentifierSortable';
					break;
				default:
					return false;
					break;
			}
			
			jQuery.each(jQuery('#' + that.fieldNamePrefix + that.setItemListID + ' .setItem'), function(k, v) {
				var id_string = jQuery(v).attr('id');
				if (id_string) {
					var indexKey = jQuery('#' + id_string + ' .imagecontainer .' + indexKeyClass).text();
					indexedValues[indexKey] = v;
				}
				jQuery(v).remove();
			});
			indexedValues = caUI.utils.sortObj(indexedValues, true);
			
			jQuery.each(indexedValues, function(k, v) {
				jQuery('#' + that.fieldNamePrefix + that.setItemListID).append(v);
				var id_string = jQuery(v).attr('id');
				var id = id_string.replace(that.fieldNamePrefix + 'setItem', '');
				var rIDBits = id.split(/_/);
				that.setDeleteButton(rIDBits[0], rIDBits[1]);
			});
			
			caUI.utils.showUnsavedChangesWarning(true);
			that.refresh();
		}
		// ------------------------------------------------------------------------------------
		
		// ------------------------------------------------------------------------------------
		
		that.initSetEditor();
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.tableview.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initTableView = function(container, options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			container: container,
			initialData: null,
			rowCount: null,		// number of rows in result set to display
			contextMenu: false,
			columnSorting: true,
			
			dataLoadUrl: null,
			dataSaveUrl: null,
			editLinkFormat: null,
			
			rowHeaders: null,
			colHeaders: null,
			columns: null,
			colWidths: null,
			
			currentRowClassName: 'caResultsEditorCurrentRow',
			currentColClassName: 'caResultsEditorCurrentCol',
			readOnlyCellClassName: 'caResultsEditorReadOnlyCell',
			statusDisplayClassName: 'caResultsEditorStatusDisplay',
			
			saveMessage: "Saving...",
			errorMessagePrefix: "[Error]",
			saveSuccessMessage: "Saved changes",
			
			lastLookupIDMap: null,
			
			saveQueue: [],
			saveQueueIsRunning: false
		}, options);
		
	
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------

		that.htmlRenderer = function(instance, td, row, col, prop, value, cellProperties) {
			if (cellProperties.readOnly) {
				td.className = that.readOnlyCellClassName;
			}
			jQuery(td).empty().append(value);
			return td;
		};
		
		that.caResultsEditorOpenFullScreen = function() {
			var ht = jQuery(that.container).data('handsontable');
			jQuery(that.container).toggleClass('caResultsEditorContentFullScreen');
		
			caResultsEditorPanel.showPanel();
			
			jQuery('#scrollingResults').toggleClass('caResultsEditorContainerFullScreen').prependTo('#caResultsEditorPanelContentArea'); 
		
			jQuery('.caResultsEditorToggleFullScreenButton').hide();
			jQuery("#caResultsEditorControls").show();
		
			ht.updateSettings({width: jQuery("#caResultsEditorPanelContentArea").width() - 15, height: jQuery("#caResultsEditorPanelContentArea").height() - 32});
			jQuery(that.container).width(jQuery("#caResultsEditorPanelContentArea").width() - 15).height(jQuery("#caResultsEditorPanelContentArea").height() - 32).resize();
		
			ht.render();
		}
	
		that.caResultsEditorCloseFullScreen = function(dontDoHide) {
			if (!dontDoHide) { caResultsEditorPanel.hidePanel(); }
			var ht = jQuery(that.container).data('handsontable');
	
			jQuery('#scrollingResults').toggleClass('caResultsEditorContainerFullScreen').prependTo('#caResultsEditorWrapper'); 
			jQuery(that.container).toggleClass('caResultsEditorContentFullScreen');
	
			jQuery('.caResultsEditorToggleFullScreenButton').show();
			jQuery("#caResultsEditorControls").hide();
	
			ht.updateSettings({width: 740, height: 500 });
			jQuery(that.container).width(740).height(500).resize();
			ht.render();
		}
		// --------------------------------------------------------------------------------
		
		that.colWidths = [];
		jQuery.each(that.columns, function(i, v) {
			that.colWidths.push(200);
			switch(that.columns[i]['type']) {
				case 'DT_SELECT':
					delete(that.columns[i]['type']);
					that.columns[i]['type'] = 'autocomplete';
					that.columns[i]['editor'] = 'dropdown';
					break;
				case 'DT_LOOKUP':
					var d = that.columns[i]['data'];
					var lookupUrl = that.columns[i]['lookupURL'];
					var list = that.columns[i]['list'];
					that.columns[i] = {
						'data' : d,
						'type': 'autocomplete',
						'strict': false,
						'source' : function (query, process) {
							if (!query) { return; }
							$.ajax({
								url: lookupUrl,
								data: {
									term: query,
									list: list,
									simple: 0,
									
									
								},
								success: function (response) {
									console.log("r", response);
									var labels = [];
									that.lastLookupIDMap = {};
									for(var k in response) {
										labels.push(response[k]['label']);
										that.lastLookupIDMap[response[k]['label']] = k;
									}
									if (labels.length > 0) {
										process(labels);
									}
								}
							})
					}};
					break;
				default:
					delete(that.columns[i]['type']);
					that.columns[i]['renderer'] = that.htmlRenderer;
					break;
			}
		});
		// --------------------------------------------------------------------------------
		
		that.save = function(change) {
			that.saveQueue.push(change);
			that._runSaveQueue();
		};
		// --------------------------------------------------------------------------------
		
		that._runSaveQueue = function() {
			if (that.saveQueueIsRunning) { 
				console.log("Queue is already running");	
				return false;
			}
			
			that.saveQueueIsRunning = true;
			var q = that.saveQueue;
			
			if (!q.length) { 
				that.saveQueueIsRunning = false;
				return false;
			}
			
			var ht = jQuery(that.container).data('handsontable');
			
			// make map from item_id to row, and vice-versa
			var rowToItemID = {}, itemIDToRow = {}, rowData = {};
			jQuery.each(q, function(k, v) {
				rowToItemID[v['change'][0][0]] = v['id'];
				itemIDToRow[v['id']] = v['change'][0][0];
				rowData[v['change'][0][0]] = v;
			});
			
			that.saveQueue = [];
			jQuery.getJSON(that.dataSaveUrl, { changes: q },
				function(data) {
					if (data.errors && (data.errors instanceof Object)) {
						var errorMessages = [];
						jQuery.each(data.errors, function(k, v) {
							errorMessages.push(that.errorMessagePrefix + ": " + v.message);
							ht.setDataAtRowProp(itemIDToRow[k], rowData[itemIDToRow[k]]['change'][0][1], rowData[itemIDToRow[k]]['change'][0][2], 'external');
						});
						jQuery("." + that.statusDisplayClassName).html(errorMessages.join('; '));
					} else {
						jQuery("." + that.statusDisplayClassName).html(that.saveSuccessMessage);
						
						jQuery.each(data.messages, function(k, v) {
							ht.setDataAtRowProp(itemIDToRow[k], rowData[itemIDToRow[k]]['change'][0][1], v['value'], 'external');
						});
						setTimeout(function() { jQuery('.' + that.statusDisplayClassName).fadeOut(500); }, 5000);
					}
					
					that.saveQueueIsRunning = false;
					that._runSaveQueue(); // anything else to save?
				}
			);
			
			return true;
		};
		// --------------------------------------------------------------------------------
		
		var ht = jQuery(that.container).handsontable({
			data: that.initialData,
			rowHeaders: that.rowHeaders,
			colHeaders: that.colHeaders,
			
			minRows: that.rowCount,
			maxRows: that.rowCount,
			contextMenu: that.contextMenu,
			columnSorting: that.columnSorting,
			
			currentRowClassName: that.currentRowClassName,
			currentColClassName: that.currentColClassName,
			
			stretchH: "all",
			columns: that.columns,
			colWidths: that.colWidths,
			
			dataLoadUrl: that.dataLoadUrl,
			editLinkFormat: that.editLinkFormat,
			statusDisplayClassName: that.statusDisplayClassName,
			
			onChange: function (change, source) {
				if ((source === 'loadData') || (source === 'updateAfterRequest') || (source === 'external')) {
				  return; //don't save this change
				}
				jQuery("." + that.statusDisplayClassName).html(that.saveMessage).fadeIn(500);
				
				var item_id = this.getDataAtRowProp(parseInt(change[0]), 'item_id');
				
				var pieces = (change[0] instanceof Array) ? change[0][1].split("-") : change[1].split("-");
				var table = pieces.shift();
				var bundle = pieces.join('-');
				
				if (that.lastLookupIDMap) {
					if (that.lastLookupIDMap[change[0][3]]) {
						change[0][3] = that.lastLookupIDMap[change[0][3]];
					}
				}
				that.lastLookupIDMap = null;
				
				that.save({ 'table' : table, 'bundle': bundle, 'id': item_id, 'value' : change[0][3], 'change' : change, 'source': source });
			}
		});
		
		return that;
		
		// --------------------------------------------------------------------------------
	};	
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.uniquenesschecker.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2011-2013 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initUniquenessChecker = function(options) {
		var that = jQuery.extend({
			errorIcon: null,
			processIndicator: null,
			statusID: 'status',
			lookupUrl: null,
			formElementID: null,
			separator: '.',
			table_num: null,
			row_id: null,
			field: null,
			withinFields: {},
			
			alreadyInUseMessage: 'value is already in use',
		}, options);
		
		
		that.checkValue = function() { 
			jQuery('#' + that.statusID).html((that.processIndicator ? '<img src=\'' + that.processIndicator + '\' border=\'0\'/>' : ''));
			
			var val = jQuery('#' + that.formElementID).val();
			jQuery.getJSON(that.lookupUrl, { n: val, table_num: that.table_num, id: that.row_id, field: that.field, withinFields: that.withinFields}, 
				function(data) {
					if (
						(
							(data.length > 1) &&
							(jQuery.inArray(that.row_id, data) === -1)
						) ||
						(
							(data.length == 1) &&
							(parseInt(data) != parseInt(that.row_id))
						)
					) {
						var msg = that.alreadyInUseMessage;
						jQuery('#' + that.statusID).html((that.errorIcon ? '<img src=\'' + that.errorIcon + '\' border=\'0\'/> ' : '') + msg).show(0);
					} else{
						jQuery('#' + that.statusID).html('').hide(0);
					}
				}
			);
		}
		
		jQuery('#' + that.formElementID).bind('change keyup', that.checkValue);
		
		that.checkValue();
		return that;
	};
})(jQuery);
/* ----------------------------------------------------------------------
 * js/ca/ca.utils.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2009-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initUtils = function(options) {
		var that = jQuery.extend({
			
			// Unsaved change warning options
			unsavedChangesWarningMessage: 'You have made changes in this form that you have not yet saved. If you navigate away from this form you will lose your unsaved changes.',
			disableUnsavedChangesWarning: false
		}, options);
		
		that.showUnsavedChangesWarningFlag = false;
		caUI.utils = {};
		//
		// Unsaved change warning methods
		//		
			// Sets whether warning should be shown if user tries to navigate away
			caUI.utils.showUnsavedChangesWarning = function(b) {
				if (b === undefined) { b = true; }
				that.showUnsavedChangesWarningFlag = b ? true : false;
				return this;
			};
			
			// Returns true if warning will be shown if user user tries to navigate away
			caUI.utils.shouldShowUnsavedChangesWarning = function() {
				return that.showUnsavedChangesWarningFlag;
			};
			
			// returns text of warning message
			caUI.utils.getUnsavedChangesWarningMessage = function() {
				return that.unsavedChangesWarningMessage;
			};
			
			// If set to true, no warning will be triggered
			caUI.utils.disableUnsavedChangesWarning = function(b) {
				that.disableUnsavedChangesWarning = b ? true : false;
			};
			
			caUI.utils.getDisableUnsavedChangesWarning = function(b) {
				return that.disableUnsavedChangesWarning;
			};
			
			// init event handler
			window.onbeforeunload = function() { 
				if(!caUI.utils.getDisableUnsavedChangesWarning() && caUI.utils.shouldShowUnsavedChangesWarning()) {
					return caUI.utils.getUnsavedChangesWarningMessage();
				}
			}
			
			// ------------------------------------------------------------------------------------
			
			caUI.utils.sortObj = function(arr, isCaseInsensitive) {
				var sortedKeys = new Array();
				var sortedObj = {};
				
				// Separate keys and sort them
				for (var i in arr){
					sortedKeys.push(i);
				}
				
				if (isCaseInsensitive) {
					sortedKeys.sort(caUI.utils._caseInsensitiveSort);
				} else {
					sortedKeys.sort();
				}
				
				// Reconstruct sorted obj based on keys
				for (var i in sortedKeys){
					sortedObj[sortedKeys[i]] = arr[sortedKeys[i]];
				}
				return sortedObj;
			};
			
			caUI.utils._caseInsensitiveSort = function(a, b) { 
			   var ret = 0;
			   a = a.toLowerCase();
			   b = b.toLowerCase();
			   if(a > b) 
				  ret = 1;
			   if(a < b) 
				  ret = -1; 
			   return ret;
			}
			
			// ------------------------------------------------------------------------------------
			// Update state/province form drop-down based upon country setting
			// Used by BaseModel for text fields with DISPLAY_TYPE DT_COUNTRY_LIST and DT_STATEPROV_LIST
			//
			caUI.utils.updateStateProvinceForCountry = function(e) {
				var data = e.data;
				var stateProvID = data.stateProvID;
				var countryID = data.countryID;
				var statesByCountryList = data.statesByCountryList;
				var stateValue = data.value;
				var mirrorStateProvID = data.mirrorStateProvID;
				var mirrorCountryID = data.mirrorCountryID;
				
				var origStateValue = jQuery('#' + stateProvID + '_select').val();
				
				jQuery('#' + stateProvID + '_select').empty();
				var countryCode = jQuery('#' + countryID).val();
				if (statesByCountryList[countryCode]) {
					for(k in statesByCountryList[countryCode]) {
						jQuery('#' + stateProvID + '_select').append('<option value="' + statesByCountryList[countryCode][k] + '">' + k + '</option>');
						
						if (!stateValue && (origStateValue == statesByCountryList[countryCode][k])) {
							stateValue = origStateValue;
						}
					}
					jQuery('#' + stateProvID + '_text').css('display', 'none').attr('name', stateProvID + '_text');
					jQuery('#' + stateProvID + '_select').css('display', 'inline').attr('name', stateProvID).val(stateValue);
					
					if (mirrorCountryID) {
						jQuery('#' + stateProvID + '_select').change(function() {
							jQuery('#' + mirrorStateProvID + '_select').val(jQuery('#' + stateProvID + '_select').val());
						});
						jQuery('#' + mirrorCountryID + '_select').val(jQuery('#' + countryID + '_select').val());
						caUI.utils.updateStateProvinceForCountry({ data: {stateProvID: mirrorStateProvID, countryID: mirrorCountryID, statesByCountryList: statesByCountryList, value: stateValue}});
					}
				} else {
					jQuery('#' + stateProvID + '_text').css('display', 'inline').attr('name', stateProvID);
					jQuery('#' + stateProvID + '_select').css('display', 'none').attr('name', stateProvID + '_select');
					
					if (mirrorCountryID) {
						jQuery('#' + stateProvID + '_text').change(function() {
							jQuery('#' + mirrorStateProvID + '_text').val(jQuery('#' + stateProvID + '_text').val());
						});
						jQuery('#' + mirrorCountryID + '_select').attr('selectedIndex', jQuery('#' + countryID + '_select').attr('selectedIndex'));
						
						caUI.utils.updateStateProvinceForCountry({ data: {stateProvID: mirrorStateProvID, countryID: mirrorCountryID, statesByCountryList: statesByCountryList}});
					}
				}
			};
			// --------------------------------------------------------------------------------
			// Convert file size in bytes to display format 
			//
			// @param string The file size in bytes
			//
			caUI.utils.formatFilesize = function(filesize) {
				if (filesize >= 1073741824) {
					filesize = caUI.utils.formatNumber(filesize / 1073741824, 2, '.', '') + ' Gb';
				} else { 
					if (filesize >= 1048576) {
						filesize = caUI.utils.formatNumber(filesize / 1048576, 2, '.', '') + ' Mb';
					} else { 
						if (filesize >= 1024) {
							filesize = caUI.utils.formatNumber(filesize / 1024, 0) + ' Kb';
						} else {
							filesize = caUI.utils.formatNumber(filesize, 0) + ' bytes';
						};
					};
				};
				return filesize;
			};
		
			caUI.utils.formatNumber = function formatNumber( number, decimals, dec_point, thousands_sep ) {
				// http://kevin.vanzonneveld.net
				// +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
				// +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
				// +     bugfix by: Michael White (http://crestidg.com)
				// +     bugfix by: Benjamin Lupton
				// +     bugfix by: Allan Jensen (http://www.winternet.no)
				// +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)    
				// *     example 1: number_format(1234.5678, 2, '.', '');
				// *     returns 1: 1234.57     
 
				var n = number, c = isNaN(decimals = Math.abs(decimals)) ? 2 : decimals;
				var d = dec_point == undefined ? "," : dec_point;
				var t = thousands_sep == undefined ? "." : thousands_sep, s = n < 0 ? "-" : "";
				var i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "", j = (j = i.length) > 3 ? j % 3 : 0;
 
				return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
			};
			
			
			//
			// http://thecodeabode.blogspot.com
			// @author: Ben Kitzelman
			// @updated: 03-03-2013
			//
			caUI.utils.getAcrobatInfo = function() {

				var getBrowserName = function() {
					return this.name = this.name || function() {
						var userAgent = navigator ? navigator.userAgent.toLowerCase() : "other";

						if(userAgent.indexOf("chrome") > -1)        return "chrome";
						else if(userAgent.indexOf("safari") > -1)   return "safari";
						else if(userAgent.indexOf("msie") > -1)     return "ie";
						else if(userAgent.indexOf("firefox") > -1)  return "firefox";
						return userAgent;
					}();
				};

				var getActiveXObject = function(name) {
					try { return new ActiveXObject(name); } catch(e) {}
				};

				var getNavigatorPlugin = function(name) {
					for(key in navigator.plugins) {
						var plugin = navigator.plugins[key];
						if(plugin.name == name) return plugin;
					}
				};

				var getPDFPlugin = function() {
					return this.plugin = this.plugin || function() {
						if(getBrowserName() == 'ie') {
							//
							// load the activeX control
							// AcroPDF.PDF is used by version 7 and later
							// PDF.PdfCtrl is used by version 6 and earlier
							return getActiveXObject('AcroPDF.PDF') || getActiveXObject('PDF.PdfCtrl');
						} else {
							return getNavigatorPlugin('Adobe Acrobat') || getNavigatorPlugin('Chrome PDF Viewer') || getNavigatorPlugin('WebKit built-in PDF');
						}
					}();
				};

				var isAcrobatInstalled = function() {
					return !!getPDFPlugin();
				};

				var getAcrobatVersion = function() {
					try {
						var plugin = getPDFPlugin();

						if(getBrowserName() == 'ie') {
							var versions = plugin.GetVersions().split(',');
							var latest   = versions[0].split('=');
							return parseFloat(latest[1]);
						}

						if(plugin.version) return parseInt(plugin.version);
						return plugin.name
					} catch(e) {
						return null;
					}
				}

				//
				// The returned object
				// 
				return {
					browser:        getBrowserName(),
					acrobat:        isAcrobatInstalled() ? 'installed' : false,
					acrobatVersion: getAcrobatVersion()
				};
			};
			// ------------------------------------------------------------------------------------
		
		return that;
	};
	
	
})(jQuery);

$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
/* ----------------------------------------------------------------------
 * js/ca/ca.widgetpanel.js
 * ----------------------------------------------------------------------
 * CollectiveAccess
 * Open-source collections management software
 * ----------------------------------------------------------------------
 *
 * Software by Whirl-i-Gig (http://www.whirl-i-gig.com)
 * Copyright 2010-2014 Whirl-i-Gig
 *
 * For more information visit http://www.CollectiveAccess.org
 *
 * This program is free software; you may redistribute it and/or modify it under
 * the terms of the provided license as published by Whirl-i-Gig
 *
 * CollectiveAccess is distributed in the hope that it will be useful, but
 * WITHOUT ANY WARRANTIES whatsoever, including any implied warranty of 
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  
 *
 * This source code is free and modifiable under the terms of 
 * GNU General Public License. (http://www.gnu.org/copyleft/gpl.html). See
 * the "license.txt" file for details, or visit the CollectiveAccess web site at
 * http://www.CollectiveAccess.org
 *
 * ----------------------------------------------------------------------
 */
 
var caUI = caUI || {};

(function ($) {
	caUI.initWidgetPanel = function(options) {
		// --------------------------------------------------------------------------------
		// setup options
		var that = jQuery.extend({
			widgetUrl: '',
			panelCSSClass: 'browseSelectPanel',
			
			useExpose: true,
			
			isChanging: false
		}, options);
		
		// --------------------------------------------------------------------------------
		// Define methods
		// --------------------------------------------------------------------------------
		that.showWidgetPanel = function() {
			that.isChanging = true;
			jQuery("#dashboardWidgetPanel").fadeIn(200, function() { that.isChanging = false; });
			
			if (that.useExpose) { 
				jQuery("#dashboardWidgetPanel").expose({api: true, color: '#000000', opacity: 0.5}).load(); 
			}
			jQuery("#dashboardWidgetPanelContent").load(that.widgetUrl, {});
		}
		
		that.hideWidgetPanel = function() {
			that.isChanging = true;
			jQuery("#dashboardWidgetPanel").fadeOut(200, function() { that.isChanging = false; });
			
			if (that.useExpose) {
				jQuery.mask.close();
			}
			jQuery("#dashboardWidgetPanelContent").empty();
		}
		
		that.WidgetPanelIsVisible = function() {
			return (jQuery("#dashboardWidgetPanel:visible").length > 0) ? true : false;
		}

		// --------------------------------------------------------------------------------
		// Set up handler to trigger appearance of browse panel
		// --------------------------------------------------------------------------------
		jQuery(document).ready(function() {
			
			// hide panel if click is outside of panel
			jQuery(document).click(function(event) {
				var p = jQuery(event.target).parents().map(function() { return this.id; }).get();
				if (!that.isChanging && that.WidgetPanelIsVisible() && (jQuery.inArray('dashboardWidgetPanel', p) == -1)) {
					that.hideWidgetPanel();
				}
			});
			
			// hide browse panel if escape key is clicked
			jQuery(document).keyup(function(event) {
				if ((event.keyCode == 27) && !that.isChanging && that.WidgetPanelIsVisible()) {
					that.hideWidgetPanel();
				}
			});
		});
		
		// --------------------------------------------------------------------------------
		
		return that;
	};	
})(jQuery);