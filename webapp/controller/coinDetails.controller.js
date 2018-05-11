sap.ui.define([
	"nathan/hand/coins/controller/baseController",
	"nathan/hand/coins/util/coinapi",
    "sap/ui/model/json/JSONModel"
], function(baseController, coinapi, JSONModel) {
	"use strict";

	return baseController.extend("nathan.hand.coins.controller.coinDetails", {

		onInit: function() {
			this.getRouter().getRoute("coinDetails").attachMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function(oEvent) {
            let coinId = oEvent.getParameter("arguments").coinId;
            this.setDetailedCoinModel({id: coinId});
            const additionalCurrencies = ["GBP", "EUR"];
            let promiseArray = [];
            additionalCurrencies.forEach(key => {
                let promise = coinapi.getSingleCoinPrices(coinId, key)
                    .then(coin => this.addAdditionalCoinModelData(coin));
                promiseArray.push(promise);
            });
            Promise.all(promiseArray).then(data => {
                let coinData = this.getView().getModel("coin").getData();
                this.buildGraphDataModel(coinData);
            });
        },

        buildGraphDataModel: function(coinModelData){
            const quotes = coinModelData.quotes;
            var data = {
                labels: ["Current Value", "+1 week", "+2 weeks", "+3 weeks", "+4 week"],
                datasets: []
            };
            Object.keys(quotes).forEach(key => {
                let newData = {
                    label: key,
                    fill: false,
                    borderColor: this.returnColourBasedOnKey(key),
                    backgroundColor: this.returnColourBasedOnKey(key),
                    data: [
                        quotes[key].price,
                        this.returnProjection(quotes[key], 0),
                        this.returnProjection(quotes[key], 1),
                        this.returnProjection(quotes[key], 2),
                        this.returnProjection(quotes[key], 3)
                    ]
                };
                data.datasets.push(newData);
            });
            var projectionModel = new JSONModel(data);
            this.getView().setModel(projectionModel, "projections");
        },

        returnProjection: function(quote, week) {
            const currentPrice = quote.price;
            let weeklyPercent = quote.percent_change_7d;
            let add = true;
            if(weeklyPercent.toString().indexOf("-") != -1){
                add = false;
            }
            var amount = currentPrice * Math.abs(weeklyPercent) / 100;
            if(add === true) {
                var projectionPrice = currentPrice + amount;
            }
            else{
                var projectionPrice = currentPrice - amount;
            }
            for(var i = 0; i <= week; i++) {
                amount = projectionPrice * Math.abs(weeklyPercent) / 100;
                if(add === true) {
                    projectionPrice = projectionPrice + amount;
                }
                else{
                    projectionPrice = projectionPrice - amount;
                }
            }
            return projectionPrice;
        },

        returnColourBasedOnKey: function(key){
            if(key === "USD") {
                return "#FF0000";
            }
            else if (key === "GBP") {
                return "#00FF00";
            }
            else{
                return "#0000FF";
            }
        },

        setDetailedCoinModel: function(coin){
            var coinJson = new JSONModel(coin);
            this.getView().setModel(coinJson, "coin");
        },

        addAdditionalCoinModelData: function(coin){
            return new Promise((resolve, reject) => {
                this.getView().getModel("coin").setData(coin, true);
                resolve(this.getView().getModel("coin").getData());
            });
        }
	});
});