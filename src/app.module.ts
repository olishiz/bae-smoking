import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { PlantModule } from './plant/plant.module';

@Module({
  imports: [AuthModule, PlantModule],
})
export class AppModule {}
