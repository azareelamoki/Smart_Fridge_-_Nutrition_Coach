import httpx


async def check_connection(client: httpx.AsyncClient) -> dict:
    response = await client.get("/foods/list", params={"pageSize": 1, "pageNumber": 1})
    response.raise_for_status()
    return {"status": "ok", "http_status": response.status_code}


async def search_food_by_name(client: httpx.AsyncClient, name: str, page_size: int = 6) -> dict:
    response = await client.get(
        "/foods/search",
        params={
            "query": name,
            "pageSize": page_size,
        },
    )
    response.raise_for_status()
    return response.json()
