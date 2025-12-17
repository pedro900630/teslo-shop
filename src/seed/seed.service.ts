import { Injectable } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { initialData } from './data/seed-data';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  constructor(
    private readonly productsService: ProductsService,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async runSeed() {
    await this.deleteTables();
    const user = await this.seedUsers()[0];
    await this.insertNewProducts(user);
    return 'SEED EXECUTED';
  }

  private async deleteTables() {
    await this.productsService.deleteAllProducts();
    const queryBuilder = this.userRepository.createQueryBuilder();
    await queryBuilder.delete().where({}).execute();
  }

  private async seedUsers() {
    const users = initialData.users.map(({ password, ...userDataRest }) =>
      this.userRepository.create({
        ...userDataRest,
        password: bcrypt.hashSync(password, 10),
      }),
    );
    return await this.userRepository.save(users);
  }

  async insertNewProducts(user: User) {
    await this.productsService.deleteAllProducts();

    const products = initialData.products;

    const insertPromises = [];
    for (const product of products) {
      insertPromises.push(this.productsService.create(product, user));
    }

    await Promise.all(insertPromises);

    return true;
  }
}
