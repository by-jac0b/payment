const {UserModel} = require("Shared/Models/Users.model");
const DepositModel = require("Shared/Models/Deposits.model");
const WithdrawWaletsModel = require("Shared/Models/Withdraw_Wallets.model");
const WithdrawModel = require("Shared/Models/Withdraws.model");
const Action = require("Shared/Models/Actions.model/create");
const {MATH} = require("Shared/Helpers/f");
const {  PUBLISHER } = require("Shared/Helpers/redis-server");
const {TEMP} = require("../System/temp")
const {EMAIL} = require("Shared/Controllers/email/template");
const f =require("Shared/Helpers/f");
class UserProcess {
    constructor(userId) {
        this.userId = userId;
    }

    async usdt_deposited(message) {
        const wallet = message.to;
        const user = await UserModel.findOne({'wallets.usdt': wallet});
        if (user) {
            const balanceAmount = parseFloat((message.amount * 1).toFixed(2));
            user.finance.balance = MATH.add(user.finance.balance, balanceAmount);
            user.stats.total.deposit = MATH.add(balanceAmount, user.stats.total.deposit);
            user.dates.lastDepositDate = new Date();
            await user.save();
            Action.save(user, "usdt_deposit", {'level': 3,"params":{"amount":message.amount,"currency":"USDT","txid":message.txid}});
            await PUBLISHER.pub('_USERINFO',JSON.stringify( {'_id':user._id.toString()}));
            const telegram_message = {
                "userId": user._id.toString(),
                "player": user.personal.nickname,
                "partner": user.personal.referer,
                "balance": balanceAmount,
                "currency": user.finance.currency,
                "amount": message.amount,
                "lastPrice": 1,
                "wallet": message.to,
                "trx": message.txid
            }
            PUBLISHER.pub("message_usdt_deposit", JSON.stringify(telegram_message));

            await DepositModel.create({
                userId: user._id,
                nickname: user.personal.nickname,
                referer: user.personal.referer,
                wallet: message.to,
                amount: message.amount,
                balance: message.amount,
                currency: "USDT",
                trxid: message.txid,
            });
            console.log(message)
            EMAIL.send('deposit',User.personal.email,{name : User.personal.name,amount : message.amount.toFixed(2) ,"txid":message.txid,from : message.from  })

        } else return {"success": false, message: "not_user_exist"}

    }
    async withdraw_response(message){
        message.amount = Number(message.amount);
        const User = await UserModel.findOne({'_id':message.userId});
        User.stats.total.withdraw = MATH.add(User.stats.total.withdraw,message.amount);
        const Withdraw = await WithdrawModel.findOne({'_id':message.id});
        const WWs = await WithdrawWaletsModel.findOne({'userId':Withdraw.userId,'address':message.address});
        if(Withdraw){
            Withdraw.status = 1;
            Withdraw.info = message.txid;
            await Withdraw.save()
        }
        if(WWs){
            WWs.total = MATH.add(WWs.total,message.amount)
        }
        delete TEMP.que[message.id];
        const country = f.country(Withdraw.ip)
        EMAIL.send('withdraw',User.personal.email,{"address":Withdraw.address,ip:Withdraw.ip,country,name : User.personal.name,label :WWs.label,amount : message.amount.toFixed(2)  })

        return true;
    }
}

module.exports = UserProcess