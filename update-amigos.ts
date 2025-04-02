import { pool } from './server/db.js';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { drizzle } from 'drizzle-orm/node-postgres';
import { users } from './shared/schema.js';
import { eq } from 'drizzle-orm';

// Lista de estilos de avatar para mais diversidade visual
const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral',
  'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'bottts-neutral',
  'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon',
  'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs',
  'notionists', 'notionists-neutral', 'open-peeps', 'personas',
  'pixel-art', 'pixel-art-neutral', 'shapes', 'thumbs'
];

// Lista de possíveis interesses
const possiveisInteresses = [
  'Esportes', 'Música', 'Gastronomia', 'Livros', 'Cinema', 'Viagens', 'Arte', 'Fotografia', 
  'Dança', 'Teatro', 'Tecnologia', 'Jogos', 'Natureza', 'Moda', 'História', 'Ciência',
  'Política', 'Economia', 'Yoga', 'Meditação', 'Culinária', 'Artesanato', 'Jardinagem',
  'Astronomia', 'Arquitetura', 'Psicologia', 'Filosofia', 'Idiomas', 'Investimentos'
];

async function atualizarAmigos() {
  const db = drizzle(pool);
  
  console.log('Atualizando informações dos amigos...');
  
  try {
    // Buscar todos os amigos
    const amigos = await db.select().from(users).where(eq(users.isAmigo, true));
    console.log(`Encontrados ${amigos.length} amigos para atualizar.`);
    
    // Atualizar cada amigo
    for (let i = 0; i < amigos.length; i += 50) {
      const lote = amigos.slice(i, i + 50);
      
      for (const amigo of lote) {
        // Gerar valores para os campos que faltam
        const perfilReviews = Math.random();
        let reviewCount: number;
        let averageRating: number;
        
        if (perfilReviews < 0.1) {
          // Novos (10%)
          reviewCount = 0;
          averageRating = 0;
        } else if (perfilReviews < 0.3) {
          // Poucas avaliações (20%)
          reviewCount = faker.helpers.rangeToNumber({ min: 1, max: 10 });
          averageRating = Number(faker.helpers.rangeToNumber({ min: 3.0, max: 5.0 }).toFixed(1));
        } else if (perfilReviews < 0.7) {
          // Médio número de avaliações (40%)
          reviewCount = faker.helpers.rangeToNumber({ min: 11, max: 50 });
          averageRating = Number(faker.helpers.rangeToNumber({ min: 3.5, max: 5.0 }).toFixed(1));
        } else if (perfilReviews < 0.9) {
          // Muitas avaliações (20%)
          reviewCount = faker.helpers.rangeToNumber({ min: 51, max: 150 });
          averageRating = Number(faker.helpers.rangeToNumber({ min: 4.0, max: 5.0 }).toFixed(1));
        } else {
          // Super populares (10%)
          reviewCount = faker.helpers.rangeToNumber({ min: 151, max: 500 });
          averageRating = Number(faker.helpers.rangeToNumber({ min: 4.5, max: 5.0 }).toFixed(1));
        }
        
        // Gerar texto sobre o amigo com mais personalidade
        let about = '';
        if (Math.random() < 0.85) { // 85% tem descrição detalhada
          const introducao = faker.helpers.arrayElement([
            "Olá! Sou uma pessoa",
            "Prazer em conhecê-lo! Me considero",
            "Bem-vindo ao meu perfil! Sou",
            "Oi! Sou uma pessoa que se define como",
            "Opa! Por aqui sou conhecido por ser"
          ]);
          
          const personalidade = faker.helpers.arrayElement([
            "extrovertida e animada", 
            "calma e observadora",
            "criativa e espontânea",
            "organizada e detalhista",
            "aventureira e descontraída",
            "intelectual e curiosa",
            "empática e acolhedora",
            "divertida e despreocupada",
            "séria e determinada",
            "pragmática e direta"
          ]);
          
          const hobby = faker.helpers.arrayElement(possiveisInteresses);
          
          const conclusao = faker.helpers.arrayElement([
            "Estou sempre em busca de novas experiências!",
            "Adoro conhecer pessoas novas e trocar experiências!",
            "Tenho muito a compartilhar e aprender com você!",
            "Vamos trocar ideias e criar memórias juntos!",
            "Meu objetivo é proporcionar momentos inesquecíveis!"
          ]);
          
          about = `${introducao} ${personalidade}. ${faker.lorem.paragraph(3)} Tenho grande paixão por ${hobby}. ${faker.lorem.paragraph(2)} ${conclusao}`;
        }
        
        // Escolher estilo de avatar aleatório para mais diversidade visual (alguns amigos)
        let avatar = amigo.avatar;
        if (Math.random() < 0.3) {
          const avatarStyle = faker.helpers.arrayElement(avatarStyles);
          const avatarSeed = faker.string.alphanumeric(10);
          avatar = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}`;
        }
        
        // Atualizar o amigo
        await db.update(users)
          .set({
            reviewCount,
            averageRating,
            about,
            avatar
          })
          .where(eq(users.id, amigo.id));
      }
      
      console.log(`Atualizados ${Math.min(i + 50, amigos.length)} de ${amigos.length} amigos.`);
    }
    
    console.log('Todos os amigos foram atualizados com sucesso!');
  } catch (error) {
    console.error('Erro ao atualizar amigos:', error);
  } finally {
    await pool.end();
  }
}

// Executar a atualização
atualizarAmigos().catch(console.error);