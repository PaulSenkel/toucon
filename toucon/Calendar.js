/**
 * @param {int} [startHour] the time with which you want to start (e.g. 6 for 6am)
 * @param {int} [numberOfHours] the number of hours you want to display (e.g. 12 if you want to go up to 18:00)
 * @param {int} [slicesPerHour] 1 for the full hour, 2 for half hours, 4 for quarter hours etc.
 * @param {int} [appointmentTopMargin] offset in px which the appointments should have from one another
 * @param {int} [heightPerMinute] height in px, if set to 1, then one hour will be 60px high
 * @param {array} [data] the data array
 *
 * @desc This control permits to display appointments for several days. 
 * <br>Conflicting appointments are supported and will be rendered in as 
 * many parallel columns as required.
 * <br><br>
 * The data array must conform to the following structure:
 * <br>An array which contains the days (columns): [day1,day2,...]
 * <br>Each day must be an object as follows: {title:"Title day#1",slices: [appointment1, appointment2, ...]}
 * <br>All appointments must come in a chronological order, sorted by their start time.
 * <br>Each appointment must be an object as follows (example for an appointment from 6:00 to 9:00): {fromhour:"6",fromminute:"0",tohour:"9",tominute:"0",title:"Title of the appointment",description:"Description of the appointment"}
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
 * @alias toucon-Calendar
 */
