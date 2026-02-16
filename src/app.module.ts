import { Module } from '@nestjs/common';
import { envs } from './config/envs';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './products/products.module';
import { SeedModule } from './seed/seed.module';
import { FilesModule } from './files/files.module';
import { ConfigModule } from '@nestjs/config';
import { CommonModule } from './common/common.module';
import { AuthModule } from './auth/auth.module';
import { MessageWsModule } from './message-ws/message-ws.module';

// console.log({
//   type: 'postgres',
//   host: envs.db_host,
//   port: envs.db_port,
//   username: envs.db_user,
//   password: envs.db_password,
//   database: envs.db_name,
//   autoLoadEntities: true,
//   synchronize: true, // Set to false in production
// });

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: envs.db_host,
      port: envs.db_port,
      username: envs.db_user,
      password: envs.db_password,
      database: envs.db_name,
      autoLoadEntities: true,
      synchronize: false, // Set to false in production
    }),
    ProductsModule,
    SeedModule,
    FilesModule,
    CommonModule,
    AuthModule,
    MessageWsModule,
    // ServeStaticModule.forRoot({
    //   rootPath: join(__dirname, '..', 'public'),
    // }),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {
  constructor() {}
}
