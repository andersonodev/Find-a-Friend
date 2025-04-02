import { pool } from './server/db.js';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { users } from './shared/schema.js';
import { drizzle } from 'drizzle-orm/node-postgres';

// Configure faker
faker.seed(123);

// Interface para tipo de amigo
interface AmigoData {
  name: string;
  email: string;
  password: string;
  bio: string;
  avatar: string;
  location: string;
  interests: string[];
  isAmigo: boolean;
  isVerified: boolean;
  hourlyRate: number;
  about: string;
  reviewCount: number;
  averageRating: number;
}

// Listas de cidades brasileiras por estado
const cidadesPorEstado: Record<string, string[]> = {
  'São Paulo': ['São Paulo', 'Campinas', 'Santos', 'Ribeirão Preto', 'São José dos Campos', 'Sorocaba', 'Osasco', 'Guarulhos'],
  'Rio de Janeiro': ['Rio de Janeiro', 'Niterói', 'Petrópolis', 'Nova Iguaçu', 'Duque de Caxias', 'Campos dos Goytacazes', 'Volta Redonda'],
  'Minas Gerais': ['Belo Horizonte', 'Uberlândia', 'Juiz de Fora', 'Contagem', 'Montes Claros', 'Poços de Caldas', 'Uberaba'],
  'Bahia': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Ilhéus', 'Porto Seguro', 'Camaçari', 'Juazeiro'],
  'Paraná': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa', 'Cascavel', 'Foz do Iguaçu'],
  'Rio Grande do Sul': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas', 'Santa Maria', 'Gramado', 'Novo Hamburgo'],
  'Pernambuco': ['Recife', 'Olinda', 'Jaboatão dos Guararapes', 'Caruaru', 'Petrolina', 'Paulista'],
  'Ceará': ['Fortaleza', 'Juazeiro do Norte', 'Sobral', 'Caucaia', 'Maracanaú'],
  'Pará': ['Belém', 'Santarém', 'Marabá', 'Ananindeua', 'Castanhal'],
  'Santa Catarina': ['Florianópolis', 'Joinville', 'Blumenau', 'Balneário Camboriú', 'Chapecó', 'Criciúma']
};

// Lista de possíveis interesses
const possiveisInteresses = [
  'Esportes', 'Música', 'Gastronomia', 'Livros', 'Cinema', 'Viagens', 'Arte', 'Fotografia', 
  'Dança', 'Teatro', 'Tecnologia', 'Jogos', 'Natureza', 'Moda', 'História', 'Ciência',
  'Política', 'Economia', 'Yoga', 'Meditação', 'Culinária', 'Artesanato', 'Jardinagem',
  'Astronomia', 'Arquitetura', 'Psicologia', 'Filosofia', 'Idiomas', 'Investimentos',
  'Empreendedorismo', 'Voluntariado', 'Sustentabilidade', 'Cultura Pop', 'Séries',
  'Pets', 'Fitness', 'Nutrição', 'Ativismo', 'Religião', 'Astrologia', 'Carros',
  'Motos', 'Ciclismo', 'Corrida', 'Natação', 'Surf', 'Skate', 'Montanhismo',
  'Camping', 'Pesca', 'Stand-up Comedy', 'Festivais', 'Bares', 'Baladas',
  'Pintura', 'Desenho', 'Escultura', 'Cerâmica', 'Tricô', 'Crochê', 'Costura',
  'DIY', 'Marcenaria', 'Escrita Criativa', 'Poesia', 'Caligrafia', 'Degustação de Vinhos',
  'Cerveja Artesanal', 'Cocktails', 'Xadrez', 'Pôquer', 'Jogos de Tabuleiro', 'RPG',
  'Mangá', 'Anime', 'Cosplay', 'K-pop', 'Instrumentos Musicais', 'Canto', 'Karaokê',
  'Futebol', 'Vôlei', 'Basquete', 'Tênis', 'Golfe', 'Escalada', 'Trilhas',
  'Observação de Aves', 'Astronomia Amadora', 'Meteorologia', 'Geologia', 'Botânica',
  'Horta Urbana', 'Compostagem', 'Energia Renovável', 'Reciclagem', 'Minimalismo',
  'Decoração', 'Feng Shui', 'Tarô', 'Astrologia', 'Magia', 'Espiritualidade',
  'Meditação Guiada', 'Reiki', 'Shiatsu', 'Acupuntura', 'Yoga Kundalini', 'Tantra',
  'Massagem', 'Ayurveda', 'Coaching', 'Desenvolvimento Pessoal', 'Liderança',
  'Oratória', 'Debate', 'História Mundial', 'Mitologia', 'Arqueologia', 'Antropologia',
  'Sociologia', 'Psicologia Social', 'Linguística', 'Línguas Estrangeiras'
];

// Lista de estilos de avatar para mais diversidade visual
const avatarStyles = [
  'adventurer', 'adventurer-neutral', 'avataaars', 'avataaars-neutral',
  'big-ears', 'big-ears-neutral', 'big-smile', 'bottts', 'bottts-neutral',
  'croodles', 'croodles-neutral', 'fun-emoji', 'icons', 'identicon',
  'initials', 'lorelei', 'lorelei-neutral', 'micah', 'miniavs',
  'notionists', 'notionists-neutral', 'open-peeps', 'personas',
  'pixel-art', 'pixel-art-neutral', 'shapes', 'thumbs'
];

