import { vi } from "vitest";
import RegisterUser from "../../../Domains/users/entities/RegisterUser.js";
import RegisteredUser from "../../../Domains/users/entities/RegisteredUser.js";
import UserRepository from "../../../Domains/users/UserRepository.js";
import PasswordHash from "../../security/PasswordHash.js";
import AddUserUseCase from "../AddUserUseCase.js";

describe("AddUserUseCase", () => {
  it("should orchestrating the add user action correctly", async () => {
    // Arrange
    const useCasePayload = {
      username: "dicoding",
      password: "secret",
      fullname: "Dicoding Indonesia",
    };
    const expectedRegisteredUser = new RegisteredUser({
      id: "user-123",
      username: "dicoding",
      fullname: "Dicoding Indonesia",
    });

    const mockUserRepository = new UserRepository();
    const mockPasswordHash = new PasswordHash();

    // Mocking dengan instansiasi objek baru (literal)
    mockUserRepository.verifyAvailableUsername = vi
      .fn()
      .mockImplementation(() => Promise.resolve());
    mockPasswordHash.hash = vi
      .fn()
      .mockImplementation(() => Promise.resolve("encrypted_password"));
    mockUserRepository.addUser = vi.fn().mockImplementation(() =>
      Promise.resolve(
        new RegisteredUser({
          id: "user-123",
          username: "dicoding",
          fullname: "Dicoding Indonesia",
        })
      )
    );

    const getUserUseCase = new AddUserUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
    });

    // Action
    const registeredUser = await getUserUseCase.execute(useCasePayload);

    // Assert
    expect(registeredUser).toStrictEqual(expectedRegisteredUser);
    expect(mockUserRepository.verifyAvailableUsername).toBeCalledWith(
      "dicoding"
    );
    expect(mockPasswordHash.hash).toBeCalledWith("secret");
    expect(mockUserRepository.addUser).toBeCalledWith(
      new RegisterUser({
        username: "dicoding",
        password: "encrypted_password",
        fullname: "Dicoding Indonesia",
      })
    );
  });
});
