import { Controller, Post, Body } from '@nestjs/common';
import { PlantService } from './plant.service';
import { GetPlantDataDto, SavePlantDataDto } from '../common/dto/plant.dto';

@Controller('api/plant-data')
export class PlantController {
  constructor(private readonly plantService: PlantService) {}

  @Post('get')
  async getPlantData(@Body() dto: GetPlantDataDto) {
    return this.plantService.getPlantData(dto.sessionToken);
  }

  @Post('save')
  async savePlantData(@Body() dto: SavePlantDataDto) {
    return this.plantService.savePlantData(dto.sessionToken, dto.plantData);
  }
}
