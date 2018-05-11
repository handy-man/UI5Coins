sap.ui.define([], function () {
    "use strict";
    return {
        getCurrentPrice: function(currencyCode)
        {
            currencyCode = currencyCode ? currencyCode : "GBP"
            const url = `https://api.coinmarketcap.com/v2/ticker/?convert=${currencyCode}`;
            const req = new Request(url);
            return fetch(req).then(response => response.json()).then(json => json.data);
        },

        getSingleCoinPrices: function(coinId, currencyCode)
        {
            coinId = coinId ? coinId : "1";
            currencyCode = currencyCode ? currencyCode : "GBP";
            const url = `https://api.coinmarketcap.com/v2/ticker/${coinId}/?convert=${currencyCode}`;
            const req = new Request(url);
            return fetch(req).then(response => response.json()).then(json => json.data);
        }
    };

});