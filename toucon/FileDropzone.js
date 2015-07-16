jQuery.sap.require("toucon.extlibs.dropzone-min");

/**
 * @param {object} [options] The map in which you have to specify the real DropZone's options (e.g. url, maxFilesize, maxFiles, etc.). Please refer to the dropzone.js
 * documentation for more information
 * @param {string} [cssUrl] The Url to the combined CSS, default: res/toucon-extlibs/dropzone.css
 * 
 * @desc This FileDropzone enables you to include a dropzone.js file uploader in your UI5 application
 * without having to include CSS by hand and without having to think of what needs to
 * happen in the View and what needs to happen in the Controller.
 * <br><br>
 * Credits for the Dropzone library go to dropzonejs.com, please go there for up-to-date code, license information and donations.
 * <br><br>
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
 * @alias toucon-FileDropzone
 */
var touconFileDropzone = sap.ui.core.Control.extend("toucon.FileDropzone", {                         
    metadata : {                              
        properties : {
        	"options" : {type: "object", defaultValue: null},
           	"cssUrl" :  {type: "string", defaultValue: "res/toucon-extlibs/dropzone.css"},
           	"visible" : {type: "boolean", defaultValue: true },
           	"authorized" : {type: "boolean", defaultValue: true }
        },
        aggregations : {
        }
    },
    dropzone:null,
    cssLoaded:false,
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-FileDropzone
	 */
	exit: function () {
        if ((this.dropzone===undefined)==false) {
            delete this.dropzone;
        }
        if ((this.cssLoaded===undefined)==false) {
            delete this.cssLoaded;
        }
    },
    /**
	 * @desc Checks if the CSS is loaded or adds it to the <head>.
	 *
	 * @function
	 * @since 1.01
	 * @protected
     * @memberOf toucon-FileDropzone
	 */
    onBeforeRendering : function () {
    	if (this.cssLoaded==false && !jQuery("link[href='"+this.getCssUrl()+"']").length) {
    	    jQuery('<link href="'+this.getCssUrl()+'" rel="stylesheet">').appendTo("head");
    	}
    },
	/**
	 * @desc Generates and runs the Yelp function which imports the Javascript
	 * and generates the button.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-FileDropzone
	 */
	onAfterRendering: function() {
    	if (this.getVisible()==true && this.getAuthorized()==true) {
    		this.dropzone = new Dropzone("#"+this.getId(), this.getOptions());
    	}
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Renders an div into which the DropZone will be generated.
	 *
	 * @function
	 * @implements CSS: .dropzone
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-FileDropzone
	 */
    renderer : function(oRm, oControl) {
    	if (oControl.getVisible()==true) {
			oRm.write("<div"); 
			oRm.writeControlData(oControl);
			oRm.addClass("dropzone");
			oRm.writeClasses();
			oRm.write(">");
			if (oControl.getAuthorized()==false) {
				oRm.write("<center>You are not authorized to upload documents.</center>");
			}
			oRm.write("</div>");
    	}
    }
});