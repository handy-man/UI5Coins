sap.ui.define([
	"nathan/hand/coins/controller/baseController",
	"nathan/hand/coins/util/coinapi",
    "sap/ui/model/json/JSONModel"
], function(baseController, coinapi, JSONModel) {
	"use strict";

	return baseController.extend("nathan.hand.coins.controller.mainView", {

		/**
		 * Called when a controller is instantiated and its View controls (if available) are already created.
		 * Can be used to modify the View before it is displayed, to bind event handlers and do other one-time initialization.
		 */
		onInit: function() {
            this.getRouter().getRoute("main").attachMatched(this._onRouteMatched, this);
		},

        _onRouteMatched: function(oEvent)
        {
            coinapi.getCurrentPrice().then(coins => this.setCoinModel(coins));
        },

        navToDetails: function (oEvent) {
            let object = oEvent.getSource().getBindingContext("coins").getObject();
            let coinId = object.id;
            this.getRouter().navTo("coinDetails", {
                "coinId" : coinId
            });
        },

        setCoinModel: function(coins)
        {
            var coinsJson = new JSONModel(coins);
            this.getView().setModel(coinsJson, "coins");
        }
	});
});