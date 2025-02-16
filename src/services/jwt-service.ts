import jwt from 'jsonwebtoken';
import moment from 'moment';
import { env } from '../../config/env';
import { UserDto } from '../resources/users/user-schema';
const {
  jwt: { secret, secondsToExpiry, audience, issuer },
} = env;

export type SignResult = {
  accessToken: string;
  tokenType: 'Bearer';
  expiresIn: number;
};

class JwtService {
  sign(payload: UserDto): SignResult {
    const token = jwt.sign(payload, secret, {
      expiresIn: `${secondsToExpiry}s`,
      audience,
      issuer,
    });

    return {
      accessToken: token,
      tokenType: 'Bearer',
      expiresIn: moment().unix() + secondsToExpiry,
    };
  }

  verify(token: string): UserDto {
    return jwt.verify(token, secret, {
      audience,
      issuer,
    }) as UserDto;
  }
}

export const jwtService = new JwtService();
