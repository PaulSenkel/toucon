/**
 * @param {string} [mail] the e-mail address
 * @param {string} [subject] an optional value for the subject
 * @param {string} [body] an optional value for the body of the message
 *
 * @desc A button with a default mail icon and which will open the local
 * e-mail client and prefill the e-mail with the given information
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
 * @alias toucon-MailButton
 */
var touconMailButton = sap.m.Button.extend("toucon.MailButton", {  
	metadata: {  
		properties: {  
			"mail" : { type: "string", defaultValue: null },
			"subject" : { type: "string", defaultValue: null },
			"body" : { type: "string", defaultValue: null }
		}
	},
	/**
	 * @desc Initializes the button icon with the default icon sap-icon://email and 
	 * attaches the press function which will call the mailto link with target "hidden"
	 * Please note that this version requires the existence of a hidden iFrame called "hidden"!
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-MailButton
	 */
	init: function () {
		this.setIcon("sap-icon://email");
		this.attachPress((function () {
				var params = "";
				if (this.getSubject()!="") params = "?subject="+encodeURIComponent(this.getSubject());
				if (this.getBody()!="") params = params+((params=="")? "?":"&")+"body="+encodeURIComponent(this.getBody());
				window.open("mailto:"+this.getMail()+params,"hidden");
			}).bind(this));
	},
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Applies the mail parameter as text if no text was set and 
	 * calls the sap.m.ButtonRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-MailButton
	 */
	renderer: function(oRm, oControl) {
		//Uses the mail address as default text
		if (oControl.getText()=="") oControl.setText(oControl.getMail());

		//Use the standard renderer to rendering this prepared control
		sap.m.ButtonRenderer.render(oRm, oControl);
	}
});