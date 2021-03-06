jQuery.sap.require("sap.ui.commons.Tree");
jQuery.sap.require("sap.ui.commons.TreeNode");
jQuery.sap.require("sap.ui.commons.MenuButton");
jQuery.sap.require("sap.ui.commons.MenuItem");
jQuery.sap.require("sap.ui.commons.Menu");

/**
 * @param {sap.ui.commons.MenuButton} [menuButton] MenuButton containing a possible action menu for this node.
 * This aggregation is created by default, so that you just have to use the setMenu function in order
 * to attach a suitable sap.ui.commons.Menu.
 * @param {toucon.TreeNode[]} [nodes] Child nodes for this node.
 * 
 * @desc This Treenode extends the original sap.ui.commons.Treenode by allowing the presence of a right-aligned
 * MenuButton in order to provide additional actions for the Treenode.
 * 
 * @extends sap.ui.commons.TreeNode
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
 * @alias toucon-TreeNode
 */
var touconTreeNode = sap.ui.commons.TreeNode.extend("toucon.TreeNode", {
    metadata : {                              
        properties : {
        },
        aggregations : {
			menuButton : { type: "sap.ui.commons.MenuButton", multiple: false, visibility: "public"},
			/**
			 * Subnodes for the current node
			 */
			nodes : {type : "toucon.TreeNode", multiple : true, singularName : "node"}
        }
    },
    _menu : null,
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-TreeNode
	 */
	exit: function () {
        if (this._menu) {
            this._menu.destroy();
            delete this._menu;
        }
    },
	/**
	 * @desc Adds the menu to this treenode
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-TreeNode
	 */
	setMenu: function (menu) {
        this._menu = menu;
    },
	/**
	 * @desc Getter for the menu to this treenode
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-TreeNode
	 */
	getMenu: function () {
        return this._menu;
    },
	/**
	 * @desc Initializes the TreeNode and creates the default MenuButton with an "action" icon.
	 *
	 * @function
	 * @implements .touconTreeNodeMenuButton
	 * @since 1.0
	 * @protected
     * @memberOf toucon-TreeNode
	 */
    init : function () {
		if (sap.ui.commons.TreeNode.prototype.init) {             
			sap.ui.commons.TreeNode.prototype.init.apply(this, arguments);
		}
    	//we prepare a default Menu Button to which we can now directly set a menu
    	this.setAggregation("menuButton",new sap.ui.commons.MenuButton({icon: "sap-icon://action"}).addStyleClass("touconTreeNodeMenuButton"));
    }
});