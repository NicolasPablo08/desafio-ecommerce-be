import { authMiddleware } from "src/middlewares";
import { User } from "src/models/model";
import * as yup from "yup";

const bodySchema = yup.object().shape({
  address: yup.string().required(),
});

export const PATCH = authMiddleware(handler);

async function handler(request: Request, userId: string) {
  const body = await request.json();
  try {
    await bodySchema.validate(body);
  } catch (e) {
    return new Response(JSON.stringify({ field: "body", message: e.message }), { status: 400 });
  }
  try {
    const { address } = body;
    const updated = await User.updateAddress(address, userId);
    if (!updated) {
      return Response.json({ message: "Error, user not updated address" }, { status: 400 });
    }
    return Response.json({ message: "User updated address" }, { status: 200 });
  } catch (e) {
    return Response.json({ message: e.message }, { status: 400 });
  }
}

// ejemplo con varios meidlewares
// export const PATCH = withRateLimit(
//   withAuth(
//     withJsonBody(handler)
//   )
// );
