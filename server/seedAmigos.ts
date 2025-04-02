import { pool } from './db';
import { faker } from '@faker-js/faker/locale/pt_BR';
import { users } from '../shared/schema';
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
  'Camping', 'Pesca', 'Stand-up Comedy', 'Festivais', 'Bares', 'Baladas'
];

// Gerar um perfil de amigo
function gerarAmigo(): AmigoData {
  // Selecionar estado e cidade aleatoriamente
  const estado = faker.helpers.arrayElement(Object.keys(cidadesPorEstado));
  const cidade = faker.helpers.arrayElement(cidadesPorEstado[estado]);
  const location = `${cidade}, ${estado}`;
  
  // Selecionar interesses aleatoriamente (entre 3 a 8 interesses)
  const numInteresses = faker.helpers.rangeToNumber({ min: 3, max: 8 });
  const interests = faker.helpers.arrayElements(possiveisInteresses, numInteresses);
  
  // Determinar se é um amigo verificado (com probabilidade alta)
  const isVerified: boolean = Math.random() < 0.85; // 85% de chance de ser verificado
  
  // Gerar preço por hora (entre 30 e 200 reais)
  const hourlyRate = faker.helpers.rangeToNumber({ min: 30, max: 200 });
  
  // Gerar número de avaliações (entre 0 e 120)
  const reviewCount = faker.helpers.rangeToNumber({ min: 0, max: 120 });
  
  // Gerar média de avaliações (entre 3.5 e 5.0)
  const averageRating = reviewCount === 0 
    ? 0 
    : Number(faker.helpers.rangeToNumber({ min: 3.5, max: 5.0 }).toFixed(1));
  
  // Gerar texto sobre o amigo
  const about = faker.helpers.maybe(
    () => faker.lorem.paragraphs({ min: 2, max: 4 }),
    { probability: 0.7 }
  ) || '';
  
  // Montar o objeto final
  return {
    name: faker.person.fullName(),
    email: faker.internet.email().toLowerCase(),
    password: faker.internet.password(),
    bio: faker.lorem.sentence({ min: 10, max: 25 }),
    avatar: `https://i.pravatar.cc/300?u=${faker.string.uuid()}`,
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

// Função para inserir os amigos no banco de dados
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

// Verificar se o script está sendo executado diretamente
if (require.main === module) {
  // Executar com o número desejado de amigos (padrão: 1000)
  const numAmigos = parseInt(process.argv[2]) || 1000;
  inserirAmigos(numAmigos).catch(console.error);
}

export { inserirAmigos };