const {AssetsModel} = require("Shared/Models/Assets.model");
const { StakePlansModel } = require("Shared/Models/StakePlans.model")
class AssetManager {
    constructor() {
        this.list = false;
        this.stake_list = false;
    }
    async init(){
        const getFutureDate = param => new Date(Date.now() + parseInt(param) * 24 * 60 * 60 * 1000);
        /*
         AssetsModel.create({
            'name' : 'BTC/USDT',
            'asset1.name' : 'Bitcoin',
            'asset1.symbol' : 'BTC',
            'asset2.name' : 'Tether',
            'asset2.symbol' : 'USDT',
             '_is.active': true,
             '_is.sorted': 1,
            'now.lastPrice' : 53300.25,
            'now.sellPrice' : 53310.12,
            'now.buyPrice' : 53390.63,
            'now.lowPrice' : 51517.93,
            'now.highPrice' : 55607.53,
            'before.price24h' : 52007.11,
            'before.vol24h' : 8136892.62,
            'before.vol1Week' : 9823894231,

        })
        AssetsModel.create({
            'name' : 'ETH/USDT',
            'asset1.name' : 'Etherium',
            'asset1.symbol' : 'ETH',
            'asset2.name' : 'Tether',
            'asset2.symbol' : 'USDT',
            '_is.active': true,
            '_is.sorted': 2,
            'now.lastPrice' : 23300.25,
            'now.sellPrice' : 23310.12,
            'now.buyPrice' : 23390.63,
            'now.lowPrice' : 21517.93,
            'now.highPrice' : 25607.53,
            'before.price24h' : 22007.11,
            'before.vol24h' : 5136892.62,
            'before.vol1Week' : 3823894231,
        })
        AssetsModel.create({
            'name' : 'DOGE/USDT',
            'asset1.name' : 'Doge Coin',
            'asset1.symbol' : 'DOGE',
            'asset2.name' : 'Tether',
            'asset2.symbol' : 'USDT',
            '_is.active': true,
            '_is.sorted': 3,
            'now.lastPrice' : 300.25,
            'now.sellPrice' : 310.12,
            'now.buyPrice' : 390.63,
            'now.lowPrice' : 517.93,
            'now.highPrice' : 607.53,
            'before.price24h' : 107.11,
            'before.vol24h' : 36892.62,
            'before.vol1Week' : 23894231,

        })

             StakePlansModel.create({
                   coin : "SHIBA",
                   apy : 0.02,
                   openDays : 30,
                   "dates.expired" : getFutureDate("30d")
               })*/

        if(!this.list){
            this.list = {}
            const assetList = await AssetsModel.find({'_is.active':true}).sort({'_is.sort':1});
            if(assetList){
                assetList.forEach((dt) =>{
                    this.list[dt.name] = dt
                })
            }
        }
        if(!this.stake_list){
            this.stake_list =  await StakePlansModel.find({'dates.expired': {$gt : new Date()}});
        }
    }
}

const Assets = new AssetManager();
module.exports = {Assets}