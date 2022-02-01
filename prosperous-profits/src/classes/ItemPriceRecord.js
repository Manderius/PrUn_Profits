export class ItemPriceRecord {
    Ticker;
    Ask;
    Bid;
    SellingOrders;
    BuyingOrders;

    constructor(ticker, ask, bid, sellingOrders, buyingOrders) {
        this.Ticker = ticker;
        this.Ask = ask;
        this.Bid = bid;
        this.SellingOrders = sellingOrders;
        this.BuyingOrders = buyingOrders;

        this.BuyingOrders.forEach(order => {
            if (order.ItemCount === null) order.ItemCount = 999999;
        })
    }
}