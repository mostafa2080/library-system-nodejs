const express = require('express');
const AdminstratorController = require('./../Controllers/adminstratorController');
const validateMW = require('./../Core/ValidationMW/validateMW');
const validateAdminstrator = require('./../Core/ValidationMW/adminstratorValidation');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const uploadImg = multer({
  fileFilter: (req, file, callBack) => {
    if (
      file.mimetype == 'image/png' ||
      file.mimetype == 'image/jpg' ||
      file.mimetype == 'image/jpeg'
    ) {
      callBack(null, true);
    } else {
      callBack(new Error('Add a valid Image'));
    }
  },
  storage: multer.diskStorage({
    destination: (req, file, callBack) => {
      callBack(null, path.join(__dirname, '..', 'images', 'Adminstrator'));
    },
    filename: (req, file, callBack) => {
      let extension = path.extname(file.originalname);
      let fileName = path.basename(file.originalname, extension);
      let unqImgName =
        file.fieldname + '-' + fileName + '-' + Date.now() + extension;
      callBack(null, unqImgName);
    },
  }),
});

const setImage = (req, res, next) => {
  if (req.file && req.file.path) req.body.image = req.file.path;
  next();
};
// Router
router
  .route('/adminstrators')
  .get(AdminstratorController.getAllAdminstrators)
  .post(
    uploadImg.single('image'),
    setImage,
    validateAdminstrator.validateAdminstratorArray,
    validateMW,
    AdminstratorController.addAdminstrator
  )
  .patch(
    uploadImg.single('image'),
    setImage,
    validateAdminstrator.optValidateAdminstratorArray,
    validateMW,
    AdminstratorController.updateAdminstrator
  )
  .delete(
    validateAdminstrator.optValidateAdminstratorArray,
    validateMW,
    AdminstratorController.deleteAdminstrator
  );

module.exports = router;
