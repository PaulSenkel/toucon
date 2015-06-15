jQuery.sap.require("sap.ui.commons.Tree");
jQuery.sap.require("sap.ui.commons.TreeNode");
jQuery.sap.require("sap.ui.commons.MenuButton");
jQuery.sap.require("sap.ui.commons.MenuItem");
jQuery.sap.require("sap.ui.commons.Menu");

/**
 * @desc This Tree allows for Treenodes which can contain a MenuButton with a hierarchical menu.
 * 
 * @extends sap.ui.commons.Tree
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
 * @alias toucon-Tree
 */
var touconTree = sap.ui.commons.Tree.extend("toucon.Tree", {
    metadata : {                              
        properties : {
        },
		aggregations : {
			/**
			 * First level nodes
			 */
			nodes : {type : "toucon.TreeNode", multiple : true, singularName : "node", bindable : "bindable"}
		},
    },
	/**
	 * @desc Initializes the underlying sap.ui.commons.Tree
	 *
	 * @function
	 * @implements .touconTree
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Tree
	 */
    init : function () {
		if (sap.ui.commons.Tree.prototype.init) {             
			sap.ui.commons.Tree.prototype.init.apply(this, arguments);
		}
    }
});