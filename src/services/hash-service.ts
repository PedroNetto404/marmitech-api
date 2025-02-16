import bcrypt from 'bcrypt';
import { env } from '../../config/env';
const { hashSalt } = env;

type Hash = (value: string) => Promise<string>;
const hash: Hash = async (value) => await bcrypt.hash(value, hashSalt);

type Compare = (params: {
  value: string;
  hash: string;
}) => Promise<boolean>;
const compare: Compare = ({ value, hash }) => bcrypt.compare(value, hash);

export const hashService = {
  hash,
  compare,
};
