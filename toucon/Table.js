jQuery.sap.require("sap.ui.table.Table");
jQuery.sap.require("toucon.TableColumn");
/**
 * @param {boolean} [actionMode] default is "false"; if "true", then the actionOnSelect function will be executed when a row is being selected
 * @param {function} [actionOnSelect] the function which will be executed on row selection if actionMode is true
 * @param {boolean} [editMode] default is "false"; if "true" all controls in the row will be made editable or enabled. Controls of all other rows will be inactivated.
 * @param {sap.ui.table.SelectionMode} [selectionMode] defaulting to sap.ui.table.SelectionMode.Single
 * @param {sap.ui.table.SelectionBehavior} [selectionBehavior] defaulting to sap.ui.table.SelectionBehavior.RowSelector -> one must click on a row header in order to select the row
 *
 * @fires beforeMakingRowEditable: when the user has selected a row, this will fire just before all controls will be made editable/enabled
 * @fires afterMakingRowEditable: when the user has selected a row, this will fire just after all controls have been made editable/enabled
 * @fires onValueStateError: when one of the controls in the row has a valueState==Error, then this will fire ONCE, even if several controls are concerned
 *  
 * @desc The Table control enables us execute actions on row selection, to make a row editable on row selection
 * and will also highlight columns which have the editable flag set to true.
 * <br>This table enables us a more interactive experience as we can
 * <br>a) execute for example an "open" action on a row if the table is not in edit mode
 * <br>b) make a line editable on row selection after we switched the table to edit mode
 * <br>c) clearly highlight columns in which we want users to enter data
 * <br>
 * <br>As ODATA models do not let us modify more than one data set at the same time, this table is in
 * Single selection mode by default and fires an event before a new line is made editable.
 * This enables us to save changes and refresh our model before we move to the next line. 
 * 
 * @extends sap.ui.table.Table
 * @returns sap.ui.table.Table
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
 * @alias toucon-Table
 */
