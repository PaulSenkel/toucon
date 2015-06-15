jQuery.sap.require("sap.ui.layout.Grid");
jQuery.sap.require("sap.ui.layout.GridData");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");

/**
 * @param {string} [title] title of the box
 * @param {string} [icon] URL to an icon, e.g. sap-icon://home
 *
 * @desc The Box control is a content area with an icon, a title
 * both are contained in an horizontal layout
 * followed by the standard content[]
 * @extends sap.ui.layout.Grid
 * @returns sap.ui.layout.Grid
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
 * @alias toucon-Box
 */
var touconBox = sap.ui.layout.Grid.extend("toucon.Box", {  
	metadata: {  
		properties: {  
			title : { type: "string", defaultValue: null },
			icon : { type: "string", defaultValue: null },
		},
		aggregations: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	oHeader: null,
	oIcon: null,
	oTitle: null,
	//We release these variables manually onExit
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Box
	 */
	exit: function () {
        if (this.oHeader) {
            this.oHeader.destroy();
            delete this.oHeader;
        }
        if (this.oIcon) {
            this.oIcon.destroy();
            delete this.oIcon;
        }
        if (this.oTitle) {
            this.oTitle.destroy();
            delete this.oTitle;
        }
    },
	/**
	 * @desc Initializes the header, icon and title controls and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconBox, .touconBoxUnderline, .touconBoxIcon, .touconBoxTitle
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Box
	 */
	init: function() {
		//Box decoration (background, rounded corners etc.)
		this.addStyleClass("touconBox");
		
		//We prepare the header zone
		this.oHeader = new sap.ui.layout.HorizontalLayout({
			layoutData : new sap.ui.layout.GridData({
				span: "L12 M12 S12"})
		}).addStyleClass("touconBoxUnderline");
		this.addContent(this.oHeader);

		//We prepare the icon zone
		this.oIcon = new sap.ui.core.Icon( {  
	        src : ""  
	    } ).addStyleClass("touconBoxIcon");
		this.oHeader.addContent(this.oIcon);

		//We prepare the title zone
		this.oTitle = new sap.m.Label({
			text: "",
			tooltip: "",
			layoutData : new sap.ui.layout.GridData({
				span: "L12 M12 S12",
				linebreakL: true,
				linebreakM: true,
				linebreakS: true
			})}).addStyleClass("touconBoxTitle");
		this.oHeader.addContent(this.oTitle);
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the Box params and calls the sap.ui.layout.GridRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Box
	 */
	renderer: function(oRm, oControl) {
		//Here we fill the icon and title
		oControl.oIcon.setSrc(oControl.getIcon());
		oControl.oTitle.setText(oControl.getTitle());
		oControl.oTitle.setTooltip(oControl.getTitle());
		
		//We call the default renderer for this object as we do not want to do anything special
		sap.ui.layout.GridRenderer.render(oRm, oControl);
	}
});