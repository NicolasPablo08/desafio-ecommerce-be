import { client } from "lib/connections/algolia";
import { Cart } from "models/model";

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

export async function getProductsBySearch(
	search: string,
	limit: number,
	offset: number
) {
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
			throw new Error(
				"Error searching products from getProductsBySearch of products controller"
			);
		return {
			results: results.hits,
			pagination: { offset, limit, total: results.nbHits },
		};
	} catch (e) {
		throw new Error(
			`Error searching products from getProductsBySearch of products controller: ${e.message}`
		);
	}
}

//busqueda de productos en carros con status pending o finished
//faltaria agregar campos para los productos finishied o pending,
// como final price y title de los products, ya que al final de la
// compra estos no deberia variar por cambios en la db
export async function getProductsFromOldsCart(userId: string) {
	try {
		const products = await Cart.getOldsCarts(userId);
		return products;
	} catch (e) {
		throw new Error(
			`Error to obtain products from getProductsFromOldsCart of products controller: ${e.message}`
		);
	}
}
//busqueda de productos de un carro con status new y luego
// busqueda de los productos en algolia
export async function getProductsFromNewCart(userId: string) {
	try {
		const products = await Cart.getNewCart(userId);
		if (products.length === 0) return null;

		//buscamos los productos en algolia
		const productsFromAlgolia = await client.getObjects({
			requests: products.map((p) => ({
				indexName,
				objectID: p.productId,
			})),
		});
		if (!productsFromAlgolia)
			throw new Error(
				"Error searching products from getProductsBySearch of products controller"
			);
		const algoliaProducts = productsFromAlgolia.results as any[];
		//agregamos a los resultados de algolia los quantitys
		const results = algoliaProducts.map((productAlgolia) => {
			const cartProduct = products.find(
				(p) => p.productId === productAlgolia.objectID
			);
			return {
				...productAlgolia,
				quantity: cartProduct ? cartProduct.quantity : 0, // Agregamos la cantidad
			};
		});
		return results;
	} catch (e) {
		throw new Error(
			`Error to obtain products from getProductsFromNewCart of products controller: ${e.message}`
		);
	}
}

//agregar productos al carro
export async function addProductToCart(userId: string, productId: string) {
	try {
		const response = await Cart.addProductToCart(userId, productId);
		return response;
	} catch (e) {
		throw new Error(
			`Error add product to cart from addProductToCart of products controller: ${e.message}`
		);
	}
}

//eliminar productos del carro
export async function deleteProductFromCart(userId: string, productId: string) {
	try {
		const response = await Cart.deleteProductFromCart(userId, productId);
		return response;
	} catch (e) {
		throw new Error(
			`Error to delete product from cart from addProductToCart of products controller: ${e.message}`
		);
	}
}
