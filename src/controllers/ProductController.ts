import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import path from 'path';
import fs from 'fs';

import uploadConfig from '../config/upload';

import ProductRepository from "../repositories/ProductRepository";
import { classToClass } from "class-transformer";

class ProductController {
  async create(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);
    const { name, description } = request.body;

    const existsProduct = await productRepository.findOne({ name });

    if(existsProduct) {
      return response.status(400).json({ err: 'Product already exists'});
    }

    const product = productRepository.create({
      name,
      description
    });

    await productRepository.save(product);

    return response.json(product);
  }

  async index(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const products = await productRepository.find();

    return response.json(products);
  }

  async show(request: Request, response: Response) {
    const productRepository = getCustomRepository(ProductRepository);

    const { id } = request.params;

    const product = await productRepository.findOne(id);

    return response.json(product);
  }

  async update(request: Request, response: Response) {
    const { product_id } = request.params;
    const imageFileName = request.file.filename;

    const productRepository = getCustomRepository(ProductRepository);
    const product = await productRepository.findOne(product_id);

    if(!product) {
      return response.status(401).json({ error: 'Product does not exists' });
    }

    if(product.image) {
      const filePath = path.resolve(uploadConfig.uploadsFolder, product.image);

      try {
        await fs.promises.stat(filePath);
      } catch {
        return response.json({ error: 'File path error '});
      }

      await fs.promises.unlink(filePath);
    }

    await fs.promises.rename(
      path.resolve(uploadConfig.tmpFolder, imageFileName),
      path.resolve(uploadConfig.uploadsFolder, imageFileName)
    )

    product.image = imageFileName;

    await productRepository.save(product);

    return response.json(classToClass(product));
  }
}

export default new ProductController();
