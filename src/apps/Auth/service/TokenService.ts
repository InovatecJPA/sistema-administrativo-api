import { Repository } from "typeorm";
import * as jwt from "../../../config/jwt";
import AppDataSource from "../../../database/dbConnection";
import { NotFoundError } from "../../../error/NotFoundError";
import { UnauthorizedException } from "../../../error/UnauthorizedException";
import Token from "../model/Token";
import User from "../model/User";
import { UserService, userService } from "./UserService";

/**
 * Service for handling operations related to user tokens.
 * It includes functionalities for generating, validating, and invalidating JWT-based tokens.
 */
export class TokenService {
  private readonly userService: UserService; // Service to handle user operations
  private readonly tokenRepository: Repository<Token>; // Repository to manage token storage and retrieval

  /**
   * Constructor to initialize the TokenService with the UserService and Token repository.
   * @param userService - Instance of the UserService to handle user-related operations.
   * @param tokenRepository - Repository for Token entity to handle database operations.
   */
  constructor(userService: UserService, tokenRepository: Repository<Token>) {
    this.userService = userService;
    this.tokenRepository = tokenRepository;
  }

  /**
   * Generates a reset token for a user.
   * Creates a new token or updates the existing one for the specified user ID and stores it in the database.
   * The generated token is valid for 5 minutes.
   *
   * @param _userId - The ID of the user for whom to generate the reset token.
   * @returns A promise that resolves to the generated reset token as a string.
   */
  public async generateResetToken(_userId: string): Promise<string> {
    // Generate a reset token valid for 5 minutes
    const resetToken = jwt.signToken({ userId: _userId }, "5m");

    // Check if a token already exists for this user
    let token = await this.tokenRepository.findOne({
      where: { userId: _userId },
    });

    // If token exists, update it; otherwise, create a new one
    if (token) {
      token.token = resetToken;
      token.isUsed = false;
    } else {
      token = this.tokenRepository.create({
        userId: _userId,
        token: resetToken,
      });
    }

    // Save the token to the database
    await this.tokenRepository.save(token);

    return resetToken;
  }

  /**
   * Marks a token as used in the database to prevent its reuse.
   *
   * @param token - The token string to be invalidated.
   */
  public invalidateToken(token: string): void {
    // Mark the token as used
    this.tokenRepository.update({ token }, { isUsed: true });
  }

  /**
   * Validates a reset token and retrieves the associated user if the token is valid.
   * The token is considered valid if it is not expired, exists in the database, matches the one in storage, and has not been used.
   *
   * @param token - The reset token string to be validated.
   * @returns A promise that resolves to the User associated with the token.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedException if the token is invalid or expired.
   */
  public async validateResetToken(token: string): Promise<User> {
    try {
      // Decode and verify the token with the JWT secret
      const payload = jwt.verifyToken(token) as { userId: string };

      // Find the user based on the decoded userId from the token
      const user = await this.userService.findOne({ id: payload.userId });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      // Find the token associated with the user in the database
      const tokenEntity = await this.tokenRepository.findOne({
        where: { userId: user.id },
      });

      // Check if the token entity exists, matches the provided token, and hasn't been used
      if (!tokenEntity || tokenEntity.token !== token || tokenEntity.isUsed) {
        throw new UnauthorizedException("Token inválido ou expirado.");
      }

      // Mark the token as used to prevent reuse
      tokenEntity.isUsed = true;
      await this.tokenRepository.save(tokenEntity);

      // Return the user if all checks pass
      return user;
    } catch (error) {
      // Throw unauthorized error if the token is invalid or expired
      throw new UnauthorizedException("Token inválido ou expirado.");
    }
  }

  /**
   * Validates a token and returns the user associated with it, without checking if the token has been used.
   * This method is useful for general token validation without the reset token constraints.
   *
   * @param token - The token string to be validated.
   * @returns A promise that resolves to the User associated with the token.
   * @throws NotFoundError if the user is not found.
   * @throws UnauthorizedException if the token is invalid or expired.
   */
  public async validateToken(token: string): Promise<User> {
    try {
      // Decode and verify the token with the JWT secret
      const payload = jwt.verifyToken(token) as { id: string };

      // Find the user based on the decoded id from the token
      const user = await this.userService.findOne({ id: payload.id });

      if (!user) {
        throw new NotFoundError("Usuário não encontrado.");
      }

      return user;
    } catch (error) {
      // Throw unauthorized error if the token is invalid or expired
      throw new UnauthorizedException("Token inválido ou expirado.");
    }
  }
}

// Create the token repository to be used by TokenService
const tokenRepository = AppDataSource.getRepository(Token);

// Export a singleton instance of TokenService for application-wide use
export const tokenService = new TokenService(userService, tokenRepository);
