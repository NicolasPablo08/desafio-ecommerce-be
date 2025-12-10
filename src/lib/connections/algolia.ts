import { algoliasearch } from "algoliasearch";

export const client = algoliasearch(process.env.ALGOLIA_APP_ID, process.env.ALGOLIA_API_KEY);
//algolia ya no permite referenciar al indice con client.initIndex("products")
//por eso exportamos client y en el endpoint ponemos el nombre del indice
