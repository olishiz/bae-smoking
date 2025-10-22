import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { DatabaseService, PlantData } from '../database/database.service';

@Injectable()
export class PlantService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getPlantData(sessionToken: string): Promise<{ success: boolean; plantData: PlantData | null }> {
    if (!sessionToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.databaseService.getSession(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const plantData = await this.databaseService.getUserPlantData(session.username);

    return {
      success: true,
      plantData,
    };
  }

  async savePlantData(sessionToken: string, plantData: PlantData): Promise<{ success: boolean; message: string }> {
    if (!sessionToken) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.databaseService.getSession(sessionToken);

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const saved = await this.databaseService.saveUserPlantData(session.username, plantData);

    if (saved) {
      return {
        success: true,
        message: 'Plant data saved',
      };
    } else {
      throw new NotFoundException('User not found');
    }
  }
}
