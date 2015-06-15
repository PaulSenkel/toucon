jQuery.sap.require("toucon.Icon");
/**
 * @param {string} [value] an integer string, default is "0", or a value which will be translated by the valueRules map
 * @param {string} [defaultValue] an integer string, default is "0", which is used as fallback if the value is overwritten with ""
 * @param {object} [valueRules] a map which translates the value to a valid integer string
 * @param {boolean} [showValue] determines if the numeric value will be displayed, default is true; if false, the icon will be displayed
 * @param {string} [iconValue] an icon URL or a value which will be translated by the iconRules map
 * @param {object} [iconRules] a map which translates the icon value to a valid icon URL
 * @param {boolean} [showIcon] determines if the icon value will be displayed if the numeric values are NOT being displayed, default is true
 * @param {boolean} [asc] determines if the numeric values will be interpreted in an ascending or descending manner, default is asc=true which means that the highest value is red and the lowest green
 * @param {int} [redLimit] the value above which the value will be displayed in red
 * @param {int} [greenLimit] the value below which the value will be displayed in green
 * @param {int} [blueLimit] the value below which the value will be displayed in blue
 * @param {float} [size] the CSS size in rem units, defaultValue is 2.0
 * 
 *
 * @desc Displays a red rectangle, a yellow triangle or a green circle depending on the passed
 * integer value and limits for going green, blue or red. Yellow is the default state.
 * <br>
 * You can also switch off the rendering of the actual value which is very handy
 * if you "fake" the numeric value through the valueRules mapping where you 
 * "translate" a text from your model (e.g. warning, error, success) to a fitting number.
 * <br>
 * Thanks go to Abesh (https://gist.github.com/abesh/9504351) for the original ColorCircle control
 * <br><br>
 * V1.01 - corrected default red/green/blueLimit values and potential but when checking if ascending is true/false
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
 * @version 1.01
 *
 * @constructor
 * @public
 * @alias toucon-StatusIndicator
 */
var touconStatusIndicator = sap.ui.core.Control.extend("toucon.StatusIndicator", {                         
    metadata : {                              
        properties : {
           	"value" : {defaultValue: "0"},
           	"defaultValue" : {defaultValue: "0"},//used as fallback if the value is overwritten with ""
			"showValue" : {type: "boolean", defaultValue: true},//if true then this supersedes the icon	
			"valueRules" : { type: "object", defaultValue: null},
           	"iconValue" : {defaultValue: null},
			"iconRules" : { type: "object", defaultValue: null},
			"showIcon" : {type: "boolean", defaultValue: true},//if showValue is false the icon will be shown
			"asc" : {type: "boolean", defaultValue: true},	
			"redLimit" : {type: "int", defaultValue: 90},	
			"greenLimit" : {type: "int", defaultValue: 75},			
			"blueLimit" : {type: "int", defaultValue: -1},//not relevant for gauges, but interesting for calculated error, warning, success and info states			
			"size" : {type: "float", defaultValue: 2.0}			
        },
        aggregations : {
			_icon : { type: "sap.ui.core.Icon", multiple: false, visibility: "hidden"},
        }
    },
    
	/**
	 * @desc Initializes the icon with default iconRules which will out-of-the-box map the following values to sap-icon URLs.
	 * <br>
	 * You can pass the following values in the iconValue and benefit from a standard value to icon mapping:
	 * <br>
	 * "Red":"sap-icon://decline",
	 * <br>
	 * "Yellow":"sap-icon://warning",
	 * <br>
	 * "Green":"sap-icon://accept",
	 * <br>
	 * "Blue":"sap-icon://hint",
	 * <br>
	 * "E":"sap-icon://decline",
	 * <br>
	 * "W":"sap-icon://warning",
	 * <br>
	 * "S":"sap-icon://accept",
	 * <br>
	 * "I":"sap-icon://hint",
	 * <br>
	 * "error":"sap-icon://decline",
	 * <br>
	 * "warning":"sap-icon://warning",
	 * <br>
	 * "success":"sap-icon://accept",
	 * <br>
	 * "info":"sap-icon://hint",
	 * <br>
	 * "ERROR":"sap-icon://decline",
	 * <br>
	 * "WARNING":"sap-icon://warning",
	 * <br>
	 * "SUCCESS":"sap-icon://accept",
	 * <br>
	 * "INFO":"sap-icon://hint"
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-StatusIndicator
	 */
    init : function () {
    	//we prepare a toucon icon which will translate common values to icons
    	this.setAggregation("_icon",new toucon.Icon({
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
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc The default state is Yellow. If the value is an empty string or null, then the defaultValue will be used.
	 * <br>
	 * If no valueRules mapping is given, then we parse the integer string to an integer, otherwise
	 * we retrieve the the mapped value and parse this one instead.
	 * <br>
	 * Depending on whether ascending has been set to false or left on true, we will compare the value according to the ASC/DESC rules below.
	 * <br>
	 * <br>
	 * Then we build the icon if the value will not be shown AND if the icon should be shown.
	 * <br>
	 * We set the icon's value with the iconValue if given, 
	 * if an iconRules mapping is provided, then we use the value of this StatusIndicator,
	 * if not we pass the state (Red, Yellow, Green or Blue) as value (this will work fine with 
	 * the out-of-the-box mapping).
	 * <br>
	 * If we have an iconRules mapping, then we pass it to the icon.
	 * <br>
	 * <br>
	 * ASC:
	 * <br>
	 * Red if > redLimit
	 * <br>
	 * Yellow if <= redLimit and > greenLimit
	 * <br>
	 * Green if <= greenLimit and > blueLimit
	 * <br>
	 * Else Blue
	 * <br>
	 * <br>
	 * DESC:
	 * <br>
	 * Blue if <= blueLimit
	 * <br>
	 * Red if > blueLimit and <= redLimit
	 * <br>
	 * Yellow if > redLimit and < greenLimit
	 * <br>
	 * Else Green
	 *
	 * @function
	 * @implements .touconStatusIndicator[state]BG .touconStatusIndicator[state]Text
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-StatusIndicator
	 */
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
			if(oControl.getAsc()==true){
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

			//If there's a chance to display the icon
			if (oControl.getShowValue()==false && oControl.getShowIcon()==true) {
				//Finalising the icon, use icon-specific value if given
				if (oControl.getIconValue()!=null && oControl.getIconValue()!="") {
					oControl.getAggregation("_icon").setIcon(oControl.getIconValue());
				} else {
					//If no icon-specific value is given, then use the global input value if special icon rules are given (means that the user wants to map a value to an icon rule)
					if (oControl.getIconRules()!=null && (oControl.getIconRules()===undefined)==false) {
						oControl.getAggregation("_icon").setIcon(oControl.getValue());
					} 
					//If no icon-specific values or rules are given, then use the state against the initial iconRules
					else {
						oControl.getAggregation("_icon").setIcon(state);
					}
				}
				//Apply special iconRules if given
				if (oControl.getIconRules()!=null && (oControl.getIconRules()===undefined)==false) {
					oControl.getAggregation("_icon").setIconRules(oControl.getIconRules());
				}
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
			else if (oControl.getShowIcon()==true && (oControl.getAggregation("_icon")===undefined)==false) {
				oRm.renderControl(oControl.getAggregation("_icon"));
			}
			oRm.write("</div>");                                                
			oRm.write("</div>");
		}
    }
});