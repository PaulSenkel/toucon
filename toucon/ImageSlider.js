jQuery.sap.require("toucon.extlibs.jssor-slider-mini");
/**
 * @param {boolean} [autoPlay] determines if the slideshow will run automatically, default is false
 * @param {boolean} [autoResize] determines if the slideshow container will be resized via timeouts when the screen resizes or the screen orientation changes, default is true
 * @param {int} [lazyLoading] determines if lazyLoading is used and how many slides will be preloaded, default is 1 which means that lazyLoading is true and one slide will be preloaded
 * @param {int} [slideDuration] milliseconds before each slide change if autoPlay is active, default is 1000 (1s)
 * @param {int} [numberOfThumbnails] number of thumbnails which will be displayed at the button of the ImageSlider, default is 5
 * @param {int} [maxWidth] width in px, default is 600
 * @param {int} [maxHeight] height in px, default is 300
 * @param {string} [loadingGifUrl] URL to animated gif, default is res/toucon-extlibs/jssor/loading.gif
 * @param {string[]} [images] array of image URLs
 * @param {string[]} [thumbnails] array of thumbnail image URLs
 *
 * @desc This ImageSlider enables the integration of the JSSOR ImageSlider in UI5 Apps.
 * <br> It has been optimized for the thumbnail-based slider demo'ed on http://www.jssor.com/demos/image-slider.html
 * <br> You may have to extend it to cover other Jssor Sliders (additional parameters for feeding other options).
 * <br> If you do so, please let me know so that I can update this component.
 * <br><br>
 * Credits for the Jssor Slider library go to JSSOR.COM, please go there for up-to-date code, license information and donations.
 * <br><br>
 * v1.01 - added parameter for CSS with auto-include function so that the jssor CSS does no longer need to be included in another CSS file
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
 * @version 1.01
 *
 * @constructor
 * @public
 * @alias toucon-ImageSlider
 */
