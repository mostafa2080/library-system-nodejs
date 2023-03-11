const express=require("express");
const {body}=require("express-validator");
const router=express.Router();

const validate=require("./../Core/ValidationMW/validateMW");
const memberValidator=require("./../Core/ValidationMW/membersValidator");
const controller=require("./../Controllers/membersController");

router.route("/members")
    .get(controller.getAllMembers)
    .post(memberValidator.memberPostValidator,validate,controller.addMember)
    .put(memberValidator.memberPutValidator,validate,controller.updateMember)
    .delete(memberValidator.memberDeleteValidator,validate,controller.deleteMember);


module.exports=router;