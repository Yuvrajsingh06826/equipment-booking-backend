export interface CreateUserInput {
  userName: string;
  userPassword: string;
  role?: "user" | "admin";
}

export interface LoginUserInput {
  userName: string;
  userPassword: string;
}

const userNamePattern = /^[a-zA-Z0-9_]+$/;

export const validateCreateUserInput = (user: CreateUserInput): void => {
  const userName = user.userName?.trim();
  const userPassword = user.userPassword;
  const role = user.role;

  if (!userName || !userPassword) {
    throw new Error("Username and password are required");
  }

  if (userName.length < 3 || userName.length > 30) {
    throw new Error("Username must be between 3 and 30 characters");
  }

  if (!userNamePattern.test(userName)) {
    throw new Error("Username can contain only letters, numbers, and underscores");
  }

  if (userPassword.length < 6 || userPassword.length > 50) {
    throw new Error("Password must be between 6 and 50 characters");
  }

  if (userPassword.includes(" ")) {
    throw new Error("Password must not contain spaces");
  }

  if (role && role !== "user" && role !== "admin") {
    throw new Error("Role must be user or admin");
  }
};

export const validateLoginInput = (user: LoginUserInput): void => {
  const userName = user.userName?.trim();
  const userPassword = user.userPassword;

  if (!userName || !userPassword) {
    throw new Error("Username and password are required");
  }

  if (userName.length < 3 || userName.length > 30) {
    throw new Error("Username must be between 3 and 30 characters");
  }

  if (!userNamePattern.test(userName)) {
    throw new Error("Username can contain only letters, numbers, and underscores");
  }

  if (userPassword.length < 6 || userPassword.length > 50) {
    throw new Error("Password must be between 6 and 50 characters");
  }

  if (userPassword.includes(" ")) {
    throw new Error("Password must not contain spaces");
  }
};

export const normalizeUserRole = (
  role: string | undefined
): "user" | "admin" => {
  return role === "admin" ? "admin" : "user";
};