// Satellite habitat monitoring using NASA FIRMS API and simulated Sentinel-2 NDVI data
// Integrates real fire detection data from NASA for comprehensive habitat monitoring

const NASA_FIRMS_API_KEY = process.env.NASA_FIRMS_API_KEY || '';
const NASA_FIRMS_API_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv';

export interface SatelliteAnalysisResult {
  location: {
    name: string;
    latitude: number;
    longitude: number;
    area: string;
  };
  ndvi: {
    current: number;
    historical: { date: string; value: number }[];
    change: number;
    trend: "improving" | "stable" | "degrading";
  };
  deforestation: {
    detected: boolean;
    severity: "none" | "low" | "medium" | "high" | "critical";
    areaAffected: number; // in hectares
    changeDetected: string;
  };
  fires: {
    detected: boolean;
    count: number;
    recentFires: Array<{
      latitude: number;
      longitude: number;
      brightness: number;
      confidence: string;
      date: string;
    }>;
  };
  vegetation: {
    health: "excellent" | "good" | "fair" | "poor" | "critical";
    coveragePercent: number;
    forestDensity: string;
  };
  alerts: string[];
  recommendations: string[];
  lastUpdated: string;
}

// Real Karnataka protected areas with coordinates
const karnatakaProtectedAreas = [
  { name: "Bandipur National Park", lat: 11.6697, lon: 76.6957, area: "874 km²" },
  { name: "Nagarahole National Park", lat: 12.0000, lon: 76.1000, area: "643 km²" },
  { name: "BRT Tiger Reserve", lat: 11.9833, lon: 77.1333, area: "540 km²" },
  { name: "Bhadra Wildlife Sanctuary", lat: 13.5833, lon: 75.6667, area: "490 km²" },
  { name: "Kali Tiger Reserve", lat: 14.9000, lon: 74.5500, area: "834 km²" },
];

// Simulated NDVI calculation (would use real Sentinel-2 data in production)
function calculateNDVI(lat: number, lon: number): number {
  // Simulate NDVI based on location (dense forests have higher NDVI)
  // Real implementation would fetch from Google Earth Engine
  const baseNDVI = 0.65 + (Math.random() * 0.15);
  return parseFloat(baseNDVI.toFixed(3));
}

// Generate historical NDVI data (simulated)
function generateHistoricalNDVI(currentNDVI: number, months: number = 12): { date: string; value: number }[] {
  const data: { date: string; value: number }[] = [];
  const now = new Date();
  
  for (let i = months; i >= 0; i--) {
    const date = new Date(now);
    date.setMonth(date.getMonth() - i);
    
    // Simulate seasonal variation and trend
    const seasonalVariation = Math.sin((i / 12) * Math.PI * 2) * 0.05;
    const trend = (months - i) * 0.002; // Slight degradation trend
    const noise = (Math.random() - 0.5) * 0.03;
    
    const value = Math.max(0, Math.min(1, currentNDVI + seasonalVariation - trend + noise));
    
    data.push({
      date: date.toISOString().split('T')[0],
      value: parseFloat(value.toFixed(3)),
    });
  }
  
  return data;
}

// Fetch real fire data from NASA FIRMS API
async function fetchNASAFireData(
  lat: number,
  lon: number,
  days: number = 10
): Promise<any[]> {
  if (!NASA_FIRMS_API_KEY) {
    console.warn('NASA FIRMS API key not configured, using simulated data');
    return [];
  }

  try {
    // Define area of interest (1 degree box around location)
    const minLat = lat - 0.5;
    const maxLat = lat + 0.5;
    const minLon = lon - 0.5;
    const maxLon = lon + 0.5;

    // NASA FIRMS API endpoint
    const url = `${NASA_FIRMS_API_URL}/${NASA_FIRMS_API_KEY}/VIIRS_SNPP_NRT/${minLat},${minLon},${maxLat},${maxLon}/${days}`;
    
    console.log(`🛰️ Fetching NASA FIRMS fire data for area: ${lat},${lon}`);
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'WildGuard-Conservation-System/1.0'
      }
    });

    if (!response.ok) {
      console.error(`NASA FIRMS API error: ${response.status}`);
      return [];
    }

    const csvData = await response.text();
    
    // Parse CSV data
    const lines = csvData.trim().split('\n');
    if (lines.length <= 1) return []; // No fires detected
    
    const headers = lines[0].split(',');
    const fires = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const fireData: any = {};
      headers.forEach((header, index) => {
        fireData[header.trim()] = values[index]?.trim() || '';
      });
      fires.push(fireData);
    }
    
    console.log(`🔥 Found ${fires.length} fires in the area`);
    return fires;
    
  } catch (error) {
    console.error('Error fetching NASA FIRMS data:', error);
    return [];
  }
}

