import httpx

async def search_meal_by_name(client: httpx.AsyncClient, name: str) -> dict:
    response = await client.get("/search.php", params={"s": name})
    response.raise_for_status()
    return response.json()


async def get_random_meal(client: httpx.AsyncClient) -> dict:
    response = await client.get("/random.php")
    response.raise_for_status()
    return response.json()
