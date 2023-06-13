import jwt from 'jsonwebtoken';

export const decodeJWT = (token: any) => {
  try {
    const decoded = jwt.decode(token);
    return decoded;
  } catch (error) {
    console.error('Error decoding JWT:', error);
    return null;
  }
};
