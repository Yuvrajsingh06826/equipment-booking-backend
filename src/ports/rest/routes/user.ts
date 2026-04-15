import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../../../middleware/auth";

const router = express.Router();

interface UserRecord {
  userId: string;
  userName: string;
  userPassword: string;
  role: "user" | "admin";
}

const userDb: UserRecord[] = [];

router.post(
  "/create",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userName = req.body.userName;
      const userPassword = req.body.userPassword;
      const role: "user" | "admin" =
        req.body.role === "admin" ? "admin" : "user";

      const existingUser = userDb.find(
        (savedUser) => savedUser.userName === userName
      );

      if (existingUser) {
        return res.status(400).json({
          message: "User already exists"
        });
      }

      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(userPassword, salt);

      const createUser: UserRecord = {
        userId: `user_${userDb.length + 1}`,
        userName,
        userPassword: hashedPassword,
        role
      };

      userDb.push(createUser);

      res.status(200).json({
        message: "User created successfully",
        user: {
          userId: createUser.userId,
          userName: createUser.userName,
          role: createUser.role
        }
      });
    } catch (error) {
      console.log(
        `Error creating user: ${JSON.stringify((error as Error).message)}`
      );
      res.status(500).json({
        message: `Error creating user: ${JSON.stringify(
          (error as Error).message
        )}`
      });
    }
  }
);

router.post(
  "/login",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = userDb.find(
        (savedUser) => savedUser.userName === req.body.userName
      );

      if (!user) {
        throw new Error("Error logging in, unable to find username");
      }

      const compareResult = await bcrypt.compare(
        req.body.userPassword,
        user.userPassword
      );

      if (!compareResult) {
        throw new Error("Error logging in, invalid password");
      }

      const token = jwt.sign(
        {
          userId: user.userId,
          userName: user.userName,
          role: user.role
        },
        getJwtSecret(),
        { expiresIn: "1h" }
      );

      res.status(200).json({
        message: "User logged in successfully",
        token,
        user: {
          userId: user.userId,
          userName: user.userName,
          role: user.role
        }
      });
    } catch (error) {
      console.log(
        `Error logging in: ${JSON.stringify((error as Error).message)}`
      );
      res.status(500).json({
        message: `Error logging in: ${JSON.stringify(
          (error as Error).message
        )}`
      });
    }
  }
);

export default router;