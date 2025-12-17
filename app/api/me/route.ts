import { authMiddleware } from "middlewares";
import { User } from "models/model";
import * as yup from "yup";

const bodySchema = yup
  .object()
  .shape({
    name: yup.string(),
    lastName: yup.string(),
    email: yup.string().email(),
  })
  .noUnknown(true)
  .strict();

export const GET = authMiddleware(obtainUserHandler);
export const PATCH = authMiddleware(updateDataUserHandler);

async function obtainUserHandler(req: Request, userId: string) {
  try {
    const user = await User.findUserById(userId);
    if (!user)
      return new Response(JSON.stringify({ message: "Error, user not found" }), { status: 400 });
    return new Response(JSON.stringify(user), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}

async function updateDataUserHandler(req: Request, userId: string) {
  const body = await req.json();
  try {
    await bodySchema.validate(body);
  } catch (e) {
    return new Response(JSON.stringify({ field: "body", message: e.message }), { status: 400 });
  }
  try {
    const updatedDataUser = await User.updatePartialUser(userId, body);
    if (!updatedDataUser)
      return new Response(JSON.stringify({ message: "Error, user not updated" }), { status: 400 });
    return new Response(JSON.stringify({ message: "User updated" }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), { status: 400 });
  }
}
