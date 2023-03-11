const mongoose=require("mongoose");
require("./../Model/membersModel");
const Members=mongoose.model("members");

exports.getAllMembers=(request,response,next)=>{
    response.status(200).json({data:"get all members"});
}
/**************** Get All Members **************/

exports.addMember=(request,response,next)=>{
    response.status(200).json({data:"get all members"});
}
/**************** Add New Member **************/

exports.updateMember=(request,response,next)=>{
    response.status(200).json({data:"update member data"});
}
/**************** Update Exist Member **************/

exports.deleteMember=(request,response,next)=>{
    response.status(200).json({data:"delete a member"});
}
/**************** Delete Member **************/
