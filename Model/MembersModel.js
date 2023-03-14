const mongoose=require("mongoose");
const schema=new mongoose.Schema({
    _id:Number,
    fullName:{type:String,required:true},
    email:{
        type:String,
        required:true,
        match:/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/
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
    }
})

mongoose.model("members",schema);