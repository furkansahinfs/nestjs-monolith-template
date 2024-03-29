import { HttpStatus, Inject, Injectable } from "@nestjs/common";
import { GetProductsFilterDTO } from "src/dto";
import { I18nService } from "nestjs-i18n";
import { ResponseBody } from "src/util";
import { IResponse, QueryData } from "src/types";
import { CommerceService } from "./commerce.service";
import { Product } from "@commercetools/platform-sdk";
import { generateProductWhereIdString } from "./utils";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { CTProductSDKImpl } from "src/repository";

@Injectable()
export class ProductService extends CommerceService {
  ctProductSDKImpl: CTProductSDKImpl;
  constructor(
    @Inject(REQUEST) protected readonly request: Request,
    private readonly i18n: I18nService,
  ) {
    super(request);
    this.ctProductSDKImpl = new CTProductSDKImpl();
  }

  async getProducts(
    dto: GetProductsFilterDTO,
  ): Promise<IResponse<QueryData<Product>>> {
    const where = dto?.productIds
      ? generateProductWhereIdString(dto.productIds)
      : undefined;

    return this.ctProductSDKImpl
      .findProducts({
        where,
        limit: this.getLimit(dto?.limit),
        offset: this.getOffset(dto?.offset),
      })
      .then(({ body }) =>
        ResponseBody()
          .status(HttpStatus.OK)
          .data({ total: body.total, results: body.results })
          .build(),
      )
      .catch((error) => {
        return ResponseBody()
          .status(error?.statusCode)
          .message({
            error: error,
            where,
          })
          .build();
      });
  }

  async getProductWithId(productId: string): Promise<IResponse<Product>> {
    return this.ctProductSDKImpl
      .findProductById(productId)
      .then(({ body }) =>
        ResponseBody().status(HttpStatus.OK).data(body).build(),
      )
      .catch((error) =>
        ResponseBody()
          .status(error?.statusCode)
          .message({ error, id: productId })
          .build(),
      );
  }
}
