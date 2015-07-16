jQuery.sap.require("sap.ui.layout.Grid");
jQuery.sap.require("sap.ui.layout.GridData");
jQuery.sap.require("sap.ui.layout.HorizontalLayout");
jQuery.sap.require("toucon.Box");
jQuery.sap.require("toucon.NotificationBar");
/**
 * @param {sap.ui.core.Control} [topContent] controls which are added here will be displayed horizontally
 * @param {sap.ui.core.Control} [mainContent] controls which are added here will be displayed in a responsive grid according to their layout data
 * @param {sap.ui.core.Control} [bottomContent] controls which are added here will be displayed horizontally
 * @param {boolean} [bottomEqualsTop] default=false; defines whether this page's bottomContent should be populated with a clone of the topContent (very useful for repeating buttons like Cancel or Save above & below a long form)
 * @param {boolean} [useAuthorizations] default=false; this will change the default value of authorized to false. This avoids that the page contents are visible until the authentication model returns false.
 * @param {boolean} [authorized] default=false; defines if the user is authorized to use this page; if false, then a box with a default error message will be displayed (very useful for passing the value of an authorization model)
 * @param {boolean} [useNotificationBar] default=true; defines whether this page's footer consists of a toucon.NotificationBar (hidden by default)
 *
 * @desc A container with three aggregations for content. 
 * <br>
 * topContents will be added to a sap.ui.layout.HorizontalLayout
 * <br>
 * mainContents will be added to a sap.ui.layout.Grid
 * <br>
 * bottomContents will be added to a sap.ui.layout.HorizontalLayout
 * 
 * @extends sap.m.Page
 * @returns sap.m.Page
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
 * @alias toucon-Page
 */
