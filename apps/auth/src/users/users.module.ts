import { Module, forwardRef } from '@nestjs/common';

import { ProfileController } from './profile.controller';
import { CreateUserProvider, UserByEmailProvider } from './providers';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { AuthModule } from '../auth.module';
import { CsvService } from '@app/common/services/csv.service';
import { DatabaseModule } from '@app/common/database/database.module';

@Module({
  imports: [DatabaseModule, forwardRef(() => AuthModule)],
  controllers: [UsersController, ProfileController],
  providers: [
    UsersService,
    CreateUserProvider,
    UserByEmailProvider,
    CsvService,
  ],
  exports: [UsersService, UserByEmailProvider],
})
export class UsersModule {}
