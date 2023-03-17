const mongoose=require("mongoose");

const schema=new mongoose.Schema({
    year:{
        type:Number,
        required:true
    },
    month:{
        type:String,
        required:true
    },
    numberOfMembers:{
        type:Number,
        default:0
    },
    newMembers:{
        type:Number,
        default:0
    },
    deletedMembers:{
        type:Number,
        default:0
    }
});

mongoose.model("membersReport",schema);