var touconPage = sap.m.Page.extend("toucon.Page", {  
	metadata: {  
		properties: {  
			"bottomEqualsTop" : { type: "boolean", defaultValue: false},//defines if bottomContent=topContent
			"useAuthorizations" : { type: "boolean", defaultValue: false},
			"authorized" : { type: "boolean", defaultValue: false},
			"useNotificationBar" : { type: "boolean", defaultValue: true}
		},
		//These aggregations can be used to addTopContent etc. in standard fashion
		aggregations: {
			"topContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"mainContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"},
			"bottomContent" : { type: "sap.ui.core.Control", multiple: true, visibility: "public"}
		},
		events: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we use the addContent functions
	_topContainer: null,
	_mainContainer: null,
	_bottomContainer: null,
	_topControls: null,
	_bottomControls: null,
	_notificationBar: null,
	//We release these variables manually onExit
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-Page
	 */
	exit: function () {
		if (this._topContainer) {
			this._topContainer.destroy();
			delete this._topContainer;
		}
		if (this._mainContainer) {
			this._mainContainer.destroy();
			delete this._mainContainer;
		}
		if (this._bottomContainer) {
			this._bottomContainer.destroy();
			delete this._bottomContainer;
		}
		if (this._topControls) {
			this._topControls.destroy();
			delete this._topControls;
		}
		if (this._bottomControls) {
			this._bottomControls.destroy();
			delete this._bottomControls;
		}
		if (this._notificationBar) {
			this._notificationBar.destroy();
			delete this._notificationBar;
		}
	},
	/**
	 * @desc Initializes the top, main and bottom content containers and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconPage, .touconPageHeader, .touconPageContent, .touconPageFooter
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-Page
	 */
	init: function() {
		//Page decoration (background etc.)
		this.addStyleClass("touconPage");//("pageBG");

		//We prepare the different content zones
		this._topContainer = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});
		this._topContainer.addStyleClass("touconPageHeader");//("width100p padding0");

		this._mainContainer = new sap.ui.layout.Grid({
			hSpacing: 1,
			vSpacing: 1
		});
		this._mainContainer.addStyleClass("touconPageContent");//("width100p padding0 gridBG");

		this._bottomContainer = new sap.ui.layout.HorizontalLayout({
			allowWrapping: true
		});
		this._bottomContainer.addStyleClass("touconPageFooter");//("width100p padding0 height100p");

		this.addContent(this._topContainer);
		this.addContent(this._mainContainer);
		this.addContent(this._bottomContainer);
		this._notificationBar=new toucon.NotificationBar();
//		console.log("Page-init");
//		console.log(this.getNotificationBar());
	},
	/**
	 * @desc Through this function we grant direct access to the topContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
	 * @memberOf toucon-Page
	 */
	getTopContainer : function () {
		return this._topContainer;
	},
	/**
	 * @desc Through this function we grant direct access to the mainContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
	 * @memberOf toucon-Page
	 */
	getContentContainer : function () {
		return this._mainContainer;
	},
	/**
	 * @desc Through this function we grant direct access to the bootomContent aggregation
	 *
	 * @function
	 * @since 1.0
	 * @public
	 * @memberOf toucon-Page
	 */
	getBottomContainer : function () {
		return this._bottomContainer;
	},
	/**
	 * @desc Through this function we grant direct access to the notificationBar which can also be called
	 * through the getFooter function of the page as it is added as a footer
	 *
	 * @function
	 * @since 1.0
	 * @public
	 * @memberOf toucon-Page
	 */
	getNotificationBar : function () {
		return this._notificationBar;
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Pushes the top, main and bottom contents into the three respective layout containers's
	 * content aggregations and calls the sap.m.PageRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
	 * @memberOf toucon-Page
	 */
	renderer: function(oRm, oControl) {
		if (oControl.getUseAuthorizations()==false || 
				(oControl.getUseAuthorizations()==true && oControl.getAuthorized()==true)) {

			//If the bottom should display the same elements as the top,
			//then we clone the top contents and add them as bottom contents
			//Please note that we add both the original and the clone 
			//as dependent to the respective clone/original
			//this way we can find the clone and change the status of both instances
			//of a toggle-button for example

			//Please note that we must only go through the cloning process once
			//as we will otherwise attempt to create controls with duplicate ids
			if ((oControl._topControls===null)==true) {
				oControl._topControls = oControl.getTopContent();
				if (oControl.getBottomEqualsTop()==true) {
					for (var i=0; i<oControl._topControls.length; i++) {
						var tControl=oControl._topControls[i];
						var bControl=tControl.clone("bottom");
						tControl.addCustomData(new sap.ui.core.CustomData({key:"clone",value:bControl}));
						bControl.addCustomData(new sap.ui.core.CustomData({key:"clone",value:tControl}));
						oControl.addBottomContent(bControl);
					}
				}
			}
			if ((oControl._bottomControls===null)==true) {
				oControl._bottomControls = oControl.getBottomContent();
			}		
			//We fill our three layouts with the aggregation
			oControl.getTopContainer().mAggregations.content=oControl._topControls;
			oControl.getContentContainer().mAggregations.content=oControl.getMainContent();
			oControl.getBottomContainer().mAggregations.content=oControl._bottomControls;
		} else {
			//TODO add a loading spinner and display the error after 1sec
			var errorBox = new toucon.Box({
				icon : "sap-icon://error",
				title:"Error",
				content: [new sap.m.Text({text:"You are not authorized to view this page."})],
				layoutData : new sap.ui.layout.GridData({
					span: "L12 M12 S12",
					linebreakL: true,
					linebreakM: true,
					linebreakS: true
				})
			});

			oControl.getTopContainer().mAggregations.content=[];
			oControl.getContentContainer().mAggregations.content=[errorBox];
			oControl.getBottomContainer().mAggregations.content=[];
		}
		
		if (oControl.getUseNotificationBar()==true) {
//				&& (oControl.getNotificationBar()===undefined || oControl.getNotificationBar()===null)) {
//			oControl.setNotificationBar(new toucon.NotificationBar());
			oControl.setFooter(oControl._notificationBar);
			if (oControl._notificationBar.hasMessages()==false)	oControl.setShowFooter(false);
		}
			//We call the default renderer for this object as we do not want to do anything special
			sap.m.PageRenderer.render(oRm, oControl);
	}
});