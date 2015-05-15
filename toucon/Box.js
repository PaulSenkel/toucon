/* A content area with an icon, a title
 * both are contained in an horizontal layout
 * followed by the standard content[]
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
sap.ui.layout.Grid.extend("toucon.Box", {  
	metadata: {  
		properties: {  
			title : { type: "string", defaultValue: null },
			icon : { type: "string", defaultValue: null },
		},
		aggregations: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	oHeader: null,
	oIcon: null,
	oTitle: null,
	//We release these variables manually onExit
	exit: function () {
        if (this.oHeader) {
            this.oHeader.destroy();
            delete this.oHeader;
        }
        if (this.oIcon) {
            this.oIcon.destroy();
            delete this.oIcon;
        }
        if (this.oTitle) {
            this.oTitle.destroy();
            delete this.oTitle;
        }
    },
	init: function() {
		//Box decoration (background, rounded corners etc.)
		this.addStyleClass("touconBox");
		
		//We prepare the header zone
		this.oHeader = new sap.ui.layout.HorizontalLayout({
			layoutData : new sap.ui.layout.GridData({
				span: "L12 M12 S12"})
		}).addStyleClass("touconBoxUnderline");
		this.addContent(this.oHeader);

		//We prepare the icon zone
		this.oIcon = new sap.ui.core.Icon( {  
	        src : "",  
	        size : "32px",  
	    } ).addStyleClass("touconBoxIcon");
		this.oHeader.addContent(this.oIcon);

		//We prepare the title zone
		this.oTitle = new sap.m.Label({
			text: "",
			tooltip: "",
			layoutData : new sap.ui.layout.GridData({
				span: "L12 M12 S12",
				linebreakL: true,
				linebreakM: true,
				linebreakS: true
			})}).addStyleClass("touconBoxTitle");
		this.oHeader.addContent(this.oTitle);
	},
	renderer: function(oRm, oControl) {
		//Here we fill the icon and title
		oControl.oIcon.setSrc(oControl.getIcon());
		oControl.oTitle.setText(oControl.getTitle());
		oControl.oTitle.setTooltip(oControl.getTitle());
		
		//We call the default renderer for this object as we do not want to do anything special
		sap.ui.layout.GridRenderer.render(oRm, oControl);
	}
});