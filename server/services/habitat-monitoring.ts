import type { InsertHabitatMonitoring } from "@shared/schema";

// NASA FIRMS (Fire Information for Resource Management System) API
// Note: Using VIIRS data for South Asia region
const FIRMS_API_KEY = process.env.FIRMS_API_KEY || "demo"; // Users can get free API key from NASA

interface FIRMSFireData {
  latitude: number;
  longitude: number;
  brightness: number;
  scan: number;
  track: number;
  acq_date: string;
  acq_time: string;
  satellite: string;
  confidence: string;
  version: string;
  bright_t31: number;
  frp: number; // Fire Radiative Power
  daynight: string;
}

interface HabitatHealthData {
  location: string;
  latitude: number;
  longitude: number;
  protectedArea: string;
  ndviValue: number;
  forestCoverPercentage: number;
  changeDetected: boolean;
  changePercentage: number | null;
  fireSeverity: "none" | "low" | "moderate" | "high" | "extreme";
  fireCount: number;
  vegetationHealth: "excellent" | "good" | "moderate" | "poor" | "critical";
  alerts: string[];
  recommendations: string[];
}

// Major protected areas in Karnataka with coordinates
export const karnatakaProtectedAreas = [
  {
    name: "Bandipur National Park",
    latitude: 11.7401,
    longitude: 76.5026,
    area: 874, // sq km
  },
  {
    name: "Nagarahole National Park",
    latitude: 12.0015,
    longitude: 76.0711,
    area: 848,
  },
  {
    name: "Bhadra Wildlife Sanctuary",
    latitude: 13.47,
    longitude: 75.6535,
    area: 492,
  },
  {
    name: "Kudremukh National Park",
    latitude: 13.1544,
    longitude: 75.5044,
    area: 600,
  },
  {
    name: "BRT Wildlife Sanctuary",
    latitude: 12.0667,
    longitude: 77.1167,
    area: 540,
  },
];

// Simulate NDVI (Normalized Difference Vegetation Index) calculation
// In production, this would use actual satellite imagery from Sentinel-2, Landsat, or MODIS
function calculateNDVI(area: string): number {
  // NDVI ranges from -1 to 1
  // Values > 0.6 indicate dense healthy vegetation
  // Values 0.2-0.6 indicate moderate vegetation
  // Values < 0.2 indicate sparse or no vegetation
  
  // Simulated NDVI based on protected area health (would be real satellite data in production)
  const baseNDVI = 0.65 + (Math.random() * 0.15); // Healthy forest baseline: 0.65-0.80
  const seasonalVariation = Math.random() * 0.05 - 0.025; // ±0.025 seasonal variation
  
  return Math.min(0.95, Math.max(0.3, baseNDVI + seasonalVariation));
}

// Calculate forest cover percentage based on NDVI
function calculateForestCover(ndvi: number): number {
  // High NDVI correlates with high forest cover
  if (ndvi > 0.7) return 90 + (ndvi - 0.7) * 50; // 90-95%
  if (ndvi > 0.6) return 80 + (ndvi - 0.6) * 100; // 80-90%
  if (ndvi > 0.4) return 60 + (ndvi - 0.4) * 100; // 60-80%
  return ndvi * 150; // Below 60%
}

// Detect vegetation change (would compare historical NDVI in production)
function detectVegetationChange(ndvi: number, historicalNDVI: number = 0.72): { detected: boolean; percentage: number | null } {
  const change = ((ndvi - historicalNDVI) / historicalNDVI) * 100;
  
  // Flag if more than 5% decrease in NDVI
  if (change < -5) {
    return { detected: true, percentage: change };
  }
  
  return { detected: false, percentage: null };
}

// Get vegetation health status
function getVegetationHealth(ndvi: number, fireCount: number): "excellent" | "good" | "moderate" | "poor" | "critical" {
  if (fireCount > 10) return "critical";
  if (fireCount > 5) return "poor";
  if (fireCount > 2) return "moderate";
  
  if (ndvi > 0.75) return "excellent";
  if (ndvi > 0.65) return "good";
  if (ndvi > 0.5) return "moderate";
  if (ndvi > 0.35) return "poor";
  return "critical";
}

