import { Args, Mutation, Resolver, Query } from '@nestjs/graphql';
import { CreateModelInput } from './dto/createModel.input';
import { UpdateModelInput } from './dto/updateModel.input';
import { Model } from './entities/model.entity';
import { ModelService } from './model.service';

@Resolver()
export class ModelResolver {
    constructor(
        private readonly modelService: ModelService, //
    ) {}

    @Query(() => [Model])
    fetchModels() {
        return this.modelService.findAll();
    }

    @Query(() => [Model])
    fetchModelsDeleted() {
        return this.modelService.findAllDeleted();
    }

    @Query(() => Model)
    fetchModel(
        @Args('modelId') modelId: string, //
    ) {
        return this.modelService.findOne({ modelId });
    }

    @Mutation(() => Boolean)
    restoreModel(@Args('modelId') modelId: string) {
        return this.modelService.restoreDeleted({ modelId });
    }

    @Mutation(() => Model)
    createModel(@Args('createModelInput') createModelInput: CreateModelInput) {
        return this.modelService.create({ createModelInput });
    }

    @Mutation(() => Model)
    async updateModel(
        @Args('modelId') modelId: string,
        @Args('updateModelInput') updateModelInput: UpdateModelInput,
    ) {
        return await this.modelService.update({
            modelId,
            updateModelInput,
        });
    }

    @Mutation(() => Boolean)
    deleteModel(@Args('productId') modelId: string) {
        return this.modelService.delete({ modelId });
    }
}
