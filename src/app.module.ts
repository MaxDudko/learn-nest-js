import {MiddlewareConsumer, Module, RequestMethod} from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserModule} from './user/user.module';
import ormconfig from "./ormconfig";
import {AuthMiddleware} from "./middlewares/AuthMiddleware";

@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), UserModule],
  exports: []
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL
    })
  }
}
