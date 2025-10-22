import { Module } from '@nestjs/common';
import { PlantController } from './plant.controller';
import { PlantService } from './plant.service';
import { DatabaseService } from '../database/database.service';

@Module({
  controllers: [PlantController],
  providers: [PlantService, DatabaseService],
})
export class PlantModule {}
