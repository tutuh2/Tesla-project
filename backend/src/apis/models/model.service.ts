import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Model } from './entities/model.entity';

@Injectable()
export class ModelService {
    constructor(
        @InjectRepository(Model)
        private readonly modelRepository: Repository<Model>,
    ) {}

    async findAll() {
        return await this.modelRepository.find({
            relations: ['color', 'isAuto', 'type'],
        });
    }

    async findAllDeleted() {
        return await this.modelRepository.find({
            withDeleted: true,
        });
    }

    async restoreDeleted({ modelId }) {
        console.log(modelId);
        const result = await this.modelRepository.restore(modelId);
        console.log(result);
        return result.affected ? true : false;
        // return await this.modelRepository.restore(modelId);
    }

    async findOne({ modelId }) {
        return await this.modelRepository.findOne({
            where: { id: modelId },
            relations: ['type'],
        });
    }

    async create({ createModelInput }) {
        const { typeId, ...model } = createModelInput;
        console.log(typeId);
        return await this.modelRepository.save({
            ...model,
            type: { id: typeId },
        });
    }

    async update({ modelId, updateModelInput }) {
        const product = await this.modelRepository.findOne({
            where: { id: modelId },
        });

        const newProduct = {
            ...product,
            ...updateModelInput,
        };

        return await this.modelRepository.save(newProduct);
    }

    async delete({ modelId }) {
        const result = await this.modelRepository.softDelete({
            id: modelId,
        });
        return result.affected ? true : false;
    }
}
