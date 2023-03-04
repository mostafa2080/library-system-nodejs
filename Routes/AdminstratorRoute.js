const express = require('express');
const AdminstratorController = require('./../Controllers/adminstratorController');
const validateMW = require('./../Core/ValidationMW/validateMW');
const validateAdminstrator = require('./../Core/ValidationMW/adminstratorValidation');
const { uploadImg, setImage } = require("./../Utilities/ImageUtility");
const { basicAdmin, adminOrAbove } = require("./../Core/AuthenticationMw/Authorization")
const router = express.Router();


// Router
router
  .route('/adminstrators')
  .get(adminOrAbove,AdminstratorController.getAllAdminstrators)
  .post(
    basicAdmin,
    uploadImg('Adminstrator').single('image'),
    setImage,
    validateAdminstrator.validateAdminstratorArray,
    validateMW,
    AdminstratorController.addAdminstrator
  )
  .patch(
    basicAdmin,
    uploadImg('Adminstrator').single('image'),
    setImage,
    validateAdminstrator.optValidateAdminstratorArray,
    validateMW,
    AdminstratorController.updateAdminstrator
  )
  .delete(
    basicAdmin,
    validateAdminstrator.optValidateAdminstratorArray,
    validateMW,
    AdminstratorController.deleteAdminstrator
  );

module.exports = router;
