jQuery.sap.require("sap.ui.unified.FileUploader");
jQuery.sap.require("sap.ui.commons.ProgressIndicator");
/**
 * @fires uploadFailed: if upload is considered complete, but if the server lacks to return "201" as status
 *
 * @desc This FileUploader uses the standard sap.ui.unified.FileUploader, but increases the clickable "drop zone"
 * which users can use to upload documents (drag and drop is only working in Chrome and Firefox, not in IE10).
 * <br>
 * This FileUploader provides also a progress bar which illustrates the progress of an individual file.
 * <br>
 * <b>Please note:</b> This uploader has been built for single file uploads and has not been
 * tested for multiple uploads. It has not been tested on mobile devices either.
 * @extends sap.ui.unified.FileUploader
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
 * @version 0.1
 *
 * @constructor
 * @public
 * @alias toucon-FileUploader
 * @todo i18n, multiple file support, testing on mobile devices, documentation of inline functions
 */
var touconFileUploader = sap.ui.unified.FileUploader.extend("toucon.FileUploader", {  
	metadata: {  
		properties: {
			_fileArray : { type: "string[]", defaultValue: []}
		},
		aggregations : {
			_fileUploader : {type: "sap.ui.unified.FileUploader", multiple: false, visibility: "hidden"},
			_fileListTable : {type: "sap.m.Table", multiple: false, visibility: "hidden"},
			_fileListModel : {type: "sap.ui.model.json.JSONModel", multiple: false, visibility: "hidden"},
			_progressIndicator : {type: "sap.ui.commons.ProgressIndicator", multiple: false, visibility: "hidden"}
		},
		events :{
			uploadFailed :  {enablePreventDefault : true},
		}
	},
	isInitialised:false,
	isRendered:false,
	/**
	 * @desc Releases private variables
	 *
	 * @function
	 * @since 0.1
	 * @protected
     * @memberOf toucon-FileUploader
	 */
	exit: function () {
		if (this.isInitialised) delete this.isInitialised;
		if (this.isRendered) delete this.isRendered;
	},
	/**
	 * @desc Initializes the data model for the results table, the results table, 
	 * the progress bar, attaches default functions for the following events 
	 * (change, uploadProgress, uploadFailed, uploadAborted, uploadComplete and applies CSS classes.
	 * <br><b>Please note:</b> I tried to implement the same in the standard init method
	 * but this did not work.
	 *
	 * @function
	 * @implements CSS: .touconFileUploaderTable, .touconFileUploaderProgressIndicator
	 * @since 0.1
	 * @protected
     * @memberOf toucon-FileUploader
	 */
	doInit : function () {
		//Initialising the model
		this.setAggregation("_fileListModel",new sap.ui.model.json.JSONModel({"fileList": []}));

		//Initialising the table
		var table = new sap.m.Table(this.getId()+"_table",{
			noDataText: "No uploads so far.",
			columns:[
			         new sap.m.Column({width:"40px", header: new sap.m.Label({text:"Zeit"})}),
			         new sap.m.Column({width:"80px", header: new sap.m.Label({text:"Name"})}),
			         new sap.m.Column({width:"30px", header: new sap.m.Label({text:"Status"})}),
			         ]}).addStyleClass("touconFileUploaderTable");
		
		table.bindAggregation("items","/fileList", new sap.m.ColumnListItem({  
			cells : [  
//			         new sap.m.DatePicker({//TimeInput
//			        	 editable: false,
//			        	 value: "{date}",
//			        	 displayFormat : "dd.MM.yyyy",
//			        	 valueFormat : "yyyy-MM-ddTHH:mm:ss.SSSZ"
//			         }),  
			         new sap.m.Text({text : "{date}"}),
			         new sap.m.Text({text : "{name}"}),
			         new toucon.StatusIndicator({value : "{status}",redLimit:99,asc:false,showValue:false,size:1.6}),  
			         ]  
		}));
		table.setModel(this.getAggregation("_fileListModel"));
		this.setAggregation("_fileListTable",table);
		
		//Initialising progress indicator
		var progress = new sap.ui.commons.ProgressIndicator({
			width: "100%", 
			percentValue: 0, 
			displayValue: "0%"
			}).addStyleClass("touconFileUploaderProgressIndicator");
		this.setAggregation("_progressIndicator",progress);
		
		//Attaching the function which will push new file names into the table's model
		this.attachChange((function (oEvent) {
			this.getAggregation("_progressIndicator").setPercentValue(0).setDisplayValue("0% - "+this.getValue());
			progress.setBarColor(sap.ui.core.BarColor.NEUTRAL);
//			console.log(oEvent);
//			console.log(this.getValue());

			//Here we constitued a list of files which we wanted to load
			//However, it turns out that we cannot go through this list and upload
			//files one by one throughthe uploader
			//we would have to use our own postCall for this
//			var fileNames = this.getValue().split(/"/);
//			//cleanup, consolidate and add to model
//			var model = this.getAggregation("_fileListModel");
//			var fileList = model.getProperty("/fileList");
//			var fileArray = this.getProperty("_fileArray");
//			fileNames.forEach(function (item, index) {
//				console.log(item);
//				if (item != "" && item != " " && fileArray.indexOf(item)==-1) {
//					fileArray.push(item);
//					var newEntry = {
//							name     : item,
//							status   : "pending"
//					};
//					fileList.push(newEntry);
//				}
//				console.log(fileArray);
//			});
//			this.setProperty("_fileArray",fileArray);
//			model.setProperty("/fileList",fileList);
//			console.log(this.getProperty("_fileArray"));
//			console.log(model.oData);
		}).bind(this));
		
		this.attachUploadProgress((function (oEvent) {
			var nLoaded, nTotal, percent, display;
			if (oEvent.getParameter("lengthComputable")) {
				nLoaded = oEvent.getParameter("loaded");
				nTotal = oEvent.getParameter("total");
				percent = Math.round((nLoaded / nTotal * 100));
				display = percent+"% - "+this.getValue()+" is being uploaded...";
				this.getAggregation("_progressIndicator").setPercentValue(percent).setDisplayValue(display);

				console.log("Upload Progress in Bytes: " +
						nLoaded + " of " + nTotal + " loaded (" +
						(nLoaded / nTotal * 100) + "%)"
				);
			}}).bind(this));
		
		this.attachUploadFailed((function (oEvent) {
			this._logUploadAttempt(oEvent,"failed");
		}).bind(this));
		
		this.attachUploadAborted((function (oEvent) {
			this._logUploadAttempt(oEvent,"aborted");
		}).bind(this));

		this.attachUploadComplete((function (oEvent) {
			console.log("completed(" + oEvent.getParameter("status") + "): " + oEvent.getParameter("response"));
			var status = oEvent.getParameter("status");
			if (status===undefined || status===null ||
					((status===undefined)==false && status!="201"))
			{
				this.fireUploadFailed();
			} 
			else {
				this._logUploadAttempt(oEvent,"success");
			}				
		}).bind(this));
		
		this.isInitialised=true;
	},
	/**
	 * @param {event} [oEvent] UI5 Event
	 * @param {string} [status] success, aborted or failed
	 * 
	 * @desc Writes an entry for the upload attempt into the data model.
	 *
	 * @function
	 * @since 0.1
	 * @private
     * @memberOf toucon-FileUploader
	 */
	_logUploadAttempt: function (oEvent,status) {
		console.log("Upload "+status);
		
		//Preparing the message for the progress bar
		var message = "has been uploaded.";
		if (status == "aborted") message = "- upload has been aborted.";
		else if (status == "failed") message = "failed to upload.";
		
		//Updating the progress indicator with a fitting message and status color
		var progress = this.getAggregation("_progressIndicator");
		var percent = progress.getPercentValue();
		if (status != "success" && percent>99) percent=0;//we set this to 0, in order to avoid false positives in the table
		progress.setDisplayValue(percent+"% - "+this.getValue()+" "+message);
		if (status=="success") {
			progress.setBarColor(sap.ui.core.BarColor.POSITIVE);
		} else {
			progress.setBarColor(sap.ui.core.BarColor.NEGATIVE);
		}

		//Attempting to get date information from the response header
		var dateStr="";
		var headers = oEvent.getParameter("headers");
		if ((headers===undefined)==false && (headers===null)==false
				&& (headers.Date===undefined)==false && (headers.Date===null)==false) {
			var dateGMT = headers.Date;
			var date;
			if (dateGMT) {
				date = Date.parse(dateGMT);
			}
			var min = date / 1000 / 60; // convert gmt date to minutes
		    var localNow = new Date().getTimezoneOffset(); // get the timezone offset in minutes
	        var localTime = min - localNow; // get the local time
		    var localDate = new Date(localTime * 1000 * 60);
		    dateStr = localDate.toISOString();// this will return as just the server date format i.e., yyyy-MM-dd'T'HH:mm:ss.SSS'Z'
		    
		    //get just the time(between T and the .milliseconds
		    dateStr = dateStr.substring(dateStr.indexOf("T")+1);
		    dateStr = dateStr.substring(0,dateStr.indexOf("."));
		}
	    
		//Adding information on this upload attempt to the table
		var model = this.getAggregation("_fileListModel");
		var fileList = model.getProperty("/fileList");
		var item = this.getValue();
				var newEntry = {
						date     : dateStr,
						name     : item,
						status   : percent+""
				};
				fileList.push(newEntry);
		model.setProperty("/fileList",fileList);
		console.log(model.oData);
	},
	/**
	 * @desc If this FileUploader has not yet been initialised, then it will 
	 * launch the doInit method.
	 *
	 * @function
	 * @since 0.1
	 * @protected
     * @memberOf toucon-FileUploader
	 */
	onBeforeRendering : function () {
		if (this.isInitialised==false) this.doInit();
	},
	/**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Writes the full HTML required for the FileUploader (copied from the sap.ui.unified.FileUploader)
	 * and enhances the design with additional HTML and CSS classes.
	 * <br>
	 * Renders also the progress bar and results table with their standard renderers.
	 *
	 * @function
	 * @implements CSS: .touconFileUploader, .touconFileUploaderBody, .touconFileUploaderForm, .touconFileUploaderDiv, .touconFileUploaderDropzoneText, .touconFileUploaderDropzoneSubText, .touconFileUploaderDropzone
	 * @since 0.1
	 * @protected
	 * @static
	 * @memberOf toucon-FileUploader
	 */
	renderer: 
		function(oRenderManager, oFileUploader) {
	     
        var rm = oRenderManager;
        var accessibility = sap.ui.getCore().getConfiguration().getAccessibility();

        rm.write('<div');
        rm.writeControlData(oFileUploader);
        rm.addClass("sapUiFup touconFileUploader");
        rm.writeClasses();
        rm.write('>');
  
        rm.write('<div');
        rm.addClass("touconFileUploaderBody");
        rm.writeClasses();
        rm.write('>');
  
        // form
        rm.write('<form style="display:inline-block" encType="multipart/form-data" method="post"');
        rm.writeAttribute('id', oFileUploader.getId() + '-fu_form');
        rm.writeAttributeEscaped('action', oFileUploader.getUploadUrl());
        rm.writeAttribute('target', oFileUploader.getId() + '-frame');
        rm.addClass("touconFileUploaderForm");
        rm.writeClasses();
        rm.write('>');
  
        // the SAPUI5 TextField and Button
        rm.write('<div class="sapUiFupInp touconFileUploaderDiv"');
        if (accessibility) {
             rm.writeAttribute("role", "textbox");
             rm.writeAttribute("aria-readonly", "true");
        }
        rm.write('>');
        rm.write('<span ');
        rm.addClass("touconFileUploaderDropzoneText");
        rm.writeClasses();
        rm.write('>');
        rm.writeEscaped("Click to upload");
        rm.write('<br><span');
        rm.addClass("touconFileUploaderDropzoneSubText");
        rm.writeClasses();
        rm.write('>');
        rm.writeEscaped("Chrome/Firefox: you can also drop documents here.");
        rm.write('</span></span>');
        
        if (!oFileUploader.getButtonOnly()) {
             rm.write('<div class="sapUiFupGroup" border="0" cellPadding="0" cellSpacing="0"><div><div>');
        } else {
             rm.write('<div class="sapUiFupGroup" border="0" cellPadding="0" cellSpacing="0"><div><div style="display:none">');
        }
        rm.renderControl(oFileUploader.oFilePath);
        rm.write('</div><div>');  //-> per style margin
        rm.renderControl(oFileUploader.oBrowse);
        rm.write('</div></div></div>');
  
        // hidden pure input type file (surrounded by a div which is responsible for giving the input the correct size)
        var sName = oFileUploader.getName() || oFileUploader.getId();
        rm.write('<div');
        rm.addClass("sapUiFupInputMask touconFileUploaderDropzone");
        rm.writeClasses();
        rm.write('>');
        rm.write('<input type="hidden" name="_charset_">');
        rm.write('<input type="hidden" id="' + oFileUploader.getId() + '-fu_data"');
        rm.writeAttributeEscaped('name', sName + '-data');
        rm.writeAttributeEscaped('value', oFileUploader.getAdditionalData() || "");
        rm.write('>');
        jQuery.each(oFileUploader.getParameters(), function(iIndex, oParam) {
             rm.write('<input type="hidden" ');
             rm.writeAttributeEscaped('name', oParam.getName() || "");
             rm.writeAttributeEscaped('value', oParam.getValue() || "");
             rm.write('>');
        });
        rm.write('</div>');
        rm.write('</div>');
        rm.write('</form>');
        rm.renderControl(oFileUploader.getAggregation("_progressIndicator"));
		rm.renderControl(oFileUploader.getAggregation("_fileListTable"));
        rm.write('</div>');
        rm.write('</div>');
  }
});