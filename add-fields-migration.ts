import { pool } from './server/db.js';
import { drizzle } from 'drizzle-orm/node-postgres';

async function addFields() {
  const db = drizzle(pool);
  
  console.log('Adicionando novos campos à tabela users...');
  
  try {
    // Adicionando campo about se não existir
    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN about TEXT;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);
    
    // Adicionando campo review_count se não existir
    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN review_count INTEGER DEFAULT 0;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);
    
    // Adicionando campo average_rating se não existir
    await pool.query(`
      DO $$ 
      BEGIN 
        BEGIN
          ALTER TABLE users ADD COLUMN average_rating DOUBLE PRECISION DEFAULT 0;
        EXCEPTION
          WHEN duplicate_column THEN NULL;
        END;
      END $$;
    `);
    
    console.log('Campos adicionados com sucesso!');
  } catch (error) {
    console.error('Erro ao adicionar campos:', error);
  } finally {
    await pool.end();
  }
}

// Executar a migração
addFields().catch(console.error);