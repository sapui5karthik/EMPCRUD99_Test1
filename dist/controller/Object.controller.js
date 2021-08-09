/*global location*/
sap.ui.define([
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/controller/BaseController",
		"sap/ui/model/json/JSONModel",
		"sap/ui/core/routing/History",
		"zsapui5proj99/ZSPUI5_Proj99_EMPCrud/model/formatter",
		"sap/ui/model/Filter",
		"sap/ui/model/FilterOperator",
		"sap/ui/model/odata/ODataModel",
		"sap/m/MessageToast"
	], function (
		BaseController,
		JSONModel,
		History,
		formatter,Filter,FilterOperator,ODataModel,MessageToast
	) {
		"use strict";

		return BaseController.extend("zsapui5proj99.ZSPUI5_Proj99_EMPCrud.controller.Object", {

			formatter: formatter,

			/* =========================================================== */
			/* lifecycle methods                                           */
			/* =========================================================== */
			onInit : function(){
				this.oRouter = sap.ui.core.UIComponent.getRouterFor(this);
				this.oRouter.getRoute("object").attachPatternMatched(this._getempdata,this);
			},//end of onInit
			_getempdata : function(oevent){
				
				var empid = oevent.getParameter("arguments").EMPID;
				
				var empurl = "/sap/opu/odata/sap/ZBATCH95_ODATA_SRV/";
				var empcrudodatamodel = new ODataModel(empurl);
				var empjsonmodel = new JSONModel();
				sap.ui.core.BusyIndicator.show(0);
				
				this.filter1 = new Filter("EMPID",FilterOperator.EQ,empid);
				
				empcrudodatamodel.read("/EMPSet",{
					
					success : function(req,resp){ 
						sap.ui.core.BusyIndicator.hide();
						empjsonmodel.setSizeLimit(1000);
						empjsonmodel.setData(req.results);
						
						var xFilter = [];
						xFilter.push(this.filter1);
						var finalFilter = new Filter({
							filters : xFilter,
							and : true
						});
						this.getView().setModel(empjsonmodel,"emp");
						
					
						
						//this.getView().setModel(empjsonmodel);
						
					}.bind(this),
					error : function(msg){
						sap.ui.core.BusyIndicator.hide();
						MessageToast.show("Failed:Retry:1000:" + msg);
					}
				});
				
			},//end of _getempdata
			_toworklist : function(){
				this.oRouter.navTo("worklist",{},true);
			},//end of _toworklist

			/**
			 * Called when the worklist controller is instantiated.
			 * @public
			 */
			_onInit : function () {
				// Model used to manipulate control states. The chosen values make sure,
				// detail page is busy indication immediately so there is no break in
				// between the busy indication for loading the view's meta data
				var iOriginalBusyDelay,
					oViewModel = new JSONModel({
						busy : true,
						delay : 0
					});

				this.getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);

				// Store original busy indicator delay, so it can be restored later on
				iOriginalBusyDelay = this.getView().getBusyIndicatorDelay();
				this.setModel(oViewModel, "objectView");
				this.getOwnerComponent().getModel().metadataLoaded().then(function () {
						// Restore original busy indicator delay for the object view
						oViewModel.setProperty("/delay", iOriginalBusyDelay);
					}
				);
			},

			/* =========================================================== */
			/* event handlers                                              */
			/* =========================================================== */

			/**
			 * Event handler when the share in JAM button has been clicked
			 * @public
			 */
			onShareInJamPress : function () {
				var oViewModel = this.getModel("objectView"),
					oShareDialog = sap.ui.getCore().createComponent({
						name: "sap.collaboration.components.fiori.sharing.dialog",
						settings: {
							object:{
								id: location.href,
								share: oViewModel.getProperty("/shareOnJamTitle")
							}
						}
					});
				oShareDialog.open();
			},


			/* =========================================================== */
			/* internal methods                                            */
			/* =========================================================== */

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {sap.ui.base.Event} oEvent pattern match event in route 'object'
			 * @private
			 */
			_onObjectMatched : function (oEvent) {
				var sObjectId =  oEvent.getParameter("arguments").objectId;
				this.getModel().metadataLoaded().then( function() {
					var sObjectPath = this.getModel().createKey("EMPSet", {
						EMPID :  sObjectId
					});
					this._bindView("/" + sObjectPath);
				}.bind(this));
			},

			/**
			 * Binds the view to the object path.
			 * @function
			 * @param {string} sObjectPath path to the object to be bound
			 * @private
			 */
			_bindView : function (sObjectPath) {
				var oViewModel = this.getModel("objectView"),
					oDataModel = this.getModel();

				this.getView().bindElement({
					path: sObjectPath,
					events: {
						change: this._onBindingChange.bind(this),
						dataRequested: function () {
							oDataModel.metadataLoaded().then(function () {
								// Busy indicator on view should only be set if metadata is loaded,
								// otherwise there may be two busy indications next to each other on the
								// screen. This happens because route matched handler already calls '_bindView'
								// while metadata is loaded.
								oViewModel.setProperty("/busy", true);
							});
						},
						dataReceived: function () {
							oViewModel.setProperty("/busy", false);
						}
					}
				});
			},

			_onBindingChange : function () {
				var oView = this.getView(),
					oViewModel = this.getModel("objectView"),
					oElementBinding = oView.getElementBinding();

				// No data for the binding
				if (!oElementBinding.getBoundContext()) {
					this.getRouter().getTargets().display("objectNotFound");
					return;
				}

				var oResourceBundle = this.getResourceBundle(),
					oObject = oView.getBindingContext().getObject(),
					sObjectId = oObject.EMPID,
					sObjectName = oObject.EMPHIREDATE;

				oViewModel.setProperty("/busy", false);
				// Add the object page to the flp routing history
				this.addHistoryEntry({
					title: this.getResourceBundle().getText("objectTitle") + " - " + sObjectName,
					icon: "sap-icon://enter-more",
					intent: "#VMAXEmployeeCRUDOperations-display&/EMPSet/" + sObjectId
				});

				oViewModel.setProperty("/saveAsTileTitle", oResourceBundle.getText("saveAsTileTitle", [sObjectName]));
				oViewModel.setProperty("/shareOnJamTitle", sObjectName);
				oViewModel.setProperty("/shareSendEmailSubject",
				oResourceBundle.getText("shareSendEmailObjectSubject", [sObjectId]));
				oViewModel.setProperty("/shareSendEmailMessage",
				oResourceBundle.getText("shareSendEmailObjectMessage", [sObjectName, sObjectId, location.href]));
			}

		});

	}
);