import type { Aquarium, AquariumPayload } from "../../aquariums/types/aquarium";
const GET_METHOD = "GET";
const POST_METHOD = "POST";
const PATCH_METHOD = "PATCH";
const INCLUDE_CREDENTIALS = "include";
const AQUA_ENDPOINT = "/api/aquariums/";
const CONTENT_TYPE_HEADER = "Content-Type";
const JSON_CONTENT_TYPE = "application/json";

export async function getExistingAquas(): Promise<Aquarium[]>{
    const response = await fetch(AQUA_ENDPOINT,{
        method: GET_METHOD,
        credentials: INCLUDE_CREDENTIALS,
    });
    if(!response.ok) throw new Error("Error getting aquariums");
    const data = (await response.json());
    if (!data || typeof data !== "object" || !Array.isArray(data.aquariums)) return [];
    return data.aquariums as Aquarium[];
}

export async function addAqua(aqua: Aquarium): Promise<Aquarium>{
    const response = await fetch(AQUA_ENDPOINT,{
      method: POST_METHOD,
      credentials: INCLUDE_CREDENTIALS,
      headers: {
        [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE,
      },
      body: JSON.stringify(aqua)
    });
    if(!response.ok) throw new Error("Error adding aquariums");
    return aqua;
}


export async function updateAqua(aquaPayload: AquariumPayload): Promise<Aquarium>{
    const response = await fetch(`${AQUA_ENDPOINT}${aquaPayload.aquariumId}`,{
      method: PATCH_METHOD,
      credentials: INCLUDE_CREDENTIALS,
      headers: {
        [CONTENT_TYPE_HEADER]: JSON_CONTENT_TYPE,
      },
      body: JSON.stringify(aquaPayload)
    });
    if(!response.ok) throw new Error("Error updating aquariums");
    return {...aquaPayload, id: aquaPayload.aquariumId};
}


