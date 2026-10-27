/**
 * Script para gerar e anexar 32 novas pílulas de saúde diária (Dias 33 a 64)
 * com rigor médico, temas originais e dados sincronizados.
 */

const fs = require('fs');
const path = require('path');

const JSON_PATH = path.join(__dirname, '..', 'conteudo_diario.json');
const JS_PATH = path.join(__dirname, '..', 'conteudo_diario_data.js');

const novasDicas = [
  {
    dia: 33,
    dia_semana: "Edição #33",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Otimize suas Usinas Celulares com Coenzima Q10!",
      habito_descricao: "A partir dos 30 anos, nossa produção endógena de Coenzima Q10 cai progressivamente. Praticar exercícios regulares e ingerir gorduras nobres potencializa a bioenergética mitocondrial e previne a fadiga crônica.",
      nutriente_nome: "Coenzima Q10 (Ubiquinol)",
      nutriente_tipo: "Antioxidante Mitocondrial Vital",
      o_que_faz: "Transporta elétrons na cadeia respiratória mitocondrial para gerar ATP e protege os lipídios celulares contra peroxidação oxidativa.",
      fontes_alimentares: "Sardinhas, cavala, carne bovina de pasto, espinafre, brócolis, nozes e sementes de gergelim.",
      orientacao_medica: "Pacientes em uso de estatinas frequentemente apresentam depleção de CoQ10 e se beneficiam de reposição médica personalizada.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Alopecia Androgenética: Identifique os Primeiros Sinais",
      descricao: "A calvície de padrão feminino e masculino decorre da sensibilidade folicular à di-hidrotestosterona (DHT), provocando afinamento progressivo dos fios.",
      destaque_texto: "Alargamento da risca média do cabelo, rarefação nas entradas e perda de espessura indicam miniaturização folicular ativa.",
      orientacao_medica: "Quanto mais cedo iniciada a terapia médica com moduladores hormonais e bioestímulo capilar, maior a preservação da densidade.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Bioestimulador de PLLA (Sculptra) para Firmeza Tecidual",
      descricao: "O ácido poli-L-lático estimula a produção endógena de colágeno tipo 1 e tipo 3 pelos fibroblastos sem conferir volume artificial.",
      destaque_texto: "Restaura a ancoragem e densidade dérmica com efeito gradativo, alcançando o ápice biológico entre 60 e 90 dias após a aplicação.",
      orientacao_medica: "A massagem pós-procedimento e a manutenção da hidratação celular são indispensáveis para distribuição uniforme do produto.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 34,
    dia_semana: "Edição #34",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Combata a Glicação com Ácido Alfa-Lipóico!",
      habito_descricao: "Evite assados excessivamente tostados ou frituras que concentram compostos de Maillard. O Ácido Alfa-Lipóico atua como um potente reciclador dos antioxidantes clássicos no organismo.",
      nutriente_nome: "Ácido Alfa-Lipóico (ALA)",
      nutriente_tipo: "Antioxidante Universal Anfipático",
      o_que_faz: "Age tanto em meio aquoso quanto lipídico no citosol, reciclando vitaminas C e E, glutationa e melhorando a sensibilidade celular à insulina.",
      fontes_alimentares: "Espinafre, brócolis, tomate, couve-de-bruxelas, fígado e levedura nutricional.",
      orientacao_medica: "Excelente coadjuvante no manejo da neuropatia periférica e na prevenção do envelhecimento precoce de vasos e nervos.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Miliária ('Brotoeja') no Calor: Como Evitar a Obstrução",
      descricao: "Em ambientes úmidos e quentes, os ductos das glândulas sudoríparas écrinas podem ocluir, gerando microvesículas e ardência na pele.",
      destaque_texto: "Prefira tecidos 100% algodão leves, evite hidratantes pesados em dobras e tome banhos frescos imediatos pós-treino.",
      orientacao_medica: "Corticoides potentes de uso indiscriminado agravam a oclusão sudorípara e devem ser evitados na miliária.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Polidesoxirribonucleotídeo (PDRN de Salmão) na Biorregeneração",
      descricao: "Frações nobres de DNA purificado de salmão estimulam os receptores de adenosina A2A, promovendo reparo dérmico e angiogênese fisiológica.",
      destaque_texto: "Acelera a regeneração de peles com cicatrizes de acne, melasma refratário e afinamento periorbital com zero efeito 'pillow face'.",
      orientacao_medica: "Protocolo médico minimamente invasivo de alta compatibilidade biológica com resultados cumulativos excepcionais.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 35,
    dia_semana: "Edição #35",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Estimule a Biogênese Mitocondrial com PQQ!",
      habito_descricao: "Inclua alimentos ricos em polifenóis na primeira refeição. O PQQ (Pirroloquinolina Quinona) é um dos raros compostos capazes de acionar genes que geram novas mitocôndrias nas células humanas.",
      nutriente_nome: "PQQ (Pirroloquinolina Quinona)",
      nutriente_tipo: "Fator de Biogênese Celular",
      o_que_faz: "Ativa a proteína PGC-1alfa, estimulando a multiplicação de mitocôndrias saudáveis e protegendo contra o declínio cognitivo associado à idade.",
      fontes_alimentares: "Natto (soja fermentada), salsa fresca, chá verde, kiwi, mamão papaia e pimentão verde.",
      orientacao_medica: "A combinação sinérgica de PQQ com Coenzima Q10 maximiza a clareza mental e a tolerância ao estresse diário.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Ceratose Pilar ('Pele de Galinha' nos Braços): Causas e Alívio",
      descricao: "A hiperqueratinização folicular genética acumula queratina na saída dos poros, criando pequenas bolinhas ásperas nos braços e coxas.",
      destaque_texto: "Nunca esprema ou esfregue buchas vegetais ásperas. Use loções com ureia a 10% ou ácido lático para afinamento suave.",
      orientacao_medica: "A esfoliação mecânica abrasiva provoca hipercromia pós-inflamatória permanente. O tratamento deve ser químico e emoliente.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Skinbooster com Ácido Hialurônico Reticulado Suave",
      descricao: "Microgotas de ácido hialurônico de baixa densidade aplicadas na derme média restauram o reservatório hídrico profundo que cremes não alcançam.",
      destaque_texto: "Confere viço luminoso imediato e atenua o craquelamento fino das bochechas, pescoço e colo sem alterar a anatomia natural.",
      orientacao_medica: "Ideal para preparar a derme para estações secas ou reverter o ressecamento decorrente de voos e ar condicionado constante.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 36,
    dia_semana: "Edição #36",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Modulação Anti-inflamatória com Cúrcuma e Pimenta-preta!",
      habito_descricao: "Adicione uma colher de cúrcuma com uma pitada de pimenta-preta moída e azeite no almoço. A piperina aumenta a biodisponibilidade da curcumina em até 2.000% no trato digestivo.",
      nutriente_nome: "Curcumina Ativa (Polifenol Nobre)",
      nutriente_tipo: "Regulador Fitoquímico Anti-inflamatório",
      o_que_faz: "Inibe a via inflamatória nuclear NF-kB, reduzindo interleucinas inflamatórias (IL-6 e TNF-alfa) que aceleram a degradação articular e cutânea.",
      fontes_alimentares: "Raiz de cúrcuma fresca ou em pó puro, combinada obrigatoriamente a gordura boa (azeite/coco) e pimenta-preta.",
      orientacao_medica: "Excelente para modular o 'inflammaging', a inflamação silenciosa que desgasta o colágeno profundo.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Pitiríase Versicolor ('Pano Branco'): Entenda o Fungo Natural",
      descricao: "A levedura Malassezia faz parte da microbiota normal da pele, mas prolifera em excesso com suor, calor e óleos corporais oclusivos.",
      destaque_texto: "Manchas claras, descamativas ou avermelhadas no tronco exigem xampus medicinais antifúngicos e roupas arejadas.",
      orientacao_medica: "A cor normal da pele demora semanas para retornar após a eliminação do fungo. Não se exponha ao sol achando que 'queima' a mancha.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Microagulhamento Robótico com Radiofrequência",
      descricao: "Microagulhas banhadas a ouro penetram na profundidade exata da derme emitindo calor fracionado, coagulando microzonas e estimulando colágeno.",
      destaque_texto: "Tratamento de precisão para fechamento de poros dilatados, atenuação de cicatrizes de acne e retração de flacidez dérmica.",
      orientacao_medica: "A via estéril de microcanais permite o 'drug delivery' seguro de fatores de crescimento e antioxidantes na mesma sessão.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 37,
    dia_semana: "Edição #37",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Fortaleça sua Glutationa com Alimentos Sulfurados!",
      habito_descricao: "Inclua alho cru picado, cebola roxa e brócolis cozido no vapor diariamente. O enxofre biodisponível alimenta a síntese do maior antioxidante intracelular do corpo humano.",
      nutriente_nome: "N-Acetilcisteína (NAC)",
      nutriente_tipo: "Precursor Direto da Glutationa",
      o_que_faz: "Fornece cisteína biodisponível para a síntese da glutationa hepática, neutraliza metabólitos tóxicos e fluidifica secreções mucosas.",
      fontes_alimentares: "Ovos caipiras, sementes de girassol, alho, cebola, lentilhas, iogurte natural e vegetais crucíferos.",
      orientacao_medica: "A suplementação de NAC supervisionada apoia a desintoxicação celular e combate a oxidação do folículo piloso.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Lentigos Solares nas Costas e Ombros: Histórico de Queimaduras",
      descricao: "Pequenas manchas castanhas múltiplas na parte superior das costas e ombros revelam episódios de queimadura solar ocorridos na infância e juventude.",
      destaque_texto: "Indicador clínico de dano acumulado no DNA dos melanócitos. Exige mapeamento dermatoscópico semestral das lesões suspeitas.",
      orientacao_medica: "Diferenciar lentigo solar benigno de lentigo maligno precoce só é possível com dermatoscópio de luz polarizada.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Peeling de Retinol: Renovação Cutânea sem Efeito Rebote",
      descricao: "A aplicação clínica de ácido retinóico estabilizado acelera o turnover celular epidérmico, uniformizando o tom e a textura da pele.",
      destaque_texto: "Promove descamação fina e controlada a partir do terceiro dia, revelando uma epiderme rejuvenescida, clara e com viço renovado.",
      orientacao_medica: "O uso rigoroso de protetor solar físico com cor mineral nos 15 dias subsequentes é mandatório para evitar manchas solares.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 38,
    dia_semana: "Edição #38",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Cuide da Barreira Intestinal para uma Pele sem Acne!",
      habito_descricao: "Beba caldos de ossos caseiros ou consuma fontes de glutamina. A permeabilidade intestinal aumentada ('leaky gut') dispara citocinas inflamatórias que agravam acne e rosácea na face.",
      nutriente_nome: "L-Glutamina",
      nutriente_tipo: "Aminoácido Trófico Enterocitário",
      o_que_faz: "Serve como combustível primordial para a regeneração rápida dos enterócitos e linfócitos da mucosa intestinal, selando as junções oclusivas.",
      fontes_alimentares: "Carne bovina, peixes, ovos, queijo cottage, espinafre e couve cozidos.",
      orientacao_medica: "Não há saúde dérmica duradoura sem um epitélio digestivo com integridade de barreira comprovada.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Manchas Hipocrômicas Pós-Inflamatórias: A Volta do Pigmento",
      descricao: "Após lesões de acne, picadas de inseto ou dermatites intensas, a pele pode temporariamente perder melanina na área afetada.",
      destaque_texto: "Hidratação profunda, fotoproteção e paciência biológica permitem que os melanócitos circundantes repovoem a área.",
      orientacao_medica: "Evite acelerar com bronzeamentos artificiais, que queimam a pele saudável ao redor e acentuam o contraste da mancha branca.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Laser Fracionado de Picossegundos para Manchas e Rejuvenescimento",
      descricao: "Disparos na velocidade de trilionésimos de segundo fragmentam a melanina por efeito fotoacústico em partículas microscópicas sem queimar o tecido.",
      destaque_texto: "Atinge o pigmento profundo com segurança comprovada em peles claras e morenas, reduzindo melasma e estimulando neocolagênese.",
      orientacao_medica: "Downtime mínimo com recuperação ultrarrápida, sem crostas escuras ou necessidade de afastamento das atividades cotidianas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 39,
    dia_semana: "Edição #39",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Module o Cortisol com Plantas Adaptógenas!",
      habito_descricao: "Reserve 10 minutos de respiração diafragmática (4 segundos inspirando, 6 segundos expirando) no entardecer. Reduzir picos de cortisol preserva o colágeno profundo da quebra enzimática.",
      nutriente_nome: "Ashwagandha (Withania somnifera)",
      nutriente_tipo: "Fitoterápico Adaptógeno Nobre",
      o_que_faz: "Modula o eixo HPA (hipotálamo-hipófise-adrenal), estabilizando os níveis de cortisol circundante e melhorando a resiliência neurológica ao estresse.",
      fontes_alimentares: "Raiz de Withania somnifera padronizada em withanolídeos sob prescrição clínica individualizada.",
      orientacao_medica: "A modulação do cortisol reduz o 'burnout celular' e melhora o tônus da musculatura lisa e estriada da face.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Xantelasma Palpebral: Depósitos de Lipídios ao Redor dos Olhos",
      descricao: "Pequenas placas amareladas e planas nas pálpebras superiores ou inferiores correspondem ao acúmulo de histiócitos carregados de colesterol.",
      destaque_texto: "Pode ser o primeiro alerta clínico visual de dislipidemia sistêmica ou predisposição genética aterogênica.",
      orientacao_medica: "A avaliação do perfil lipídico sérico completo deve acompanhar a remoção dermatológica por microcirurgia ou eletrocoagulação delicada.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Sustentação do Terço Médio (Malar) e Triângulo da Juventude",
      descricao: "O envelhecimento facial começa pela reabsorção dos coxins de gordura profunda da bochecha e osso zigomático, acentuando o bigode chinês.",
      destaque_texto: "Aplicar microalíquotas de ácido hialurônico de alta viscosidade diretamente no periósteo ergue a face sem inflar o rosto.",
      orientacao_medica: "Tratar a causa da queda (o pilar malar) corrige indiretamente os sulcos nasogenianos com harmonia e elegância suprema.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 40,
    dia_semana: "Edição #40",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Foco Sereno e Sono Profundo com L-Teanina!",
      habito_descricao: "Substitua o café da noite por uma xícara de chá verde suave ou matcha. A L-Teanina promove estado de relaxamento vívido através do estímulo às ondas alfa cerebrais.",
      nutriente_nome: "L-Teanina",
      nutriente_tipo: "Aminoácido Nootrópico Natural",
      o_que_faz: "Atravessa a barreira hematoencefálica, estimula a produção de GABA e serotonina e contrabalança a excitação nervosa excessiva induzida pela cafeína.",
      fontes_alimentares: "Folhas nobres de Camellia sinensis (Chá Verde, Chá Branco e Matcha Cerimonial).",
      orientacao_medica: "O sono de ondas lentas restaurador é a principal janela biológica de pico de GH (hormônio do crescimento), vital para o tônus da pele.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Siringomas e Milium na Face: Saiba a Diferença",
      descricao: "O milium é um pequeno cisto de queratina superficial e fácil de drenar. O siringoma é uma proliferação benigna dos ductos das glândulas sudoríparas.",
      destaque_texto: "Nunca esprema pápulas palpebrais em casa para não gerar cicatrizes hipertróficas. O dermatologista remove com técnica asséptica.",
      orientacao_medica: "A excisão com microeletrocautério ou laser de CO2 ultra-focado entrega acabamento estético sem danificar a pele fina periocular.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Toxina Botulínica no Terço Inferior e Linhas de Marionete",
      descricao: "O músculo depressor do ângulo da boca (DAO) puxa os cantos dos lábios para baixo com o passar dos anos, criando um semblante cansado.",
      destaque_texto: "Microinjeções milimétricas de botox relaxam a tração muscular descendente, devolvendo um repouso labial harmônico e jovem.",
      orientacao_medica: "Exige profundo domínio da anatomia miológica facial para não interferir na fala, mastigação ou sorriso do paciente.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 41,
    dia_semana: "Edição #41",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Fotoproteção Oral Biológica com Astaxantina!",
      habito_descricao: "Adicione salmão selvagem ou algas na rotina. A astaxantina é considerada o carotenoide mais potente da natureza para proteger membranas celulares contra radiação UV.",
      nutriente_nome: "Astaxantina Natural",
      nutriente_tipo: "Carotenoide Marinho Super-Antioxidante",
      o_que_faz: "Neutraliza radicais livres até 6.000 vezes mais eficazmente que a Vitamina C, atravessa a bicamada lipídica e protege as organelas dérmicas.",
      fontes_alimentares: "Salmão selvagem, camarão, krill, truta e a microalga Haematococcus pluvialis.",
      orientacao_medica: "Funciona como um filtro solar interno coadjuvante, aumentando o tempo que a pele tolera à radiação antes do eritema.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Acne Escoriada: Rompa o Ciclo de Manipulação Cutânea",
      descricao: "A compulsão involuntária de cutucar, coçar e espremer microlesões provoca infecções bacterianas secundárias e manchas permanentes.",
      destaque_texto: "Mantenha unhas curtas, use curativos hidrocoloides adesivos invisíveis sobre espinhas e busque acompanhamento integrado.",
      orientacao_medica: "Tratar a acne de base associando apoio ansiolítico e dermatológico restaura a integridade cutânea e a autoestima do paciente.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Cuidados com o Pescoço: Tratamento da Pele mais Fina do Corpo",
      descricao: "O pescoço possui menos glândulas sebáceas e derme mais delgada que a face, denunciando o envelhecimento prematuro (pescoço 'tech neck').",
      destaque_texto: "Associação de skinbooster de ácido hialurônico, bioestimuladores diluídos e aplicação noturna de hidratantes com ceramidas.",
      orientacao_medica: "Estenda sempre todo o seu protocolo de skincare da face até a fúrcula esternal e topo dos ombros.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 42,
    dia_semana: "Edição #42",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Ativação das Sirtuínas com Trans-Resveratrol!",
      habito_descricao: "Consuma uvas roxas orgânicas com casca, mirtilos e cacau 85%. O resveratrol ativa os genes da longevidade celular (SIRT1), desacelerando a senescência biológica.",
      nutriente_nome: "Trans-Resveratrol Bioativo",
      nutriente_tipo: "Ativador de Vias de Longevidade",
      o_que_faz: "Mimetiza os efeitos metabólicos nobres do jejum intermitente, estimula a autofagia de proteínas danificadas e melhora a resistência vascular.",
      fontes_alimentares: "Casca de uvas roxas, mirtilos (blueberries), amoras silvestres, cacau cru e nozes.",
      orientacao_medica: "A forma trans-resveratrol micronizada ou lipossomal garante biodisponibilidade superior para absorção celular eficiente.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Púrpura Senil: Por que Manchas Roxas Surgem nos Braços?",
      descricao: "Com o avançar da idade e exposição solar crônica, o colágeno de sustentação perivascular se degrada, tornando os capilares frágeis ao menor toque.",
      destaque_texto: "Manchas roxas nos antebraços surgem sem trauma severo aparente. Hidratação com vitamina C tópica e proteção solar fortalecem o estroma.",
      orientacao_medica: "Sempre investigar plaquetas e coagulação sanguínea para descartar patologias hematológicas associadas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Preenchimento Labial Estilo 'Gloss': Volume Natural com Cânula",
      descricao: "Técnica médica focada em hidratação e contorno vermelhão labial sem projeção excessiva ou inversão anatômica da borda.",
      destaque_texto: "Utiliza cânula atraumática para depositar ácido hialurônico em microcamada superficial, eliminando código de barras e ressecamento crônico.",
      orientacao_medica: "Lábios bonitos são lábios simétricos, hidratados e em perfeita proporção estética com o queixo e o nariz do paciente.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 43,
    dia_semana: "Edição #43",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Elimine Células Senescentes com Quercetina e Fisetina!",
      habito_descricao: "Inclua maçãs vermelhas com casca, alcaparras e morangos orgânicos. Esses flavonoides atuam como agentes senolíticos naturais, auxiliando o corpo a reciclar células 'zumbis'.",
      nutriente_nome: "Quercetina & Fisetina",
      nutriente_tipo: "Flavonoides Senolíticos Celulares",
      o_que_faz: "Induzem apoptose em células senescentes que pararam de se dividir e que secretam citocinas tóxicas, rejuvenescendo o microambiente tecidual.",
      fontes_alimentares: "Cebola roxa, maçãs com casca, alcaparras, morangos, folhas de chá verde e trigo sarraceno.",
      orientacao_medica: "A remoção de células senescentes dérmicas reativa a síntese vigorosa de colágeno e elastina pelos fibroblastos jovens.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Granuloma Anular: O Reconhecimento de Lesões em Anel",
      descricao: "Dermatose benigna não contagiosa caracterizada por pápulas que formam anéis circulares no dorso das mãos, pés ou tronco.",
      destaque_texto: "Frequentemente confundida com micoses. Não coça intensamente e não descama, não respondendo a pomadas antifúngicas comuns.",
      orientacao_medica: "Pode ter correlação clínica com disfunções tireoidianas ou intolerância glicêmica que exigem rastreio laboratorial.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Fios de Polidioxanona (PDO) Especulados para Tração Suave",
      descricao: "Suturas absorvíveis biocompatíveis com microgarras reposicionam tecidos que cederam pela gravidade, estimulando colágeno ao longo do trajeto.",
      destaque_texto: "Excelente indicação para definição do contorno da mandíbula, elevação discreta da cauda da sobrancelha e atenuação do 'jowl'.",
      orientacao_medica: "Os fios são 100% reabsorvidos pelo organismo em 6 a 8 meses, deixando no lugar uma firme malha colágena autoral.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 44,
    dia_semana: "Edição #44",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Controle da Glicemia e AMPK com Berberina Natural!",
      habito_descricao: "Evite consumir carboidratos simples isolados no café da manhã. Comece com proteínas e fibras para manter a glicose estável e preservar a matriz dérmica da glicação.",
      nutriente_nome: "Berberina Fitoterápica",
      nutriente_tipo: "Ativador Metabólico de AMPK",
      o_que_faz: "Ativa a enzima AMPK (chave mestra energética das células), melhora a absorção muscular de glicose e reduz a esteatose hepática não alcoólica.",
      fontes_alimentares: "Extrato da raiz de Berberis aristata ou Hydrastis canadensis sob prescrição médica especializada.",
      orientacao_medica: "A estabilidade glicêmica é o segredo médico fundamental para prevenir a 'caramelização' do colágeno dérmico.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Hidradenite Supurativa: Reconhecimento e Manejo Clínico",
      descricao: "Condição inflamatória crônica dos folículos pilosos nas axilas, virilhas e sob as mamas, formando nódulos dolorosos e drenagens recorrentes.",
      destaque_texto: "Não se trata de infecção por falta de higiene. O tabagismo e a obesidade são fatores de agravamento sistêmico documentados.",
      orientacao_medica: "O diagnóstico dermatológico precoce impede a formação de trajetos fistulosos e cicatrizes retráteis severas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "O Protocolo 'Eye Glow': Clareamento e Atenuação de Bolsas",
      descricao: "Abordagem médica sinérgica unindo laser não ablativo suave, infusão de vitamina C/K e peeling enzimático específico para a região periocular.",
      destaque_texto: "Elimina a tonalidade marrom e arroxeada das olheiras, devolvendo luminosidade e descanso instantâneo ao olhar.",
      orientacao_medica: "A pele das pálpebras requer concentrações e pHs específicos para não deflagrar dermatite de contato irritativa.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 45,
    dia_semana: "Edição #45",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Reduza o Estresse Noturno com Fosfatidilserina!",
      habito_descricao: "Desligue telas e luzes brancas 1 hora antes de dormir. A Fosfatidilserina auxilia na atenuação da secreção excessiva de cortisol noturno, permitindo repouso reparador.",
      nutriente_nome: "Fosfatidilserina (Fosfolipídio Nobre)",
      nutriente_tipo: "Estabilizador de Membrana e Cognição",
      o_que_faz: "Compõe a camada interna da membrana dos neurônios, facilita a comunicação sináptica e modula a hiperatividade do eixo do estresse.",
      fontes_alimentares: "Gema de ovo caipira, cavala, arenque, fígado de galinha e lecitina de girassol não transgênica.",
      orientacao_medica: "Essencial para pacientes com mente hiperativa à noite que acordam com sensação de cansaço crônico e fadiga visual.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Hiperidrose Primária: Controle do Suor Excessivo",
      descricao: "A hiperatividade dos nervos simpáticos das glândulas sudoríparas provoca transpiração excessiva em mãos, axilas, pés e face, mesmo em repouso.",
      destaque_texto: "Impacta intensamente o convívio social e profissional. Desodorantes comuns são ineficazes frente ao volume sudoríparo.",
      orientacao_medica: "A aplicação de toxina botulínica nas axilas e palmas bloqueia os sinais colinérgicos com alívio duradouro de 6 a 9 meses.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Antioxidantes em Camadas: Vitamina C + Ácido Ferúlico + E",
      descricao: "A combinação de 15% de ácido L-ascórbico puro com 1% de alfa-tocoferol e 0,5% de ácido ferúlico multiplica por 8 a proteção celular contra radicais livres.",
      destaque_texto: "Aplique 4 a 5 gotas pela manhã antes do protetor solar para blindar a pele contra poluição urbana, ozônio e radiação infravermelha.",
      orientacao_medica: "O frasco deve ser mantido bem fechado e ao abrigo da luz, pois a vitamina C pura oxida quando exposta ao oxigênio contínuo.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 46,
    dia_semana: "Edição #46",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Osmorregulação e Saúde Celular com Taurina!",
      habito_descricao: "Beba água ao longo do dia em pequenas goladas com uma pitada de flor de sal marinho. A taurina atua equilibrando a hidratação intracelular e a função cardíaca.",
      nutriente_nome: "Taurina Micronizada",
      nutriente_tipo: "Aminoácido Sulfônico Citoprotetor",
      o_que_faz: "Regula o fluxo de cálcio e magnésio nos miócitos, melhora a sensibilidade à insulina e exerce ação antioxidante mitocondrial robusta.",
      fontes_alimentares: "Frutos do mar (ostras, mexilhões), carne escura de peru, frango caipira e atum fresco.",
      orientacao_medica: "Pesquisas científicas recentes comprovam que a taurina atua diretamente na desaceleração dos marcadores do envelhecimento biológico.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Queloides e Cicatrizes Hipertróficas: A Ação Precoce Faz a Diferença",
      descricao: "A resposta cicatricial exacerbada com proliferação desordenada de colágeno gera cicatrizes elevadas, avermelhadas e pruriginosas após cortes ou cirurgias.",
      destaque_texto: "Queloides ultrapassam os limites originais do corte; cicatrizes hipertróficas permanecem na borda da ferida.",
      orientacao_medica: "Infiltração intralesional de corticoide associada a placas de silicone e laser vascular bloqueia o crescimento em fases iniciais.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Proteção Solar com Óxido de Ferro contra Luz Visível e Telas",
      descricao: "Filtros solares incolores protegem contra raios UV, mas deixam passar a luz azul visível de computadores, celulares e lâmpadas de LED.",
      destaque_texto: "O pigmento de óxido de ferro presente nos protetores solares com cor forma uma barreira física opaca que impede o escurecimento do melasma.",
      orientacao_medica: "Para quem tem melasma ou manchas resistentes, o protetor solar com cor é obrigatório mesmo em dias nublados e dentro de escritórios.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 47,
    dia_semana: "Edição #47",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Transporte Gorduras para Queima com L-Carnitina!",
      habito_descricao: "Faça caminhadas matinais em jejum moderado ou com café sem açúcar. A carnitina auxilia as mitocôndrias a transformarem lipídios em energia ativa.",
      nutriente_nome: "L-Carnitina & Acetil-L-Carnitina",
      nutriente_tipo: "Transportador de Ácidos Graxos",
      o_que_faz: "Transporta os ácidos graxos de cadeia longa através da membrana mitocondrial interna para beta-oxidação e geração de energia.",
      fontes_alimentares: "Carne vermelha magra, leite integral de vacas a pasto, bacalhau e peito de frango.",
      orientacao_medica: "A forma acetilada (ALCAR) possui tropismo cerebral, melhorando a energia mental e prevenindo o declínio neurológico.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Vitiligo: Diagnóstico, Fatores Autoimunes e Novas Abordagens",
      descricao: "Condição autoimune em que linfócitos atacam seletivamente os melanócitos em áreas específicas da pele e mucosas, provocando manchas acrômicas brancas.",
      destaque_texto: "Não é transmissível nem contagioso. O controle do estresse emocional e o tratamento precoce aumentam as chances de repigmentação.",
      orientacao_medica: "Fototerapia UVB de banda estreita combinada a inibidores tópicos de JAK e antioxidantes sistêmicos revolucionou o manejo clínico.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Limpeza com Óleo Emulsionável (Cleansing Oil) nos Poros",
      descricao: "O princípio químico 'semelhante dissolve semelhante' faz com que óleos nobres vegetais dissolvam sebo oxidado, filtro solar e maquiagem à prova d'água.",
      destaque_texto: "Emulsiona em contato com a água sem deixar filme oleoso, desobstruindo filamentos sebáceos no nariz e queixo sem agredir a barreira.",
      orientacao_medica: "Excelente técnica mesmo para peles oleosas e acneicas quando seguida de um gel de limpeza suave com pH 5.5.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 48,
    dia_semana: "Edição #48",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Harmonia Hormonal Feminina com Inositol!",
      habito_descricao: "Mantenha horários regulares para suas refeições e reduza industrializados. A combinação de Mio-Inositol com D-Chiro-Inositol atua na regulação dos receptores ovarianos e metabólicos.",
      nutriente_nome: "Mio-Inositol & D-Chiro-Inositol (40:1)",
      nutriente_tipo: "Segundo Mensageiro Celular",
      o_que_faz: "Atua na sinalização intracelular do FSH e da insulina, melhorando a sensibilidade celular e reduzindo a hiperandrogenemia na Síndrome dos Ovários Policísticos (SOP).",
      fontes_alimentares: "Frutas cítricas (laranja, toranja), melão cantaloupe, feijões, arroz integral e sementes oleaginosas.",
      orientacao_medica: "Reduz o excesso de pelos, oleosidade cutânea e acne hormonal de origem ovariana de forma fisiológica e sem efeitos colaterais.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Alopecia Areata: Queda de Cabelo em Círculos e Imunidade",
      descricao: "Ataque imunológico inflamatório transitório aos folículos pilosos que gera clareiras circulares totalmente lisas no couro cabeludo ou barba.",
      destaque_texto: "O folículo permanece vivo sob a derme, permitindo a recuperação total dos fios com o tratamento dermatológico correto.",
      orientacao_medica: "Infiltração intralesional com microagulhas e novos imunomoduladores oferecem excelentes taxas de resposta clínica.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Esfoliação Química Suave com PHA (Poli-Hidroxiácidos)",
      descricao: "Ácidos de terceira geração (Gluconolactona e Ácido Lactobiônico) com moléculas maiores que renovam a superfície sem causar ardência ou vermelhidão.",
      destaque_texto: "Possuem propriedades umectantes superiores, sendo tolerados com conforto absoluto por pacientes com rosácea, eczema e peles reativas.",
      orientacao_medica: "Substitui esfoliantes físicos ásperos que provocam microfissuras na epiderme e agravam a sensibilidade.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 49,
    dia_semana: "Edição #49",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Direcione o Cálcio aos Ossos com Vitamina K2 (MK-7)!",
      habito_descricao: "Evite tomar suplementos de cálcio ou altas doses de Vitamina D3 isoladas sem orientação médica. A Vitamina K2 é o 'GPS' que garante que o cálcio vá para os ossos e não para as artérias.",
      nutriente_nome: "Vitamina K2 (Menaquinona-7)",
      nutriente_tipo: "Regulador de Distribuição Mineral",
      o_que_faz: "Ativa a osteocalcina (que fixa cálcio na matriz óssea) e a proteína MGP (que inibe a calcificação das paredes arteriais e tecidos moles).",
      fontes_alimentares: "Natto (soja fermentada tradicional japonesa), queijos curados (Gouda, Brie), gema caipira e fígado.",
      orientacao_medica: "Imprescindível na longevidade para prevenção simultânea de osteoporose e rigidez arterial cardiovascular.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Líquen Plano: Lesões Arroxeadas na Pele, Unhas e Mucosas",
      descricao: "Doença inflamatória imunomediada que cursa com pápulas poligonais violáceas pruriginosas nos punhos, tornozelos e estrias brancas na boca.",
      destaque_texto: "O estresse psicológico e reações medicamentosas são gatilhos frequentes de eclosão ou exacerbação.",
      orientacao_medica: "A biópsia dermatológica confirma o diagnóstico precoce e afasta outras patologias papuloescamosas graves.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Soroterapia Revitalizante Facial: Nutrientes Venosos para o Viço",
      descricao: "Infusão intravenosa lenta de complexo B, magnésio, glutationa, zinco e vitamina C pura que atinge 100% de biodisponibilidade plasmática imediata.",
      destaque_texto: "Alimenta os fibroblastos dérmicos de dentro para fora, restaurando hidratação profunda, imunidade e tônus em poucas sessões.",
      orientacao_medica: "Protocolo médico seguro realizado sob monitoramento clínico após checagem de exames laboratoriais prévios.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    }
  },
  {
    dia: 50,
    dia_semana: "Edição #50",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Ative a Imunidade Natural com Beta-Glucanas!",
      habito_descricao: "Inclua aveia em flocos grossos e cogumelos comestíveis nas refeições. As beta-glucanas 'treinam' os macrófagos e neutrófilos para respostas de defesa mais ágeis e equilibradas.",
      nutriente_nome: "Beta-Glucanas (1,3/1,6)",
      nutriente_tipo: "Imunomodulador Biológico",
      o_que_faz: "Liga-se aos receptores Dectin-1 dos macrófagos, aprimorando a fagocitose de patógenos sem induzir tempestade inflamatória tóxica.",
      fontes_alimentares: "Cogumelos medicinais (Shiitake, Maitake, Reishi), aveia integral e leveduras.",
      orientacao_medica: "Auxilia na cicatrização dérmica e no controle de dermatites recorrentes associadas à imunidade deprimida.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Linhas de Beau nas Unhas: O Registro de Estresses Passados",
      descricao: "Sulcos horizontais profundos que atravessam a lâmina ungueal refletem uma interrupção temporária do crescimento da matriz ungueal semanas atrás.",
      destaque_texto: "Como a unha cresce cerca de 3mm por mês, a distância do sulco até a cutícula indica exatamente em que mês o estresse físico ou infecção ocorreu.",
      orientacao_medica: "Febres altas, cirurgias de grande porte, desnutrição transitória ou infecções virais intensas costumam deixar esse registro nas unhas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Hidratação Oclusiva Noturna ('Sluggin') com Petrolato Médico",
      descricao: "Aplicação de uma fina camada de pomada oclusiva medicinal pura (petrolato estéril) sobre o hidratante noturno para travar a perda transepidérmica de água.",
      destaque_texto: "Ideal para resgatar peles descamando por frio ou ácidos. Desperta a cútis incrivelmente macia e reparada na manhã seguinte.",
      orientacao_medica: "Evitar o slugging sobre ácidos retinóicos puros ou em peles com tendência ativa a comedões e acne folicular.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 51,
    dia_semana: "Edição #51",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Proteja as Mitocôndrias com a Melatonina Natural!",
      habito_descricao: "Durma em quarto completamente escuro (sem leds de aparelhos ou frestas de luz externa). A escuridão total ativa a síntese da melatonina, o mais nobre antioxidante das organelas celulares.",
      nutriente_nome: "Melatonina Fisiológica",
      nutriente_tipo: "Hormônio Circadiano & Protetor Mitocondrial",
      o_que_faz: "Neutraliza espécies reativas de oxigênio dentro das mitocôndrias, regula os ciclos de autofagia celular noturna e induz reparo no DNA dérmico.",
      fontes_alimentares: "Cerejas azedas (tart cherry), nozes, sementes de mostarda e pistache.",
      orientacao_medica: "Muito além de induzir o sono, a melatonina atua como protetora oncológica celular e desaceleradora do envelhecimento sistêmico.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Carcinoma Espinocelular: Como Diferenciar de uma Ferida Comum",
      descricao: "O segundo câncer de pele mais frequente. Manifesta-se como uma ferida avermelhada, cascuda ou nódulo áspero que sangra e não cicatriza após 4 semanas.",
      destaque_texto: "Comum no rosto, orelhas, lábio inferior, dorso das mãos e áreas com histórico de ceratoses actínicas antigas.",
      orientacao_medica: "A excisão cirúrgica com margem de segurança e laudo anatomopatológico imediato garante taxas de cura próximas a 100%.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Bioestimulação com Hidroxiapatita de Cálcio (Radiesse)",
      descricao: "Microesferas de hidroxiapatita de cálcio em gel carreador estimulam uma intensa rede de colágeno e elastina, promovendo firmeza sem efeito volumizador pesado.",
      destaque_texto: "Indicado para definição do ângulo da mandíbula, correção de papada flácida e rejuvenescimento estrutural das mãos e braços.",
      orientacao_medica: "Promove redensificação dérmica progressiva que se mantém estável por até 18 meses após o procedimento médico.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 52,
    dia_semana: "Edição #52",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Acalme a Neuroinflamação com Apigenina!",
      habito_descricao: "Tome uma xícara concentrada de chá de camomila morno antes de ler à noite. A apigenina presente nas flores liga-se aos receptores GABA promovendo serenidade profunda.",
      nutriente_nome: "Apigenina Bioativa",
      nutriente_tipo: "Flavonoide Neuroprotetor",
      o_que_faz: "Inibe a enzima CD38 (poupando NAD+ celular para reparo de DNA), acalma a excitotoxicidade neuronal e melhora a qualidade do repouso noturno.",
      fontes_alimentares: "Flores de camomila, salsa fresca, aipo, alcachofra e orégano desidratado.",
      orientacao_medica: "Preservar os níveis intracelulares de NAD+ é uma das fronteiras médicas mais comprovadas no retardo da degeneração tecidual.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Dermatite Perioral: O Perigo de Usar Pomadas com Corticoide na Face",
      descricao: "Erupção de microespinhas e vermelhidão ao redor da boca, nariz e olhos frequentemente desencadeada pelo uso de pomadas hormonais sem prescrição.",
      destaque_texto: "O corticoide tópico parece clarear a lesão nos primeiros 2 dias, mas causa efeito rebote explosivo assim que é interrompido.",
      orientacao_medica: "O tratamento exige desmame médico gradual, substituição por anti-inflamatórios não esteroidais e cremes com zinco e enxofre.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Máscaras de LED Vermelho e Infravermelho Próximo",
      descricao: "Comprimentos de onda específicos (630nm e 830nm) atingem a citocromo c oxidase mitocondrial nas células da derme, estimulando a síntese de ATP.",
      destaque_texto: "Acelera a cicatrização pós-laser, reduz a vermelhidão inflamatória e potencializa a produção de colágeno sem gerar calor térmico prejudicial.",
      orientacao_medica: "Excelente terapia não ablativa de suporte semanal complementar aos procedimentos dermatológicos em consultório.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 53,
    dia_semana: "Edição #53",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Ative a Autofagia Celular com EGCG do Chá Verde!",
      habito_descricao: "Beba chá verde preparado com água a 80°C (não fervendo) e adicione algumas gotas de limão para preservar os polifenóis da degradação rápida no estômago.",
      nutriente_nome: "EGCG (Epigalocatequina Galato)",
      nutriente_tipo: "Catequina Termogênica e Autofágica",
      o_que_faz: "Estimula a reciclagem de organelas celulares defeituosas (autofagia), inibe a angiogênese tumoral precoce e apoia o metabolismo lipídico hepático.",
      fontes_alimentares: "Chá verde de boa procedência, Matcha cerimonial em pó e chá branco.",
      orientacao_medica: "A modulação do gasto energético e o estímulo à renovação proteica protegem os órgãos nobres contra o acúmulo de gordura ectópica.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Queilite Angular ('Boqueira'): Salivação, Fungos e Falta de Vitaminas",
      descricao: "Fissura dolorosa, vermelha e descamativa no canto dos lábios provocada pelo acúmulo de saliva que favorece proliferação de Candida albicans.",
      destaque_texto: "Pode estar associada à deficiência de vitaminas do complexo B (especialmente B2 e B12), anemia ferropriva ou perda de suporte dentário.",
      orientacao_medica: "Associação de pomada barreira protetora, antifúngico tópico e checagem laboratorial nutricional resolve o quadro em poucos dias.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Ácido Tranexâmico Tópico e Injetável no Controle da Pigmentação",
      descricao: "Inibe a ligação do plasminogênio aos queratinócitos, bloqueando a cascata inflamatória vascular que alimenta o melanócito no melasma crônico.",
      destaque_texto: "Reduz o componente avermelhado e vascular que sustenta a mancha escura, entregando clareamento estável e consistente.",
      orientacao_medica: "Pode ser utilizado em séruns tópicos diários ou aplicado via intradermoterapia pontual pelo dermatologista.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 54,
    dia_semana: "Edição #54",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Proteja a Mucosa Gástrica com Zinco Carnosina!",
      habito_descricao: "Mastigue muito bem os alimentos e evite consumir líquidos volumosos durante as refeições principais para manter o ácido clorídrico gástrico concentrado.",
      nutriente_nome: "Zinco Carnosina (PepZin GI)",
      nutriente_tipo: "Protetor Epitelial Gástrico",
      o_que_faz: "Adere diretamente às áreas inflamadas ou ulceradas do estômago, acelerando o reparo da mucosa sem suprimir a acidez necessária para digerir proteínas.",
      fontes_alimentares: "Complexo quelatado de zinco com L-carnosina manipulado sob receita médica.",
      orientacao_medica: "A digestão completa no estômago previne a passagem de macromoléculas não digeridas para o intestino, reduzindo a reatividade dérmica.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Manchas de Gravidez e Cloasma: O Papel dos Hormônios",
      descricao: "O aumento acentuado de estrogênio e progesterona durante a gestação estimula os melanócitos a produzirem melanina em resposta ao menor estímulo solar.",
      destaque_texto: "Manchas simétricas na testa, maçãs do rosto e buço exigem fotoproteção física com óxido de ferro e chapéus com aba larga.",
      orientacao_medica: "Muitos ácidos e clareadores são contraindicados na gravidez e amamentação. Consulte sempre a dermatologista para protocolos seguros.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Retinaldeído: O Precursor Mais Rápido e Gentil do Ácido Retinóico",
      descricao: "Necessita de apenas uma conversão enzimática na pele para se transformar em ácido retinóico ativo (enquanto o retinol precisa de duas).",
      destaque_texto: "Entrega resultados anti-idade e clareadores até 11 vezes mais rápidos que o retinol comum, apresentando excelente perfil de tolerância dérmica.",
      orientacao_medica: "Excelente opção noturna para quem busca renovação celular intensa sem descamação excessiva ou hipersensibilidade.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 55,
    dia_semana: "Edição #55",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Detox Hepático e Clareamento com Glutationa!",
      habito_descricao: "Elimine o consumo de álcool refinado e produtos com conservantes artificiais por 14 dias para desafogar as enzimas de fase II do fígado.",
      nutriente_nome: "Glutationa Lipossomal / Endovenosa",
      nutriente_tipo: "Antioxidante Mestre do Organismo",
      o_que_faz: "Conjuga toxinas lipossolúveis para excreção biliar e urinária e modula a tirosinase, favorecendo a síntese de feomelanina mais clara na epiderme.",
      fontes_alimentares: "Abacate, aspargos, espinafre, melancia e precursores (NAC, proteína do soro do leite e selênio).",
      orientacao_medica: "A via endovenosa garante entrada celular plena sem a degradação gástrica que costuma inativar a glutationa oral comum.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Tinea Pedis ('Pé de Atleta') e Fissuras nos Calcanhares",
      descricao: "Infecção fúngica comum nos espaços interdigitais dos pés e plantas, agravada por calçados fechados e umidade prolongada pós-banho.",
      destaque_texto: "Secar cuidadosamente entre os dedos com toalha exclusiva e usar meias de algodão respiráveis impede o reaparecimento das fissuras dolorosas.",
      orientacao_medica: "Tratar a micose com antifúngicos prescritos é essencial antes de lixar os calcanhares, pois a abrasão mecânica espalha os esporos fúngicos.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Massagem Facial com Gua Sha: Drenagem sem Estirar a Pele",
      descricao: "Técnica milenar com pedra natural lisa (quartzo ou jade) que estimula o fluxo linfático e relaxa a hipertonia dos músculos mastigatórios.",
      destaque_texto: "Aplique previamente um óleo facial nobre para deslizamento sem atrito e realize movimentos suaves do centro do rosto para os gânglios cervicais.",
      orientacao_medica: "Reduz o inchaço matinal periocular e facial imediato, aumentando a oxigenação tecidual sem trauma mecânico.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 56,
    dia_semana: "Edição #56",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Aumente sua Resiliência Física e Mental com Rhodiola!",
      habito_descricao: "Pratique caminhadas na natureza ou pausas silenciosas ao ar livre. A Rhodiola Rosea é uma raiz adaptógena do ártico que melhora a tolerância física à fadiga prolongada.",
      nutriente_nome: "Rhodiola Rosea (Raiz de Ouro)",
      nutriente_tipo: "Fitoterápico Adaptógeno Vigoroso",
      o_que_faz: "Otimiza os níveis de serotonina e dopamina no córtex cerebral, reduz a percepção de exaustão e melhora a produção miocárdica de energia.",
      fontes_alimentares: "Extrato padronizado em rosavinas e salidrosídeos sob orientação médica.",
      orientacao_medica: "Indicada para fases de sobrecarga profissional ou estudos intensos, preservando a vitalidade imunológica do organismo.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Reações a Picadas de Inseto (Estrófulo): Cuidado com a Sensibilização",
      descricao: "Hipersensibilidade imunológica da pele às proteínas da saliva de mosquitos e pulgas, gerando pápulas muito pruriginosas e crostas.",
      destaque_texto: "Coçar as lesões introduz bactérias da flora ungueal, evoluindo para impetigo secundário e manchas castanhas residuais.",
      orientacao_medica: "Uso de repelentes seguros (como Icaridina a 20%), compressas geladas e loções calmantes com calamina e mentol aliviam a coceira.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Preenchimento de Mãos com Bioestimulador para Densidade",
      descricao: "O dorso das mãos perde colágeno e tecido subcutâneo com o tempo, tornando tendões, veias e ossos excessivamente visíveis.",
      destaque_texto: "A aplicação de hidroxiapatita de cálcio ou ácido hialurônico específico com cânula devolve sustentação dérmica e camufla as veias proeminentes.",
      orientacao_medica: "Procedimento rápido em consultório com anestesia local que rejuvenesce as mãos em perfeita harmonia com o rosto.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 57,
    dia_semana: "Edição #57",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "ATP Muscular e Cognitivo com Creatina Monoidratada!",
      habito_descricao: "Tome 3 a 5g de creatina monoidratada diariamente diluída em água morna ou suco. A creatina não é apenas para atletas: ela é fundamental para o tônus muscular e a lucidez mental.",
      nutriente_nome: "Creatina Monoidratada Pura (Creapure)",
      nutriente_tipo: "Doador de Fosfato para Síntese de ATP",
      o_que_faz: "Ressintetiza rapidamente o ATP celular gasto em esforços físicos e neurológicos, preserva a massa magra contra a sarcopenia e hidrata a célula.",
      fontes_alimentares: "Carne bovina magra, salmão, atum e suplementação de grau farmacêutico 100% puro.",
      orientacao_medica: "Mulheres e pessoas maduras se beneficiam imensamente da creatina para sustentação miofascial e prevenção do declínio cognitivo.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Envelhecimento das Mãos: Entenda as Melanoses e a Perda Tecidual",
      descricao: "As mãos estão sempre expostas ao volante, ao sol e à lavagem constante com sabonetes agressivos sem fotoproteção regular.",
      destaque_texto: "Manchas escuras (melanoses solares) associadas à perda de elasticidade exigem remoção com laser e hidratação com barreira lipídica.",
      orientacao_medica: "Mantenha sempre um tubo de protetor solar dentro do carro para reaplicação nas mãos antes de dirigir sob o sol forte.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Tratamento de Estrias Vermelhas e Brancas com Lasers Combinados",
      descricao: "Estrias vermelhas (recentes e vascularizadas) respondem muito rápido ao laser vascular (Luz Pulsada); estrias brancas (antigas) exigem remodelamento fracionado.",
      destaque_texto: "A combinação de laser ablativo suave com infusão de retinoides e ácido hialurônico contrai a largura e melhora a textura da pele.",
      orientacao_medica: "Iniciar o tratamento enquanto a estria ainda está avermelhada garante até 90% de melhora estética visual.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 58,
    dia_semana: "Edição #58",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Harmonia do Eixo Intestino-Pele com Probióticos Vivos!",
      habito_descricao: "Consuma iogurtes naturais sem açúcar, kefir ou chucrute caseiro fermentado. A diversidade da microbiota intestinal dita a saúde e a reatividade inflamatória dos poros da pele.",
      nutriente_nome: "Probióticos Específicos & Prebióticos",
      nutriente_tipo: "Reguladores do Microbioma Humano",
      o_que_faz: "Produzem ácidos graxos de cadeia curta (butirato, acetato), inibem a translocação de endotoxinas LPS e equilibram a imunidade mucosa e dérmica.",
      fontes_alimentares: "Kefir de leite ou água, kombucha de baixa fermentação, iogurtes fermentados vivos e biomassa de banana verde.",
      orientacao_medica: "Certas cepas (como Lactobacillus rhamnosus e Bifidobacterium lactis) possuem evidência clínica direta na redução da severidade da acne.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Ceratodermia Palmo-Plantar: O Espessamento Indesejado da Pele",
      descricao: "Espessamento excessivo e endurecido da camada córnea das palmas e plantas, frequentemente com fissuras dolorosas e perda de sensibilidade tátil.",
      destaque_texto: "Pode decorrer de fatores mecânicos crônicos (fricção), desidratação severa ou predisposição genética hereditária.",
      orientacao_medica: "Cremes queratolíticos à base de ácido salicílico a 5-10% e ureia a 20% restauram a maleabilidade sem necessidade de cortes abrasivos.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Protocolo 'Pre-Party': Drenagem, Máscara Tensora e Laser Glow",
      descricao: "Procedimento médico express para eventos especiais que combina peeling de diamante ultraleve, laser não ablativo iluminador e máscara calmante oclusiva.",
      destaque_texto: "Zero descamação, zero vermelhidão e resultado instantâneo de pele acetinada, poros contraídos e maquiagem impecável.",
      orientacao_medica: "Realizado preferencialmente 24 a 48 horas antes de casamentos, festas de gala ou ensaios fotográficos profissionais.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 59,
    dia_semana: "Edição #59",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Recupere o Fôlego Celular com D-Ribose!",
      habito_descricao: "Evite treinos extenuantes quando estiver com sono acumulado. A D-Ribose auxilia os miócitos a regenerarem as reservas de energia esgotadas em menor tempo.",
      nutriente_nome: "D-Ribose Pura",
      nutriente_tipo: "Monossacarídeo Estrutural de Nucleotídeos",
      o_que_faz: "Serve como bloco de construção indispensável na via das pentoses para a síntese 'de novo' do ATP e nucleotídeos de RNA celular.",
      fontes_alimentares: "Carne bovina, cogumelos e queijos curados, sendo comumente prescrita em pó puro de rápida dissolução aquosa.",
      orientacao_medica: "Excelente suporte médico para recuperação pós-exercício, fadiga adrenal e indivíduos com queixas de cansaço crônico persistente.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Dermatoscopia Digital Comparativa: Acompanhamento de Pessoas com Muitas Pintas",
      descricao: "Tecnologia médica de alta precisão que fotografa e mapeia microscopicamente cada pinta do corpo inteiro em tela digital ampliada.",
      destaque_texto: "Permite comparar fotos com precisão milimétrica ano a ano, detectando alterações mínimas e imperceptíveis antes que evoluam para melanoma.",
      orientacao_medica: "Indispensável para pacientes com histórico familiar de câncer de pele, pele muito clara ou mais de 50 pintas pelo corpo.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Cuidados Pós-Sol Imediatos: Centella Asiática (Cica) e Pantenol",
      descricao: "Após exposição solar intensa, a pele sofre microdanos térmicos subclínicos que aceleram a destruição do colágeno se não resfriados adequadamente.",
      destaque_texto: "Brumas de água termal gelada seguidas de bálsamos com Madecassoside (Cica) e D-Pantenol desativam mediadores inflamatórios dérmicos.",
      orientacao_medica: "Jamais use óleos densos ou manteigas sobre a pele recém-queimada de sol, pois eles retêm o calor tecidual e agravam o eritema.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 60,
    dia_semana: "Edição #60",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Combustível Limpo para o Cérebro com Ácido Caprílico (MCT C8)!",
      habito_descricao: "Adicione uma colher de café de óleo MCT C8 puro no seu chá ou café matinal. O ácido caprílico converte-se rapidamente em corpos cetônicos no fígado sem sobrecarregar a digestão.",
      nutriente_nome: "Ácido Caprílico Puro (MCT C8)",
      nutriente_tipo: "Triglicerídeo de Cadeia Média Rápido",
      o_que_faz: "Gera corpos cetônicos que cruzam a barreira hematoencefálica fornecendo energia imediata aos neurônios e mitocôndrias sem elevar a insulina.",
      fontes_alimentares: "Fração C8 purificada do óleo de coco e laticínios de animais criados em pasto.",
      orientacao_medica: "Excelente estratégia para clareza mental e controle do apetite em rotinas de jejum intermitente supervisionado.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Pele Reativa e Alérgica: A Síndrome da Intolerância a Cosméticos",
      descricao: "Sensação de queimação, pinicação e vermelhidão ao passar qualquer produto no rosto decorre da quebra total da camada lipídica protetora da epiderme.",
      destaque_texto: "Suspenda todos os ácidos, esfoliantes, fragrâncias e tônicos com álcool. Adote rotina ultra-minimalista por 2 semanas com limpador suave e ceramidas.",
      orientacao_medica: "Testes de contato (Patch Test) dermatológicos identificam com precisão alérgenos ocultos como conservantes e fragrâncias sintéticas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Harmonização Facial Médica com Respeito à Anatomia e Identidade",
      descricao: "A medicina estética contemporânea rejeita rostos padronizados e volumizados em excesso. O foco é valorizar os traços individuais de cada pessoa.",
      destaque_texto: "Pequenos ajustes em pontos de luz anatômicos devolvem frescor e descanso ao semblante sem que ninguém perceba que houve procedimento.",
      orientacao_medica: "O bom procedimento estético é aquele em que as pessoas elogiam sua vitalidade e beleza, e não o produto que foi aplicado.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 61,
    dia_semana: "Edição #61",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Proteja os Hepatócitos com Silimarina Natural!",
      habito_descricao: "Beba chás de ervas amargas (como carqueja, alcachofra e boldo) após refeições gordurosas. O fígado é a grande fábrica que processa hormônios e toxinas antes que cheguem à pele.",
      nutriente_nome: "Silimarina (Cardo Mariano / Silybum marianum)",
      nutriente_tipo: "Fitoterápico Hepatoprotetor Nobre",
      o_que_faz: "Estabiliza as membranas dos hepatócitos impedindo a entrada de toxinas e estimula a síntese proteica regenerativa do fígado.",
      fontes_alimentares: "Sementes de Cardo Mariano padronizadas em silibina e extratos botânicos.",
      orientacao_medica: "Indivíduos com sobrecarga hepática frequentemente manifestam pele opaca, acne persistente na mandíbula e olheiras pigmentadas.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Granuloma Piogênico: Pequenos Nódulos Vermelhos Sangrantes Pós-Trauma",
      descricao: "Proliferação vascular benigna rápida que surge frequentemente após um pequeno arranhão, picada de inseto ou trauma na cutícula.",
      destaque_texto: "Apresenta aspecto de framboesa avermelhada brilhante que sangra abundantemente ao menor toque ou atrito de roupas.",
      orientacao_medica: "A cauterização química ou eletrocoagulação simples em consultório resolve o nódulo com cicatrização rápida e sem dor.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Ácido Lático: Esfoliação Delicada e Retenção Hídrica Cutânea",
      descricao: "Alfa-hidroxiácido suave com propriedades umectantes naturais intrínsecas, atuando na quebra suave dos desmossomos da camada córnea.",
      destaque_texto: "Uniformiza a textura áspera da pele sem provocar descamação visível ou vermelhidão intensa, ideal para peles maduras e secas.",
      orientacao_medica: "Aplicar à noite duas vezes por semana sob supervisão para devolver luminosidade imediata à pele sem viço.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 62,
    dia_semana: "Edição #62",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Disposição Matinal e Suporte à Tireoide com L-Tirosina!",
      habito_descricao: "Consuma ovos caipiras, sementes de abóbora e queijo de cabra no desjejum. A tirosina é precursora da dopamina que nos dá motivação e foco para vencer o dia.",
      nutriente_nome: "L-Tirosina",
      nutriente_tipo: "Aminoácido Precursor de Catecolaminas e Tireoide",
      o_que_faz: "Serve como substrato para a síntese dos hormônios tireoidianos T3 e T4 e dos neurotransmissores dopamina, adrenalina e noradrenalina.",
      fontes_alimentares: "Ovos caipiras, spirulina, queijo parmesão, peito de frango, sementes de abóbora e gergelim.",
      orientacao_medica: "A hipotireoidismo subclínico reduz o metabolismo basal e deixa a pele seca, cabelos quebradiços e unhas frágeis.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Foliculite da Barba e Depilação: Como Romper o Ciclo",
      descricao: "Pelos grossos e curvados que reentram na pele ao crescerem provocam microinflamações bacterianas pustulosas e manchas escuras no pescoço e virilha.",
      destaque_texto: "Nunca depile no sentido contrário ao crescimento do pelo com lâminas gastas. Lave com sabonete antisséptico suave antes da lâmina.",
      orientacao_medica: "A depilação médica a laser é a solução padrão-ouro definitiva para eliminar o pelo pela raiz e cicatrizar a pele.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Microtoxina ('Baby Botox') para Poros Dilatados e Oleosidade",
      descricao: "Microdoses ultra-diluídas de toxina botulínica injetadas superficialmente na derme (sem paralisar a mímica muscular profunda).",
      destaque_texto: "Atua nos microreceptores colinérgicos das glândulas sebáceas e eretores do pelo, diminuindo a oleosidade excessiva e fechando os poros.",
      orientacao_medica: "Preserva a expressividade facial 100% natural com um refinamento espetacular da textura da pele.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 63,
    dia_semana: "Edição #63",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Fortaleça seus Vasos e Microcirculação com Rutina!",
      habito_descricao: "Inclua trigo sarraceno, maçãs com casca e frutas cítricas integrais no cardápio. Os bioflavonoides protegem os capilares finos da face contra rompimentos.",
      nutriente_nome: "Rutina & Hesperidina (Bioflavonoides)",
      nutriente_tipo: "Vasoprotetor Microcirculatório",
      o_que_faz: "Reduz a permeabilidade e fragilidade capilar excessiva, combate a formação de vasinhos avermelhados (telangiectasias) e reduz edemas.",
      fontes_alimentares: "Casca branca de frutas cítricas, trigo sarraceno, maçã, figo e amoras silvestres.",
      orientacao_medica: "Excelente aliada para pacientes com queixas de pernas pesadas, rosácea vascular e olheiras escuras congestivas.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Exame Dermatológico de Corpo Inteiro: Seu Checklist Anual de Saúde",
      descricao: "Consulta médica dedicada a examinar minuciosamente toda a superfície corporal com dermatoscópio: couro cabeludo, costas, palmas, plantas e unhas.",
      destaque_texto: "Detecta lesões malignas em fases microscópicas iniciais, onde a taxa de cura cirúrgica atinge quase 100% sem mutilações.",
      orientacao_medica: "O autoexame em casa é importante, mas nada substitui o olho treinado do especialista com lentes dermatoscópicas de luz polarizada.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Regeneração com Esqualano Vegetal e Ácidos Graxos Nobres",
      descricao: "O esqualeno é um lipídio natural biocompatível que compõe o manto hidrolipídico da nossa própria pele, diminuindo após os 25 anos.",
      destaque_texto: "O esqualano vegetal puro (extraído da cana-de-açúcar ou oliva) é 100% estável, não oxida e não obstrui poros (não comedogênico).",
      orientacao_medica: "Aqueça 2 gotas na palma das mãos e pressione suavemente sobre o rosto para selar a hidratação com toque seco e aveludado.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  },
  {
    dia: 64,
    dia_semana: "Edição #64",
    nutriente: {
      tag: "MEDICINA INTEGRATIVA & NUTRIÇÃO CELULAR",
      habito_titulo: "Equilíbrio Neuroimunológico com Fitocanabinoides (CBD)!",
      habito_descricao: "Dedique tempo diário para atividades contemplativas, sono regulado e manejo da dor. A modulação do sistema endocanabinoide restaura a homeostase biológica.",
      nutriente_nome: "Canabidiol Medicinal (CBD de Espectro Amplo)",
      nutriente_tipo: "Modulador do Sistema Endocanabinoide",
      o_que_faz: "Interage com receptores CB1, CB2 e TRPV1, modulando a percepção da dor crônica, a ansiedade generalizada e a cascata de citocinas inflamatórias.",
      fontes_alimentares: "Óleos de cânhamo de grau medicinal farmacêutico importados com prescrição médica e autorização da Anvisa.",
      orientacao_medica: "A medicina canabinoide é uma terapêutica séria e regulamentada que traz alívio profundo em dores crônicas refratárias e distúrbios de sono.",
      medico: "Dr. Renato Nakad Gouveia",
      area: "Medicina Integrativa"
    },
    dermatologia: {
      tag: "DERMATOLOGIA CLÍNICA & DIAGNÓSTICO PRECOCE",
      titulo: "Prevenção da Flacidez de Colo e Decote: O Segredo da Juventude",
      descricao: "Dormir de lado e a exposição solar no trânsito provocam rugas verticais profundas no colo chamadas de 'sleep lines'.",
      destaque_texto: "Almofadas de separação noturna, fotoproteção estendida ao decote e aplicação de bioestimuladores evitam o enrugamento precoce.",
      orientacao_medica: "O colo é uma das primeiras regiões a denunciar a idade biológica. O cuidado preventivo preserva a textura acetinada por décadas.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Clínica"
    },
    beleza: {
      tag: "BELEZA CONSCIENTE & PROTOCOLOS DIÁRIOS",
      titulo: "Plano de Beleza 360° para o Ano Todo: Cronograma Preventivo",
      descricao: "A beleza perene e natural não nasce de procedimentos improvisados na véspera de datas comemorativas, mas de um cronograma médico planejado.",
      destaque_texto: "Organize seu ano com: 1 bioestímulo semestral, 2 toxinas botulínicas preventivas por ano e rotina diária disciplinada de skincare e nutrição celular.",
      orientacao_medica: "Envelhecer bem é uma decisão diária de amor-próprio, disciplina biológica e acompanhamento médico de confiança.",
      medico: "Dra. Line Manuelle Gouveia",
      area: "Dermatologia Estética"
    }
  }
];

function executar() {
  console.log('Lendo conteudo_diario.json...');
  const data = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));

  console.log(`Dicas existentes: ${data.dicas_diarias.length}`);

  // Filtra apenas dias que ainda não existem
  const diasExistentes = new Set(data.dicas_diarias.map(d => d.dia));
  let adicionados = 0;

  for (const nova of novasDicas) {
    if (!diasExistentes.has(nova.dia)) {
      data.dicas_diarias.push(nova);
      adicionados++;
    }
  }

  // Ordena por dia
  data.dicas_diarias.sort((a, b) => a.dia - b.dia);

  // Atualiza config total_dias
  data.config.total_dias = data.dicas_diarias.length;

  console.log(`Adicionadas ${adicionados} novas pílulas.`);
  console.log(`Novo total de dias: ${data.config.total_dias}`);

  // Salva o JSON formatado
  fs.writeFileSync(JSON_PATH, JSON.stringify(data, null, 2), 'utf8');
  console.log('conteudo_diario.json salvo com sucesso!');

  // Salva o JS sincronizado
  const jsContent = `// Dados do Diário Dermaline (Permite execução tanto via HTTP/HTTPS quanto diretamente via file:// local)
window.DERMALINE_CONTEUDO_DATA = ${JSON.stringify(data, null, 2)};
`;
  fs.writeFileSync(JS_PATH, jsContent, 'utf8');
  console.log('conteudo_diario_data.js atualizado com sucesso!');
}

executar();
