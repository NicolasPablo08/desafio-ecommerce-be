import { airtableBase } from "src/lib/connections/airtable";
import { client } from "src/lib/connections/algolia";

const indexName = "products"; // nombre del indice en algolia

export async function POST(req: Request) {
  try {
    await new Promise((resolve, reject) => {
      airtableBase("products")
        .select({
          pageSize: 10, //limit (cantidad por pagina)
        })
        .eachPage(
          async function (records, fetchNextPage) {
            //fetchNextPage es la siguiente pagina
            //guardamos en algolia los productos de airtable con su id
            const objects = records.map((r) => ({
              objectID: r.id,
              ...r.fields,
            }));
            // guardamos los productos en algolia
            await client.saveObjects({
              indexName, //nombre del indice declarado mas arriba
              objects,
            });

            fetchNextPage(); //cuando termina una pagina, se llama a la siguiente
          },
          (err) => {
            if (err) reject(err);
            else resolve();
          }
        );
    });
    return new Response(JSON.stringify({ message: "base de datos Algolia actualizada" }), {
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ message: "Error actualizando Algolia" }), {
      status: 500,
    });
  }
}