var touconTable = sap.ui.table.Table.extend("toucon.Table", {  
	metadata: {  
		properties: {  
			"actionMode" : { type: "boolean", defaultValue: false },
			"actionOnSelect" : {type : "object", defaultValue: null},
			"editMode": { type: "boolean", defaultValue: false},
			"selectionMode" : {type: "sap.ui.table.SelectionMode", defaultValue: sap.ui.table.SelectionMode.Single},
			"selectionBehavior": {type: "sap.ui.table.SelectionBehavior", defaultValue: sap.ui.table.SelectionBehavior.RowSelector}
		},
		events : {
			beforeMakingRowEditable :  {enablePreventDefault : true},
			afterMakingRowEditable :  {enablePreventDefault : true},
			onValueStateError :  {enablePreventDefault : true}
		}
	},  
	_currentEditableRowIndex:null,
	_currentValueStates:{},
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @memberOf toucon-Table
	 */
	exit: function () {
		if (this._currentEditableRowIndex) {
			this._currentEditableRowIndex.destroy();
			delete this._currentEditableRowIndex;
		}
		if (this._currentValueStates) {
			this._currentValueStates.destroy();
			delete this._currentValueStates;
		}
	},
	/**
	 * @desc Initializes the table and applies CSS classes.
	 *
	 * @function
	 * @implements CSS: .touconTable
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	init: function () {
		if (sap.ui.table.Table.prototype.init) {             
			sap.ui.table.Table.prototype.init.apply(this, arguments);
		}
		this.addStyleClass("touconTable");
	},
	/**
	 * @desc Toggles the actionMode from on to off and back.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	toggleActionMode: function () {
		this.setActionMode(!this.getActionMode());
		return this.getActionMode();
	},
	/**
	 * @desc Toggles the editMode from on to off and back.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	toggleEditMode: function () {
		this.setEditMode(!this.getEditMode());
		return this.getEditMode();
	},
	/**
	 * @param {event} [oEvent] the UI5 event
	 *
	 * @desc Sets the rowIndex as selectedIndex and calls the editRow function.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	editOnSelect : function(oEvent){
		var selId = oEvent.getParameter("rowIndex");//table.getSelectedIndex();
//		var reselectingSameRow = this._currentEditableRowIndex==selId; 
//		this.editRow(selId,reselectingSameRow);//not so nice as also triggered by click on cell in same row and not only the selector
		this.setSelectedIndex(selId);
		this.editRow(selId);
	},
	/**
	 * @param {int} [selId] the id of the row to select
	 * @param {boolean} [silent] if true, then no event will be fired
	 *
	 * @fires beforeMakingRowEditable
	 * @fires afterMakingRowEditable
	 * @fires onValueStateError
	 * 
	 * @desc Fires the beforeMakingRowEditable event, 
	 * <br>then checks if there is a previously selected row (which we are now leaving) that has
	 * error value states on its controls and fires the onValueStateError event if this is the case,
	 * <br>if no errors have been found then this function runs over all rows
	 * and attempts to set the controls' editable flag to false (any row) or true (selected row).
	 * <br>On the selected row it will also apply previously saved valueStates so as to highlight
	 * the controls which caused an error (this makes sure that we see highlighted error states after a
	 * rerender).
	 * <br>If controls cannot be made editable, then as a fallback it does the same for the enabled flag.
	 * <br>At the end the current row is memorized as currentEditableRow and the memorized valueStates are
	 * reset to empty.
	 *
	 * @function
	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	editRow : function(selId,silent) {
		//console.log("editRow "+selId+ " (previousRow "+this._currentEditableRowIndex+")");
		var reselectingSameRow = this._currentEditableRowIndex==selId; 
		if (silent!=true) this.fireBeforeMakingRowEditable({rowIndex:selId});
		var rows = this.getRows();
		//test if previous row has errors in valueState if the previous row is different from the current
		if (reselectingSameRow==false) {
			if ((this._currentEditableRowIndex===null)==false){
				//console.log("check if previous had errors");
				var controls = rows[this._currentEditableRowIndex].getCells();
				var hasError=false;
				for (var c=0; c<controls.length; c++) {
					if (controls[c].getValueState) {
						this._currentValueStates[c]=controls[c].getValueState();
						if (controls[c].getValueState()==sap.ui.core.ValueState.Error) {
							//this.fireOnValueStateError({rowIndex:this._currentEditableRowIndex,cellIndex:c});
							hasError=true;
						}
					}
				}
				//stops execution and does not make a new row editable by consequence
				if (hasError==true) {
					//console.log("errors exist->stop");
					//console.log(this._currentValueStates);
					if (silent!=true) this.fireOnValueStateError({rowIndex:this._currentEditableRowIndex});
					return;
				}
			}
		} 
		for (var r=0; r<rows.length; r++){
			var selRow = rows[r];
			var editable = (selRow.getIndex()==selId);
			var cells = selRow.getCells();
			for (var i=0; i<cells.length; i++) {
				if (editable==true && this._currentValueStates[i]) {
					cells[i].setValueState(this._currentValueStates[i]);
				}
				try {
					cells[i].setEditable(editable);
				} catch (e) {
					//For Selects:
					try {
						cells[i].setEnabled(editable);
					} catch (e) {}
				}
			}
		}
		if (silent!=true) this.fireAfterMakingRowEditable({rowIndex:selId,previousRowIndex:this._currentEditableRowIndex});
		this._currentEditableRowIndex=selId;
		this._currentValueStates={};
	},
	/**
	 * @desc Runs over all columns and rows in order to highlight column headers and cells by
	 * attaching the touconTableEditableColumn/Cell CSS classes if these columns are flagged
	 * as editable.
	 * <br>
	 * Also attaches the touconTableSelectToOpen/Edit classes according to the current action/edit mode
	 * and attaches the editOnSelect function or the actionOnSelect function to the row selection event.
	 * <br>
	 * Also makes the currently remembered editable row editable again by calling the editRow function in silent mode
	 * (no events will be fired for this editRow call)
	 * 
	 * @function
	 * @implements CSS: .touconTableEditableColumn, .touconTableEditableCell, .touconTableSelectToOpen, .touconTableSelectToEdit

	 * @since 1.0
	 * @protected
     * @memberOf toucon-Table
	 */
	onAfterRendering: function () {
		//console.log("table-onafterrendering");
		if (sap.ui.table.Table.prototype.onAfterRendering) {             
			sap.ui.table.Table.prototype.onAfterRendering.apply(this, arguments);
		}
		var cols = this.getColumns();
		var rows = this.getRows();
		//Highlighting the column headers of columns that are flagged as editable
		var colIndex = 0;
		for (var i=0; i<cols.length; i++) {
			var col = cols[i];
			if ((col.getEditable===undefined)==false && col.getEditable()==true && document.getElementById(col.getId()) && document.getElementById(col.getId()).className.indexOf("touconTableEditableColumn")<0) {
				document.getElementById(col.getId()).className = document.getElementById(col.getId()).className +" touconTableEditableColumn";
				for (var r=0; r<rows.length; r++) {
					var cellId = this.getId()+"-rows-row"+r+"-col"+colIndex;
					if (document.getElementById(cellId) && document.getElementById(cellId).className.indexOf("touconTableEditableCell")<0) {
						document.getElementById(cellId).className = document.getElementById(cellId).className +" touconTableEditableCell";
					}
				}
			}
			//the colIndex in the cell Ids does not follow the columns if columns are invisible
			if (col.getVisible()==true) {colIndex++;}
		}
		//If the table switches to edit mode then we
		//detach the eventual open/select action and attach
		//the edit handler which enables us to interact with individual rows
		if (this.getEditMode()==true) {
			this.removeStyleClass("touconTableSelectToOpen");
			this.addStyleClass("touconTableSelectToEdit");
			if (this.getProperty("actionOnSelect")!=null) {
				this.detachRowSelectionChange(this.getProperty("actionOnSelect"));
				this.detachCellClick(this.getProperty("actionOnSelect"));
			}
			//we detach before we attach in order to avoid multiple attaches
			this.detachRowSelectionChange(this.editOnSelect);
			this.detachCellClick(this.editOnSelect);
			this.attachRowSelectionChange(this.editOnSelect);
			this.attachCellClick(this.editOnSelect);
			
			//if there is a current editable row, make sure it remains editable
			if ((this._currentEditableRowIndex===null)==false){
				//console.log("table-onafterrendering-silent-editrow");
				this.editRow(this._currentEditableRowIndex,true);//true->silent, no events
			}
		}
		//If we leave the edit mode, then we detach the edit select
		//action and reattach the eventual "default" open/select action
		else {
			this.removeStyleClass("touconTableSelectToEdit");
			this.detachRowSelectionChange(this.editOnSelect);
			this.detachCellClick(this.editOnSelect);
			if (this.getActionMode()==true) {
				this.addStyleClass("touconTableSelectToOpen");
				if (this.getProperty("actionOnSelect")!=null) {
					//we detach before we attach in order to avoid multiple attaches
					//and we never attach the selection change for actiosn on the cells as
					//the action may require specific customData which the cells will not
					//provide
					//moreover the cellclick will interfere with the links in the columns
					this.detachRowSelectionChange(this.getProperty("actionOnSelect"));
					this.attachRowSelectionChange(this.getProperty("actionOnSelect"));
				}
			}
		}
	},
	/**
	 * @desc Retrieves the data rows from the model and sets the visibleRowCount
	 * of this table to the length of the retrieved array.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Table
	 */
	fitToRows: function () {
		var dataRows = this.getModel().getProperty(this.getBinding().sPath);
		if (dataRows && dataRows.length>0) this.setVisibleRowCount(dataRows.length);		
	},
	/**
	 * @desc Returns the index of the row which is currently editable.
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Table
	 */
	getCurrentEditableRowIndex: function () {
		return this._currentEditableRowIndex;		
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Calls the sap.ui.table.TableRenderer
	 *
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Table
	 */
	renderer: function(oRm, oControl) {
		//console.log("table-render");
		sap.ui.table.TableRenderer.render(oRm, oControl);
	}
});