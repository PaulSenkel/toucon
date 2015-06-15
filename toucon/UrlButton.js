/**
 * @param {string} [url] the URL
 * @param {string} [target] an optional value for the target, defaultValue is _blank
 *
 * @desc A button with a default mail icon which will open the given URL
 * in the given target or by default in a new window/tab.
 *
 * @extends sap.m.Button
 * @returns sap.m.Button
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
 * @alias toucon-UrlButton
 */
var UrlButton = sap.m.Button.extend("toucon.UrlButton", {  
	metadata: {  
		properties: {  
			"url" : { type: "string", defaultValue: null },
			"target" : { type: "string", defaultValue: "_blank" }
		}
	},
	/**
	 * @desc Initializes the button icon with the default icon sap-icon://world and 
	 * attaches the press function which will open the URL in the given target (or by default
	 * in a new window or tab).
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-UrlButton
	 */
	init: function () {
		this.setIcon("sap-icon://world");
		this.attachPress((function () {
				window.open(this.getUrl(),this.getTarget());
			}).bind(this));
	},
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the URL parameter as text if no text was set and 
	 * calls the sap.m.ButtonRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-UrlButton
	 */
	renderer: function(oRm, oControl) {
		//Uses the mail address as default text
		if (oControl.getText()=="") oControl.setText(oControl.getUrl());

		//Use the standard renderer to rendering this prepared control
		sap.m.ButtonRenderer.render(oRm, oControl);
	}
});