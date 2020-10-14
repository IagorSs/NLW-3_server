import { Router } from 'express';
import multer from 'multer';

import uploadConfig from './config/upload';
import OrphanagesController from './Controllers/OrphanagesController';

const routes = Router();
const upload = multer(uploadConfig);

routes
  .get("/orphanages", OrphanagesController.index)
  .get("/orphanages/:id", OrphanagesController.show)
  .post('/orphanages', upload.array('images'), OrphanagesController.create);

export default routes;