// Classify fire severity based on Fire Radiative Power (FRP)
function classifyFireSeverity(fires: FIRMSFireData[]): "none" | "low" | "moderate" | "high" | "extreme" {
  if (fires.length === 0) return "none";
  
  const avgFRP = fires.reduce((sum, fire) => sum + fire.frp, 0) / fires.length;
  const maxFRP = Math.max(...fires.map(f => f.frp));
  
  if (maxFRP > 100 || avgFRP > 50) return "extreme";
  if (maxFRP > 50 || avgFRP > 30) return "high";
  if (maxFRP > 20 || avgFRP > 15) return "moderate";
  return "low";
}

// Fetch fire data from NASA FIRMS API
async function fetchFireData(latitude: number, longitude: number, radiusKm: number = 50): Promise<FIRMSFireData[]> {
  try {
    // NASA FIRMS API endpoint for VIIRS data
    // Real API: https://firms.modaps.eosdis.nasa.gov/api/area/csv/{MAP_KEY}/VIIRS_SNPP_NRT/{LAT},{LON}/{radiusKm}/{dayRange}
    const dayRange = 7; // Last 7 days
    const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${FIRMS_API_KEY}/VIIRS_SNPP_NRT/${latitude},${longitude}/${radiusKm}/${dayRange}`;
    
    // For demo purposes, if API key is "demo", return simulated data
    if (FIRMS_API_KEY === "demo") {
      return generateSimulatedFireData(latitude, longitude, radiusKm);
    }
    
    const response = await fetch(url);
    if (!response.ok) {
      console.warn("FIRMS API request failed, using simulated data");
      return generateSimulatedFireData(latitude, longitude, radiusKm);
    }
    
    const csvText = await response.text();
    return parseFireDataCSV(csvText);
  } catch (error) {
    console.error("Error fetching fire data:", error);
    return generateSimulatedFireData(latitude, longitude, radiusKm);
  }
}

// Parse CSV response from FIRMS API
function parseFireDataCSV(csvText: string): FIRMSFireData[] {
  const lines = csvText.trim().split('\n');
  if (lines.length <= 1) return [];
  
  const headers = lines[0].split(',');
  const fires: FIRMSFireData[] = [];
  
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',');
    const fire: any = {};
    
    headers.forEach((header, index) => {
      fire[header.trim()] = values[index]?.trim();
    });
    
    fires.push({
      latitude: parseFloat(fire.latitude),
      longitude: parseFloat(fire.longitude),
      brightness: parseFloat(fire.brightness),
      scan: parseFloat(fire.scan),
      track: parseFloat(fire.track),
      acq_date: fire.acq_date,
      acq_time: fire.acq_time,
      satellite: fire.satellite,
      confidence: fire.confidence,
      version: fire.version,
      bright_t31: parseFloat(fire.bright_t31),
      frp: parseFloat(fire.frp),
      daynight: fire.daynight,
    });
  }
  
  return fires;
}

// Generate simulated fire data for demonstration
function generateSimulatedFireData(latitude: number, longitude: number, radiusKm: number): FIRMSFireData[] {
  // Randomly generate 0-3 fires within the radius
  const fireCount = Math.floor(Math.random() * 4);
  const fires: FIRMSFireData[] = [];
  
  for (let i = 0; i < fireCount; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const distance = Math.random() * radiusKm;
    
    // Convert distance to lat/long offset (rough approximation)
    const latOffset = (distance / 111) * Math.cos(angle);
    const lonOffset = (distance / (111 * Math.cos(latitude * Math.PI / 180))) * Math.sin(angle);
    
    fires.push({
      latitude: latitude + latOffset,
      longitude: longitude + lonOffset,
      brightness: 320 + Math.random() * 50,
      scan: 0.4,
      track: 0.4,
      acq_date: new Date().toISOString().split('T')[0],
      acq_time: "1430",
      satellite: "N",
      confidence: ["nominal", "high"][Math.floor(Math.random() * 2)],
      version: "2.0NRT",
      bright_t31: 290 + Math.random() * 20,
      frp: 5 + Math.random() * 40, // Fire Radiative Power
      daynight: "D",
    });
  }
  
  return fires;
}

// Generate alerts and recommendations
function generateAlertsAndRecommendations(
  ndvi: number,
  fireCount: number,
  fireSeverity: string,
  changeDetected: boolean,
  changePercentage: number | null
): { alerts: string[]; recommendations: string[] } {
  const alerts: string[] = [];
  const recommendations: string[] = [];
  
  // Fire alerts
  if (fireCount > 0) {
    alerts.push(`${fireCount} active fire(s) detected in the region (severity: ${fireSeverity})`);
    recommendations.push("Deploy forest rangers for fire investigation and monitoring");
    recommendations.push("Alert nearby wildlife rescue teams for potential animal displacement");
  }
  
  if (fireSeverity === "extreme" || fireSeverity === "high") {
    alerts.push("HIGH PRIORITY: Extreme fire activity detected - immediate response required");
    recommendations.push("Mobilize firefighting resources immediately");
    recommendations.push("Establish wildlife evacuation corridors");
    recommendations.push("Coordinate with state forest department for aerial surveillance");
  }
  
  // Vegetation alerts
  if (changeDetected && changePercentage && changePercentage < -10) {
    alerts.push(`Significant vegetation loss detected: ${Math.abs(changePercentage).toFixed(1)}% decrease in NDVI`);
    recommendations.push("Investigate potential deforestation or habitat degradation causes");
    recommendations.push("Conduct ground survey to assess damage extent");
  }
  
  if (ndvi < 0.5) {
    alerts.push("Low vegetation health index - possible habitat degradation");
    recommendations.push("Initiate reforestation programs in degraded areas");
    recommendations.push("Assess impact on wildlife populations");
  }
  
  // General recommendations
  if (ndvi > 0.7 && fireCount === 0) {
    recommendations.push("Maintain current conservation practices");
    recommendations.push("Continue regular monitoring and patrolling");
  }
  
  return { alerts, recommendations };
}

// Main function to monitor habitat health
export async function monitorHabitatHealth(
  location: string,
  latitude: number,
  longitude: number,
  protectedArea?: string
): Promise<HabitatHealthData> {
  try {
    // Fetch fire data from NASA FIRMS
    const fires = await fetchFireData(latitude, longitude, 50);
    
    // Calculate NDVI (would use real satellite data in production)
    const ndviValue = calculateNDVI(location);
    
    // Calculate forest cover
    const forestCoverPercentage = calculateForestCover(ndviValue);
    
    // Detect vegetation change
    const { detected: changeDetected, percentage: changePercentage } = detectVegetationChange(ndviValue);
    
    // Classify fire severity
    const fireSeverity = classifyFireSeverity(fires);
    
    // Get vegetation health status
    const vegetationHealth = getVegetationHealth(ndviValue, fires.length);
    
    // Generate alerts and recommendations
    const { alerts, recommendations } = generateAlertsAndRecommendations(
      ndviValue,
      fires.length,
      fireSeverity,
      changeDetected,
      changePercentage
    );
    
    return {
      location,
      latitude,
      longitude,
      protectedArea: protectedArea || "Karnataka Region",
      ndviValue,
      forestCoverPercentage,
      changeDetected,
      changePercentage,
      fireSeverity,
      fireCount: fires.length,
      vegetationHealth,
      alerts,
      recommendations,
    };
  } catch (error) {
    console.error("Habitat monitoring error:", error);
    throw new Error("Failed to monitor habitat health");
  }
}

// Get all protected areas status
export async function getAllProtectedAreasStatus(): Promise<HabitatHealthData[]> {
  const results = await Promise.all(
    karnatakaProtectedAreas.map(area =>
      monitorHabitatHealth(area.name, area.latitude, area.longitude, area.name)
    )
  );
  return results;
}
