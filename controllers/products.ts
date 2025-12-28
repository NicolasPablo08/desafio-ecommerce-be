import { client } from "lib/connections/algolia";

const indexName = "products"; // nombre del indice en algolia

export async function getProducts() {
  try {
    const allProducts = await client.search({
      requests: [
        {
          indexName,
          hitsPerPage: 100, //para que traiga todos (el maximo permitido por algolia es 100)
        },
      ],
    });
    const results = allProducts.results[0] as { hits: any[] };

    return { results: results.hits };
  } catch (e) {
    throw new Error(
      `Error fetching products from getProducts of products controller: ${e.message}`
    );
  }
}

export async function getProductById(id: string) {
  try {
    const product = await client.getObject({
      indexName,
      objectID: id,
    });

    return product;
  } catch (e) {
    throw new Error(
      `Error fetching product by ID from getProductById of products controller: ${e.message}`
    );
  }
}

export async function getProductsBySearch(search: string, limit: number, offset: number) {
  //hacer busqueda en algolia
  try {
    const products = await client.search({
      requests: [
        {
          indexName,
          query: search,
          hitsPerPage: limit, //cantidad de resultados por pagina
          page: Math.floor(offset / limit), //pagina actual, osea offset/limit redondeado hacia abajo
        },
      ],
    });
    const results = products.results[0] as { hits: any[]; nbHits: number };
    if (!products)
      throw new Error("Error searching products from getProductsBySearch of products controller");
    return { results: results.hits, pagination: { offset, limit, total: results.nbHits } };
  } catch (e) {
    throw new Error(
      `Error searching products from getProductsBySearch of products controller: ${e.message}`
    );
  }
}