export async function analyzeSatelliteData(
  locationName?: string,
  latitude?: number,
  longitude?: number
): Promise<SatelliteAnalysisResult> {
  try {
    // Use provided location or default to a Karnataka protected area
    let location = karnatakaProtectedAreas[0];
    
    if (locationName) {
      const found = karnatakaProtectedAreas.find(
        area => area.name.toLowerCase().includes(locationName.toLowerCase())
      );
      if (found) location = found;
    } else if (latitude && longitude) {
      // Find nearest protected area
      let minDist = Infinity;
      karnatakaProtectedAreas.forEach(area => {
        const dist = Math.sqrt(
          Math.pow(area.lat - latitude, 2) + Math.pow(area.lon - longitude, 2)
        );
        if (dist < minDist) {
          minDist = dist;
          location = area;
        }
      });
    }

    const currentNDVI = calculateNDVI(location.lat, location.lon);
    const historicalData = generateHistoricalNDVI(currentNDVI);
    const previousNDVI = historicalData[historicalData.length - 6].value;
    const ndviChange = currentNDVI - previousNDVI;

    // Fetch real NASA fire data
    const nasaFires = await fetchNASAFireData(location.lat, location.lon, 10);
    const fireDetected = nasaFires.length > 0;
    
    // Process fire data
    const recentFires = nasaFires.slice(0, 10).map((fire: any) => ({
      latitude: parseFloat(fire.latitude || fire.lat),
      longitude: parseFloat(fire.longitude || fire.lon),
      brightness: parseFloat(fire.bright_ti4 || fire.brightness || 0),
      confidence: fire.confidence || 'unknown',
      date: fire.acq_date || new Date().toISOString().split('T')[0]
    }));

    // Determine vegetation health based on NDVI
    let vegHealth: "excellent" | "good" | "fair" | "poor" | "critical";
    if (currentNDVI > 0.7) vegHealth = "excellent";
    else if (currentNDVI > 0.6) vegHealth = "good";
    else if (currentNDVI > 0.4) vegHealth = "fair";
    else if (currentNDVI > 0.2) vegHealth = "poor";
    else vegHealth = "critical";

    // Deforestation detection
    const deforestationDetected = ndviChange < -0.05;
    let deforestationSeverity: "none" | "low" | "medium" | "high" | "critical";
    if (!deforestationDetected) deforestationSeverity = "none";
    else if (ndviChange > -0.1) deforestationSeverity = "low";
    else if (ndviChange > -0.15) deforestationSeverity = "medium";
    else if (ndviChange > -0.2) deforestationSeverity = "high";
    else deforestationSeverity = "critical";

    const areaAffected = deforestationDetected ? Math.abs(ndviChange) * 1000 : 0;

    // Generate alerts and recommendations
    const alerts: string[] = [];
    const recommendations: string[] = [];

    if (fireDetected) {
      alerts.push(`🔥 ${nasaFires.length} active fire(s) detected in area (NASA FIRMS data)`);
      const highConfidenceFires = nasaFires.filter((f: any) => 
        (f.confidence || '').toLowerCase() === 'high' || 
        parseFloat(f.bright_ti4 || f.brightness || 0) > 330
      );
      if (highConfidenceFires.length > 0) {
        alerts.push(`⚠️ ${highConfidenceFires.length} high-confidence fire alert(s)`);
      }
      recommendations.push("Immediate fire response team deployment recommended");
      recommendations.push("Monitor fire spread using real-time satellite data");
      recommendations.push("Evacuate wildlife if fires are spreading rapidly");
    }

    if (deforestationDetected) {
      alerts.push(`Vegetation loss detected: ${(Math.abs(ndviChange) * 100).toFixed(1)}% NDVI decrease`);
      alerts.push(`Estimated ${areaAffected.toFixed(1)} hectares affected`);
      recommendations.push("Conduct ground survey to verify satellite observations");
      recommendations.push("Investigate causes: illegal logging, encroachment, or natural factors");
    }

    if (currentNDVI < 0.5) {
      alerts.push("Vegetation health below optimal levels for dense forest");
      recommendations.push("Assess soil moisture and implement reforestation programs");
    }

    if (vegHealth === "excellent" || vegHealth === "good") {
      recommendations.push("Maintain current conservation practices");
      recommendations.push("Continue regular monitoring for early threat detection");
    }

    return {
      location: {
        name: location.name,
        latitude: location.lat,
        longitude: location.lon,
        area: location.area,
      },
      ndvi: {
        current: currentNDVI,
        historical: historicalData,
        change: parseFloat(ndviChange.toFixed(3)),
        trend: ndviChange > 0.02 ? "improving" : ndviChange < -0.02 ? "degrading" : "stable",
      },
      deforestation: {
        detected: deforestationDetected,
        severity: deforestationSeverity,
        areaAffected: parseFloat(areaAffected.toFixed(2)),
        changeDetected: deforestationDetected 
          ? `${(Math.abs(ndviChange) * 100).toFixed(1)}% vegetation loss over 6 months`
          : "No significant deforestation detected",
      },
      fires: {
        detected: fireDetected,
        count: nasaFires.length,
        recentFires: recentFires,
      },
      vegetation: {
        health: vegHealth,
        coveragePercent: parseFloat((currentNDVI * 100).toFixed(1)),
        forestDensity: currentNDVI > 0.65 ? "Dense" : currentNDVI > 0.45 ? "Moderate" : "Sparse",
      },
      alerts,
      recommendations,
      lastUpdated: new Date().toISOString(),
    };
  } catch (error) {
    console.error("Satellite analysis failed:", error);
    throw new Error("Failed to analyze satellite data: " + (error as Error).message);
  }
}
