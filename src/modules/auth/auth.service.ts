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
  AuthHelper,
} from '@auth';
import { config } from '@core/config/app.config';
import { Logger } from '@services';
import { UserMongoI } from '../user/user.interface';

export class AuthService {
  private authHelper = new AuthHelper();
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

  loginGoogle(data: GoogleUserDto): Promise<UserWithTokenI> {
    return new Promise(async (resolve, reject) => {
      console.log(data);
      try {
        const user = await User.findOne({ email: data.email }).exec();
        if (user) {
          resolve(await this.onLoginGoogleExistUser(user, data));
        } else {
          resolve(await this.onLoginGoogleNotExistUser(data));
        }
      } catch (error) {
        Logger.error(error);
        reject(error);
      }
    });
  }

  private onLoginGoogleExistUser(
    user: UserMongoI,
    data: GoogleUserDto
  ): Promise<UserWithTokenI> {
    return new Promise(async (resolve, reject) => {
      console.log('onLoginGoogleExistUser');
      try {
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
      } catch (error) {
        reject(error);
      }
    });
  }

  private async onLoginGoogleNotExistUser(
    data: GoogleUserDto
  ): Promise<UserWithTokenI> {
    console.log('onLoginGoogleNotExistUser');
    const userData: UserCreateDto = {
      name: data.name ?? data.displayName,
      email: data.email,
      country: 'es',
      role: 'USER',
      googleId: data.uid,
      darkMode: 'system',
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

  sendPasswordResetEmail(email: string) {
    return new Promise(async (resolve, reject) => {
      try {
        const user = await User.findOne({ email }).exec();
        if (user) {
          const token = this.authHelper.usePasswordHashToMakeToken(user);
          const url = `https://xsmusic.carstournaments.com/auth/resetPassword/${user._id}/${token}`;
          const emailTemplate = this.authHelper.resetPasswordTemplate(
            user,
            url
          );
          this.sendEmail(emailTemplate);
          resolve({ message: 'Email enviado, revisa tu bandeja de entrada' });
        } else {
          reject({ message: 'No hay usuarios con ese email' });
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  private sendEmail(emailTemplate: any) {
    return new Promise((resolve, reject) => {
      this.authHelper.transporter.sendMail(emailTemplate, (err, info) => {
        if (err) {
          reject({ message: 'Error sending email' });
        }
        resolve({ message: info.response });
      });
    });
  }

  resetPassword = (userId: string, token: string, password: string) => {
    return new Promise(async (resolve, reject) => {
      try {
        const user: UserI = await User.findOne({ _id: userId }).exec();
        if (user) {
          const jwtResponse: any = jwt.decode(token, { complete: true });
          if (jwtResponse.payload.user.toString() === user._id.toString()) {
            bcrypt.genSalt(10, (err, salt) => {
              if (err) {
                reject(err);
              }
              bcrypt.hash(password, salt, async (err, hash) => {
                if (err) return;
                await User.findOneAndUpdate(
                  { _id: userId },
                  { password: hash }
                ).exec();
                resolve({ message: 'Contraseña modificada' });
              });
            });
          }
        } else {
          reject({ message: 'Usuario invalido' });
        }
      } catch (error) {
        reject(error);
      }
    });
  };
}
