/**
 * @param {string} [icon] URL to an icon, e.g. sap-icon://home, OR a value which will be translated by the iconRules mapping
 * @param {string} [defaultIcon] URL to an icon, e.g. sap-icon://home, defaultValue is sap-icon://border, OR a value which will be translated by the iconRules mapping
 * @param {object} [iconRules] a map which translates the value passed in "icon" to a valid icon URL
 * @param {string} [colorValue] a web color, e.g. #ff0000, OR a value which will be translated by the colorRules mapping
 * @param {object} [colorRules] a map which translates the value passed in "colorValue" to a valid web color
 *
 * @desc The Icon control enables us to display a colored icon based on incoming parameters
 * which we then map to valid icons and valid colors.
 * @extends sap.ui.core.Icon
 * @returns sap.ui.core.Icon
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
 * @alias toucon-Icon
 */
var touconIcon = sap.ui.core.Icon.extend("toucon.Icon", {  
	metadata: {  
		properties: {  
			"icon" : { type: "string", defaultValue: null },
			"defaultIcon" : { type: "string", defaultValue: "sap-icon://border" },
			"iconRules" : { type: "object", defaultValue: null },
			"colorValue" : { type: "string", defaultValue: null },
			"colorRules" : { type: "object", defaultValue: null }
		}
	},  
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the Icon params, resolves the values of icon and colorValue
	 * against their respective iconRules and colorRules mappings
	 * and calls the sap.ui.core.IconRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Icon
	 */
	renderer: function(oRm, oControl) {
		//If no icon (key) was given, then let's use the default one
		if (oControl.getIcon()==null && oControl.getIcon()=="") {
			oControl.setIcon(oControl.getDefaultIcon());
		}
		//If we get an icon key
		if (oControl.getIcon()!=null && oControl.getIcon()!="") {
			//No conversion rule is given, use the value directly if integer
			if (oControl.getIconRules()==null){
				oControl.setSrc(oControl.getIcon());	
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getIconRules()[oControl.getIcon()]===undefined)==false){
				oControl.setSrc(oControl.getIconRules()[oControl.getIcon()]);
			}
		}
		//If we get a color (or a key that needs conversion)
		if (oControl.getColorValue()!=null && oControl.getColorValue()!=""){
			//Conversion rule given, update color
			if (oControl.getColorRules()!=null && (oControl.getColorRules()[oControl.getColorValue()]===undefined)==false){
				oControl.setColor(oControl.getColorRules()[oControl.getColorValue()]);
			}
		}
	
		sap.ui.core.IconRenderer.render(oRm, oControl);
	}
});