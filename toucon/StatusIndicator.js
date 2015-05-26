/** Displays a red rectangle, a yellow triangle or a green circle depending on the passed
 * integer value and limits for going green or red.
 * You can also switch off the rendering of the actual value which is very handy
 * if you "fake" the numeric value through the valueRules mapping where you 
 * "translate" a text from your model (e.g. warning, error, success) to a fitting number.
 * Thanks go to Abesh (https://gist.github.com/abesh/9504351) for the original ColorCircle control
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
jQuery.sap.require("toucon.Icon");
var touconStatusIndicator = sap.ui.core.Control.extend("toucon.StatusIndicator", {                         
    metadata : {                              
        properties : {
			"showValue" : {type: "boolean", defaultValue: true},//if true then this supersedes the icon	
           	"value" : {defaultValue: "0"},
           	"defaultValue" : {defaultValue: "0"},//used as fallback if the value is overwritten with ""
			"valueRules" : { type: "object", defaultValue: null},
			"showIcon" : {type: "boolean", defaultValue: true},//if showValue is false the icon will be shown
           	"iconValue" : {defaultValue: null},
			"iconRules" : { type: "object", defaultValue: null},
			"asc" : {type: "boolean", defaultValue: true},	
			"redLimit" : {type: "int", defaultValue: "90"},	
			"greenLimit" : {type: "int", defaultValue: "75"},			
			"blueLimit" : {type: "int", defaultValue: "-1"},//not relevant for gauges, but interesting for calculated error, warning, success and info states			
			"size" : {type: "float", defaultValue: 2.0}			
        },
        aggregations : {
			icon : { type: "sap.ui.core.Icon", multiple: false, visibility: "public"},
        }
    },
    
    init : function () {
    	//we prepare a toucon icon which will translate common values to icons
    	this.setIcon(new toucon.Icon({
			iconRules: {
				"Red":"sap-icon://decline",
				"Yellow":"sap-icon://warning",
				"Green":"sap-icon://accept",
				"Blue":"sap-icon://hint",
				"E":"sap-icon://decline",
				"W":"sap-icon://warning",
				"S":"sap-icon://accept",
				"I":"sap-icon://hint",
				"error":"sap-icon://decline",
				"warning":"sap-icon://warning",
				"success":"sap-icon://accept",
				"info":"sap-icon://hint",
				"ERROR":"sap-icon://decline",
				"WARNING":"sap-icon://warning",
				"SUCCESS":"sap-icon://accept",
				"INFO":"sap-icon://hint"
			}
		}));
    },

    renderer : function(oRm, oControl) {
    	var value = 0;
    	var state = "Yellow";
		//No value given, try to use the defaultValue
    	if (oControl.getValue()==null || oControl.getValue()=="") {
			oControl.setValue(oControl.getDefaultValue());
		}
		if (oControl.getValue()!=null && oControl.getValue()!="") {
			//No conversion rule is given, use the value directly if integer
			if (oControl.getValueRules()==null && parseInt(oControl.getValue())==oControl.getValue()){
				value = oControl.getValue();
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getValueRules()[oControl.getValue()]===undefined)==false){
				value = parseInt(oControl.getValueRules()[oControl.getValue()]);
			}

			//Determine state based on (mapped) value
			if(oControl.getAsc()){
				if(value > oControl.getRedLimit()){
					state = "Red";
				}else if(value <= oControl.getRedLimit() && value > oControl.getGreenLimit()){
					state = "Yellow";			
				}else if(value <= oControl.getGreenLimit() && value > oControl.getBlueLimit()){
					state = "Green";		
				}else {
					state = "Blue";
				}
			}else{
				if(value <= oControl.getBlueLimit()){
					state = "Blue";
				}else if(value > oControl.getBlueLimit() && value <= oControl.getRedLimit()){
					state = "Red";
				}else if(value > oControl.getRedLimit() && value < oControl.getGreenLimit()){
					state = "Yellow";			
				}else{
					state = "Green";		
				}		
			}

			//Finalising the icon, use icon-specific value if given
			if (oControl.getIconValue()!=null && oControl.getIconValue()!="") {
				oControl.getIcon().setIcon(oControl.getIconValue());
			} else {
				//If no icon-specific value is given, then use the global input value if special icon rules are given (means that the user wants to map a value to an icon rule)
				if (oControl.getIconRules()!=null && (oControl.getIconRules()===undefined)==false) {
					oControl.getIcon().setIcon(oControl.getValue());
				} 
				//If no icon-specific values or rules are given, then use the state against the initial iconRules
				else {
					oControl.getIcon().setIcon(state);
				}
			}
			//Apply special iconRules if given
			if (oControl.getIconRules()!=null && (oControl.getIconRules()===undefined)==false) {
				oControl.getIcon().setIconRules(oControl.getIconRules());
			}

			//Global div
			oRm.write("<div"); 
			oRm.writeControlData(oControl);  
			oRm.write(">");
			//Background div
			oRm.write("<div");
			//Global color definition through CSS by State
			oRm.addClass("touconStatusIndicator"+state+"BG"); 
			oRm.writeClasses();
			//Creates round CSS circle
			if (state=="Green" || state=="Blue") {
				oRm.addStyle("width", oControl.getSize()+"rem");                                                        
				oRm.addStyle("height", 0);
				oRm.addStyle("padding-bottom", oControl.getSize()+"rem");
				oRm.addStyle("border-radius", oControl.getSize()/2+"rem");
				oRm.addStyle("-moz-border-radius", oControl.getSize()/2+"rem");
				oRm.addStyle("-webkit-border-radius", oControl.getSize()/2+"rem");
				oRm.addStyle("margin-left", oControl.getSize()*0.1+"rem");//compensates for the larger Yellow sizes
			} 
			//Creates rounded CSS square
			else if (state=="Red") {
				oRm.addStyle("width", oControl.getSize()+"rem");
				oRm.addStyle("height", 0);
				oRm.addStyle("padding-bottom", oControl.getSize()+"rem");
				oRm.addStyle("border-radius", oControl.getSize()/8+"rem");
				oRm.addStyle("-moz-border-radius", oControl.getSize()/8+"rem");
				oRm.addStyle("-webkit-border-radius", oControl.getSize()/8+"rem");
				oRm.addStyle("margin-left", oControl.getSize()*0.1+"rem");//compensates for the larger Yellow sizes
			} 
			//Creates CSS triangle, we add 20% to the size so that this shape will have equal graphical strength
			else if (state=="Yellow") {
				oRm.addStyle("width", 0);
				oRm.addStyle("height", 0);
				oRm.addStyle("border-left-width", oControl.getSize()/2*1.2+"rem");
				oRm.addStyle("border-right-width", oControl.getSize()/2*1.2+"rem");
				oRm.addStyle("border-bottom-width", oControl.getSize()*1.2+"rem");
			}
			oRm.writeStyles();
			oRm.write("> </div>");
			//Value/icon div
			oRm.write("<div");
			oRm.addClass("touconStatusIndicator"+state+"Text"); 
			oRm.writeClasses();
			oRm.addStyle("margin-top", "-"+oControl.getSize()+"rem");                                                        
			oRm.addStyle("font-size", oControl.getSize()/2+"rem");                                                        
			oRm.addStyle("height", oControl.getSize()+"rem");
			//We compensate for the increased size so that the icon will still be centered
			if (state=="Yellow") {
				oRm.addStyle("width", oControl.getSize()*1.2+"rem");                                                        
				oRm.addStyle("line-height", oControl.getSize()*1.2+"rem");	
			}                                                        
			else {
				oRm.addStyle("width", oControl.getSize()+"rem");
				oRm.addStyle("line-height", oControl.getSize()+"rem");
				oRm.addStyle("margin-left", oControl.getSize()*0.1+"rem");//compensates for the larger Yellow sizes
			}
			oRm.writeStyles();
			oRm.write(">");
			if (oControl.getShowValue()==true) {
				oRm.writeEscaped(oControl.getValue()+"");
			}  
			else if (oControl.getShowIcon()==true && (oControl.getIcon()===undefined)==false) {
				oRm.renderControl(oControl.getIcon());
			}
			oRm.write("</div>");                                                
			oRm.write("</div>");
		}
    }
});