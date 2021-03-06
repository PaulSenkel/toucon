jQuery.sap.require("sap.ui.layout.Grid");
jQuery.sap.require("sap.ui.layout.GridData");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");
jQuery.sap.require("sap.ui.commons.RichTooltip");

/**
 * @param {string} [label] used as "Title:" in front of the field, can be a {binding}
 * @param {string} [tooltipText]used in a richtexttooltip which is being attached, can be a {binding}
 * @param {boolean} [mandatory] used for adding a styleclass; this will also be set to true if a toucon value type with a mandatory:true formatoption is being attached
 * @param {boolean} [visible] used for managing visibility of the labels and controls, default is true
 * @param {sap.ui.core.Control} [control] e.g. a sap.m.Input which should be rendered in the form line
 * @param {sap.ui.layout.GridData} [labelLayoutData] must contain the span for the label which will be shown on Large and Medium screens
 * @param {sap.ui.layout.GridData} [controlLayoutData] must contain the span for the control itself
 *
 * @desc A container with two labels (one shown on medium and large screens, one on smartphones
 * which takes a Control to which it attaches a richtext tooltip.
 * <br>
 * In the future we want to provide an additional label which displays an error text
 * if an error is raised (e.g. through the change event based on the valueState or other
 * information).
 * <br><br>
 * V1.01 - added visible flag
 * 
 * @extends sap.ui.core.Control
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
 * @alias toucon-FormLine
 */