var touconCalendar = sap.ui.core.Control.extend("toucon.Calendar", {                         
    metadata : {                              
        properties : {
			"startHour" : { type: "int", defaultValue: 6 },//start display at 6am
			"numberOfHours" : { type: "int", defaultValue: 12 },//display 12h up to 6pm
			"slicesPerHour" : { type: "int", defaultValue: 4 },//display slices of 15 minutes
			"appointmentTopMargin" : { type: "int", defaultValue: 3 },//leaves 3px space between the appointments
			"heightPerMinute" : { type: "int", defaultValue: 2 },//pixels per minute
			"data" : { type: "object", defaultValue: null}//the data array
        }
    },
	 /**
	 * @desc Returns the Id of the main table.
	 * 
	 * @function
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Calendar
	 */
    getTableId : function () {
    	return this.getId()+"-table";
    },
	 /**
	 * @param {RenderManager} [oRm] 
	 * @param {Control} [oControl] this control
	 *
	 * @desc Renders a table inside a div. The table consists of two rows, one for the header, the other
	 * for the actual data.
	 * <br><br>
	 * The first data cell visualizes the time slots. They are generated based on the start hour, 
	 * the number of hours and the number of slices per hour which we want to display.
	 * <br>
	 * If we start at 6, go for 12 hours with 4 slices, then this will generate 6:00, 6:15, 6:30, 6:45, 7:00 etc.
	 * <br><br>
	 * The following data cells contain inner tables wo that we can have several columns for displaying
	 * parallel appointments.
	 * <br>
	 * Before we render the divs which represent the appointments we will first check in how far they are
	 * conflicting and then add more columns as required. At the same time we always check if the current
	 * appointment may fit into a previous column so as to create only new columns if really required
	 * (e.g. a further appointment may conflict with column #2, but not necessarily with column #1)
	 * 
	 * @function
	 * @implements CSS: touconCalendar, touconCalendarTable, touconCalendarTimeColumn, touconCalendarDayColumn
	 * @since 1.0
	 * @protected
	 * @static
     * @memberOf toucon-Calendar
	 */
    renderer : function(oRm, oControl) {
    	var days = oControl.getData();//daysWithTimeSlices;
    	var numHours = oControl.getNumberOfHours();
    	var startHour = oControl.getStartHour();
    	var slicesPerHour = oControl.getSlicesPerHour();
    	var topMargin = oControl.getAppointmentTopMargin();
    	var heightPerMinute = oControl.getHeightPerMinute();

    	oRm.write("<div"); 
    	oRm.writeControlData(oControl);
    	oRm.addClass("touconCalendar");
    	oRm.writeClasses();
    	oRm.write(">");
    	if ((days===undefined)==false && (days===null)==false && (days.length===undefined)==false) {
    		
    		oRm.write("<table id='"+oControl.getTableId()+"' class=touconCalendarTable><tr>");
    		//write headers
    		oRm.write("<th>Uhrzeit</th>");
    		for (var d=0; d<days.length;d++) {
    			oRm.write("<th>"+days[d].title+"</th>");
    		}
    		oRm.write("</tr><tr>"); 
    		//write time column
    		oRm.write("<td><table class=touconCalendarTimeColumn><tr><td>");
    		for (var h=startHour;h<(startHour+numHours);h++) {
    			for (var s=0; s<slicesPerHour; s++){
    				hr = h; if (hr<10) hr="0"+hr;
    				mn = (s*60/slicesPerHour); if (mn<10) mn="0"+mn;
    				var height = 60/slicesPerHour*heightPerMinute-topMargin;
    				oRm.write("<div style='margin-top:"+topMargin+"px;height:"+height+"px'><div>"+hr+":"+mn+"</div></div>");
    			}
    		}
    		oRm.write("</td></tr></table></td>");
    		//write daily appointments
    		for (var d=0; d<days.length;d++) {
    			oRm.write("<td><table><td><table class=touconCalendarDayColumn><tr><td>");
    			var times = days[d].slices;
    			//split slices into several columns if required
    			var columns = [];
    			var column = {lasttohour:startHour,lasttominute:0,incolumns:false,slices:[]};
    			for (var t=0; t<times.length;t++) {
    				var ts = times[t];
    				var fh = parseInt(ts.fromhour);
    				var fm = parseInt(ts.fromminute);
    				var th = parseInt(ts.tohour);
    				var tm = parseInt(ts.tominute);
    				//If this slice starts before the previous one ended, start a new column
    				if (fh<column.lasttohour || (fh==column.lasttohour && fm<column.lasttominute)) {
    					//pushing current column to array if not already done
    					if (column.incolumns==false) {
    						column.incolumns=true;
    						columns.push(JSON.parse(JSON.stringify(column)));
    					}
    					//creating a new column by default
    					column = {lasttohour:startHour,lasttominute:0,incolumns:false,slices:[]};
    					//try to find a suitable column and use this one instea
    					for (var c=0; c<columns.length; c++) {
    						if (columns[c].lasttohour<fh || (columns[c].lasttohour==fh && columns[c].lasttominute<=fm)) {
    							column = columns[c];
    							break;
    						}
    					}
    				}
    				column.slices.push(ts);
    				column.lasttohour=th;
    				column.lasttominute=tm;
    			}
    			//add the last one if required
    			if (column.incolumns==false) {
    				column.incolumns=true;
    				columns.push(column);
    			}

    			for (var c=0; c<columns.length; c++) {
    				var times = columns[c].slices;
    				var lasttohour = startHour;
    				var lasttominute = 0;
    				for (var t=0; t<times.length;t++) {
    					var ts = times[t];
    					var fh = parseInt(ts.fromhour);
    					var fm = parseInt(ts.fromminute);
    					var th = parseInt(ts.tohour);
    					var tm = parseInt(ts.tominute);
    					var height = ((th*60+tm)-(fh*60+fm))*heightPerMinute-topMargin;
    					var offset = ((fh*60+fm)-(lasttohour*60+lasttominute))*heightPerMinute+topMargin;
    					oRm.write("<div style='margin-top:"+offset+"px;height:"+height+"px'><div>"+ts.title+"<br>"+ts.description+"</div></div>");
    					lasttohour=th;
    					lasttominute=tm;
    				}
    				oRm.write("</td></tr></table></td>");
    				//Start a new column
    				if (c<columns.length-1) oRm.write("<td><table class=touconCalendarDayColumn><tr><td>");
    			}

    			oRm.write("</table></td>");
    		}
    		oRm.write("</tr></table>"); 
    	}
    	oRm.write("</div>");
    }
});