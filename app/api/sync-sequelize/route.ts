import syncPostgresDataBase from "models/sync";

export async function GET(req: Request) {
  try {
    const response = await syncPostgresDataBase();
    return new Response(JSON.stringify(response), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ message: e.message }), {
      status: 400,
    });
  }
}
