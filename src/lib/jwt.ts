import jwt from "jsonwebtoken";

export function decodeToken(token: string) {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) throw new Error("JWS Invalid token");
  return decodedToken;
}
export function generateToken(userId: string) {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET);
  if (!token) throw new Error("Token generation failed");
  return token;
}
