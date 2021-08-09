/*global QUnit*/

jQuery.sap.require("sap.ui.qunit.qunit-css");
jQuery.sap.require("sap.ui.thirdparty.qunit");
jQuery.sap.require("sap.ui.qunit.qunit-junit");
QUnit.config.autostart = false;

sap.ui.require([
	"sap/ui/test/Opa5",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/Common",
	"sap/ui/test/opaQunit",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/Worklist",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/Object",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/NotFound",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/Browser",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/pages/App"
], function (Opa5, Common) {
	"use strict";
	Opa5.extendConfig({
		arrangements: new Common(),
		viewNamespace: "zsapui5proj99.ZSPUI5_Proj99_EMPCrud.view."
	});

	sap.ui.require([
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/WorklistJourney",
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/ObjectJourney",
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/NavigationJourney",
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/NotFoundJourney",
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/test/integration/FLPIntegrationJourney"
	], function () {
		QUnit.start();
	});
});