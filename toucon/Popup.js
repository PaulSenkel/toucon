/**
 * TODO
 * @param {string} [title] title of the Popup
 * @param {string} [icon] URL to an icon, e.g. sap-icon://home
 *
 * @desc The Popup control is sap.m.Dialog with a custom header which includes a (x) close button.
 * <br> The CSS of this popup will automatically hide the title bar if the added content is a sap.m.Page.
 * 
 * @extends sap.m.Dialog
 * @returns sap.m.Dialog
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
 * @alias toucon-Popup
 */
var touconPopup = sap.m.Dialog.extend("toucon.Popup", {  
	metadata: {  
		properties: {  
			//title : { type: "string", defaultValue: "" },
			closeButtonIcon : { type: "string", defaultValue: "sap-icon://sys-cancel" },
			closeButtonText : { type: "string", defaultValue: "" },			
		},
		aggregations: {
		}
	},
	//We use these "private" variables instead of "private" aggregations
	//As the objects are removed from aggregations when we attach them somewhere else
	_closeButton: null,
	_headerTitle: null,
	_headerBar: null,
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Popup
	 */
	exit: function () {
        if (this._closeButton) {
            this._closeButton.destroy();
            delete this._closeButton;
        }
        if (this._headerBar) {
            this._headerBar.destroy();
            delete this._headerBar;
        }
        if (this._headerTitle) {
            this._headerTitle.destroy();
            delete this._headerTitle;
        }
    },
	/**
	 * @desc Initializes the header and its close button and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconPopup, .touconPopupHeader, .sapUiSizeCompact
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Popup
	 */
	init: function() {
		console.log("toucon-Popup init");
		if (sap.m.Dialog.prototype.init) {             
			sap.m.Dialog.prototype.init.apply(this, arguments);
		}
		//Popup decoration (hide eventual page title bars if the content is a page)
		this.addStyleClass("touconPopup sapUiSizeCompact");//dialogHideInnerPageTitle
		
		this._closeButton = new sap.m.Button({
			icon:this.getCloseButtonIcon(),
			text:this.getCloseButtonText(),
			press: (function(oEvent) { 
				this.close(); 
			}).bind(this)
		});
		this._headerTitle = new sap.m.Label({text:this.getTitle()});
		this._headerBar = new sap.m.Bar({
			design:sap.m.BarDesign.Header,
			contentMiddle: this._headerTitle,
			contentRight: this._closeButton
		}).addStyleClass("touconPopupHeader");//dialogBrandedHeader

		this.setCustomHeader(this._headerBar);
		this.setType(sap.m.DialogType.Message);
		console.log(this);
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the Popup params and calls the sap.m.DialogRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Popup
	 */
	renderer: function(oRm, oControl) {
		console.log("toucon-Popup render");
		//Here we update the header title and close button
		oControl._headerTitle.setText(oControl.getTitle());
		oControl._closeButton.setText(oControl.getCloseButtonText());
		oControl._closeButton.setIcon(oControl.getCloseButtonIcon());
		
		//We call the default renderer for this object as we do not want to do anything special
		sap.m.DialogRenderer.render(oRm, oControl);
	}
});