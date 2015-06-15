jQuery.sap.require("sap.ui.layout.Grid");
jQuery.sap.require("sap.ui.layout.GridData");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");

/**
 * @param {sap.ui.core.Control} [topContent] controls which are added here will be displayed horizontally
 * @param {sap.ui.core.Control} [mainContent] controls which are added here will be displayed in a responsive grid according to their layout data
 * @param {sap.ui.core.Control} [bottomContent] controls which are added here will be displayed horizontally
 *
 * @desc A container with three aggregations for content. 
 * <br>
 * topContents will be added to a sap.ui.layout.HorizontalLayout
 * <br>
 * mainContents will be added to a sap.ui.layout.Grid
 * <br>
 * bottomContents will be added to a sap.ui.layout.HorizontalLayout
 * 
 * @extends sap.m.Page
 * @returns sap.m.Page
 *
 * @class
 * @author Paul Senkel
 * @copyright 2015 Paul Senkel
 * @license Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * @version 1.0
 *
 * @constructor
 * @public
 * @alias toucon-Page
 */
var touconPage = sap.m.Page.extend("toucon.Page", {  
	metadata: {  
		properties: {  
		},
		//These aggregations can be used to addTopContent etc. in standard fashion
		aggregations: {
			"topContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"mainContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"bottomContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"}
		},
		events: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	oTopContainer: null,
	oMainContainer: null,
	oBottomContainer: null,
	//We release these variables manually onExit
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Page
	 */
	exit: function () {
        if (this.oTopContainer) {
            this.oTopContainer.destroy();
            delete this.oTopContainer;
        }
        if (this.oMainContainer) {
            this.oMainContainer.destroy();
            delete this.oMainContainer;
        }
        if (this.oBottomContainer) {
            this.oBottomContainer.destroy();
            delete this.oBottomContainer;
        }
    },
	/**
	 * @desc Initializes the top, main and bottom content containers and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconPage, .touconPageHeader, .touconPageContent, .touconPageFooter
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Page
	 */
	init: function() {
		//Page decoration (background etc.)
		this.addStyleClass("touconPage");//("pageBG");
		
		//We prepare the different content zones
		this.oTopContainer = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});
	 	this.oTopContainer.addStyleClass("touconPageHeader");//("width100p padding0");
	 	
	 	this.oMainContainer = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1
		});
		this.oMainContainer.addStyleClass("touconPageContent");//("width100p padding0 gridBG");
		
		this.oBottomContainer = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});
	 	this.oBottomContainer.addStyleClass("touconPageFooter");//("width100p padding0 height100p");

	 	this.addContent(this.oTopContainer);
	 	this.addContent(this.oMainContainer);
	 	this.addContent(this.oBottomContainer);
	},
	/**
	 * @desc Through this function we grant direct access to the topContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-Page
	 */
	getTopContainer : function () {
		return this.oTopContainer;
	},
	/**
	 * @desc Through this function we grant direct access to the mainContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-Page
	 */
	getContentContainer : function () {
		return this.oMainContainer;
	},
	/**
	 * @desc Through this function we grant direct access to the bootomContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-Page
	 */
	getBottomContainer : function () {
		return this.oBottomContainer;
	},
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Pushes the top, main and bottom contents into the three respective layout containers's
	 * content aggregations and calls the sap.m.PageRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Page
	 */
	renderer: function(oRm, oControl) {
		//We fill our three layouts with the aggregation
		oControl.getTopContainer().mAggregations.content=oControl.getTopContent();
		oControl.getContentContainer().mAggregations.content=oControl.getMainContent();
		oControl.getBottomContainer().mAggregations.content=oControl.getBottomContent();
		
		//We call the default renderer for this object as we do not want to do anything special
		sap.m.PageRenderer.render(oRm, oControl);
	}
});