// Gerar um perfil de amigo
function gerarAmigo(): AmigoData {
  // Selecionar estado e cidade aleatoriamente
  const estado = faker.helpers.arrayElement(Object.keys(cidadesPorEstado));
  const cidade = faker.helpers.arrayElement(cidadesPorEstado[estado]);
  const location = `${cidade}, ${estado}`;
  
  // Selecionar interesses aleatoriamente (entre 3 a 10 interesses)
  const numInteresses = faker.helpers.rangeToNumber({ min: 3, max: 10 });
  const interests = faker.helpers.arrayElements(possiveisInteresses, numInteresses);
  
  // Determinar se é um amigo verificado (com probabilidade alta)
  const isVerified: boolean = Math.random() < 0.85; // 85% de chance de ser verificado
  
  // Definir faixa de preço baseada em um perfil
  let hourlyRate: number;
  const perfilPreco = Math.random();
  if (perfilPreco < 0.2) {
    // Preço baixo (20%)
    hourlyRate = faker.helpers.rangeToNumber({ min: 25, max: 50 });
  } else if (perfilPreco < 0.7) {
    // Preço médio (50%)
    hourlyRate = faker.helpers.rangeToNumber({ min: 51, max: 120 });
  } else if (perfilPreco < 0.95) {
    // Preço alto (25%)
    hourlyRate = faker.helpers.rangeToNumber({ min: 121, max: 200 });
  } else {
    // Preço premium (5%)
    hourlyRate = faker.helpers.rangeToNumber({ min: 201, max: 350 });
  }
  
  // Distribuição de avaliações baseada em perfil
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
    
    const hobby = faker.helpers.arrayElement(interests);
    
    const conclusao = faker.helpers.arrayElement([
      "Estou sempre em busca de novas experiências!",
      "Adoro conhecer pessoas novas e trocar experiências!",
      "Tenho muito a compartilhar e aprender com você!",
      "Vamos trocar ideias e criar memórias juntos!",
      "Meu objetivo é proporcionar momentos inesquecíveis!"
    ]);
    
    about = `${introducao} ${personalidade}. ${faker.lorem.paragraph(3)} Tenho grande paixão por ${hobby}. ${faker.lorem.paragraph(2)} ${conclusao}`;
  }
  
  // Escolher estilo de avatar aleatório para mais diversidade visual
  const avatarStyle = faker.helpers.arrayElement(avatarStyles);
  const avatarSeed = faker.string.alphanumeric(10);
  const avatar = `https://api.dicebear.com/7.x/${avatarStyle}/svg?seed=${avatarSeed}`;
  
  // Montar o objeto final
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    bio: faker.lorem.sentence({ min: 10, max: 25 }),
    avatar,
    location,
    interests,
    isAmigo: true,
    isVerified,
    hourlyRate,
    about,
    reviewCount,
    averageRating
  };
}

// Função principal para inserir os amigos no banco de dados
async function inserirAmigos(quantidade: number) {
  console.log(`Iniciando geração de ${quantidade} amigos...`);
  
  // Criar conexão com o banco de dados
  const db = drizzle(pool);
  
  try {
    // Gerar amigos
    const amigosGerados: AmigoData[] = [];
    for (let i = 0; i < quantidade; i++) {
      amigosGerados.push(gerarAmigo());
      
      // Mostrar progresso a cada 50 amigos
      if ((i + 1) % 50 === 0) {
        console.log(`Gerados ${i + 1} amigos...`);
      }
    }
    
    console.log('Todos os amigos foram gerados. Iniciando inserção no banco de dados...');
    
    // Inserir no banco em lotes de 50 para não sobrecarregar
    const loteSize = 50;
    for (let i = 0; i < amigosGerados.length; i += loteSize) {
      const loteAtual = amigosGerados.slice(i, i + loteSize);
      
      // Inserir lote no banco
      await db.insert(users).values(
        loteAtual.map(amigo => ({
          email: amigo.email,
          username: amigo.email.split('@')[0],
          password: amigo.password, // Em produção deveria ser hash
          name: amigo.name,
          bio: amigo.bio,
          avatar: amigo.avatar,
          location: amigo.location,
          interests: amigo.interests,
          isAmigo: amigo.isAmigo,
          isVerified: amigo.isVerified,
          hourlyRate: amigo.hourlyRate,
          about: amigo.about,
          reviewCount: amigo.reviewCount,
          averageRating: amigo.averageRating
        }))
      );
      
      console.log(`Inseridos ${Math.min(i + loteSize, amigosGerados.length)} amigos de ${amigosGerados.length}`);
    }
    
    console.log('Processo de geração e inserção de amigos concluído com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir amigos:', error);
  } finally {
    // Garantir que a conexão seja fechada
    await pool.end();
  }
}

// Executar o processo
console.log('Iniciando a inserção de 300 amigos...');
inserirAmigos(300)
  .then(() => {
    console.log('Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro ao executar script de seed:', error);
    process.exit(1);
  });