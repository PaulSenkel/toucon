/*!
 * SAP UI development toolkit for HTML5 (SAPUI5/OpenUI5)
 * (c) Copyright 2009-2015 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides default renderer for control toucon.TreeRenderer
sap.ui.define(['jquery.sap.global'],
	function(jQuery) {
	"use strict";


	/**
	 * Tree renderer.
	 * @namespace
	 */
	var TreeRenderer = {
	};
	
	/**
	 * Renders the HTML for the Tree
	 *
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oTree] A toucon.Tree
	 *
	 * @desc This function is a copy of the original TreeRenderer.render function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Tree
	 */
	TreeRenderer.render = function(oRenderManager, oTree){
		// convenience variable
		var rm = oRenderManager;
	
		//First node get is focusable.
		TreeRenderer.bFirstNodeRendered = false;
	
		rm.write("<div");
		rm.writeControlData(oTree);
		rm.addClass("sapUiTree");
	
		if (oTree.getHeight() != "" && oTree.getHeight() != "auto") {
			rm.addClass("sapUiTreeFixedHeight");
		}
		if (!oTree.getShowHeader()) {
			rm.addClass("sapUiTreeTransparent");
		}
		rm.writeClasses();
	
		rm.addStyle("width", oTree.getWidth() || "auto");
		rm.addStyle("height", oTree.getHeight());
		rm.addStyle("min-width", oTree.getMinWidth());
	
		rm.writeStyles();
	
		//ARIA
		rm.writeAttribute('role', 'tree');
		rm.write(">");
	
		if (oTree.getShowHeader()) {
	
			rm.write("<div id=\"" + oTree.getId() + "-Header\" class=\"sapUiTreeHeader\""); //Header
			rm.writeAttribute('role', 'heading');
			rm.write(">");
	
			//Title
			rm.write("<div class='sapUiTreeTitle'");
	
			if (oTree.getTooltip_AsString()) {
				rm.writeAttributeEscaped( "title", oTree.getTooltip_AsString());//Tree tooltip
			}
			rm.write(">");
			rm.writeEscaped(oTree.getTitle());
			rm.write("</div>");
	
	
			if (oTree.getShowHeaderIcons()) {
				rm.write("<div id='" + oTree.getId() + "-TBCont' class='sapUiTreeTbCont'"); //ToolbarContainer
				rm.writeAttribute('role', 'toolbar');
				rm.write(">");
				rm.renderControl(oTree.oCollapseAllButton);
				rm.renderControl(oTree.oExpandAllButton );
	
				rm.write("</div>");
			}
	
	
			rm.write("</div>");//End of Header
		}
	
		rm.write("<div id=\"" + oTree.getId() + "-TreeCont\""); //tree container
	
		rm.addClass("sapUiTreeCont");
		var showScroll = oTree.getShowHorizontalScrollbar();
		if (showScroll) {
			rm.addClass("sapUiTreeContScroll");
		} else {
			rm.addClass("sapUiTreeContNoScroll");
		}
		rm.writeClasses();
	
		rm.write(">");
	
		// write the HTML into the render manager
		rm.write("<ul class=\"sapUiTreeList\">");
	
		var aNodes = oTree.getNodes();
		 for (var i = 0;i < aNodes.length;i++) {
		   TreeRenderer.renderNode(rm, aNodes[i], 1, aNodes.length, i + 1);
		}
	
		rm.write("</ul>");
		rm.write("</div>");//Tree Container
		rm.write("</div>");//Tree
	};
	
	/**
	 * Renders the HTML for a TreeNode
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oNode an object representation of the control that should be rendered
	 * @param {int} iLevel the hierarchical level value of the node
	 *
	 * @desc This function is an extended copy of the original TreeRenderer.renderNode function.
	 * <br>
	 * It will render the MenuButton of this TreeNode if it contains a defined Menu.
	 * <br><br><b>Please note:</b>
	 * <br>
	 * For now this is a prototype. It will look for a global variable useActionMenu. If true
	 * a hard-coded menu will be injected for demo purposes.
	 *
	 * @function
	 * @implements CSS: .touconTreeNode .touconTreeNodeLabel .touconTreeNodeAction
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-TreeNode
	 */
	TreeRenderer.renderNode = function(oRenderManager, oNode, iLevel, iSize, iPos){
		// convenience variable
		var rm = oRenderManager;
		var bExpanded;
		var menuButton = oNode.getAggregation("menuButton");
		//If a menu was passed directly, then we use it
		if ((oNode._menu===undefined)==false && (oNode._menu===null)==false) {
			//menu was defined
			menuButton.setMenu(oNode._menu);
		} else if (useActionMenu && useActionMenu==true){
			console.log("toucon.TreeRenderer-renderNode-no menu defined, faking one ...");
			//TODO REMOVE DEVPATCH
		    var oControl = new sap.ui.commons.Menu();
		    //Register one single event handler on the root menu to listen to selections
		    //TODO implement the execution of a function here
		    oControl.attachItemSelect(function(oEvent){
		     alert(oEvent.getParameter("item").getId());
		     console.log("componentBuilder.js.buildMenu.oControl.attachItemSelect:");
		     console.log(oEvent);
		     });

		     var oController = {};//fake controller
		     oController.callBackendFunction = function (oEvent){
		     console.log("componentBuilder.js.buildMenu.oControl.callBackendFunction:");
		     console.log(oEvent);
		     alert("Event HREF: "+oEvent.VALUE.HREF);
		     };
		     var oMenuItem21 = new sap.ui.commons.MenuItem({text: "New", icon: "sap-icon://add-contact"}); //Icon must be not larger than 16x16 px
		     oControl.addItem(oMenuItem21);
		     var oMenuItem22 = new sap.ui.commons.MenuItem({text: "Delete", icon: "sap-icon://delete"});
		     oControl.addItem(oMenuItem22);
		     var oMenuItem23 = new sap.ui.commons.MenuItem({text: "Properties", icon: "sap-icon://detail-view", enabled: false});
		     oControl.addItem(oMenuItem23);

		     //Create a sub menu for item 1
		     var oMenu22 = new sap.ui.commons.Menu({ariaDescription: "New File Menu"});
		     oMenuItem21.setSubmenu(oMenu22);
		     //Create the items and add them to the sub menu
		     var oMenuItem24 = new sap.ui.commons.MenuItem({text: "New TXT file", tooltip: "Creates a new TXT file."});
		     oMenu22.addItem(oMenuItem24);
		     var oMenuItem25 = new sap.ui.commons.MenuItem({text: "New RAR file", tooltip: "Creates a new RAR file."});
		     oMenu22.addItem(oMenuItem25);
			
		     menuButton.setMenu(oControl);
		}

		// write the HTML into the render manager
		rm.write("<li");
		rm.writeElementData(oNode);
		rm.addClass("sapUiTreeNode");
		rm.addClass("touconTreeNode");
	
		if (oNode.getExpanded() && (oNode.getHasExpander() || oNode.hasChildren() )) {
			rm.addClass("sapUiTreeNodeExpanded");
			bExpanded = true;
		}
		else if (!oNode.getExpanded() && (oNode.getHasExpander() || oNode.hasChildren() )) {
	
			rm.addClass("sapUiTreeNodeCollapsed");
			bExpanded = false;
		}
	
		if (oNode.getSelectable() && oNode.getIsSelected()) {
			rm.addClass("sapUiTreeNodeSelected");
			rm.writeAttribute('aria-selected', 'true');
		}
	
		if (! bExpanded && oNode.hasSelectedHiddenChild()) {
			rm.addClass("sapUiTreeNodeSelectedParent");
			rm.writeAttribute('aria-selected', 'true');
		}
	
		rm.writeClasses(oNode);
	
		//ARIA
		var mProps = {role: 'treeitem', level: iLevel, setsize: iSize, posinset: iPos};
	
		if (bExpanded) {
			mProps["expanded"] = true;
		} else {
			// don't write aria expanded attribute if a node has no children
			// if a node has an expander we assume that it also has children
			if (oNode.getHasExpander()) {
				mProps["expanded"] = false;
			}
		}
	
		rm.writeAccessibilityState(oNode, mProps);
	
		//Tooltip
		rm.writeAttributeEscaped( "title", oNode.getTooltip_AsString());
	
		if (!TreeRenderer.bFirstNodeRendered) {
			rm.write("tabindex='0'");
			TreeRenderer.bFirstNodeRendered = true;
		}
		rm.write(">");
	
	
		rm.write("<span");  //Node Content
	
		rm.addClass("sapUiTreeNodeContent touconTreeNodeLabel");
		if (!oNode.getSelectable()) {
			rm.addClass("sapUiTreeNodeNotSelectable");
		}
		rm.writeClasses();
	
		rm.write(">");  //Node Content
	
		if (oNode.getIcon()) {
			rm.writeIcon(oNode.getIcon(), "sapUiTreeIcon");
		}
	
		rm.writeEscaped( oNode.getText());
	
	
		rm.write("</span>"); //Node Content
		//Render menu button
		if ((menuButton.getMenu()===undefined)==false && (menuButton.getMenu()===null)==false) {
			rm.write("<span");  //Node Content
			rm.addClass("touconTreeNodeAction");
			rm.writeClasses();
			rm.write(">");  //Node Action Button
			rm.renderControl(menuButton);
			rm.write("</span>"); //Node Content
		} 
	
		rm.write("</li>");
	
		if (oNode.getNodes()) {
			var aSubNodes = oNode.getNodes();
			rm.write("<ul");
	
			rm.writeAttribute("id", oNode.getId() + "-children");
	
			rm.addClass("sapUiTreeChildrenNodes");
			if (!bExpanded) {
				rm.addClass("sapUiTreeHiddenChildrenNodes");
			} else {
				rm.writeAttribute("style", "display: block;");//For animation sake
			}
			rm.writeClasses();
	
			rm.write(">");
			iLevel ++;
			for (var i = 0;i < aSubNodes.length;i++) {
				TreeRenderer.renderNode(rm, aSubNodes[i], iLevel, aSubNodes.length, i + 1);
			}
			rm.write("</ul>");
		}
	};
	

	return TreeRenderer;

}, /* bExport= */ true);