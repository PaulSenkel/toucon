/* A little box with a title on the left, an additional "tag" title on the right
 * followed with a text, followed by an optional control
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
sap.ui.core.Control.extend("toucon.InfoBox", {  
	metadata: {  
		properties: {  
			"title" : { type: "string", defaultValue: null },
			"tag" : { type: "string", defaultValue: "" },
			"text" : { type: "string", defaultValue: null }
		},
		aggregations: {
			"control" : {type : "sap.ui.core.Control", multiple : false, visibility: "public"}
		}
	},  
	renderer: function(oRm, oControl) {  
		oRm.write("<div ");
		oRm.writeControlData(oControl);  // writes the Control ID and enables event handling - important!
		oRm.writeClasses(oControl);  // writes classes added with .addStyleClass()
		oRm.write(">");
		oRm.write("<div class=\"touconInfoBoxTitle\" style=\"width:20%;direction:inherit;float:right;text-align:right\">");
		oRm.writeEscaped(oControl.getTag());
		oRm.write("</div>");
		oRm.write("<div class=\"touconInfoBoxTag\" style=\"width:80%;direction:inherit;float:left;text-align:left\">");
		oRm.writeEscaped(oControl.getTitle());
		oRm.write("</div>");
		oRm.write("<div class=\"sapMText touconInfoBoxText\" style=\"width:100%;direction:inherit;float:left;text-align:left\">");
		oRm.writeEscaped(oControl.getText());
		oRm.write("</div>");
		oRm.renderControl(oControl.getControl());
		oRm.write("</div>");
	}
});