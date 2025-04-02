import { pool } from "./server/db.js";

async function addFields() {
  console.log("Adicionando novos campos à tabela users...");

  try {
    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN IF NOT EXISTS about TEXT;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);

    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN IF NOT EXISTS review_count INTEGER DEFAULT 0;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);

    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN IF NOT EXISTS average_rating DOUBLE PRECISION DEFAULT 0;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);

    console.log("Campos adicionados com sucesso!");
  } catch (error) {
    console.error("Erro ao adicionar campos:", error);
  } finally {
    await pool.end();
  }
}

addFields().catch(console.error);