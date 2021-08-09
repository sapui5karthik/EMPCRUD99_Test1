/*global location history */
sap.ui.define([
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/controller/BaseController",
	"sap/ui/model/json/JSONModel",
	"sap/ui/core/routing/History",
	"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/model/formatter",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator",
	"sap/ui/model/odata/ODataModel",
	"sap/m/MessageToast"
], function(BaseController, JSONModel, History, formatter, Filter, FilterOperator, ODataModel, MessageToast) {
	"use strict";

	return BaseController.extend("zsapui5proj99.ZSPUI5_Proj99_EMPCrud.controller.Worklist", {

		formatter: formatter,

		/* =========================================================== */
		/* lifecycle methods                                           */
		/* =========================================================== */
		onInit: function() {

			var empurl = "/sap/opu/odata/sap/ZBATCH95_ODATA_SRV/";
			var empcrudodatamodel = new ODataModel(empurl);
			var empjsonmodel = new JSONModel();
			sap.ui.core.BusyIndicator.show(0);

			empcrudodatamodel.read("/EMPSet", {
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					empjsonmodel.setSizeLimit(1000);
					empjsonmodel.setData(req.results);
					this.getView().byId("emptable").setModel(empjsonmodel, "emp");

				}.bind(this),
				error: function(msg) {
					sap.ui.core.BusyIndicator.hide();
					MessageToast.show("Failed:Retry:1000:" + msg);
				}
			});

		}, //end of onInit
		_toObjectview: function(oevent) {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
			this.oRouter.navTo("object", {
				from: "worklist",
				to: "object",
				EMPID: oevent.getSource().getBindingContext("emp").getProperty("EMPID")
			}, true);

		}, //end of _toObjectview
		_opencreaterecord: function() {

			if (!this.create1) {

				this.create1 = sap.ui.xmlfragment(this.getView().getId(), "zsapui5proj99.ZSPUI5_Proj99_EMPCrud.fragments.CreateRecord", this);
				this.getView().addDependent(this.create1);
			}
			this.create1.open();

		}, //end of _opencreaterecord
		_closecreaterecord: function() {
			this.create1.close();
		}, //end of _closecreaterecord
		_datedisplay: function(oevent) {
			var curdate = oevent.getSource().getValue();
			oevent.getSource().setValue(this.formatter.date2display(curdate));

		}, //end of _datedisplay

		_createnewrecord: function() {
			var oEntry = {
				EMPID: this.byId("EMPID").getValue(),
				EMPNAME: this.byId("EMPNAME").getValue(),
				EMPDES: this.byId("EMPDES").getValue(),
				EMPHIREDATE: this.formatter.date2ecc(this.byId("EMPHIREDATE").getValue()),
				EMPTERMINATED: this.byId("EMPTERMINATED").getSelectedKey()
			};

			var data = "/sap/opu/odata/sap/ZBATCH95_ODATA_SRV/";
			var odatamodel = new ODataModel(data);
			sap.ui.core.BusyIndicator.show(0);

			odatamodel.create("/EMPSet", oEntry, {
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					this.onInit();
					this.create1.close();
					MessageToast.show("Record Successfully Created");

				}.bind(this),
				error: function(msg) {
					MessageToast.show("Failed:RecordCreation:Try again" + msg);
					sap.ui.core.BusyIndicator.hide();
					this.create1.close();
				}
			});

		}, //end of _createnewrecord

		_openupdatefragment: function(oevent) {
			if (!this.update1) {
				this.update1 = sap.ui.xmlfragment(this.getView().getId(), "zsapui5proj99.ZSPUI5_Proj99_EMPCrud.fragments.UpdateRecord", this);
				this.getView().addDependent(this.update1);
			}
			this.update1.open();

			// read the rows data
			var bc = oevent.getSource().getBindingContext("emp");
			var EMPID = bc.getProperty("EMPID");
			var EMPNAME = bc.getProperty("EMPNAME");
			var EMPDES = bc.getProperty("EMPDES");
			var EMPHIREDATE = bc.getProperty("EMPHIREDATE");
			var EMPTERMINATED = bc.getProperty("EMPTERMINATED");

			this.byId("EMPID1").setValue(EMPID);
			this.byId("EMPNAME1").setValue(EMPNAME);
			this.byId("EMPDES1").setValue(EMPDES);
			this.byId("EMPHIREDATE1").setValue(this.formatter.date2display(EMPHIREDATE));
			this.byId("EMPTERMINATED1").setValue(EMPTERMINATED);

		}, //end of _openupdatefragment
		_closeupdaterecord: function() {
			this.update1.close();
		}, //end of _closeupdaterecord
		
		_updaterecord : function(){
				var oEntry = {
				EMPID: this.byId("EMPID1").getValue(),
				EMPNAME: this.byId("EMPNAME1").getValue(),
				EMPDES: this.byId("EMPDES1").getValue(),
				EMPHIREDATE: this.formatter.date2ecc(this.byId("EMPHIREDATE1").getValue()),
				EMPTERMINATED: this.byId("EMPTERMINATED1").getSelectedKey()
			};

			
			var data = "/sap/opu/odata/sap/ZBATCH95_ODATA_SRV/";
			var odatamodel = new ODataModel(data);
			sap.ui.core.BusyIndicator.show(0);

			var eset = "/EMPSet('"+oEntry.EMPID+"')";
			odatamodel.update(eset, oEntry, {
				success: function(req, resp) {
					sap.ui.core.BusyIndicator.hide();
					this.onInit();
					this.update1.close();
					MessageToast.show("Record Successfully Updated");

				}.bind(this),
				error: function(msg) {
					MessageToast.show("Failed:RecordUpdate:Try again" + msg);
					sap.ui.core.BusyIndicator.hide();
					this.update1.close();
				}
			});
			
		},//end of _updaterecord
		_deleterecord : function(oevent){
			var EMPID = oevent.getSource().getBindingContext("emp").getProperty("EMPID");
			
			var data = "/sap/opu/odata/sap/ZBATCH95_ODATA_SRV/";
			var odatamodel = new ODataModel(data);
			sap.ui.core.BusyIndicator.show(0);
			var eset = "/EMPSet('"+EMPID+"')";
			odatamodel.remove(eset,null,
			function(req,resp){ 
				sap.ui.core.BusyIndicator.hide();
				this.onInit();
			}.bind(this),
			function(msg){
				MessageToast.show("Failed to delete:Retry" + msg);
				
			}
			
			);
			
			
			
		},//end of _deleterecord

		/**
		 * Called when the worklist controller is instantiated.
		 * @public
		 */
		_onInit: function() {
			var oViewModel,
				iOriginalBusyDelay,
				oTable = this.byId("table");

			// Put down worklist table's original value for busy indicator delay,
			// so it can be restored later on. Busy handling on the table is
			// taken care of by the table itself.
			iOriginalBusyDelay = oTable.getBusyIndicatorDelay();
			// keeps the search state
			this._aTableSearchState = [];

			// Model used to manipulate control states
			oViewModel = new JSONModel({
				worklistTableTitle: this.getResourceBundle().getText("worklistTableTitle"),
				saveAsTileTitle: this.getResourceBundle().getText("saveAsTileTitle", this.getResourceBundle().getText("worklistViewTitle")),
				shareOnJamTitle: this.getResourceBundle().getText("worklistTitle"),
				shareSendEmailSubject: this.getResourceBundle().getText("shareSendEmailWorklistSubject"),
				shareSendEmailMessage: this.getResourceBundle().getText("shareSendEmailWorklistMessage", [location.href]),
				tableNoDataText: this.getResourceBundle().getText("tableNoDataText"),
				tableBusyDelay: 0
			});
			this.setModel(oViewModel, "worklistView");

			// Make sure, busy indication is showing immediately so there is no
			// break after the busy indication for loading the view's meta data is
			// ended (see promise 'oWhenMetadataIsLoaded' in AppController)
			oTable.attachEventOnce("updateFinished", function() {
				// Restore original busy indicator delay for worklist's table
				oViewModel.setProperty("/tableBusyDelay", iOriginalBusyDelay);
			});
			// Add the worklist page to the flp routing history
			this.addHistoryEntry({
				title: this.getResourceBundle().getText("worklistViewTitle"),
				icon: "sap-icon://table-view",
				intent: "#VMAXEmployeeCRUDOperations-display"
			}, true);
		},

		/* =========================================================== */
		/* event handlers                                              */
		/* =========================================================== */

		/**
		 * Triggered by the table's 'updateFinished' event: after new table
		 * data is available, this handler method updates the table counter.
		 * This should only happen if the update was successful, which is
		 * why this handler is attached to 'updateFinished' and not to the
		 * table's list binding's 'dataReceived' method.
		 * @param {sap.ui.base.Event} oEvent the update finished event
		 * @public
		 */
		onUpdateFinished: function(oEvent) {
			// update the worklist's object counter after the table update
			var sTitle,
				oTable = oEvent.getSource(),
				iTotalItems = oEvent.getParameter("total");
			// only update the counter if the length is final and
			// the table is not empty
			if (iTotalItems && oTable.getBinding("items").isLengthFinal()) {
				sTitle = this.getResourceBundle().getText("worklistTableTitleCount", [iTotalItems]);
			} else {
				sTitle = this.getResourceBundle().getText("worklistTableTitle");
			}
			this.getModel("worklistView").setProperty("/worklistTableTitle", sTitle);
		},

		/**
		 * Event handler when a table item gets pressed
		 * @param {sap.ui.base.Event} oEvent the table selectionChange event
		 * @public
		 */
		onPress: function(oEvent) {
			// The source is the list item that got pressed
			this._showObject(oEvent.getSource());
		},

		/**
		 * Event handler when the share in JAM button has been clicked
		 * @public
		 */
		onShareInJamPress: function() {
			var oViewModel = this.getModel("worklistView"),
				oShareDialog = sap.ui.getCore().createComponent({
					name: "sap.collaboration.components.fiori.sharing.dialog",
					settings: {
						object: {
							id: location.href,
							share: oViewModel.getProperty("/shareOnJamTitle")
						}
					}
				});
			oShareDialog.open();
		},

		onSearch: function(oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
			} else {
				var aTableSearchState = [];
				var sQuery = oEvent.getParameter("query");

				if (sQuery && sQuery.length > 0) {
					aTableSearchState = [new Filter("EMPHIREDATE", FilterOperator.Contains, sQuery)];
				}
				this._applySearch(aTableSearchState);
			}

		},

		/**
		 * Event handler for refresh event. Keeps filter, sort
		 * and group settings and refreshes the list binding.
		 * @public
		 */
		onRefresh: function() {
			var oTable = this.byId("table");
			oTable.getBinding("items").refresh();
		},

		/* =========================================================== */
		/* internal methods                                            */
		/* =========================================================== */

		/**
		 * Shows the selected item on the object page
		 * On phones a additional history entry is created
		 * @param {sap.m.ObjectListItem} oItem selected Item
		 * @private
		 */
		_showObject: function(oItem) {
			this.getRouter().navTo("object", {
				objectId: oItem.getBindingContext().getProperty("EMPID")
			});
		},

		/**
		 * Internal helper method to apply both filter and search state together on the list binding
		 * @param {sap.ui.model.Filter[]} aTableSearchState An array of filters for the search
		 * @private
		 */
		_applySearch: function(aTableSearchState) {
			var oTable = this.byId("table"),
				oViewModel = this.getModel("worklistView");
			oTable.getBinding("items").filter(aTableSearchState, "Application");
			// changes the noDataText of the list in case there are no filter results
			if (aTableSearchState.length !== 0) {
				oViewModel.setProperty("/tableNoDataText", this.getResourceBundle().getText("worklistNoDataWithSearchText"));
			}
		}

	});
});