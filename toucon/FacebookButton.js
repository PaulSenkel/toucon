/**
 * @param {string} [link] The full link to the Facebook page you want to like or recommend.
 * @param {string} [layoutType]  The way the button should look like, use "standard" for the original button the number of likes next to it, 
 * use "box_count" for a compact tile-like display including a bubble showing the number of likes, 
 * use "button_count" for a normal button showing the number of likes in a bubble on the right,
 * use "button" for a simple button without the number of likes,
 * default is "standard"
 * @param {string} [actionType] determines the name of the button, can be either "recommend" or "like" (default)
 * @param {boolean} [showFaces] whether faces of friends liking this page should be shown or not, default is false
 * @param {boolean} [showShare] whether a "Share" button should be shown in addition to the Like/Recommend button, default is false
 * 
 * @desc This control enables you to embed a Facebook button into your UI5 app without having
 * to worry about anything. This control creates the FB-ROOT div, imports the FB script and
 * generates the button.
 * 
 * @extends sap.ui.core.Control
 * @returns sap.ui.core.Control
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
 * @alias toucon-FacebookButton
 */
var touconFacebookButton = sap.ui.core.Control.extend("toucon.FacebookButton", {                         
	metadata : {                              
		properties : {
			"link" : {type: "string", defaultValue: null},	
			"layoutType" : {type: "string", defaultValue: "standard"},
			"actionType" : {type: "string", defaultValue: "like"},
			"showFaces" : {type: "boolean", defaultValue: false},
			"showShare" : {type: "boolean", defaultValue: false}
		},
		aggregations : {
		}
	},
	/**
	 * @desc Creates the fb-root div which Facebook requires at the beginning of the
	 * body tag if it does not yet exist.
	 * <br>
	 * Imports the Facebook javascript if it has not already been imported.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-FacebookButton
	 */
	onBeforeRendering: function() {
		//creates the fb-root div in body if it does not exist
		if (document.getElementById("fb-root")===undefined || document.getElementById("fb-root")===null) {
			var r = document.createElement("div"); r.id = "fb-root";
			document.body.insertBefore(r, document.body.firstChild);
		};
		//imports the FB js and removes other instances of it
		(function(d, t, c) {
			var l = sap.ui.getCore().getConfiguration().getLocale().toString().replace("-","_");
			var src = "//connect.facebook.net/"+l+"/sdk.js#xfbml=1&version=v2.3";
			var id = "facebook-jssdk";
			var g;
			if (d.getElementById(id)) {
				g = d.getElementById(id);
				g.parentNode.removeChild(g);
			}
			g = d.createElement(t);
			g.id = id;
			g.src = src;
			var s = d.getElementsByTagName(t)[0];
			s.parentNode.insertBefore(g, s);
		}(document, 'script', this));
	},
	/**
	 * @desc Reparses the control to force the rerender of the FB button.
	 * <br>Updates the locale in the FB-iFrame to UI5's current locale.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-FacebookButton
	 */
	onAfterRendering: function() {
		var d = document;
		var l = sap.ui.getCore().getConfiguration().getLocale().toString().replace("-","_");
		var fd = d.getElementById(this.getId()+"_fb")
		//if FB div is empty, reparse this control (needed on rerender)
		if (fd.innerHTML=="") {
			if ((window.FB===undefined)==false) window.FB.XFBML.parse(d.getElementById(this.getId()));
		}
		//then apply locale to FB iframe
		if (fd.innerHTML!="") {
			if (fd && fd.firstChild && fd.firstChild.firstChild) {
				var f = fd.firstChild.firstChild;
				f.src = f.src.replace(/[a-z]{2}_[A-Z]{2}/,l);
			}
		}
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Renders the Facebook button and includes UI5 control data.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
	 * @memberOf toucon-FacebookButton
	 */
	renderer : function(oRm, oControl) {
		oRm.write("<div");
		oRm.writeControlData(oControl);
		oRm.write(">");
		oRm.write("<div id=\""+oControl.getId()+"_fb\" class=\"fb-like\" data-href=\""+oControl.getLink()+"\" data-layout=\""+oControl.getLayoutType()+"\" data-action=\""+oControl.getActionType()+"\" data-show-faces=\""+oControl.getShowFaces()+"\" data-share=\""+oControl.getShowShare()+"\"></div>");
		oRm.write("</div>");
	}
});