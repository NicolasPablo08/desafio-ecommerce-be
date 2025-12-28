//podemos crear una funcion para utilizar en varios endpoints
//que devuelva un limit y un offset segun lo pasado por query
export function getLimitAndOffsetFromReq(req: Request, maxLimit: number, maxOffset: number) {
  const { searchParams } = new URL(req.url);
  const queryOffset = searchParams.get("offset");
  const queryOffsetNum = parseInt(queryOffset);
  const queryLimit = searchParams.get("limit");
  const queryLimitNum = parseInt(queryLimit);
  //si el limit pasado por req es menor al maximo lo usamos, sino usamos el maximo
  const limit = queryLimitNum < maxLimit ? queryLimitNum : maxLimit;
  //si el offset pasado por req es menor al maximo lo usamos, sino usamos 0
  const offset = queryOffsetNum >= 0 && queryOffsetNum < maxOffset ? queryOffsetNum : 0; // Asegurarte de que sea >= 0

  // const offset = queryOffsetNum < maxOffset ? queryOffsetNum : 0;

  return { limit, offset };
}
