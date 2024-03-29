import { Response } from "express";
import { getJWTUserId, ResponseBody, verifyToken } from "src/util";
import { UserService } from "src/services";
import { HttpStatus, Injectable, NestMiddleware } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { RequestWithUser } from "src/interface";

@Injectable()
export class JWTMiddleware implements NestMiddleware {
  constructor(
    private readonly userService: UserService,
    private readonly i18n: I18nService,
  ) {}

  async use(
    req: RequestWithUser,
    res: Response,
    next: () => void,
  ): Promise<Response<any, Record<string, any>>> {
    const accessTokenStr = req.headers.authorization;
    const accessToken = accessTokenStr?.replace("Bearer ", "");
    let user;

    if (!accessToken) {
      return this.generateUnauthorizedResponse(res);
    }

    const { decoded, expired } = verifyToken(
      accessToken,
      "ACCESS_TOKEN_PUBLIC_KEY",
    );
    if (decoded || !expired) {
      try {
        const userId = await getJWTUserId(
          accessToken,
          "ACCESS_TOKEN_PUBLIC_KEY",
        );

        user = await this.userService.getUserWithId(userId);
      } catch (error) {
        return res
          .status(HttpStatus.UNAUTHORIZED)
          .send(
            ResponseBody()
              .status(HttpStatus.UNAUTHORIZED)
              .message(error)
              .build(),
          );
      }
    } else {
      return this.generateUnauthorizedResponse(res);
    }

    if (user) {
      req.user = user;
    }

    next();
  }

  private generateUnauthorizedResponse(
    res: Response,
  ): Response<any, Record<string, any>> {
    return res.status(HttpStatus.UNAUTHORIZED).send(
      ResponseBody()
        .status(HttpStatus.UNAUTHORIZED)
        .message({
          error: this.i18n.translate("auth.status.unauthorized"),
        })
        .build(),
    );
  }
}
