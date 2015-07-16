/**
 * @param {string} [icon] URL to an icon, e.g. sap-icon://home, OR a value which will be translated by the iconRules mapping
 * @param {string} [defaultIcon] URL to an icon, e.g. sap-icon://home, defaultValue is sap-icon://border, OR a value which will be translated by the iconRules mapping
 * @param {object} [iconRules] a map which translates the value passed in "icon" to a valid icon URL
 * @param {string} [colorValue] a web color, e.g. #ff0000, OR a value which will be translated by the colorRules mapping
 * @param {object} [colorRules] a map which translates the value passed in "colorValue" to a valid web color
 *
 * @desc The NotificationBar control enables us to display a colored icon based on incoming parameters
 * which we then map to valid icons and valid colors.
 * @extends sap.m.Bar
 * @returns sap.m.Bar
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
 * @alias toucon-NotificationBar
 */
var touconNotificationBar = sap.m.Bar.extend("toucon.NotificationBar", {  
	metadata: {  
	},
	_notificationButton: null,
	_notificationMessage: null,
	_notificationPopover: null,
	_notificationIconSet: null,
	_messages: [],
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-Page
	 */
	exit: function () {
		if (this._notificationButton) {
			this._notificationButton.destroy();
			delete this._notificationButton;
		}
		if (this._notificationMessage) {
			this._notificationMessage.destroy();
			delete this._notificationMessage;
		}
		if (this._notificationPopover) {
			this._notificationPopover.destroy();
			delete this._notificationPopover;
		}
		if (this._notificationIconSet) {
			this._notificationIconSet.destroy();
			delete this._notificationIconSet;
		}
		if (this._messages) {
			this._messages.destroy();
			delete this._messages;
		}
	},
	/**
	 * @desc Applies the standard arguments to the sap.m.Input prototype.
	 * <br>Initializes the inner key field, the results dialog with its liveChange, confirm and search function 
	 * as well as the search dialog that pops up if too many results have been returned.
	 *
	 * @function
	 * @implements CSS: .hidden (for the hidden key field), .touconSearchHelpTableSelectDialog, .touconSearchHelpInputSearchDialogButton
	 * @since 1.0
	 * @protected
     * @memberOf searchhelp-Input
	 */
	init: function() {
		console.log("Notificationbar-Init");
		if (sap.m.Bar.prototype.init) {             
			sap.m.Bar.prototype.init.apply(this, arguments);
		}

		this._notificationButton = new sap.m.Button({press:(function (oEvent) {this._notificationPopover.openBy(oEvent.getSource());}).bind(this)});
		this._notificationMessage = new sap.m.Text();
		this._notificationList = new sap.m.List({items: {
			path: '/',
			template: new sap.m.StandardListItem({
				icon: '{icon}',
				title: '{title}',
				description: '{description}'
			})
		}});
		this._notificationPopover = new sap.m.Popover({
			showHeader: false,
			content:[this._notificationList]});
		this.addContentLeft(this._notificationButton);
		this.addContentMiddle(this._notificationMessage);
		this._notificationIconSet = {
				"sap-icon://message-error":4,
				"sap-icon://message-warning":3,
				"sap-icon://message-success":2,
				"sap-icon://message-information":1
		};
		this._messages=[];
	},
	hasMessages: function () {
		if (this._messages && this._messages.length>0) return true;
		else return false;
	},
	setMessages : function (messages) {
		//if the sap.m.Page's footer is not visible, this control will
		//not be rendered
		if (messages.length>0) {
			this.setVisible(true);
			if (this.getParent().setShowFooter) {
				this.getParent().setShowFooter(true);
			}
		} else {
			this.setVisible(false);
			if (this.getParent().setShowFooter) {
				this.getParent().setShowFooter(false);
			}
		}
		this._messages=messages;
	},
	addError: function (title,description) {
		this._messages.push({
			icon:"sap-icon://message-error",
			title:title, 
			description:description
		});
		this.setVisible(true);
		if (this.getParent().setShowFooter) {
			this.getParent().setShowFooter(true);
		}
	},
	addSuccess: function (title,description) {
		this._messages.push({
			icon:"sap-icon://message-success",
			title:title, 
			description:description
		});
		this.setVisible(true);
		if (this.getParent().setShowFooter) {
			this.getParent().setShowFooter(true);
		}
	},
	addInformation: function (title,description) {
		this._messages.push({
			icon:"sap-icon://message-information",
			title:title, 
			description:description
		});
		this.setVisible(true);
		if (this.getParent().setShowFooter) {
			this.getParent().setShowFooter(true);
		}
	},
	addWarning: function (title,description) {
		this._messages.push({
			icon:"sap-icon://message-warning",
			title:title, 
			description:description
		});
		this.setVisible(true);
		if (this.getParent().setShowFooter) {
			this.getParent().setShowFooter(true);
		}
	},
	reset: function () {
		this._messages=[];
		this.setVisible(false);
		if (this.getParent().setShowFooter) {
			this.getParent().setShowFooter(false);
		}
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the NotificationBar params, resolves the values of icon and colorValue
	 * against their respective iconRules and colorRules mappings
	 * and calls the sap.ui.core.NotificationBarRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-NotificationBar
	 */
	renderer: function(oRm, oControl) {
		console.log("Notificationbar-Render");
		//If no icon (key) was given, then let's use the default one

		if (oControl._messages.length>0) {
			var jsonModel = new sap.ui.model.json.JSONModel(oControl._messages);
			oControl._notificationList.setModel(jsonModel);

			var icon = "";
			var iconWeight = 0;
			for (var i=0; i<oControl._messages.length; i++) {
				var tIcon = oControl._messages[i].icon;
				if (oControl._notificationIconSet[tIcon]>iconWeight) {
					iconWeight = oControl._notificationIconSet[tIcon];
					icon = tIcon;
					if (iconWeight==4) break;
				}
			}
			
			oControl._notificationButton.setText(oControl._messages.length+"");
			oControl._notificationButton.setIcon(icon);
			if (iconWeight==4) {
				oControl._notificationButton.setType(sap.m.ButtonType.Reject);
				oControl._notificationPopover.setTitle("The e-mail could not be send.");
			}
			else if (iconWeight==3) {
				oControl._notificationButton.setType(sap.m.ButtonType.Reject);
				oControl._notificationPopover.setTitle("The e-mail may not have been sent. There have been issues.");
			}
			else if (iconWeight==2) {
				oControl._notificationButton.setType(sap.m.ButtonType.Accept);
				oControl._notificationPopover.setTitle("The e-mail was sent.");
			}
			else {
				oControl._notificationButton.setType(sap.m.ButtonType.Emphasized);
				oControl._notificationPopover.setTitle("The e-mail may not have been sent. Please check the messages.");
			}
			oControl._notificationMessage.setText(oControl._messages[oControl._messages.length-1].description);
			oControl._notificationMessage.setTooltip(oControl._messages[oControl._messages.length-1].description);
		}
		sap.m.BarRenderer.render(oRm, oControl);
	}
});