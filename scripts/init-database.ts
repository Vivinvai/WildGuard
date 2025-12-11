import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import ws from "ws";
import { neonConfig } from '@neondatabase/serverless';
import * as schema from "../shared/schema.js";

neonConfig.webSocketConstructor = ws;

const DATABASE_URL = process.env.DATABASE_URL || "postgresql://postgres:pokemon1234@localhost:5432/Wild_Guard_DB";

async function initDatabase() {
  console.log("🔌 Connecting to database...");
  console.log("Database URL:", DATABASE_URL.replace(/:[^:]*@/, ':****@'));

  const pool = new Pool({ connectionString: DATABASE_URL });
  const db = drizzle({ client: pool, schema });

  try {
    // Test connection
    await pool.query("SELECT NOW()");
    console.log("✅ Database connection successful!");

    // Insert sample data
    console.log("\n📊 Inserting wildlife centers...");
    await db.insert(schema.wildlifeCenters).values(schema.wildlifeCentersData).onConflictDoNothing();
    console.log("✅ Wildlife centers inserted!");

    console.log("\n🌺 Inserting botanical gardens...");
    await db.insert(schema.botanicalGardens).values(schema.botanicalGardensData).onConflictDoNothing();
    console.log("✅ Botanical gardens inserted!");

    console.log("\n🤝 Inserting NGOs...");
    await db.insert(schema.ngos).values(schema.ngosData).onConflictDoNothing();
    console.log("✅ NGOs inserted!");

    console.log("\n🎉 Database initialization complete!");
    console.log("\n📋 Summary:");
    console.log(`  - ${schema.wildlifeCentersData.length} wildlife centers`);
    console.log(`  - ${schema.botanicalGardensData.length} botanical gardens`);
    console.log(`  - ${schema.ngosData.length} NGOs`);

  } catch (error) {
    console.error("❌ Error:", error);
    throw error;
  } finally {
    await pool.end();
  }
}

initDatabase();
