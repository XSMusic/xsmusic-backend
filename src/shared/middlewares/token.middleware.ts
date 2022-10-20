import { User } from "@user";
import { UserTokenI } from "@auth";
import { config } from "@core/config/app.config";
import { Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";

const seed = config.seed;

export const checkUserToken = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userToken = req.get("XSToken") || "";
  if (config.env === "test") {
    const users = await User.find({}).exec();
    req.user = users[0];
    next();
  } else {
    checkToken(userToken)
      .then((decoded: any) => {
        req.user = decoded.user;
        next();
      })
      .catch((error: any) =>
        res
          .status(999)
          .send({ message: "Token incorrecto, no eres usuario", error })
      );
  }
};

export const checkAdminToken = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userToken = req.get("XSToken") || "";
  if (config.env === "test") {
    const users = await User.find({}).exec();
    req.user = users[0];
    next();
  } else {
    checkToken(userToken)
      .then((decoded: any) => {
        req.user = decoded.user;
        if (req.user.role === "ADMIN") {
          next();
        } else {
          return res
            .status(666)
            .send({ message: "¡Tu no tienes derecho a tocar esto!" });
        }
      })
      .catch(() =>
        res
          .status(999)
          .send({ message: "Token incorrecto, no eres administrador" })
      );
  }
};

export const checkUserNotObligatory = async (
  req: any,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const userToken = req.get("XSToken");
  if (userToken && userToken !== "null") {
    checkToken(userToken)
      .then((decoded: any) => {
        req.user = decoded.user;
        next();
      })
      .catch(() =>
        res.status(999).send({
          message: "Token incorrecto, no eres administrador",
        })
      );
  } else {
    next();
  }
};

export const checkSameUserOrAdmin = (
  req: any,
  res: Response,
  next: NextFunction
): void => {
  const userToken = req.get("XSToken") || "";

  checkToken(userToken)
    .then((decoded: any) => {
      req.user = decoded.user;
      if (req.user.role === "ADMIN") {
        next();
      } else {
        return res
          .status(400)
          .send({ ok: false, message: "El token no es correcto" });
      }
    })
    .catch(() =>
      res.status(400).send({ ok: false, message: "El token no es correcto" })
    );
};

const checkToken = (token: string): Promise<{ user: UserTokenI }> => {
  return new Promise((resolve, reject) => {
    jwt.verify(
      token,
      seed,
      (err: any, decoded: { user: UserTokenI; iat: number; exp: number }) => {
        if (err) {
          reject(err);
        }
        resolve(decoded);
      }
    );
  });
};
