/* A container with two labels (one shown on medium and large screens, one on smartphones
 * which takes a Control to which it attaches a richtext tooltip
 * In the future we want to provide an additional label which displays an error text
 * if an error is raised (e.g. through the change event based on the valueState or other
 * information)
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
sap.ui.core.Control.extend("toucon.FormLine", {  
	metadata: {  
		properties: {  
			label : { type: "string", defaultValue: null },//used as "Title:" in front of the field, can be a {binding}
//			errorText : { type: "string", defaultValue: null },//max 40chars, used as red subtext when the field is active, can be a {binding}
			tooltipText : { type: "string", defaultValue: null },//used in a richtexttooltip which is being attached, can be a {binding}
			mandatory : { type: "boolean", defaultValue: false }//used for adding a styleclass; this will also be set to true if a toucon value type with a mandatory:true formatoption is being attached
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
	init: function() {
		console.log("toucon.FormLine.init");
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
			var labelTooltip = (oControl.getTooltipText()? oControl.getTooltipText() : oControl.getLabel());
			labelLM.setText(oControl.getLabel());
			labelLM.setTooltip(labelTooltip);
			labelLM.setLayoutData(new sap.ui.layout.GridData({
				span: oControl.getLabelLayoutData().getSpan(),
				visibleL: true,
				visibleM: true,
				visibleS: !renderLabelS
			}));
			innerGrid.addContent(labelLM);
			if (oControl.getMandatory()==true) {
				labelLM.addStyleClass("touconMandatory");
			}
		}
	},
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
				var labelTooltip = (oControl.getTooltipText()? oControl.getTooltipText() : oControl.getLabel());
				labelS.setText(oControl.getLabel());
				labelS.setTooltip(labelTooltip);
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
				if (oControl.getMandatory()==true) {
					labelS.addStyleClass("touconMandatory");
				}
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
	_prepareControl : function () {
		var oControl = this;
		var input = oControl.getAggregation("control");
		if ((input===null)==false) {
			var innerGrid = oControl.getAggregation("_innerGrid");
			var tooltip = oControl.getAggregation("_tooltip");
			input.setTooltip(tooltip);
			//We attach hooks for a default design
			input.addStyleClass("touconControl");

			if (oControl.getTooltipText()!="") {
				input.getTooltip().setText(oControl.getTooltipText());
				if (oControl.getLabel()!="") input.getTooltip().setValueStateText(oControl.getLabel()+":");
			}

			if (oControl.getMandatory()==true) {
				input.addStyleClass("touconMandatory");
			}

			if ((oControl.mEventRegistry===undefined)==false) input.mEventRegistry=oControl.mEventRegistry;

			if (oControl.getControlLayoutData()) {
				input.setLayoutData(oControl.getControlLayoutData());
			}
			innerGrid.addContent(input);
		}
	},
//	Get the prepared controls so that you can attach them directly instead of
//	rendering this container control - experimental API
	getLabelLM: function() {
		oControl._prepareLabelLM();
		return this.getAggregation("_labelLM");
	},
	getLabelS: function() {
		oControl._prepareLabelS();
		return this.getAggregation("_labelS");
	},
	getControl: function() {
		oControl._prepareControl();
		return this.getAggregation("control");
	},
//	Helper function for "rendering" the three prepared controls into a parent control
	renderInto: function (oControl) {
//		oControl.addContent(this.getAggregation("_errorText"));
		oControl.addContent(this.getLabelLM());
		oControl.addContent(this.getLabelS());
		oControl.addContent(this.getControl());
	},
//	Renders the Inner Grid with the two Labels and the Input
	renderer: function(oRm, oControl) {
//		oControl._prepareErrorText();
		oControl._prepareLabelLM();
		oControl._prepareLabelS();
		oControl._prepareControl();
		var innerGrid = oControl.getAggregation("_innerGrid");
		//We are just rendering the "innerGrid" which is all what we want
		//Extending the grid does not work here as he span information (e.g. L4 M6 S12) information
		//is written before our settings can take effect
		//That is why we have to apply to our settings to a "fresh" grid control and render this instead
		oRm.renderControl(innerGrid);
	},
});