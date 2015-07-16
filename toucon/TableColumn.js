/**
 * @param {boolean} [editable] specifies if this column contains controls which can be made editable
 *
 * @desc The TableColumn control enables us just to flag a column as editable so that we can
 * retrieve this flag and attach appropriate highlighting CSS classes in the toucon.Table
 * 
 * @extends sap.ui.table.Column
 * @returns sap.ui.table.Column
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
 * @alias toucon-TableColumn
 */
var touconTableColumn = sap.ui.table.Column.extend("toucon.TableColumn", {  
	metadata: {  
		properties: {  
			"editable" : { type: "boolean", defaultValue: false }
		}
	}
});