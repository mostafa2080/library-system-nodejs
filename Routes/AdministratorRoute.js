const express = require("express");
const AdministratorController = require("../Controllers/administratorController");
const validateMW = require("../Core/ValidationMW/validateMW");
const validateAdministrator = require("../Core/ValidationMW/AdministratorValidation");
const { uploadImg, setImage } = require("../Utilities/ImageUtility");
const {
  basicAdmin,
  adminOrAbove,
} = require("../Core/AuthenticationMw/Authorization");
const router = express.Router();

// Router
router
  .route("/administrators")
  .get(basicAdmin, AdministratorController.getAllAdministrators)
  .post(
    basicAdmin,
    uploadImg("Administrator").single("image"),
    setImage,
    validateAdministrator.addValidationArray,
    validateMW,
    AdministratorController.addAdministrator
  )
  .patch(
    basicAdmin,
    uploadImg("Administrator").single("image"),
    setImage,
    validateAdministrator.updateValidationArray,
    validateMW,
    AdministratorController.updateAdministrator
  );

router
  .route("/administrators/:email")
  .get(
    adminOrAbove,
    validateAdministrator.getValidationArray,
    validateMW,
    AdministratorController.getAdministrator
  )
  .delete(
    basicAdmin,
    validateAdministrator.deleteValidationArray,
    validateMW,
    AdministratorController.deleteAdministrator
  );

module.exports = router;
