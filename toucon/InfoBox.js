/**
 * @param {string} [title] left-bound title of the info box
 * @param {string} [tag] right-bound tag of the info box
 * @param {any} [text] The text parameter can be a string, 
 * a map like {text:"text",color:"red",indentLevel:1} or
 * an array of strings or maps like {text:"text",color:"red",indentLevel:1}.
 * @param {float} [indentBy] used for indenting the text in rem units depending on the passed indentLevel, defaultValue is 1.5
 * @param {string} [tooltipText]used in a richtexttooltip which is being attached, can be a {binding}
 * @param {sap.ui.core.Control} [control] e.g. a sap.m.Input which should be rendered in the form line
 *
 * @desc A little box with a title on the left, an additional "tag" title on the right
 * followed with one ore more texts, followed by an optional control
 * 
 * @extends sap.ui.core.Control
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
 * @alias toucon-InfoBox
 */
var touconInfoBox = sap.ui.core.Control.extend("toucon.InfoBox", {  
	metadata: {  
		properties: {  
			"title" : { type: "string", defaultValue: null },
			"tag" : { type: "string", defaultValue: "" },
			"text" : { type: "any", defaultValue: null },
			"indentBy" : { type: "float", defaultValue: 1.5 }
		},
		aggregations: {
			"control" : {type : "sap.ui.core.Control", multiple : false, visibility: "public"}
		}
	},  
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc If the text parameter is a string, it will be added to an array.
	 * If the text parameter is a non-array object, we presume that it is a map like {text:"text",color:"red",indentLevel:1}
	 * and we add it to an array.
	 * If the text parameter is an array, we will use it directly and we will presume that it either
	 * contains strings or maps like {text:"text",color:"red",indentLevel:1}.
	 * Then the InfoBox tag and title will be rendered and the renderer will then iterate over the text array.
	 * It will then render the texts with the optional indentLevel (multiplied with the indentBy parameter)
	 * and the optional color.
	 * At the end the optional UI5 control will be rendered as well.
	 * 
	 * @function
	 * @implements CSS: .touconInfoBoxTag, .touconInfoBoxTitle, .touconInfoBoxText
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-InfoBox
	 */
	renderer: function(oRm, oControl) {
		var texts = [];
		//If text is a simple string, push it to the array
		if ((oControl.getText()===undefined)==false && (oControl.getText()===null)==false 
				&& typeof oControl.getText()==="string") {
			texts.push(oControl.getText());
		} 
		//If text is an object, but not an array, we presume it is a map like {text:"text",color:"red",indentLevel:1}
		else if ((oControl.getText()===undefined)==false && (oControl.getText()===null)==false 
				&& typeof oControl.getText()==="object" && !oControl.getText().length) {
			texts.push(oControl.getText());
		} 
		//If text is an array, we presume that it is an array of strings or an array of maps like {text:"text",color:"red",indentLevel:1}
		else if ((oControl.getText()===undefined)==false && (oControl.getText()===null)==false 
				&& typeof oControl.getText()==="object" && oControl.getText().length) {
			texts=oControl.getText();
		}
		oRm.write("<div ");
		oRm.writeControlData(oControl);  // writes the Control ID and enables event handling - important!
		oRm.writeClasses(oControl);  // writes classes added with .addStyleClass()
		oRm.write(">");
		oRm.write("<div class=\"touconInfoBoxTag\" style=\"width:20%;direction:inherit;float:right;text-align:right\">");
		oRm.writeEscaped(oControl.getTag());
		oRm.write("</div>");
		oRm.write("<div class=\"touconInfoBoxTitle\" style=\"width:80%;direction:inherit;float:left;text-align:left\">");
		oRm.writeEscaped(oControl.getTitle());
		oRm.write("</div>");
		for (var i=0; i<texts.length; i++) {
			var text = {};
			if (typeof texts[i]==="string") {
				text.text=texts[i];
			} else if (typeof texts[i]==="object") {
				text = texts[i];
			}
			oRm.write("<div class=\"sapMText touconInfoBoxText\" style=\"width:100%;direction:inherit;float:left;text-align:left");
			if ((text.color===undefined)==false) {
				oRm.write(";color:");oRm.writeEscaped(text.color);
			}
			if ((text.indentLevel===undefined)==false && parseInt(text.indentLevel)==text.indentLevel) {
				oRm.write(";padding-left:"+(text.indentLevel*oControl.getIndentBy())+"rem");
			}
			oRm.write("\">");
			oRm.writeEscaped(text.text);
			oRm.write("</div>");
		}
		oRm.write("<div style=\"width:100%;direction:inherit;float:left;text-align:left\">");
		oRm.renderControl(oControl.getControl());
		oRm.write("</div>");
		oRm.write("</div>");
	}
});