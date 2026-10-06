// Valores devem bater com NivelEnsinoEnum / EtapaEnsinoEnum do backend
export const ETAPAS_POR_NIVEL = {
  'Educação Básica': [
    'Educação Infantil',
    'Ensino Fundamental - Anos Iniciais',
    'Ensino Fundamental - Anos Finais',
    'Ensino Médio',
    'Educação de Jovens e Adultos (EJA)',
    'Educação Profissional Técnica'
  ],
  'Educação Superior': [
    'Graduação',
    'Pós-Graduação'
  ]
};

export const NIVEIS_ENSINO = Object.keys(ETAPAS_POR_NIVEL);