var touconImageSlider = sap.ui.core.Control.extend("toucon.ImageSlider", {                         
    metadata : {                              
        properties : {
        	"autoPlay" : {type: "boolean", defaultValue: false},	
        	"autoResize" : {type: "boolean", defaultValue: true},	
			"lazyLoading" : {type: "int", defaultValue: "1"},//number of slides to preload
           	"slideDuration" : {type: "int", defaultValue: "1000"},//milliseconds between change
			"numberOfThumbnails" : {type: "int", defaultValue: "5"},//number of thumbnails	
			"maxWidth" : { type: "int", defaultValue: "600"},
           	"maxHeight" : { type: "int", defaultValue: "300"},
           	"loadingGifUrl" : { type: "string", defaultValue: "res/toucon-extlibs/jssor/loading.gif"},
           	"cssUrl" : { type: "string", defaultValue: "res/toucon-extlibs/jssor.css"},
           	"images" : { type: "string[]", defaultValue: null},
           	"thumbnails" : { type: "string[]", defaultValue: null}
        },
        aggregations : {
        }
    },
    jssorSlider:null,
    cssLoaded:false,
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-ImageSlider
	 */
	exit: function () {
        if ((this.jssorSlider===undefined)==false) {
            delete this.jssorSlider;
        }
        if ((this.cssLoaded===undefined)==false) {
            delete this.cssLoaded;
        }
    },
    /**
	 * @desc Sets the options for the JssorSlider, binds the resize events and
	 * launches the initial scale so that the slider will have the optimal size
	 * right from the beginning.
	 * <br><b>Jssor Options:</b>
	 * <br>$DragOrientation: 3 - you can drag left/right and top/down
	 * <br>$AutoPlay: from UI5 param
	 * <br>$LazyLoading: from UI5 param
	 * <br>$SlideDuration: from UI5 param
	 * <br>$ThumbnailNavigatorOptions : {
	 * <br>		$Class : $JssorThumbnailNavigator$ - thumbnails are enforced
	 * <br>		$ChanceToShow : 2 - thumbnails are always shown
	 * <br>		$DisplayPieces : from UI5 param
	 * <br>}
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-ImageSlider
	 */
    initSlider : function () {
    	var options = {
    			$DragOrientation: 3,
    			$AutoPlay: this.getAutoPlay(),
    			$LazyLoading: this.getLazyLoading(),
    			$SlideDuration: this.getSlideDuration(),
    			$ThumbnailNavigatorOptions : {
    				$Class : $JssorThumbnailNavigator$,
    				$ChanceToShow : 2,
    				$DisplayPieces : this.getNumberOfThumbnails()
    			}
    	};
    	this.jssorSlider = new $JssorSlider$(this.getId(), options);
    	
    	if (this.getAutoResize()==true) {
        	//Scale slider while window load/resize/orientationchange.
        	jQuery(window).bind("load", this.scaleSlider.bind(this,30));
        	jQuery(window).bind("resize", this.scaleSlider.bind(this,30));
        	jQuery(window).bind("orientationchange", this.scaleSlider.bind(this,1000));
    	}

    	window.setTimeout(this._scale.bind(this), 500);
    }, 
	/**
	 * @param {int} [millis] number of milliseconds for the timeout before the rescale takes place
	 * 
	 * @desc Called by the resize events, scales the slider after a given number of milliseconds.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-ImageSlider
	 */
    scaleSlider : function (millis) {
    	window.setTimeout(this._scale.bind(this), millis);
    },
    /**
	 * @desc Checks if the CSS is loaded or adds it to the <head>.
	 *
	 * @function
	 * @since 1.01
	 * @protected
     * @memberOf toucon-ImageSlider
	 */
    onBeforeRendering : function () {
    	if (this.cssLoaded==false && !jQuery("link[href='"+this.getCssUrl()+"']").length) {
    	    jQuery('<link href="'+this.getCssUrl()+'" rel="stylesheet">').appendTo("head");
    	}
    },
	/**
	 * @desc Reinitialises the slider by calling initSlider
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-ImageSlider
	 */
    onAfterRendering : function () {
   		this.initSlider();
    },
	/**
	 * @desc Does the actual rescaling work either by using the slider div's
	 * parent width or the maxWidth.
	 *
	 * @function
	 * @since 1.0
	 * @private
     * @memberOf toucon-ImageSlider
	 */
    _scale : function () {
    	var parentWidth = $("#"+this.getId()).parent().width();
    	if (parentWidth) {
    		this.jssorSlider.$ScaleWidth(parentWidth>this.getMaxWidth()? this.getMaxWidth():parentWidth);
    	}
	},	 
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Renders all the HTML which the JssorSlider needs to render the images, thumbnails and arrows.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-ImageSlider
	 */
    renderer : function(oRm, oControl) {
			oRm.write("<div"); 
			oRm.writeControlData(oControl);
			oRm.write(" style=\"position: relative; margin: 0 auto; left: 0px; top: 0px; width: "+oControl.getMaxWidth()+"px; height: "+oControl.getMaxHeight()+"px; overflow: hidden;\">");

			oRm.write("<div u=\"loading\" style=\"position: absolute; top: 0px; left: 0px;\">");
			oRm.write("<div style=\"filter: alpha(opacity = 70); opacity: 0.7; position: absolute; display: block; background-color: #000000; top: 0px; left: 0px; width: 100%; height: 100%;\"></div>");
			oRm.write("<div style=\"position: absolute; display: block; background: url('"+oControl.getLoadingGifUrl()+"') no-repeat center center; top: 0px; left: 0px; width: 100%; height: 100%;\"></div>");
			oRm.write("</div>");
			
			oRm.write("<div u=\"slides\" style=\"cursor: move; position: absolute; left: 0px; top: 0px; width: "+oControl.getMaxWidth()+"px; height: "+oControl.getMaxHeight()+"px; overflow: hidden;\">");

			var renderThumbs = true;
			if ((oControl.getImages()===null)==false) {
				if (oControl.getThumbnails()===null || oControl.getImages().length!=oControl.getThumbnails().length) {
					renderThumbs = false;
				}
				
				for (var i=0; i<oControl.getImages().length; i++) {
					oRm.write("<div>");
					oRm.write("<img u=\"image\" src2=\""+oControl.getImages()[i]+"\">");
					if (renderThumbs==true) {
						oRm.write("<img u=\"thumb\" src=\""+oControl.getThumbnails()[i]+"\">");
					}
					oRm.write("</div>");
				}
			}
			
			oRm.write("</div>");
			
			var arrowTop = (Math.floor(oControl.getMaxHeight()/2)-20)+"px";
			
			if (renderThumbs==true) {
				oRm.write("<div u=\"thumbnavigator\" class=\"jssort03\" style=\"left: 0px; bottom: 0px; position: absolute; width:"+oControl.getMaxWidth()+"px; height:40px\">");
				oRm.write("<div style=\"background-color: #000; filter: alpha(opacity = 30); opacity: .3; width: 100%; height: 100%;\"></div>");
				oRm.write("<div u=\"slides\" style=\"cursor: default;\">"
					+"			<div u=\"prototype\" class=\"p\">"
					+"				<div class=\"w\">"
					+"					<div u=\"thumbnailtemplate\" class=\"t\"></div>"
					+"				</div>"
					+"				<div class=\"c\"></div>"
					+"			</div>"
					+"		</div>");
				oRm.write("</div>");
			}
			oRm.write("<span u=\"arrowleft\" onClick=\"sap.ui.getCore().byId('"+oControl.getId()+"').previous();\" class=\"jssora03l\" style=\"top: "+arrowTop+"; left: 8px;\"></span>");
			oRm.write("<span u=\"arrowright\" onClick=\"sap.ui.getCore().byId('"+oControl.getId()+"').next();\" class=\"jssora03r\" style=\"top: "+arrowTop+"; right: 8px;\"></span>");
			oRm.write("</div>");
    },
	/**
	 * @desc Is called by the left arrow, calls the JssorSlider's $Prev() and $Pause() functions.
	 * <br>Calling pause makes sure that the eventual animation is being stopped.
	 * <br>If people click on back, they may want to take their time looking at things.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-ImageSlider
	 */
    previous : function () {
    	this.jssorSlider.$Prev();
    	this.jssorSlider.$Pause();
    },
	/**
	 * @desc Is called by the right arrow, calls the JssorSlider's $Next() function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-ImageSlider
	 */
    next : function () {
    	this.jssorSlider.$Next();
    }
});