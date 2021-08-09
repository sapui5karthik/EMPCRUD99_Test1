sap.ui.define([
	] , function () {
		"use strict";

		return {

			/**
			 * Rounds the number unit value to 2 digits
			 * @public
			 * @param {string} sValue the number string to be rounded
			 * @returns {string} sValue with 2 digits rounded
			 */
			numberUnit : function (sValue) {
				if (!sValue) {
					return "";
				}
				return parseFloat(sValue).toFixed(2);
			},
			date2display : function(d1){
				var d2 =  sap.ui.core.format.DateFormat.getDateInstance({
					pattern : "dd/MMM/YYYY"
				});
				return d2.format(new Date(d1));	
			},
			date2ecc : function(d1){
			//2021-08-06T00:00:00
				var d2 =  sap.ui.core.format.DateFormat.getDateInstance({
					pattern : "YYYY-MM-dd"
				});
				return d2.format(new Date(d1)) + "T00:00:00";	
				
			}

		};

	}
);








