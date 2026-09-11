import httpx


async def check_connection(client: httpx.AsyncClient) -> dict:
    response = await client.get("/foods/list", params={"pageSize": 1, "pageNumber": 1})
    response.raise_for_status()
    return {"status": "ok", "http_status": response.status_code}
