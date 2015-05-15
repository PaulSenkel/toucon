/* Displays a red rectangle, a yellow triangle or a green circle depending on the passed
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
sap.ui.core.Control.extend("toucon.StatusIndicator", {                         
    metadata : {                              
        properties : {
           	"value" : {defaultValue: "0"},
			"size" : {type: "sap.ui.core.CSSSize", defaultValue: "50px"},			
			"showValue" : {type: "boolean", defaultValue: true},	
			"asc" : {type: "boolean", defaultValue: true},	
			"redLimit" : {type: "int", defaultValue: "90"},	
			"greenLimit" : {type: "int", defaultValue: "75"},			
			"valueRules" : { type: "object", defaultValue: null }
        }
    },

    renderer : function(oRm, oControl) {
    	var value = 0;
		if (oControl.getValue()!=null && oControl.getValue()!="") {
			//No conversion rule is given, use the value directly if integer
			if (oControl.getValueRules()==null && parseInt(oControl.getValue())==oControl.getValue()){
				value = oControl.getValue();
			}
			//Use the value from the provided lookup if defined
			else if ((oControl.getValueRules()[oControl.getValue()]===undefined)==false){
				value = parseInt(oControl.getValueRules()[oControl.getValue()]);
			}

			oRm.write("<div"); 
			oRm.writeControlData(oControl);  
			oRm.addStyle("width", oControl.getSize());                                                        
			oRm.addStyle("height", oControl.getSize());
			oRm.writeStyles();
			if(oControl.getAsc()){
				if(value > oControl.getRedLimit()){
					oRm.addClass("touconStatusIndicatorRed-text"); 
				}else if((value <= oControl.getRedLimit()) && (value > oControl.getGreenLimit())){
					oRm.addClass("touconStatusIndicatorYellow-text"); 			
				}else{
					oRm.addClass("touconStatusIndicatorGreen-text"); 			
				}
			}else{
				if(value <= oControl.getRedLimit()){
					oRm.addClass("touconStatusIndicatorRed-text"); 
				}else if((value > oControl.getRedLimit()) && (value < oControl.getGreenLimit())){
					oRm.addClass("touconStatusIndicatorYellow-text"); 			
				}else{
					oRm.addClass("touconStatusIndicatorGreen-text"); 			
				}		
			}
			oRm.writeClasses();               
			oRm.write(">");
			oRm.write("<div>"); 	  
			if (oControl.getShowValue()==true) oRm.write(value);  
			oRm.write("</div>");                                                
			oRm.write("</div>");
		}
    }
});