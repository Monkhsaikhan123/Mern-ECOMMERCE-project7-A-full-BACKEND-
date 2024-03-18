const mongoose  = require('mongoose')

const {Schema} = mongoose;

//create schema
const paySchema = new Schema({
    transitionId: String,
    email:String,
    price:Number,
    quantity:Number,
    status:String,
    itemName:Array,
    cartItems:Array,
    menuItems:Array,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const Pay = mongoose.model('Pay',paySchema);

module.exports = Pay;