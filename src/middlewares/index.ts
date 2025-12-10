import { decodeToken } from "src/lib/jwt";

export function authMiddleware(handler) {
  return async (request: Request) => {
    const headerAuthorization = request.headers.get("authorization");
    if (!headerAuthorization) {
      return Response.json({ error: "Authorization header missing" }, { status: 401 });
    }
    const token = headerAuthorization.split(" ")[1];
    if (!token) {
      return Response.json({ error: "No token provided" }, { status: 401 });
    }

    try {
      // Verifica si decodedToken es un objeto y tiene la propiedad userId
      const decodedToken = decodeToken(token);
      if (!decodedToken || typeof decodedToken !== "object" || !decodedToken.userId) {
        return Response.json({ error: "Invalid token" }, { status: 401 });
      }

      // Llamamos al handler
      return handler(request, decodedToken.userId as string);
    } catch (e) {
      return Response.json({ error: "Invalid token" }, { status: 401 });
    }
  };
}
