import { inserirAmigos } from './seedAmigos';

// Número de amigos a serem criados
const NUM_AMIGOS = 1000;

// Iniciar o processo de criação de amigos
console.log(`Iniciando a criação de ${NUM_AMIGOS} amigos...`);
inserirAmigos(NUM_AMIGOS)
  .then(() => {
    console.log('Processo concluído com sucesso!');
    process.exit(0);
  })
  .catch(error => {
    console.error('Erro ao executar script de seed:', error);
    process.exit(1);
  });