sap.ui.define([
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/controller/BaseController"
	], function (BaseController) {
		"use strict";

		return BaseController.extend("zsapui5proj99.ZSPUI5_Proj99_EMPCrud.controller.NotFound", {

			/**
			 * Navigates to the worklist when the link is pressed
			 * @public
			 */
			onLinkPressed : function () {
				this.getRouter().navTo("worklist");
			}

		});

	}
);