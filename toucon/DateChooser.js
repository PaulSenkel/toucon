jQuery.sap.require("sap.ui.layout.Grid");
jQuery.sap.require("sap.ui.layout.GridData");

/**
 * @param {string} [path] binding path to the value for both date pickers
 * @param {string} [placeholder] placeholder text for both date pickers
 * @param {string} [displayFormat] displayFormat for both date pickers, default is dd.MM.yyyy
 * @param {string} [valueFormat] valueFormat for both date pickers, default is yyyyMMdd
 * @param {boolean} [visible] visible for both date pickers, default is true
 * @param {boolean} [editable] editable for both date pickers, default is true
 *
 * @desc This Grid contains both a sap.m.DatePicker and sap.m.DateTimeInput
 * <br>
 * The DatePicker is more convenient to use on Smartphones and will be displayed on for small screens (S).
 * <br>
 * The DateTimeInput is more convenient to use on larger screens especially for desktop usage.
 * It will be displayed for Medium and Large screens (L and M).
 * 
 * @extends sap.ui.layout.Grid
 * @returns sap.ui.layout.Grid
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
 * @alias toucon-DateChooser
 */
var touconDateChooser = sap.ui.layout.Grid.extend("toucon.DateChooser", {  
	metadata: {  
		properties: {  
			path : { type: "string", defaultValue: null },
			visible : { type: "boolean", defaultValue: true },
			editable : { type: "boolean", defaultValue: true },
			placeholder : { type: "string", defaultValue: null },
			displayFormat : { type: "string", defaultValue: "dd.MM.yyyy" },
			valueFormat : { type: "string", defaultValue: "yyyyMMdd" },
		},
		aggregations: {
		},
		events: {
			liveChange : {
				parameters : {
					value : {type : "string"}
				}
			},
			change : {
				parameters : {
					value : {type : "string"}
				}
			},
			press : {}
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	oPicker: null,
	oInput: null,
	oTooltip: null,
	//We release these variables manually onExit
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-DateChooser
	 */
	exit: function () {
        if (this.oPicker) {
            this.oPicker.destroy();
            delete this.oPicker;
        }
        if (this.oInput) {
            this.oInput.destroy();
            delete this.oInput;
        }
        if (this.oTooltip) {
            this.oTooltip.destroy();
            delete this.oTooltip;
        }
    },
    //If FormLine passes us a tooltip we need to grant it to both
    setTooltip : function (tooltip) {
    	this.oTooltip=tooltip;
    },
    getTooltip : function () {
    	return this.oTooltip;
    },
    setValue: function (value) {
    	if ((this.oPicker===null)==false) this.oPicker.setValue(value);
    	if ((this.oInput===null)==false) this.oInput.setValue(value);
    },
	getValue: function() {
		return this.oPicker.getValue();
	},
	/**
	 * @desc Initializes both the DatePicker and DateTimeInput,
	 * passes CSS mandatory class on to the real controls and
	 * adds both to the content aggregation of the Grid.
	 *
	 * @function
	 * @implements CSS: .touconMandatory
	 * @since 1.0
	 * @protected
     * @memberOf toucon-DateChooser
	 */
	init: function() {
		if (sap.ui.layout.Grid.prototype.init) {             
			sap.ui.layout.Grid.prototype.init.apply(this, arguments);
		}
		var oControl = this;
		
		//Remove margins
		oControl.setHSpacing(0);
		oControl.setVSpacing(0);
		
		//Instantiate both date pickers/inputs
		oControl.oPicker = new sap.m.DatePicker(oControl.getId()+"-picker",{
	        visible: oControl.getVisible(),
	        editable: oControl.getEditable(),
	        layoutData: new sap.ui.layout.GridData({
	        	span: "L12 M12 S12",
	            visibleL: true,
	            visibleM: true,
	            visibleS: false
	        })
	    });
		
		oControl.oInput = new sap.m.DateTimeInput(oControl.getId()+"-input",{
	        visible: oControl.getVisible(),
	        editable: oControl.getEditable(),
	        layoutData: new sap.ui.layout.GridData({
	        	span: "L12 M12 S12",
	            visibleL: false,
	            visibleM: false,
	            visibleS: true
	        })
	    });
		
		//If FormLine added mandatory "flag"
		if (oControl.hasStyleClass("touconMandatory")) {
			oControl.oPicker.addStyleClass("touconMandatory");
			oControl.oInput.addStyleClass("touconMandatory");
			oControl.removeStyleClass("touconMandatory");
		}
		oControl.addContent(oControl.oPicker);
		oControl.addContent(oControl.oInput);
	},
	getContent: function () {
		this.onBeforeRendering();
		
		return [this.oPicker,this.oInput];
	},
	onBeforeRendering: function () {
		var oControl = this;
		//console.log("DateChooser - renderer");
		if ((oControl.getPath()===null)==false && oControl.getPath()!="") {
			oControl.oPicker.bindValue({
				path: oControl.getPath()
			});
			oControl.oInput.bindValue({
				path: oControl.getPath()
			});
		}
		oControl.oPicker.setVisible(oControl.getVisible());
		oControl.oInput.setVisible(oControl.getVisible());
		oControl.oPicker.setEditable(oControl.getEditable());
		oControl.oInput.setEditable(oControl.getEditable());
		if ((oControl.getPlaceholder()===null)==false && oControl.getPlaceholder()!="") {
			oControl.oPicker.setPlaceholder(oControl.getPlaceholder());
			oControl.oInput.setPlaceholder(oControl.getPlaceholder());
		}
		if ((oControl.getDisplayFormat()===null)==false && oControl.getDisplayFormat()!="") {
			oControl.oPicker.setDisplayFormat(oControl.getDisplayFormat());
			oControl.oInput.setDisplayFormat(oControl.getDisplayFormat());
		}
		if ((oControl.getValueFormat()===null)==false && oControl.getValueFormat()!="") {
			oControl.oPicker.setValueFormat(oControl.getValueFormat());
			oControl.oInput.setValueFormat(oControl.getValueFormat());
		}
		if ((oControl.oTooltip===null)==false) {
			oControl.oPicker.setTooltip(oControl.oTooltip);
			oControl.oInput.setTooltip(oControl.oTooltip.clone());
		}

		//We assign the events passed to the Grid to both controls
		if ((oControl.mEventRegistry===undefined)==false) {
			oControl.oPicker.mEventRegistry=oControl.mEventRegistry;
			oControl.oInput.mEventRegistry=oControl.mEventRegistry;
		}
		
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the different params and calls the sap.ui.layout.GridRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-DateChooser
	 */
	renderer: function(oRm, oControl) {

		//We call the default renderer for this object as we do not want to do anything special
		sap.ui.layout.GridRenderer.render(oRm, oControl);
	}
});