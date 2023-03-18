const express = require("express");
const { body, param } = require("express-validator");
const router = express.Router();
const { uploadImg, setImage } = require("./../Utilities/ImageUtility");

const validate = require("./../Core/ValidationMW/validateMW");
const memberValidator = require("./../Core/ValidationMW/MembersValidator");
const controller = require("./../Controllers/MembersController");
const Auth = require("./../Core/AuthenticationMw/Authorization");

router
  .route("/members")
  .get(Auth.memberOrAbove, controller.getAllMembers)
  .post(
    Auth.employeeOrAbove,
    uploadImg("Member").single("image"),
    setImage,
    memberValidator.memberPostValidator,
    validate,
    controller.addMember
  )
  .put(
    Auth.memberOrAbove,
    uploadImg("Member").single("image"),
    setImage,
    memberValidator.memberPutValidator,
    validate,
    controller.updateMember
  );

router.get("/members/report",Auth.employeeOrAbove,controller.getMembersReport);
router.get("/members/search/:keyword",Auth.memberOrAbove,validate,controller.searchMembers);

router.get("/members/month/:month",Auth.memberOrAbove,
    param("month").isString().withMessage("Moth must be String in Format of {'March','April',...etc}...!")
    ,validate,controller.membersByMonth);
router.get("/members/year/:year",Auth.memberOrAbove,
    param("year").isNumeric().withMessage("Year must be Number...!")
    ,validate,controller.membersByYear);

router.route("/members/:_id")
    .get(Auth.memberOrAbove,memberValidator.getOneMember,validate,controller.getMember)
    .delete(Auth.employeeOrAbove,memberValidator.memberDeleteValidator,validate,controller.deleteMember);



module.exports = router;
