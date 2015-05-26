/* 
 * Copyright 2015 Paul Senkel
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * */
var touconTypeDefault = sap.ui.model.type.String.extend("toucon.type.Default", {
	formatValue: function(oValue){return oValue;},
	parseValue: function(oValue){return oValue;},
	validateValue: function(oValue){}
});
var touconTypeString = sap.ui.model.type.String.extend("toucon.type.String", {
	formatValue: function(oValue){
		if (debug==true) console.log("toucon.type.String.formatValue: "+oValue);
		return oValue;
	},
	parseValue: function(oValue){
		if (debug==true) console.log("toucon.type.String.parseValue: "+oValue);
		return oValue;
	},
	validateValue: function(oValue){
		var exceptionLevel = "error";//level? level : "error";
		var mandatory = "?";//false
		var minLength = "0";//any
		var maxLength = "";//any
		if ((this.oFormatOptions.mandatory===undefined)==false && this.oFormatOptions.mandatory==true) mandatory="";//true
		if ((this.oFormatOptions.minLength===undefined)==false && this.oFormatOptions.minLength==parseInt(this.oFormatOptions.minLength)) minLength=this.oFormatOptions.minLength;
		if ((this.oFormatOptions.maxLength===undefined)==false && this.oFormatOptions.maxLength==parseInt(this.oFormatOptions.minLength)) maxLength=this.oFormatOptions.maxLength;
		var typeRegex = new RegExp("^(.{"+minLength+","+maxLength+"})"+mandatory+"$");
		if (debug==true) console.log("toucon.type.String.validateValue: "+oValue+" with "+typeRegex + " and "+exceptionLevel);
		if (typeRegex.test(oValue)==false) {throw new sap.ui.model.ValidateException(exceptionLevel);} 
	}
});
var touconTypePostCodeGermany = sap.ui.model.type.String.extend("toucon.type.PostCodeGermany", {
	formatValue: function(oValue){
		if (debug==true) console.log("toucon.type.PostCodeGermany.formatValue: "+oValue);
		return oValue;
	},
	parseValue: function(oValue){
		if (debug==true) console.log("toucon.type.PostCodeGermany.parseValue: "+oValue);
		return oValue;
	},
	validateValue: function(oValue){
		var exceptionLevel = "error";//level? level : "error";
		var mandatory = "?";//false
		if ((this.oFormatOptions.mandatory===undefined)==false && this.oFormatOptions.mandatory==true) mandatory="";//true
		var typeRegex = new RegExp("^([0-9]{5})"+mandatory+"$");
		if (debug==true) console.log("toucon.type.PostCodeGermany.validateValue: "+oValue+" with "+typeRegex + " and "+exceptionLevel);
		if (typeRegex.test(oValue)==false) {throw new sap.ui.model.ValidateException(exceptionLevel);} 
	}
});
