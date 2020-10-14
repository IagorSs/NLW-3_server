import { Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Orphanage from '../models/Orphanage';
import orphanagesView from '../views/orphanages_view';
import * as Yup from 'yup';

export default {
  async index(req:Request, res:Response) {
    const orphanagesRepositoy = getRepository(Orphanage);

    const orphanages = await orphanagesRepositoy.find({
      relations: ['images']
    });

    return res.status(200).json(orphanagesView.renderMany(orphanages));
  },

  async show(req:Request, res:Response) {
    try {
      const { id } = req.params;
  
      const orphanagesRepositoy = getRepository(Orphanage);
  
      const orphanage = await orphanagesRepositoy.findOneOrFail(id, {
        relations: ['images']
      });
  
      return res.status(200).json(orphanagesView.render(orphanage));
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  },

  async create(req:Request, res:Response) {
    const {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
    } = req.body;

    const orphanagesRepository = getRepository(Orphanage);

    const requestImages = req.files as Express.Multer.File[];
    
    const images = requestImages.map(image => {
      return { path: image.filename }
    })

    const data = {
      name,
      latitude,
      longitude,
      about,
      instructions,
      opening_hours,
      open_on_weekends,
      images
    };

    const schema = Yup.object().shape({
      name: Yup.string().required(),
      latitude: Yup.number().required(),
      longitude: Yup.number().required(),
      about: Yup.string().required().max(300),
      instructions: Yup.string().required(),
      opening_hours: Yup.string().required(),
      open_on_weekends: Yup.boolean().required(),
      images: Yup.array(
        Yup.object().shape({
          path: Yup.string().required()
        })
      )
    });

    await schema.validate(data, {
      abortEarly: false,
    })

    const orphanage = orphanagesRepository.create(data);

    await orphanagesRepository.save(orphanage);

    return res.status(201).json(orphanage);
  }
}