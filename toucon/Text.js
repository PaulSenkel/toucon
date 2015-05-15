/* A text which can be indented and colored based on mapped rules
 * 
 * Copyright 2015 Paul Senkel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * */
sap.m.Text.extend("toucon.Text", {  
	metadata: {  
		properties: {  
			"text" : { type: "string", defaultValue: null },
			"indentLevel" : { type: "string", defaultValue: null },
			"color" : { type: "string", defaultValue: null },
			"indentBy" : { type: "float", defaultValue: 1.5 },
			"indentRules" : { type: "object", defaultValue: null },
			"colorRules" : { type: "object", defaultValue: null }
		}
	},  
	renderer: function(oRm, oControl) {
		//If we get an indent level
		if (oControl.getIndentLevel()!=null && oControl.getIndentLevel()!="") {
			//No conversion rule is given, use the value directly if integer
			if (oControl.getIndentRules()==null && parseInt(oControl.getIndentLevel())==oControl.getIndentLevel()){
					oRm.addStyle("padding-left",(oControl.getIndentLevel()*oControl.getIndentBy())+"rem");
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getIndentRules()[oControl.getIndentLevel()]===undefined)==false){
				oRm.addStyle("padding-left",oControl.getIndentRules()[oControl.getIndentLevel()]);
			}
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
		//Use the standard renderer to rendering this prepared control
		sap.m.TextRenderer.render(oRm, oControl);
	}
});