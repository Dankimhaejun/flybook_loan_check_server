import express from 'express';
import { get } from '../../../controllers/v1/users.controllers';

const router = express.Router();

router.route('/').get(get);

export default router;
