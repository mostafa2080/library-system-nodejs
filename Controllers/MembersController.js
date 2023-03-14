const mongoose=require("mongoose");
require("./../Model/membersModel");
const Members=mongoose.model("members");

exports.getAllMembers=(request,response,next)=>{
    Members.find({})
    .then((data)=>{
        response.status(200).json({data});
    })
    .catch((error)=>{
        next(error);
    })
}
/**************** Get All Members **************/

exports.addMember=async(request,response,next)=>{
    try{
        let data=await new Members({
            _id:request.body._id,
            fullName:request.body.fullName,
            email:request.body.email,
            password:request.body.password,
            phoneNumber:request.body.phoneNumber,
            birthDate:request.body.birthDate,
            fullAddress:request.body.address
        }).save();

        response.status(201).json({data});
    }catch(error){
        next(error);
    }
}
/**************** Add New Member **************/

exports.updateMember=(request,response,next)=>{
    response.status(200).json({data:"update member data"});
}
/**************** Update Exist Member **************/

exports.deleteMember=(request,response,next)=>{
    Members.findOne({_id:request.body._id})
    .then((data)=>{
        if(data == null){
            next(new Error("No Such Member Exists...!"));
        }else{
            return Members.deleteOne({_id:request.body._id});
        }
    })
    .then(()=>{
        response.status(200).json({data:"Deleted Successfully."});
    })
    .catch((error)=>{
        next(error);
    })
}
/**************** Delete Member **************/
