import express from 'express';
import { bookLoanCheck } from '../../controllers/v1/loan.controller';

const router = express.Router();

router.route('/').get(bookLoanCheck);

export default router;
