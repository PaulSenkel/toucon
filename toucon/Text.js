/**
 * @param {string} [text] the text
 * @param {string} [indentLevel] integer string or value which will be translated  by the indentRules mapping
 * valid integer string by the indentRules mapping
 * @param {object} [indentRules] a map which translates the value passed in "indentLevel" to a valid integer string
 * @param {string} [color] a web color, e.g. #ff0000, OR a value which will be translated by the colorRules mapping
 * @param {string} [hAlign] right, left or center
 * @param {string} [width] CSS width, default is 100% if bgColor is set, otherwise null
 * @param {object} [colorRules] a map which translates the value passed in "color" to a valid web color
 * @param {string} [bgColor] a web color, e.g. #ff0000, OR a value which will be translated by the colorRules mapping
 * @param {object} [bgColorRules] a map which translates the value passed in "bgColor" to a valid web color
 * @param {float} [indentBy] used for indenting the text in rem units depending on the passed indentLevel, defaultValue is 1.5
 *
 * @desc A text which can be indented and colored based on mapped rules
 * 
 * @extends sap.m.Text
 * @returns sap.m.Text
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
 * @alias toucon-Text
 */
var touconText = sap.m.Text.extend("toucon.Text", {  
	metadata: {  
		properties: {  
			"text" : { type: "string", defaultValue: null },
			"hAlign" : { type: "string", defaultValue: null },
			"width" : { type: "string", defaultValue: null },
			"indentLevel" : { type: "string", defaultValue: null },
			"color" : { type: "string", defaultValue: null },
			"bgColor" : { type: "string", defaultValue: null },
			"indentBy" : { type: "float", defaultValue: 1.5 },
			"indentRules" : { type: "object", defaultValue: null },
			"colorRules" : { type: "object", defaultValue: null },
			"bgColorRules" : { type: "object", defaultValue: null }
		}
	},  
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the params, resolves the values of indentLevel, color, background color
	 * against their respective indentRules and colorRules mappings,
	 * renders the text with the optional indentLevel multiplied with the indentBy parameter
	 * and the optional color and calls the sap.m.TextRenderer.render function.
	 * <br>Please note that the width will be automatically be set to 100% if 
	 * <br>- the background color option is used
	 * <br>- text is aligned to left or center
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Text
	 */
	renderer: function(oRm, oControl) {
		var useDefaultWidth = false;
		//If we get an indent level
		if (oControl.getIndentLevel()!=null && oControl.getIndentLevel()!="") {
			//No conversion rule is given, use the value directly if integer
			if (oControl.getIndentRules()==null && parseInt(oControl.getIndentLevel())==oControl.getIndentLevel()){
					oRm.addStyle("padding-left",(oControl.getIndentLevel()*oControl.getIndentBy())+"rem");
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getIndentRules()[oControl.getIndentLevel()]===undefined)==false){
				oRm.addStyle("padding-left",(oControl.getIndentRules()[oControl.getIndentLevel()]*oControl.getIndentBy())+"rem");
			}
		}
		if (oControl.getHAlign()!=null && oControl.getHAlign()!="" && oControl.getHAlign()!="left"){
			oRm.addStyle("text-align",oControl.getHAlign()+" !important");
			useDefaultWidth=true;
		}
		//If we get a color (or a key that needs conversion9
		if (oControl.getColor()!=null && oControl.getColor()!=""){
			//No conversion rule given, use the value directly
			if (oControl.getColorRules()==null){
				oRm.addStyle("color",oControl.getColor());
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getColorRules()[oControl.getColor()]===undefined)==false){
				oRm.addStyle("color",oControl.getColorRules()[oControl.getColor()]);
			}
		}
		//If we get a color (or a key that needs conversion9
		if (oControl.getBgColor()!=null && oControl.getBgColor()!=""){
			//No conversion rule given, use the value directly
			if (oControl.getBgColorRules()==null){
				oRm.addStyle("background-color",oControl.getBgColor());
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getBgColorRules()[oControl.getBgColor()]===undefined)==false){
				oRm.addStyle("background-color",oControl.getBgColorRules()[oControl.getBgColor()]);
			}
			useDefaultWidth=true;
		}
		if (oControl.getWidth()!=null && oControl.getWidth()!=""){
			oRm.addStyle("width",oControl.getWidth());
			useDefaultWidth=false;
		}
		if (useDefaultWidth==true){
			oRm.addStyle("width","100%");
		}

		//Use the standard renderer to rendering this prepared control
		sap.m.TextRenderer.render(oRm, oControl);
	}
});