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
sap.ui.core.Icon.extend("toucon.Icon", {  
	metadata: {  
		properties: {  
			"icon" : { type: "string", defaultValue: null },
			"iconRules" : { type: "object", defaultValue: null }
		}
	},  
	renderer: function(oRm, oControl) {
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
	
		sap.ui.core.IconRenderer.render(oRm, oControl);
	}
});