var touconFormLine = sap.ui.core.Control.extend("toucon.FormLine", {  
	metadata: {  
		properties: {  
			label : { type: "string", defaultValue: null },//used as "Title:" in front of the field, can be a {binding}
//			errorText : { type: "string", defaultValue: null },//max 40chars, used as red subtext when the field is active, can be a {binding}
			tooltipText : { type: "string", defaultValue: null },//used in a richtexttooltip which is being attached, can be a {binding}
			mandatory : { type: "boolean", defaultValue: false },//used for adding a styleclass; this will also be set to true if a toucon value type with a mandatory:true formatoption is being attached
			visible :  { type: "boolean", defaultValue: true }
		},
		aggregations: {
			control : { type: "sap.ui.core.Control", multiple: false, visibility: "public"},//e.g. a sap.m.Input which should be rendered in the form line
			labelLayoutData : { type: "sap.ui.layout.GridData", multiple: false, visibility: "public"},
			controlLayoutData : { type: "sap.ui.layout.GridData", multiple: false, visibility: "public"},
			_innerGrid : { type: "sap.ui.layout.Grid", multiple: false, visibility: "hidden"},
			_labelLM : { type: "sap.m.Label", multiple: false, visibility: "hidden"},
			_labelS : { type: "sap.m.Label", multiple: false, visibility: "hidden"},
			_tooltip : { type: "sap.ui.commons.RichTooltip", multiple: false, visibility: "hidden"},
//			_errorText : { type: "sap.m.Label", multiple: false, visibility: "hidden"}
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
	/**
	 * @desc Initializes the inner grid, the label for L/M screens, the label for S screens, the tooltip and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconLabel, .touconLabelLM, .touconLabelS
	 * @since 1.0
	 * @protected
     * @memberOf toucon-FormLine
	 */
	init: function() {
		//console.log("toucon.FormLine.init");
		//Creating the auxiliary controls 
		var innerGrid = new sap.ui.layout.Grid({vSpacing:0,hSpacing:0});//no spacing -> no visual impact
		var labelLM = new sap.m.Label();//this.getId()+"-LabelLM");
		var labelS = new sap.m.Label();//this.getId()+"-LabelS");
		var tooltip = new sap.ui.commons.RichTooltip();//this.getId()+"-Tooltip");
//		var errorText = new sap.m.Label(this.getId()+"-ErrorText");
		
		//Decoration hooks
		labelLM.addStyleClass("touconLabel touconLabelLM");
		labelS.addStyleClass("touconLabel touconLabelS");
//		errorText.addStyleClass("touconError");

		//We add the controls to our InputLine container
		this.setAggregation("_innerGrid",innerGrid);
		this.setAggregation("_labelLM",labelLM);   
		this.setAggregation("_labelS",labelS);   
		this.setAggregation("_tooltip",tooltip);   
//		this.setAggregation("_errorText",errorText);   
	},
	/**
	 * @desc Applies all relevant FormLine parameters to the large-medium label.
	 * <br>
	 * We show the right-aligned label for L and M only, but not if these labels
	 * take the whole width like for S if all label span indicators require full size, 
	 * then we display only the regular label
	 *
	 * @function
	 * @implements CSS: .touconMandatory
	 * @since 1.0
	 * @private
     * @memberOf toucon-FormLine
	 */
	_prepareLabelLM : function () {
		var oControl = this;
		var innerGrid = oControl.getAggregation("_innerGrid");
		var renderLabelS = false;
		var labelLM = oControl.getAggregation("_labelLM");   
//		create Label if exist
		if (labelLM && oControl.getLabel() && oControl.getLabel() != ""){
			renderLabelS = true;
			//We show the right-aligned label for L and M only, but not if these labels
			//take the whole width like for S
			//if all label span indicators require full size, then we display only the regular label
			var span = oControl.getAggregation("labelLayoutData").getSpan();
			if (span.indexOf("L12")>-1 && span.indexOf("M12")>-1) renderLabelS = false;
			labelLM.setText(oControl.getLabel());
			labelLM.setTooltip(oControl.getLabel());
			labelLM.setLayoutData(new sap.ui.layout.GridData({
				span: oControl.getLabelLayoutData().getSpan(),
				visibleL: true,
				visibleM: true,
				visibleS: !renderLabelS
			}));
			innerGrid.addContent(labelLM);
//			if (oControl.getMandatory()==true) {
//				labelLM.addStyleClass("touconMandatory");
//			}
		}
	},
	/**
	 * @desc Applies all relevant FormLine parameters to the small label.
	 * <br>
	 * We show the right-aligned label for L and M only, but not if these labels
	 * take the whole width like for S if all label span indicators require full size, 
	 * then we display only the regular label
	 *
	 * @function
	 * @implements CSS: .touconMandatory
	 * @since 1.0
	 * @private
     * @memberOf toucon-FormLine
	 */
	_prepareLabelS : function () {
		var oControl = this;
		var innerGrid = oControl.getAggregation("_innerGrid");
		var renderLabelS = false;
		var labelS = oControl.getAggregation("_labelS");   
//		create Label if exist
		if (labelS && oControl.getLabel() && oControl.getLabel() != ""){
			renderLabelS = true;
			//We show the right-aligned label for L and M only, but not if these labels
			//take the whole width like for S
			//if all label span indicators require full size, then we display only the regular label
			var span = oControl.getAggregation("labelLayoutData").getSpan();
			if (span.indexOf("L12")>-1 && span.indexOf("M12")>-1) renderLabelS = false;
			if (renderLabelS==true) {
				labelS.setText(oControl.getLabel());
				labelS.setTooltip(oControl.getLabel());
				labelS.setLayoutData(new sap.ui.layout.GridData({
					span: "L12 M12 S12",
					visibleL: false,
					visibleM: false,
					visibleS: true,
					linebreakL: true,
					linebreakM: true,
					linebreakS: true
				}));
				innerGrid.addContent(labelS);
//				if (oControl.getMandatory()==true) {
//					labelS.addStyleClass("touconMandatory");
//				}
			}
		}
	},
//	_prepareErrorText : function () {
//		var oControl = this;
//		var innerGrid = oControl.getAggregation("_innerGrid");
//		var errorText = oControl.getAggregation("_errorText");   
//		errorText.setText(oControl.getErrorText());
//		errorText.setLayoutData(new sap.ui.layout.GridData({
//			span: "L12 M12 S12"
//		}));
//		innerGrid.addContent(errorText);
//	},
	/**
	 * @desc Applies all relevant FormLine parameters to the contained control (tooltip).
	 * <br>
	 * Also passes events which were attached to the FormLine to this control.
	 *
	 * @function
	 * @implements CSS: .touconMandatory, .touconControl
	 * @since 1.0
	 * @private
     * @memberOf toucon-FormLine
	 */
	_prepareControl : function () {
		var oControl = this;
		var input = oControl.getAggregation("control");
		if ((input===null)==false) {
			var innerGrid = oControl.getAggregation("_innerGrid");
			//We attach hooks for a default design
			input.addStyleClass("touconControl");

			if (oControl.getTooltipText()!="") {
				var tooltip = oControl.getAggregation("_tooltip");
				input.setTooltip(tooltip);
				input.getTooltip().setText(oControl.getTooltipText());
				if (oControl.getLabel()!="") input.getTooltip().setValueStateText(oControl.getLabel()+":");
			}

//			if (oControl.getMandatory()==true) {
//				input.addStyleClass("touconMandatory");
//			}

			if ((oControl.mEventRegistry===undefined)==false) input.mEventRegistry=oControl.mEventRegistry;

			if (oControl.getControlLayoutData()) {
				input.setLayoutData(oControl.getControlLayoutData());
			}
			innerGrid.addContent(input);
		}
	},
	/**
	 * @desc Get the prepared large-medium label so that you can attach it directly instead of
	 * rendering this container control - experimental API
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-FormLine
	 */
	getLabelLM: function() {
		oControl._prepareLabelLM();
		return this.getAggregation("_labelLM");
	},
	/**
	 * @desc Get the prepared small label so that you can attach it directly instead of
	 * rendering this container control - experimental API
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-FormLine
	 */
	getLabelS: function() {
		oControl._prepareLabelS();
		return this.getAggregation("_labelS");
	},
	/**
	 * @desc Get the prepared control so that you can attach it directly instead of
	 * rendering this container control - experimental API
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-FormLine
	 */
	getControl: function() {
		oControl._prepareControl();
		return this.getAggregation("control");
	},
//	Helper function for "rendering" the three prepared controls into a parent control
	/**
	 * @param {Control} [oControl] the parent control to whose content the two labels and the inner control should be added.
	 *
	 * @desc Calls addContent of the passed oControl and passes both labels and the contained control itself - experimental API
	 *
	 * @function
	 * @since 1.0
	 * @public
     * @memberOf toucon-FormLine
	 */
	renderInto: function (oControl) {
//		oControl.addContent(this.getAggregation("_errorText"));
		oControl.addContent(this.getLabelLM());
		oControl.addContent(this.getLabelS());
		oControl.addContent(this.getControl());
	},
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Prepares the two labels as well as the contained control, then renders the inner grid.
	 *
	 * @function
	 * @implements .touconHidden (required CSS class for managing visibility with set/getVisible)
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-FormLine
	 */
	renderer: function(oRm, oControl) {
//		oControl._prepareErrorText();
		oControl._prepareLabelLM();
		oControl._prepareLabelS();
		oControl._prepareControl();
		var innerGrid = oControl.getAggregation("_innerGrid");
		if (oControl.getVisible()==false){
			innerGrid.addStyleClass("touconHidden");
		} else {
			innerGrid.removeStyleClass("touconHidden");
		}
		if (oControl.getMandatory()==true) {
			innerGrid.addStyleClass("touconMandatory");
		} else {
			innerGrid.removeStyleClass("touconMandatory");
		}
		//setVisible is undefined for Grid! a bug?
		//innerGrid.setVisible(false);
		oRm.renderControl(innerGrid);
		//We call the default renderer for this object as we do not want to do anything special
		//sap.m.InputRenderer.render(oRm, oControl);
	},
});