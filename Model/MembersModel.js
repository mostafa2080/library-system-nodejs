const mongoose=require("mongoose");
var Schema = mongoose.Schema,
ObjectId = Schema.ObjectId;

const schema=new mongoose.Schema({
    //_id:ObjectId,
    fullName:{type:String,required:true,minLength:8},
    email:{
        type:String,
        required:true,
        match:/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/,
        unique:true
    },
    password:{type:String,required:true,minLength:8},
    phoneNumber:{type:Number,minLength:11},
    image:String,
    birthDate:Date,
    createdAt:{
        type:Date,
        default:Date.now
    },
    fullAddress:{
        city:{type:String},
        street:{type:String},
        building:{type:String}
    },
    settings: {
        type: String,
        default: "default"
    },
    isBanned:{
        type:Boolean,
        required:true,
        default: false
    }
})

mongoose.model("members",schema);