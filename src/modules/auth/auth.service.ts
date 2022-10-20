import bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import {
  EmailAlreadyExistsException,
  NotAuthorizedException,
  WrongCredentialsException,
} from 'src/shared/exceptions';
import { User, UserCreateDto, UserI } from '@user';
import {
  UserWithTokenI,
  UserTokenI,
  AuthLogInDto,
  AuthRegisterDto,
  GoogleUserDto,
} from '@auth';
import { config } from '@core/config/app.config';
import { Logger } from '@services';
import { UserMongoI } from '../user/user.interface';

export class AuthService {
  user = User;

  async register(
    userData: AuthRegisterDto | UserCreateDto,
    needToken = true
  ): Promise<UserWithTokenI> {
    if (await this.user.findOne({ email: userData.email }).exec()) {
      throw new EmailAlreadyExistsException(userData.email);
    }
    let user: UserI;
    if (userData.password) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      user = await this.user.create({
        ...userData,
        password: hashedPassword,
      });
    } else {
      user = await this.user.create({
        ...userData,
      });
    }

    if (needToken) {
      const token = this.createToken(user);
      return {
        token,
        user,
      };
    } else {
      return { user };
    }
  }

  login(data: AuthLogInDto): Promise<UserWithTokenI> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email: data.email }).exec();
        if (user) {
          if (data.site === 'admin' && user.role !== 'ADMIN') {
            reject(new NotAuthorizedException());
          }
          const isPasswordMatching = await bcrypt.compare(
            data.password,
            user.get('password', null, { getters: false })
          );
          if (isPasswordMatching) {
            const token = this.createToken(user);
            resolve({ user, token });
          } else {
            reject(new WrongCredentialsException());
          }
        } else {
          reject(new WrongCredentialsException());
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  async loginGoogle(data: GoogleUserDto): Promise<UserWithTokenI> {
    try {
      const user = await User.findOne({ email: data.email }).exec();
      if (user) {
        return await this.onLoginGoogleExistUser(user, data);
      } else {
        return await this.onLoginGoogleNotExistUser(data);
      }
    } catch (error) {
      Logger.error(error);
    }
  }

  private onLoginGoogleExistUser(
    user: UserMongoI,
    data: GoogleUserDto
  ): Promise<UserWithTokenI> {
    return new Promise(async (resolve, reject) => {
      if (user.googleId) {
        if (data.email === user.email) {
          const token = this.createToken(user);
          resolve({ user, token, new: false });
        } else {
          reject(new WrongCredentialsException());
        }
      } else {
        user.googleId = data.uid;
        await user.save();
        const token = this.createToken(user);
        resolve({ user, token, new: false });
      }
    });
  }

  private async onLoginGoogleNotExistUser(
    data: GoogleUserDto
  ): Promise<UserWithTokenI> {
    const userData: UserCreateDto = {
      name: data.name ?? data.displayName,
      email: data.email,
      country: 'es',
      role: 'USER',
      googleId: data.uid,
    };
    const userCreated = await this.register(userData, true);
    return { user: userCreated.user, token: userCreated.token, new: true };
  }

  createToken(user: UserI): string {
    const expiresIn = '100 days';
    const secret = config.seed;
    const dataStoredInToken = {
      user: {
        _id: user._id,
        name: user.name,
        role: user.role,
        country: user.country,
      },
    };
    return jwt.sign(dataStoredInToken, secret, { expiresIn });
  }

  me(userToken: UserTokenI): Promise<UserI> {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findById(userToken._id).exec();
        if (user) {
          resolve(user);
        } else {
          reject(new NotAuthorizedException());
        }
      } catch (error) {
        reject(error);
      }
    });
  }
}
