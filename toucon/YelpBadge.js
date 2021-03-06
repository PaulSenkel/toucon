/**
 * @param {string} [businessId] The ID of your business. You can find it in the Review Badges HTML: <div id="yelp-biz-badge-plain-<b>SrNNWDe25T2abQ9jI8LPYQ</b>">
 * @param {string} [badgeType]  Review with stars: "rrc" (default), Simple button: "plain", Small button: "yelp", Review with number of reviews: "rc"
 * @param {string} [link] The URL which will be opened, when you click on the Yelp button (should be a URL to your Yelp page)
 * @param {string} [title] The default title which the link will contain before the button is rendered, is also used as tooltip
 * 
 * @desc This YelpBadge enables you to print out several YelpBadges in your UI5 views.
 * <br>It generates the HTML and the code which needs to be executed after the rendering.
 * <br><br>
 * v1.01 - takes into account the current SAP UI5 Locale for the Yelp script import
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
 * @alias toucon-YelpBadge
 */
var touconYelpBadge = sap.ui.core.Control.extend("toucon.YelpBadge", {                         
    metadata : {                              
        properties : {
        	"businessId" : {type: "string", defaultValue: null},	
        	"badgeType" : {type: "string", defaultValue: "rrc"},
        	"title" : {type: "string", defaultValue: null},
        	"link" : {type: "string", defaultValue: null},
        },
        aggregations : {
        }
    },
	/**
	 * @desc Generates and runs the Yelp function which imports the Javascript
	 * and generates the button.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-YelpBadge
	 */
    onAfterRendering: function() {
    	(function(d, t, c) {
    		var src = "//dyn.yelpcdn.com/biz_badge_js/"+sap.ui.getCore().getConfiguration().getLocale().toString().replace("-","_")+"/"+c.getBadgeType()+"/"+c.getBusinessId()+".js";
    		var id = "yelp-biz-badge-script-"+c.getBadgeType()+"-"+c.getBusinessId();
    		var g;
    		if (d.getElementById(id)) {
    			g = d.getElementById(id);
    			g.parentNode.removeChild(g);
    		}
    		g = d.createElement(t);
    		g.id = id;
    		g.src = src;
    		var s = d.getElementsByTagName(t)[0];
    		s.parentNode.insertBefore(g, s);}(document, 'script', this));
    },
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Renders an outer div which represents this YelpBadge UI5 control
	 * and an inner div which represents the "real" review badge.
	 *
	 * @function
	 * @implements TODO
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-YelpBadge
	 */
    renderer : function(oRm, oControl) {
			oRm.write("<div"); 
			oRm.writeControlData(oControl);
			oRm.write("><div id=\"yelp-biz-badge-"+oControl.getBadgeType()+"-"+oControl.getBusinessId()+"\"><a href=\""+oControl.getLink()+"\" title=\""+oControl.getTitle()+"\">"+oControl.getTitle()+"</a></div>");
			oRm.write("</div>");
    }
});