import { IsString, IsObject } from 'class-validator';
import { PlantData } from '../../database/database.service';

export class GetPlantDataDto {
  @IsString()
  sessionToken: string;
}

export class SavePlantDataDto {
  @IsString()
  sessionToken: string;

  @IsObject()
  plantData: PlantData;
}

export class PlantDataResponseDto {
  success: boolean;
  plantData?: PlantData | null;
  message?: string;
}
