// Free iNaturalist API integration for species information
// No API key required for read-only access
// Rate limit: 100 requests/minute (aim for 60/min)

export interface TaxonInfo {
  id: number;
  name: string;
  rank: string;
  commonName: string | null;
  conservationStatus: string | null;
  wikipediaUrl: string | null;
  photoUrl: string | null;
}

const API_BASE = "https://api.inaturalist.org/v1";

export async function searchSpeciesByName(query: string): Promise<TaxonInfo[]> {
  try {
    const response = await fetch(
      `${API_BASE}/taxa?q=${encodeURIComponent(query)}&rank=species&per_page=10`
    );
    
    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.status}`);
    }

    const data = await response.json();
    
    return data.results.map((taxon: any) => ({
      id: taxon.id,
      name: taxon.name,
      rank: taxon.rank,
      commonName: taxon.preferred_common_name || null,
      conservationStatus: taxon.conservation_status?.status || null,
      wikipediaUrl: taxon.wikipedia_url || null,
      photoUrl: taxon.default_photo?.medium_url || null,
    }));
  } catch (error) {
    console.error("iNaturalist search failed:", error);
    return [];
  }
}

export async function getSpeciesInfo(taxonId: number): Promise<TaxonInfo | null> {
  try {
    const response = await fetch(`${API_BASE}/taxa/${taxonId}`);
    
    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.status}`);
    }

    const data = await response.json();
    const taxon = data.results[0];

    return {
      id: taxon.id,
      name: taxon.name,
      rank: taxon.rank,
      commonName: taxon.preferred_common_name || null,
      conservationStatus: taxon.conservation_status?.status || null,
      wikipediaUrl: taxon.wikipedia_url || null,
      photoUrl: taxon.default_photo?.medium_url || null,
    };
  } catch (error) {
    console.error("iNaturalist taxon fetch failed:", error);
    return null;
  }
}

export async function getObservationsNearLocation(
  lat: number,
  lng: number,
  radius: number = 50
): Promise<any[]> {
  try {
    const response = await fetch(
      `${API_BASE}/observations?lat=${lat}&lng=${lng}&radius=${radius}&per_page=20&has[]=photos&quality_grade=research`
    );
    
    if (!response.ok) {
      throw new Error(`iNaturalist API error: ${response.status}`);
    }

    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error("iNaturalist observations fetch failed:", error);
    return [];
  }
}
