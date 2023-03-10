const express = require("express");
const AdministratorController = require("../Controllers/administratorController");
const validateMW = require("../Core/ValidationMW/validateMW");
const validateAdministrator = require("../Core/ValidationMW/administratorValidation");
const { uploadImg, setImage } = require("../Utilities/ImageUtility");
const {
    basicAdmin,
    adminOrAbove,
} = require("../Core/AuthenticationMw/Authorization");
const router = express.Router();

// Router
router
    .route("/administrators")
    .get(adminOrAbove, AdministratorController.getAllAdministrators)
    .post(
        basicAdmin,
        uploadImg("Administrator").single("image"),
        setImage,
        validateAdministrator.validateAdministratorArray,
        validateMW,
        AdministratorController.addAdministrator
    )
    .patch(
        basicAdmin,
        uploadImg("Administrator").single("image"),
        setImage,
        validateAdministrator.optValidateAdministratorArray,
        validateMW,
        AdministratorController.updateAdministrator
    )
    .delete(
        basicAdmin,
        validateAdministrator.optValidateAdministratorArray,
        validateMW,
        AdministratorController.deleteAdministrator
    );

module.exports = router;
