/* 
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
sap.m.Page.extend("toucon.Page", {  
	metadata: {  
		properties: {  
		},
		//These aggregations can be used to addHeaderContent etc. in standard fashion
		aggregations: {
			"headerContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"mainContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"footerContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"}
		},
		events: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	oHeaderContainer: null,
	oMainContainer: null,
	oFooterContainer: null,
	//We release these variables manually onExit
	exit: function () {
        if (this.oHeaderContainer) {
            this.oHeaderContainer.destroy();
            delete this.oHeaderContainer;
        }
        if (this.oMainContainer) {
            this.oMainContainer.destroy();
            delete this.oMainContainer;
        }
        if (this.oFooterContainer) {
            this.oFooterContainer.destroy();
            delete this.oFooterContainer;
        }
    },
	init: function() {
		//Page decoration (background etc.)
		this.addStyleClass("touconPage");//("pageBG");
		
		//We prepare the different content zones
		this.oHeaderContainer = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1
		});
	 	this.oHeaderContainer.addStyleClass("touconPageHeader");//("width100p padding0");
	 	this.oMainContainer = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1
		});
		this.oMainContainer.addStyleClass("touconPageContent");//("width100p padding0 gridBG");
		this.oFooterContainer = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1
		});
	 	this.oFooterContainer.addStyleClass("touconPageFooter");//("width100p padding0 height100p");

	 	this.addContent(this.oHeaderContainer);
	 	this.addContent(this.oMainContainer);
	 	this.addContent(this.oFooterContainer);
	},
	//Through this we grant direct access to the three layouts
	getHeaderContainer : function () {
		return this.oHeaderContainer;
	},
	getContentContainer : function () {
		return this.oMainContainer;
	},
	getFooterContainer : function () {
		return this.oFooterContainer;
	},
	renderer: function(oRm, oControl) {
		//We fill our three layouts with the aggregation
		oControl.getHeaderContainer().mAggregations.content=oControl.getHeaderContent();
		oControl.getContentContainer().mAggregations.content=oControl.getMainContent();
		oControl.getFooterContainer().mAggregations.content=oControl.getFooterContent();

		//We call the default renderer for this object as we do not want to do anything special
		sap.m.PageRenderer.render(oRm, oControl);
	}
});