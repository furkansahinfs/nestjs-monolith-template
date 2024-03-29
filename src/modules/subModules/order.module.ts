import { Module } from "@nestjs/common";
import { OrderController } from "src/controller";
import { OrderService } from "src/services";
import * as path from "path";
import { AcceptLanguageResolver, I18nModule } from "nestjs-i18n";
import { ResponseStatusInterceptor } from "src/middleware";
import { APP_INTERCEPTOR } from "@nestjs/core";

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: "en",
      loaderOptions: {
        path: path.join(__dirname, "/../../i18n/"),
        watch: true,
      },
      resolvers: [AcceptLanguageResolver],
    }),
  ],
  controllers: [OrderController],
  providers: [
    OrderService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseStatusInterceptor,
    },
  ],
})
export class OrderModule {}
