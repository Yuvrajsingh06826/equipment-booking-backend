import {
  validateCreateUserInput,
  validateLoginInput,
  normalizeUserRole
} from "../user";

describe("user controller", () => {
  it("accepts valid create user input", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "secret123",
      role: "user" as "user" | "admin"
    };

    expect(() => validateCreateUserInput(user)).not.toThrow();
  });

  it("rejects missing create user input", () => {
    const user = {
      userName: "",
      userPassword: ""
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Username and password are required"
    );
  });

  it("rejects invalid role on create", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "secret123",
      role: "manager" as unknown as "user" | "admin"
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Role must be user or admin"
    );
  });

  it("rejects short username on create", () => {
    const user = {
      userName: "ab",
      userPassword: "secret123"
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Username must be between 3 and 30 characters"
    );
  });

  it("rejects invalid username characters on create", () => {
    const user = {
      userName: "yuvraj@1",
      userPassword: "secret123"
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Username can contain only letters, numbers, and underscores"
    );
  });

  it("rejects short password on create", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "123"
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Password must be between 6 and 50 characters"
    );
  });

  it("rejects password with spaces on create", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "secret 123"
    };

    expect(() => validateCreateUserInput(user)).toThrow(
      "Password must not contain spaces"
    );
  });

  it("accepts valid login input", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "secret123"
    };

    expect(() => validateLoginInput(user)).not.toThrow();
  });

  it("rejects missing login input", () => {
    const user = {
      userName: "",
      userPassword: ""
    };

    expect(() => validateLoginInput(user)).toThrow(
      "Username and password are required"
    );
  });

  it("rejects short username on login", () => {
    const user = {
      userName: "ab",
      userPassword: "secret123"
    };

    expect(() => validateLoginInput(user)).toThrow(
      "Username must be between 3 and 30 characters"
    );
  });

  it("rejects invalid username characters on login", () => {
    const user = {
      userName: "yuvraj@1",
      userPassword: "secret123"
    };

    expect(() => validateLoginInput(user)).toThrow(
      "Username can contain only letters, numbers, and underscores"
    );
  });

  it("rejects short password on login", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "123"
    };

    expect(() => validateLoginInput(user)).toThrow(
      "Password must be between 6 and 50 characters"
    );
  });

  it("rejects password with spaces on login", () => {
    const user = {
      userName: "yuvraj_1",
      userPassword: "secret 123"
    };

    expect(() => validateLoginInput(user)).toThrow(
      "Password must not contain spaces"
    );
  });

  it("normalizes admin role correctly", () => {
    expect(normalizeUserRole("admin")).toBe("admin");
  });

  it("defaults unknown role to user", () => {
    expect(normalizeUserRole("anything")).toBe("user");
  });
});