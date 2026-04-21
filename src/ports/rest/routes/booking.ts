import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../../../middleware/auth";
import {
  validateCreateUserInput,
  validateLoginInput,
  normalizeUserRole
} from "../../../controllers/user";

const router = express.Router();

interface UserRecord {
  userId: string;
  userName: string;
  userPassword: string;
  role: "user" | "admin";
}

const userDb: UserRecord[] = [];

router.post("/create", async (req: Request, res: Response) => {
  try {
    validateCreateUserInput(req.body);

    const userName = req.body.userName.trim();
    const userPassword = req.body.userPassword;
    const role = normalizeUserRole(req.body.role);

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

    const createdUser: UserRecord = {
      userId: `user_${userDb.length + 1}`,
      userName,
      userPassword: hashedPassword,
      role
    };

    userDb.push(createdUser);

    return res.status(200).json({
      message: "User created successfully",
      user: {
        userId: createdUser.userId,
        userName: createdUser.userName,
        role: createdUser.role
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({ message });
  }
});

router.post("/login", async (req: Request, res: Response) => {
  try {
    validateLoginInput(req.body);

    const userName = req.body.userName.trim();
    const userPassword = req.body.userPassword;

    const user = userDb.find((savedUser) => savedUser.userName === userName);

    if (!user) {
      throw new Error("Error logging in, unable to find username");
    }

    const compareResult = await bcrypt.compare(
      userPassword,
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

    return res.status(200).json({
      message: "User logged in successfully",
      token,
      user: {
        userId: user.userId,
        userName: user.userName,
        role: user.role
      }
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Something went wrong";

    return res.status(400).json({ message });
  }
});

export default router;