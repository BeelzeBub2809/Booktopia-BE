const express = require('express');
const {ComboController} = require('../../controllers');

const ComboRouter = express.Router();

ComboRouter.post('/create', ComboController.createCombo);

ComboRouter.get('/', ComboController.getCombo);

ComboRouter.get('/:id', ComboController.getComboById);

ComboRouter.put('/:id', ComboController.updateCombo);

module.exports = ComboRouter;