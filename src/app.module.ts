import { Module } from '@nestjs/common';
import { envs } from './config/envs';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db_host,
      port: envs.db_port,
      username: envs.db_user,
      password: envs.db_password,
      database: envs.db_name,
      autoLoadEntities: true,
      synchronize: true, // Set to false in production
    }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
