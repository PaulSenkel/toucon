How to use the Toucon controls?
===============================

Download and import them into your project, so that Javascript files
are available in your WebContent folder, e.g. in /util/toucon

Register the module path to the controls in your index.html, 
e.g. jQuery.sap.registerModulePath("toucon", "util/toucon");

Then import the controls that you need in your views, 
e.g.:
jQuery.sap.require("toucon.Page");
jQuery.sap.require("toucon.Box");

Then use them like any other standard controls:
var page = new toucon.Page({title:"MyTitle"});

A very important part of these controls are the CSS styles.
Do also import the styles files (styles.less, toucon.less, default.less and their css equivalents)
as well as the toucon-extlibs folder into your WebContent folder, e.g. into /res

Check out www.toucon.fr for examples.