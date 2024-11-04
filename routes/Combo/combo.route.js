const express = require('express');
const {ComboController} = require('../../controllers');
const Extension = require('../../extensions/uploadImage');
const ComboRouter = express.Router();

ComboRouter.post('/',[Extension.upload.array('images', 5)], ComboController.createCombo);

ComboRouter.get('/', ComboController.getCombo);

ComboRouter.get('/:id', ComboController.getComboById);

ComboRouter.put('/:id', ComboController.updateCombo);

module.exports = ComboRouter;