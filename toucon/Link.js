jQuery.sap.require("toucon.Icon");
/**
 * @param {string} [text] a string which will be translated by the textRules map or used as is
 * @param {object} [textRules] a map which translates the text to a different string if given
 * @param {string} [icon] an icon URL or a value which will be translated by the iconRules map
 * @param {object} [iconRules] a map which translates the icon value to a valid icon URL
 *
 * @desc This Link will render an imitation of a sap.m.Link which does not only display a text,
 * but also an icon before that text.
 * 
 * @extends sap.m.Link
 * @returns sap.ui.core.Control
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
 * @alias toucon-Link
 */
var touconLink = sap.m.Link.extend("toucon.Link", {
	metadata : {                              
		properties : {
			"text" : {defaultValue: null},
			"textRules" : { type: "object", defaultValue: null},
			"icon" : {defaultValue: null},
			"iconRules" : { type: "object", defaultValue: null},
			"visible" : { type: "boolean", defaultValue: true}
		},
		aggregations : {
			_icon : { type: "toucon.Icon", multiple: false, visibility: "hidden"},
		}
	},

	/**
	 * @desc Initializes the link and the icon
	 *
	 * @function
	 * @implements .touconLinkIcon
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-Link
	 */
	init : function () {
		if (sap.m.Link.prototype.init) {             
			sap.m.Link.prototype.init.apply(this, arguments);
		}
		//we prepare a toucon icon which will translate common values to icons
		this.setAggregation("_icon",new toucon.Icon().addStyleClass("touconLinkIcon"));
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Resolves the text and icon values 
	 * against their respective textRules and iconRules mappings,
	 * renders the link's HTML and the icon through its own renderer.
	 * 
	 * @function
	 * @implements .touconLink, .sapMLnk, .sapMLnkMaxWidth
	 * @since 1.0
	 * @protected
	 * @static
	 * @memberOf toucon-Link
	 */
	renderer : function(oRm, oControl) {
		if (oControl.getVisible()==true) {
			var text = "";
			var icon = "";
			if (oControl.getText()!=null && oControl.getText()!="") {
				//No conversion rule is given, use the value directly
				if (oControl.getTextRules()==null){
					text = oControl.getText();
				}
				//Use the value from the provided lookup if defined
				else if ((oControl.getTextRules()[oControl.getText()]===undefined)==false){
					text = oControl.getTextRules()[oControl.getText()];
				}

				//No conversion rule is given, use the value directly
				if (oControl.getIconRules()==null){
					icon = oControl.getIcon();
				}
				//Use the value from the provided lookup if defined
				else if ((oControl.getIconRules()[oControl.getIcon()]===undefined)==false){
					icon = oControl.getIconRules()[oControl.getIcon()];
				}

				//Global link
				oRm.write("<a"); 
				oRm.writeControlData(oControl);  
				oRm.addClass("sapMLnk sapMLnkMaxWidth touconLink");
				oRm.writeClasses();
				oRm.write("href=\"javascript:void(0);\" ");
				oRm.write(">");
				//Render icon
				if (icon!="") {
					oControl.getAggregation("_icon").setIcon(icon);
					oRm.renderControl(oControl.getAggregation("_icon"));
				} 
				oRm.writeEscaped(text);
				oRm.write("</a>");
			}
		}
	}
});