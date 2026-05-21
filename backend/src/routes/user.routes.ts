import { Router } from 'express';
import { getUser } from '../controllers/user.controller';

const router = Router();

router.get('/:username', getUser);

export default router;
