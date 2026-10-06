/* ==========================================================================
   INSTITUTO DERMALINE - INTERATIVIDADE & FUNCIONALIDADES
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const siteHeader = document.querySelector('.site-header');
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      siteHeader.classList.add('scrolled');
    } else {
      siteHeader.classList.remove('scrolled');
    }
  });

  // 2. Mobile Menu Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link');

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      const isExpanded = mobileMenu.classList.contains('open');
      mobileToggle.setAttribute('aria-expanded', isExpanded);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
      });
    });
  }

  // 3. Procedures Filter
  const filterButtons = document.querySelectorAll('.filter-btn');
  const procedureCards = document.querySelectorAll('.procedure-card');

  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      procedureCards.forEach(card => {
        if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });

  // 4. Modal de Agendamento
  const bookingModal = document.getElementById('bookingModal');
  const openModalBtns = document.querySelectorAll('.trigger-booking-modal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const bookingForm = document.getElementById('bookingForm');

  openModalBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const procedureName = btn.getAttribute('data-procedure');
      if (procedureName && document.getElementById('formProcedure')) {
        document.getElementById('formProcedure').value = procedureName;
      }
      bookingModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeModal = () => {
    bookingModal.classList.remove('open');
    document.body.style.overflow = '';
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) {
        closeModal();
      }
    });
  }

  // Máscara dinâmica para o campo WhatsApp / Telefone: (XX) XXXXX-XXXX
  const phoneInput = document.getElementById('formPhone');
  if (phoneInput) {
    const formatPhone = (val) => {
      let v = val.replace(/\D/g, '');
      // Se colou com DDI +55 (ex: 5561991736660), remove o 55
      if (v.startsWith('55') && (v.length === 12 || v.length === 13)) {
        v = v.slice(2);
      }
      if (v.length > 11) {
        v = v.slice(0, 11);
      }

      if (v.length === 0) return '';
      if (v.length <= 2) return `(${v}`;
      if (v.length <= 6) return `(${v.slice(0, 2)}) ${v.slice(2)}`;
      if (v.length <= 10) return `(${v.slice(0, 2)}) ${v.slice(2, 6)}-${v.slice(6)}`;
      return `(${v.slice(0, 2)}) ${v.slice(2, 7)}-${v.slice(7, 11)}`;
    };

    phoneInput.addEventListener('input', (e) => {
      e.target.value = formatPhone(e.target.value);
      const digits = e.target.value.replace(/\D/g, '');
      if (digits.length > 0 && digits.length < 10) {
        phoneInput.setCustomValidity('Por favor, informe o DDD e o número completo.');
      } else {
        phoneInput.setCustomValidity('');
      }
    });

    // Permite apenas digitação de dígitos e teclas de navegação
    phoneInput.addEventListener('keypress', (e) => {
      if (!/\d/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
        e.preventDefault();
      }
    });
  }

  // Form submission -> WhatsApp redirect
  if (bookingForm) {
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('formName').value;
      const phone = document.getElementById('formPhone').value;
      const procedure = document.getElementById('formProcedure').value;
      const message = document.getElementById('formNotes').value;

      const clinicPhone = '5561991736660'; // Número de WhatsApp da clínica
      const text = encodeURIComponent(
        `Olá, Instituto Dermaline! Gostaria de agendar uma consulta.\n\n` +
        `• *Nome:* ${name}\n` +
        `• *Telefone:* ${phone}\n` +
        `• *Interesse / Procedimento:* ${procedure}\n` +
        (message ? `• *Observações:* ${message}\n` : '')
      );

      window.open(`https://wa.me/${clinicPhone}?text=${text}`, '_blank');
      closeModal();
    });
  }

  // 5. Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const highlightNav = () => {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  window.addEventListener('scroll', highlightNav);

  // 6. Controle de Tempo e Ciclo da Hero (Pausa no Final com Frase e Todos Componentes)
  const heroVideo = document.getElementById('heroVideo') || document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.removeAttribute('loop');
    heroVideo.loop = false;

    const PAUSE_DURATION_MS = 3000; // Exatamente 3 segundos de pausa para leitura clara da frase e de todos os componentes
    const FADE_TRANSITION_MS = 400; // Transição suave entre os estados
    let isCycling = false;

    // Inicia a evolução da animação
    const playEvolution = () => {
      heroVideo.playbackRate = 1.0;
      heroVideo.style.opacity = '1';
      heroVideo.play().catch(() => {});
    };

    // Pausa no estado completo (com a frase e todos os componentes nítidos)
    const holdFinalStateAndPause = () => {
      if (isCycling) return;
      isCycling = true;

      // Suave transição para o frame final/completo com todos os componentes e a frase
      heroVideo.style.transition = `opacity ${FADE_TRANSITION_MS}ms ease-in-out`;
      heroVideo.style.opacity = '0.75';

      setTimeout(() => {
        heroVideo.pause();
        heroVideo.currentTime = 0; // Frame com a frase completa e todos os componentes perfeitamente nítidos
        heroVideo.style.opacity = '1';

        // Mantém a pausa de 3 segundos no final do ciclo para leitura confortável
        setTimeout(() => {
          isCycling = false;
          playEvolution();
        }, PAUSE_DURATION_MS);
      }, FADE_TRANSITION_MS);
    };

    // Quando o ciclo de evolução termina, finaliza na tela completa com a frase e pausa por 3 segundos
    heroVideo.addEventListener('ended', holdFinalStateAndPause);

    // No carregamento inicial: exibe a página completa com a frase por 3 segundos antes do primeiro ciclo
    heroVideo.pause();
    heroVideo.currentTime = 0;
    setTimeout(() => {
      playEvolution();
    }, PAUSE_DURATION_MS);
  }

  // 6. Data Dinâmica da Pílula Diária (Diário Dermaline)
  const pillCurrentDate = document.getElementById('pillCurrentDate');
  if (pillCurrentDate) {
    try {
      const now = new Date();
      const options = { weekday: 'long', day: 'numeric', month: 'long' };
      let formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(now);
      formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
      pillCurrentDate.textContent = formattedDate;
    } catch (e) {
      // fallback já preenchido no HTML
    }
  }

  // 7. Abas Interativas da Pílula Diária
  const pillTabBtns = document.querySelectorAll('.pill-tab-btn');
  const pillCards = document.querySelectorAll('.pill-content-card');

  pillTabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      pillTabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetPill = btn.getAttribute('data-pill');
      pillCards.forEach(card => {
        if (card.getAttribute('data-pill') === targetPill) {
          card.classList.add('active');
        } else {
          card.classList.remove('active');
        }
      });
    });
  });

  // 8. Modal do Artigo Semanal Completo
  const articleModal = document.getElementById('articleModal');
  const openArticleBtn = document.getElementById('openArticleBtn');
  const closeArticleBtn = document.getElementById('closeArticleBtn');

  if (openArticleBtn && articleModal) {
    openArticleBtn.addEventListener('click', (e) => {
      e.preventDefault();
      articleModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  }

  const closeArticleModal = () => {
    if (articleModal) {
      articleModal.classList.remove('open');
      document.body.style.overflow = '';
    }
  };

  if (closeArticleBtn) {
    closeArticleBtn.addEventListener('click', closeArticleModal);
  }

  if (articleModal) {
    articleModal.addEventListener('click', (e) => {
      if (e.target === articleModal) {
        closeArticleModal();
      }
    });
  }

  // 9. Carregamento e Rotação Automática (conteudo_diario.json / window.DERMALINE_DIARIO_DATA)
  const loadDailyContent = async () => {
    let data = (typeof window !== 'undefined' && window.DERMALINE_DIARIO_DATA) ? window.DERMALINE_DIARIO_DATA : null;

    if (!data) {
      try {
        const response = await fetch('./conteudo_diario.json');
        if (response.ok) {
          data = await response.json();
        }
      } catch (err) {
        console.warn('Ambiente local file:// ou restrição de CORS detectada. Usando fallback de dados.');
      }
    }

    if (!data) {
      // Garante que mesmo sem dados os modais e botões abram graciosamente
      if (typeof initAcervoSystem === 'function') initAcervoSystem([], () => {});
      if (typeof initReflexoesSystem === 'function') initReflexoesSystem([]);
      return;
    }

    try {

      // 9.0 Controle de Lançamento & Cronologia Progressiva
      const config = data.config || {};
      const agora = new Date();
      let diasDecorridos = 0;

      if (config.data_publicacao_site && String(config.data_publicacao_site).trim().length >= 10) {
        const [ano, mes, dia] = config.data_publicacao_site.trim().split('-').map(Number);
        const dataInicio = new Date(ano, mes - 1, dia, 0, 0, 0);
        const diffMs = agora.getTime() - dataInicio.getTime();
        if (diffMs > 0) {
          diasDecorridos = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        } else {
          diasDecorridos = 0; // Se a data for hoje ou futura, inicia no Dia 1
        }
      } else {
        // Fallback dinâmico: se a data estiver vazia, rotaciona automaticamente usando o dia do ano
        const inicioAno = new Date(agora.getFullYear(), 0, 1);
        diasDecorridos = Math.floor((agora.getTime() - inicioAno.getTime()) / (1000 * 60 * 60 * 24));
      }

      // 9.1 Atualizar Artigo Semanal (1 artigo novo a cada 7 dias, rotativo)
      const todosArtigos = (data.acervo_artigos && data.acervo_artigos.length > 0) 
        ? data.acervo_artigos 
        : (data.artigo_semana ? [data.artigo_semana] : []);

      if (todosArtigos.length > 0) {
        const semanaAtual = Math.floor(diasDecorridos / 7);
        const artIndex = (config.rotacao_automatica !== false)
          ? (semanaAtual % todosArtigos.length)
          : Math.min(semanaAtual, todosArtigos.length - 1);
        const art = todosArtigos[artIndex];

        const titleEl = document.querySelector('.article-featured-title');
        const excerptEl = document.querySelector('.article-excerpt');
        const authorNameEl = document.querySelector('.article-author-card .author-name');
        const authorRoleEl = document.querySelector('.article-author-card .author-role');
        const readingTimeEl = document.querySelector('.weekly-article-card .reading-time');

        if (titleEl && art.titulo) titleEl.textContent = art.titulo;
        if (excerptEl && art.resumo) excerptEl.textContent = art.resumo;
        if (authorNameEl && art.autor) authorNameEl.textContent = art.autor;
        if (authorRoleEl && (art.especialidade || art.crm)) {
          authorRoleEl.textContent = `${art.especialidade || ''} • ${art.crm || ''}`;
        }
        if (readingTimeEl && art.tempo_leitura) {
          readingTimeEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg> ${art.tempo_leitura}`;
        }

        // Atualizar Modal do Artigo
        const modalTitle = document.getElementById('articleModalTitle');
        const modalMeta = document.querySelector('.article-modal-meta');
        const modalBody = document.querySelector('.article-modal-body');

        if (modalTitle && art.titulo) modalTitle.textContent = art.titulo;
        if (modalMeta && art.autor) {
          modalMeta.innerHTML = `<span>Por <strong>${art.autor}</strong> (${art.crm || ''})</span><span>•</span><span>${art.especialidade || ''}</span><span>•</span><span>Semana ${semanaAtual + 1}</span>`;
        }
        if (modalBody && art.topicos) {
          let bodyHtml = `<p class="article-lead-text">${art.lead || ''}</p>`;
          art.topicos.forEach(topico => {
            bodyHtml += `<h3>${topico.titulo}</h3><p>${topico.texto}</p>`;
          });
          if (art.conclusao) {
            bodyHtml += `<div class="article-modal-conclusion"><h4>Conclusão &amp; Próximos Passos</h4><p>${art.conclusao}</p></div>`;
          }
          modalBody.innerHTML = bodyHtml;
        }
      }

      // 9.2 Função Modular para Renderizar Dica no Painel Principal
      const renderTipToMain = (tip, targetCategory = null) => {
        if (!tip) return;

        // Atualiza a data dinâmica no topo do card
        const pillDateEl = document.getElementById('pillCurrentDate');
        if (pillDateEl) {
          try {
            const now = new Date();
            const options = { weekday: 'long', day: 'numeric', month: 'long' };
            let formattedDate = new Intl.DateTimeFormat('pt-BR', options).format(now);
            formattedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
            pillDateEl.textContent = formattedDate;
          } catch (e) {}
        }

        // Atualiza o selo da edição atual da pílula
        const liveBadgeText = document.querySelector('.pill-live-badge span:not(.pulse-indicator)');
        if (liveBadgeText && tip.dia) {
          liveBadgeText.textContent = `Pílula do Dia • Edição #${String(tip.dia).padStart(2, '0')} • Atualizado Hoje`;
        }

        // Atualizar Card Nutriente / Hábito & Raio-X
        const nutCard = document.querySelector('.pill-content-card[data-pill="nutriente"]');
        if (nutCard && tip.nutriente) {
          const nut = tip.nutriente;
          
          const habitTitleEl = nutCard.querySelector('#pillHabitTitle') || nutCard.querySelector('.pill-title');
          const habitDescEl = nutCard.querySelector('#pillHabitDesc') || nutCard.querySelector('.pill-body-text');
          if (habitTitleEl) habitTitleEl.textContent = nut.habito_titulo || nut.titulo;
          if (habitDescEl) habitDescEl.textContent = nut.habito_descricao || nut.descricao;

          const nutValEl = nutCard.querySelector('#pillNutrientName .xray-val');
          const nutTypeEl = nutCard.querySelector('#pillNutrientType');
          const nutFuncEl = nutCard.querySelector('#pillNutrientFunction');
          const nutSourcesEl = nutCard.querySelector('#pillNutrientSources') || nutCard.querySelector('.pill-highlight-box p');

          if (nutValEl) nutValEl.textContent = nut.nutriente_nome || nut.titulo;
          if (nutTypeEl && nut.nutriente_tipo) nutTypeEl.textContent = nut.nutriente_tipo;
          if (nutFuncEl) nutFuncEl.textContent = nut.o_que_faz || nut.descricao;
          if (nutSourcesEl) nutSourcesEl.textContent = nut.fontes_alimentares || nut.fontes;

          const noteTextEl = nutCard.querySelector('#pillDoctorNoteText');
          const noteContainerEl = nutCard.querySelector('.pill-doctor-note span');
          if (noteTextEl && nut.orientacao_medica) {
            noteTextEl.textContent = nut.orientacao_medica;
          } else if (noteContainerEl && nut.orientacao_medica) {
            noteContainerEl.innerHTML = `<em>Orientação Médica:</em> ${nut.orientacao_medica}`;
          }

          const docNameEl = nutCard.querySelector('#pillDoctorName') || nutCard.querySelector('.doctor-name');
          const docAreaEl = nutCard.querySelector('#pillDoctorArea') || nutCard.querySelector('.doctor-badge');
          if (docNameEl && nut.medico) docNameEl.textContent = `Supervisão: ${nut.medico}`;
          if (docAreaEl && nut.area) docAreaEl.textContent = nut.area;

          const shareBtn = nutCard.querySelector('.pill-share-btn');
          if (shareBtn) {
            const hTitle = nut.habito_titulo || nut.titulo || 'Pílula de Saúde';
            const hDesc = nut.habito_descricao || nut.descricao || '';
            const nName = nut.nutriente_nome || 'Nutriente';
            const nType = nut.nutriente_tipo ? ` (${nut.nutriente_tipo})` : '';
            const nFunc = nut.o_que_faz || '';
            const nSources = nut.fontes_alimentares || nut.fontes || '';

            let shareText = `🌟 *Pílula de Saúde Diária (Edição #${tip.dia}) | Instituto Dermaline*\n\n`;
            shareText += `🧘 *O Hábito do Dia:* ${hTitle}\n${hDesc}\n\n`;
            shareText += `🔬 *Raio-X do Nutriente:* ${nName}${nType}\n`;
            if (nFunc) shareText += `• _O que faz no organismo:_ ${nFunc}\n`;
            if (nSources) shareText += `• _Fontes alimentares:_ ${nSources}\n\n`;
            shareText += `👨‍⚕️ _Supervisão: ${nut.medico || 'Dr. Renato Nakad Gouveia'} (${nut.area || 'Medicina Integrativa'})_\n`;
            shareText += `👉 Acompanhe as dicas diárias em: ${window.location.href}`;

            shareBtn.href = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
          }
        }

        // Atualizar Card Dermatologia
        const dermCard = document.querySelector('.pill-content-card[data-pill="dermatologia"]');
        if (dermCard && tip.dermatologia) {
          const derm = tip.dermatologia;
          const t = dermCard.querySelector('.pill-title');
          const desc = dermCard.querySelector('.pill-body-text');
          const high = dermCard.querySelector('.pill-highlight-box p');
          const note = dermCard.querySelector('.pill-doctor-note span');
          const docName = dermCard.querySelector('.doctor-name');
          const shareBtn = dermCard.querySelector('.pill-share-btn');

          if (t) t.textContent = derm.titulo;
          if (desc) desc.textContent = derm.descricao;
          if (high) high.textContent = derm.destaque_texto;
          if (note) note.innerHTML = `<em>Orientação Médica:</em> ${derm.orientacao_medica}`;
          if (docName) docName.textContent = `Supervisão: ${derm.medico}`;
          if (shareBtn) {
            const msg = encodeURIComponent(`Dica de Dermatologia do Instituto Dermaline: ${derm.titulo}. ${derm.destaque_texto} Confira mais em: ${window.location.href}`);
            shareBtn.href = `https://wa.me/?text=${msg}`;
          }
        }

        // Atualizar Card Beleza
        const belCard = document.querySelector('.pill-content-card[data-pill="beleza"]');
        if (belCard && tip.beleza) {
          const bel = tip.beleza;
          const t = belCard.querySelector('.pill-title');
          const desc = belCard.querySelector('.pill-body-text');
          const high = belCard.querySelector('.pill-highlight-box p');
          const note = belCard.querySelector('.pill-doctor-note span');
          const docName = belCard.querySelector('.doctor-name');
          const shareBtn = belCard.querySelector('.pill-share-btn');

          if (t) t.textContent = bel.titulo;
          if (desc) desc.textContent = bel.descricao;
          if (high) high.textContent = bel.destaque_texto;
          if (note) note.innerHTML = `<em>Orientação Médica:</em> ${bel.orientacao_medica}`;
          if (docName) docName.textContent = `Supervisão: ${bel.medico}`;
          if (shareBtn) {
            const msg = encodeURIComponent(`Dica de Beleza do Instituto Dermaline: ${bel.titulo}. ${bel.destaque_texto} Confira mais em: ${window.location.href}`);
            shareBtn.href = `https://wa.me/?text=${msg}`;
          }
        }

        // Se uma especialidade específica foi selecionada, ativa a respectiva aba no painel
        if (targetCategory) {
          const targetTabBtn = document.querySelector(`.pill-tab-btn[data-pill="${targetCategory}"]`);
          if (targetTabBtn) {
            targetTabBtn.click();
          }
        }
      };

      // 9.3 Rotação Diária Automática a Partir do Dia 1 (Rotação Contínua sem Travar)
      if (data.dicas_diarias && data.dicas_diarias.length > 0) {
        const totalDicas = data.dicas_diarias.length;
        // Pega a edição pelo dia decorrido; rotaciona ciclicamente se rotacao_automatica for true
        const postIndex = (config.rotacao_automatica !== false)
          ? (diasDecorridos % totalDicas)
          : Math.min(diasDecorridos, totalDicas - 1);
        const tipToday = data.dicas_diarias[postIndex];

        renderTipToMain(tipToday);

        // 9.4 Acervo de Dicas: Disponibiliza todo o acervo completo para consulta, filtros e busca
        initAcervoSystem(data.dicas_diarias, renderTipToMain);

        // 9.5 Acervo de Reflexões Médicas: Disponibiliza os artigos completos para consulta
        initReflexoesSystem(todosArtigos);
      }
    } catch (err) {
      console.error('Error in loadDailyContent:', err);
    }
  };

  // 10. Sistema de Consulta ao Acervo Completo (32 Edições)
  function initAcervoSystem(allTips, onSelectTip) {
    const modal = document.getElementById('acervoModal');
    const openBtn = document.getElementById('btnOpenAcervo');
    const closeBtn = document.getElementById('closeAcervoModalBtn');
    const grid = document.getElementById('acervoGrid');
    const searchInput = document.getElementById('acervoSearchInput');
    const clearBtn = document.getElementById('clearAcervoSearch');
    const counterEl = document.getElementById('acervoCounter');
    const catBtns = document.querySelectorAll('.acervo-cat-btn');

    if (!modal || !grid) return;

    let activeCat = 'all';
    let searchQuery = '';

    // Criar catálogo plano de publicações individuais separadas por especialidade
    const allItems = [];
    allTips.forEach(tip => {
      // 1. Hábito & Nutriente (Medicina Integrativa - Dr. Renato)
      if (tip.nutriente) {
        allItems.push({
          day: tip.dia,
          category: 'nutriente',
          categoryLabel: 'Medicina Integrativa',
          categoryBadge: '🌱 Medicina Integrativa',
          badgeClass: 'badge-nutriente',
          title: tip.nutriente.habito_titulo || tip.nutriente.titulo,
          excerpt: tip.nutriente.habito_descricao || tip.nutriente.descricao,
          highlight: `🔬 ${tip.nutriente.nutriente_nome || 'Nutriente'} (${tip.nutriente.nutriente_tipo || 'Bioativo'})`,
          doctor: tip.nutriente.medico || 'Dr. Renato Nakad Gouveia',
          doctorArea: tip.nutriente.area || 'Medicina Integrativa',
          tipRef: tip
        });
      }

      // 2. Lesões & Prevenção (Dermatologia Clínica - Dra. Line)
      if (tip.dermatologia) {
        allItems.push({
          day: tip.dia,
          category: 'dermatologia',
          categoryLabel: 'Lesões & Prevenção',
          categoryBadge: '🛡️ Lesões & Prevenção',
          badgeClass: 'badge-dermatologia',
          title: tip.dermatologia.titulo,
          excerpt: tip.dermatologia.descricao,
          highlight: `🩺 ${tip.dermatologia.destaque_texto || 'Dermatologia Clínica'}`,
          doctor: tip.dermatologia.medico || 'Dra. Line Manuelle Gouveia',
          doctorArea: tip.dermatologia.area || 'Dermatologia Clínica',
          tipRef: tip
        });
      }

      // 3. Beleza & Skincare (Dermatologia Estética - Dra. Line)
      if (tip.beleza) {
        allItems.push({
          day: tip.dia,
          category: 'beleza',
          categoryLabel: 'Beleza & Skincare',
          categoryBadge: '✨ Beleza & Skincare',
          badgeClass: 'badge-beleza',
          title: tip.beleza.titulo,
          excerpt: tip.beleza.descricao,
          highlight: `💆 ${tip.beleza.destaque_texto || 'Protocolo Facial'}`,
          doctor: tip.beleza.medico || 'Dra. Line Manuelle Gouveia',
          doctorArea: tip.beleza.area || 'Dermatologia Estética',
          tipRef: tip
        });
      }
    });

    // Renderizar Cards no Acervo
    const renderAcervo = () => {
      const q = searchQuery.toLowerCase().trim();

      const filtered = allItems.filter(item => {
        // Filtro por Categoria Exclusiva
        if (activeCat !== 'all' && item.category !== activeCat) {
          return false;
        }

        // Filtro de Busca por Palavra-Chave
        if (!q) return true;

        const titleText = (item.title || '').toLowerCase();
        const descText = (item.excerpt || '').toLowerCase();
        const highlightText = (item.highlight || '').toLowerCase();
        const docText = (item.doctor || '').toLowerCase();
        const catText = (item.categoryLabel || '').toLowerCase();

        return (
          titleText.includes(q) ||
          descText.includes(q) ||
          highlightText.includes(q) ||
          docText.includes(q) ||
          catText.includes(q) ||
          `edicao ${item.day}`.includes(q)
        );
      });

      // Atualizar Contador com o nome da especialidade filtrada
      if (counterEl) {
        const catName = activeCat === 'all' 
          ? 'ao todo em todas as especialidades' 
          : (activeCat === 'nutriente' ? 'em Medicina Integrativa' : (activeCat === 'dermatologia' ? 'em Lesões & Prevenção' : 'em Beleza & Skincare'));
        counterEl.innerHTML = `Exibindo <strong>${filtered.length}</strong> publicações ${catName}`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
            <p style="font-size: 1.1rem; margin-bottom: 8px;">Nenhuma publicação encontrada para "<strong>${searchQuery}</strong>".</p>
            <p style="font-size: 0.85rem;">Tente buscar por termos como <em>Melasma, Colágeno, Protetor, Vitamina C, Pintas</em> ou <em>Ácido Hialurônico</em>.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(item => {
        const shareMsg = encodeURIComponent(
          `🌟 ${item.categoryBadge} (Edição #${String(item.day).padStart(2, '0')}) | Instituto Dermaline\n` +
          `📌 ${item.title}\n` +
          `• ${item.highlight}\n` +
          `• ${item.excerpt}\n` +
          `👉 Consulte o acervo completo em: ${(typeof window !== 'undefined' && window.location) ? window.location.href : ''}`
        );

        return `
          <div class="acervo-card-item" data-id="${item.day}" data-cat="${item.category}">
            <div class="acervo-card-header">
              <span class="acervo-specialty-badge ${item.badgeClass}">${item.categoryBadge}</span>
              <span class="acervo-card-badge">Edição #${String(item.day).padStart(2, '0')}</span>
            </div>
            
            <h4 class="acervo-card-title">${item.title}</h4>
            <div class="acervo-highlight-snippet">${item.highlight}</div>
            <p class="acervo-card-excerpt">${item.excerpt}</p>

            <div class="acervo-card-meta-line">
              <small><strong>${item.doctor}</strong> • ${item.doctorArea}</small>
            </div>

            <div class="acervo-card-footer">
              <button type="button" class="acervo-apply-btn" data-day="${item.day}" data-cat="${item.category}">
                <span>Ver no Painel (${item.categoryLabel})</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>

              <a href="https://wa.me/?text=${shareMsg}" target="_blank" rel="noopener noreferrer" class="acervo-share-link" aria-label="Compartilhar no WhatsApp">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.598 2.664-.699c.971.53 1.777.822 2.796.822 3.182 0 5.768-2.587 5.769-5.766.001-3.182-2.585-5.769-5.769-5.769zm10.222 5.766c-.002 5.647-4.595 10.24-10.245 10.24-1.785 0-3.529-.465-5.068-1.347l-5.632 1.477 1.503-5.485c-.968-1.602-1.48-3.46-1.48-5.385.002-5.646 4.595-10.24 10.245-10.24 5.65 0 10.245 4.593 10.245 10.24zm-1.895 0c0-4.606-3.743-8.349-8.35-8.349-4.608 0-8.35 3.743-8.35 8.349 0 1.579.444 3.091 1.282 4.407l-.887 3.238 3.32-.871c1.261.764 2.71 1.173 4.285 1.173 4.608 0 8.35-3.743 8.35-8.347z"/>
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        `;
      }).join('');

      // Ação de carregar publicação no painel principal e ativar a aba da especialidade
      grid.querySelectorAll('.acervo-apply-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const dayNum = parseInt(btn.getAttribute('data-day'), 10);
          const targetCat = btn.getAttribute('data-cat');
          const selected = allTips.find(t => t.dia === dayNum);
          if (selected) {
            onSelectTip(selected, targetCat);
            closeAcervoModal();
            // Rolar suavemente até o painel
            const journalSec = document.getElementById('diario');
            if (journalSec) {
              journalSec.scrollIntoView({ behavior: 'smooth' });
            }
          }
        });
      });
    };

    // Abertura e Fechamento do Modal
    const openAcervoModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderAcervo();
      setTimeout(() => searchInput?.focus(), 150);
    };

    const closeAcervoModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', openAcervoModal);
    if (closeBtn) closeBtn.addEventListener('click', closeAcervoModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeAcervoModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeAcervoModal();
      }
    });

    // Eventos de Busca
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
        renderAcervo();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearBtn.style.display = 'none';
        renderAcervo();
      });
    }

    // Filtros de Categoria
    catBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        catBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeCat = btn.getAttribute('data-cat');
        renderAcervo();
      });
    });
  };

  // 11. Sistema de Consulta ao Acervo de Reflexões Médicas 📖
  function initReflexoesSystem(artigos) {
    const modal = document.getElementById('reflexoesModal');
    const openBtn = document.getElementById('btnOpenReflexoes');
    const closeBtn = document.getElementById('closeReflexoesModalBtn');
    const grid = document.getElementById('reflexoesGrid');
    const searchInput = document.getElementById('reflexoesSearchInput');
    const clearBtn = document.getElementById('clearReflexoesSearch');
    const counterEl = document.getElementById('reflexoesCounter');
    const authorBtns = document.querySelectorAll('.reflexoes-author-btn');

    if (!modal || !grid) return;

    let activeAuthor = 'all';
    let searchQuery = '';

    // Função para abrir o artigo no modal de leitura completa
    const openFullArticle = (art) => {
      const artModal = document.getElementById('articleModal');
      if (!artModal) return;

      const modalTitle = document.getElementById('articleModalTitle');
      const modalMeta = document.querySelector('.article-modal-meta');
      const modalBody = document.querySelector('.article-modal-body');

      if (modalTitle && art.titulo) modalTitle.textContent = art.titulo;
      if (modalMeta && art.autor) {
        modalMeta.innerHTML = `<span>Por <strong>${art.autor}</strong> (${art.crm || ''})</span><span>•</span><span>${art.especialidade || ''}</span><span>•</span><span>Ensaio Clínico</span>`;
      }
      if (modalBody && art.topicos) {
        let bodyHtml = `<p class="article-lead-text">${art.lead || ''}</p>`;
        art.topicos.forEach(topico => {
          bodyHtml += `<h3>${topico.titulo}</h3><p>${topico.texto}</p>`;
        });
        if (art.conclusao) {
          bodyHtml += `<div class="article-modal-conclusion"><h4>Conclusão &amp; Próximos Passos</h4><p>${art.conclusao}</p></div>`;
        }
        modalBody.innerHTML = bodyHtml;
      }

      // Fecha o modal de lista e abre o de leitura imersiva
      modal.classList.remove('open');
      artModal.classList.add('open');
      document.body.style.overflow = 'hidden';
    };

    // Renderizar Cards de Reflexões
    const renderReflexoes = () => {
      const q = searchQuery.toLowerCase().trim();

      const filtered = artigos.filter(art => {
        // Filtro de Autor
        let matchAuthor = true;
        if (activeAuthor === 'renato') matchAuthor = (art.autor || '').includes('Renato');
        if (activeAuthor === 'line') matchAuthor = (art.autor || '').includes('Line');

        if (!matchAuthor) return false;

        // Filtro de Texto
        if (!q) return true;

        const title = (art.titulo || '').toLowerCase();
        const resumo = (art.resumo || '').toLowerCase();
        const lead = (art.lead || '').toLowerCase();
        const autor = (art.autor || '').toLowerCase();
        const topicosText = (art.topicos || []).map(t => `${t.titulo} ${t.texto}`).join(' ').toLowerCase();

        return (
          title.includes(q) ||
          resumo.includes(q) ||
          lead.includes(q) ||
          autor.includes(q) ||
          topicosText.includes(q)
        );
      });

      // Atualizar Contador
      if (counterEl) {
        counterEl.innerHTML = `Exibindo <strong>${filtered.length}</strong> artigos médicos`;
      }

      if (filtered.length === 0) {
        grid.innerHTML = `
          <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: var(--color-text-muted);">
            <p style="font-size: 1.1rem; margin-bottom: 8px;">Nenhuma reflexão médica encontrada para "<strong>${searchQuery}</strong>".</p>
            <p style="font-size: 0.85rem;">Tente buscar por temas como <em>Mitocôndrias, Inflammaging, Colágeno, Melasma</em> ou <em>Barreira Cutânea</em>.</p>
          </div>
        `;
        return;
      }

      grid.innerHTML = filtered.map(art => {
        return `
          <div class="reflexao-card-item" data-id="${art.id || 1}">
            <div class="reflexao-card-meta">
              <span class="reflexao-reading-time">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polyline points="12 6 12 12 16 14"></polyline>
                </svg>
                ${art.tempo_leitura || 'Leitura de 3 min'}
              </span>
              <span class="reflexao-author-badge">${art.autor || 'Corpo Clínico'}</span>
            </div>

            <h4 class="reflexao-card-title">${art.titulo}</h4>
            <p class="reflexao-card-excerpt">${art.resumo}</p>

            <div class="reflexao-card-footer">
              <span style="font-size: 0.74rem; color: var(--color-text-muted);">${art.crm || ''}</span>
              <button type="button" class="reflexao-read-btn" data-id="${art.id || 1}">
                <span>Ler Reflexão Completa</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </button>
            </div>
          </div>
        `;
      }).join('');

      // Eventos de clique nos botões "Ler Reflexão Completa"
      grid.querySelectorAll('.reflexao-read-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          const artId = parseInt(btn.getAttribute('data-id'), 10);
          const selected = artigos.find(a => a.id === artId) || artigos[0];
          openFullArticle(selected);
        });
      });
    };

    // Abertura e Fechamento
    const openReflexoesModal = () => {
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      renderReflexoes();
      setTimeout(() => searchInput?.focus(), 150);
    };

    const closeReflexoesModal = () => {
      modal.classList.remove('open');
      document.body.style.overflow = '';
    };

    if (openBtn) openBtn.addEventListener('click', openReflexoesModal);
    if (closeBtn) closeBtn.addEventListener('click', closeReflexoesModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeReflexoesModal();
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        closeReflexoesModal();
      }
    });

    // Eventos de Busca
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) clearBtn.style.display = searchQuery ? 'block' : 'none';
        renderReflexoes();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        searchQuery = '';
        if (searchInput) {
          searchInput.value = '';
          searchInput.focus();
        }
        clearBtn.style.display = 'none';
        renderReflexoes();
      });
    }

    // Filtros por Autor
    authorBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        authorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        activeAuthor = btn.getAttribute('data-author');
        renderReflexoes();
      });
    });
  };

  loadDailyContent();

  // 9. Interatividade da Seção de Convênios Credenciados
  const initConveniosShowcase = () => {
    const searchInput = document.getElementById('convenioSearchInput');
    const clearBtn = document.getElementById('clearConvenioSearch');
    const tabBtns = document.querySelectorAll('.convenio-tab-btn');
    const conveniosGrid = document.getElementById('conveniosGrid');
    const convenioBadges = document.querySelectorAll('.convenio-badge');
    const counterEl = document.getElementById('conveniosCounter');
    const emptyState = document.getElementById('conveniosEmptyState');
    const searchTermEl = document.getElementById('convenioSearchTerm');
    const toggleExpandBtn = document.getElementById('toggleExpandConvenios');
    const scrollArea = document.getElementById('conveniosScrollArea');
    const expandBtnText = document.getElementById('expandBtnText');

    if (!conveniosGrid || convenioBadges.length === 0) return;

    let activeCategory = 'all';
    let searchQuery = '';

    const normalizeStr = (str) => {
      return (str || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim();
    };

    const filterConvenios = () => {
      let visibleCount = 0;
      const normalizedQuery = normalizeStr(searchQuery);

      convenioBadges.forEach(badge => {
        const badgeCategory = badge.getAttribute('data-category');
        const badgeName = normalizeStr(badge.getAttribute('data-name') || '');
        const badgeText = normalizeStr(badge.textContent || '');

        const matchesCategory = (activeCategory === 'all' || badgeCategory === activeCategory);
        const matchesSearch = (!normalizedQuery || badgeName.includes(normalizedQuery) || badgeText.includes(normalizedQuery));

        if (matchesCategory && matchesSearch) {
          badge.style.display = 'flex';
          visibleCount++;
        } else {
          badge.style.display = 'none';
        }
      });

      // Atualiza contador
      if (counterEl) {
        if (visibleCount === 0) {
          counterEl.innerHTML = 'Nenhum convênio credenciado correspondente';
        } else if (visibleCount === convenioBadges.length) {
          counterEl.innerHTML = `Exibindo <strong>${visibleCount}</strong> convênios credenciados`;
        } else {
          counterEl.innerHTML = `Exibindo <strong>${visibleCount}</strong> de <strong>${convenioBadges.length}</strong> convênios`;
        }
      }

      // Estado vazio
      if (emptyState) {
        if (visibleCount === 0) {
          emptyState.style.display = 'block';
          if (searchTermEl) searchTermEl.textContent = searchQuery;
          conveniosGrid.style.display = 'none';
        } else {
          emptyState.style.display = 'none';
          conveniosGrid.style.display = 'grid';
        }
      }
    };

    // Eventos de Busca
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value;
        if (clearBtn) {
          clearBtn.style.display = searchQuery.length > 0 ? 'block' : 'none';
        }
        filterConvenios();
      });
    }

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) {
          searchInput.value = '';
          searchQuery = '';
          clearBtn.style.display = 'none';
          searchInput.focus();
          filterConvenios();
        }
      });
    }

    // Eventos das Abas
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        activeCategory = btn.getAttribute('data-category') || 'all';
        filterConvenios();
      });
    });

    // Alternador de Expansão
    if (toggleExpandBtn && scrollArea) {
      toggleExpandBtn.addEventListener('click', () => {
        const isExpanded = scrollArea.classList.toggle('expanded');
        toggleExpandBtn.classList.toggle('expanded', isExpanded);
        if (expandBtnText) {
          expandBtnText.textContent = isExpanded 
            ? 'Recolher visualização' 
            : `Ver todos os ${convenioBadges.length} convênios em grade aberta`;
        }
      });
    }
  };

  initConveniosShowcase();

  // ==========================================================================
  // 6. ANIMAÇÃO CINEMATOGRÁFICA DO CORPO CLÍNICO (Entrada Dourada Fluida)
  // ==========================================================================
  const initTeamSectionAnimation = () => {
    const section = document.getElementById('corpo-clinico');
    const splitTitle = document.getElementById('teamSplitTitle');
    const cards = document.querySelectorAll('.team-card');

    if (!section || !splitTitle) return;

    // 1. Preparação Semântica do Split-Text (Preserva acessibilidade para leitores de tela)
    const rawText = splitTitle.textContent.trim();
    splitTitle.setAttribute('aria-label', rawText);
    splitTitle.innerHTML = '';

    const words = rawText.split(' ');
    let globalIndex = 0;

    // Dispersão elegante e suave para cada letra
    const dispersionVectors = [
      { x: -35, y: -22, rot: -10 },
      { x: 30,  y: 25,  rot: 8 },
      { x: -40, y: 18,  rot: -12 },
      { x: 35,  y: -24, rot: 11 },
      { x: -25, y: 30,  rot: -8 },
      { x: 38,  y: 20,  rot: 10 },
      { x: -32, y: -28, rot: -9 },
      { x: 36,  y: 32,  rot: 12 },
      { x: -38, y: 22,  rot: -11 },
      { x: 28,  y: -26, rot: 9 },
      { x: -42, y: -20, rot: -10 },
      { x: 34,  y: 28,  rot: 11 },
      { x: -28, y: 26,  rot: -8 },
      { x: 38,  y: -28, rot: 12 },
      { x: -34, y: -24, rot: -10 },
      { x: 32,  y: 26,  rot: 9 },
      { x: -24, y: 32,  rot: -7 }
    ];

    words.forEach((word, wIndex) => {
      const wordSpan = document.createElement('span');
      wordSpan.className = 'split-word';
      wordSpan.setAttribute('aria-hidden', 'true');

      for (let i = 0; i < word.length; i++) {
        const char = word[i];
        const charSpan = document.createElement('span');
        charSpan.className = 'split-char';
        charSpan.textContent = char;

        const v = dispersionVectors[globalIndex % dispersionVectors.length];
        charSpan.style.setProperty('--scatter-x', v.x + 'px');
        charSpan.style.setProperty('--scatter-y', v.y + 'px');
        charSpan.style.setProperty('--scatter-rot', v.rot + 'deg');
        // Escalonamento de delay suave para convergir em cascata
        charSpan.style.transitionDelay = (globalIndex * 0.025).toFixed(3) + 's';

        wordSpan.appendChild(charSpan);
        globalIndex++;
      }

      splitTitle.appendChild(wordSpan);

      if (wIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.className = 'split-space';
        spaceSpan.innerHTML = '&nbsp;';
        spaceSpan.setAttribute('aria-hidden', 'true');
        splitTitle.appendChild(spaceSpan);
      }
    });

    // 2. Disparo Automático Nobre ao Entrar na Tela
    let hasTriggered = false;

    const activateAnimation = () => {
      if (hasTriggered) return;
      hasTriggered = true;
      section.classList.add('is-active');
    };

    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            activateAnimation();
            observer.unobserve(entry.target);
          }
        });
      }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      });

      observer.observe(section);
    } else {
      activateAnimation();
    }

    // Suporte a âncora de menu #corpo-clinico
    window.addEventListener('hashchange', () => {
      if (window.location.hash === '#corpo-clinico') {
        activateAnimation();
      }
    });

    // 3. Microinteratividade Nobre no Hover com Mouse (Desktop)
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (!isTouchDevice && window.innerWidth >= 1024) {
      cards.forEach(card => {
        let isHovered = false;
        let rAF = null;

        card.addEventListener('mouseenter', () => {
          isHovered = true;
        });

        card.addEventListener('mousemove', (e) => {
          if (!isHovered) return;
          const rect = card.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const rotateX = ((y - centerY) / centerY) * -2.5;
          const rotateY = ((x - centerX) / centerX) * 2.5;

          if (rAF) cancelAnimationFrame(rAF);
          rAF = requestAnimationFrame(() => {
            card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
          });
        });

        card.addEventListener('mouseleave', () => {
          isHovered = false;
          if (rAF) cancelAnimationFrame(rAF);
          card.style.transform = '';
        });
      });
    }
  };

  /* =========================================================================
     MÓDULO DE GALERIA E LIGHTBOX DO INSTITUTO DERMALINE 🏛️🖼️
     ========================================================================= */
  const initGalleryLightbox = () => {
    const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));
    const tabBtns = document.querySelectorAll('.gallery-tab-btn');
    const modal = document.getElementById('galleryLightbox');
    if (!modal || galleryItems.length === 0) return;

    const backdrop = document.getElementById('galleryLightboxBackdrop');
    const closeBtn = document.getElementById('galleryLightboxClose');
    const prevBtn = document.getElementById('galleryLightboxPrev');
    const nextBtn = document.getElementById('galleryLightboxNext');
    const imgEl = document.getElementById('galleryLightboxImg');
    const counterEl = document.getElementById('galleryLightboxCounter');
    const titleEl = document.getElementById('galleryLightboxTitle');
    const descEl = document.getElementById('galleryLightboxDesc');

    let currentVisibleItems = [...galleryItems];
    let currentIndex = 0;

    // Filtros por Categoria
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        const filter = btn.getAttribute('data-filter');
        currentVisibleItems = [];

        galleryItems.forEach(item => {
          const cat = item.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            item.classList.remove('hidden-item');
            currentVisibleItems.push(item);
          } else {
            item.classList.add('hidden-item');
          }
        });
      });
    });

    const updateLightbox = (index) => {
      if (currentVisibleItems.length === 0) return;
      if (index < 0) index = currentVisibleItems.length - 1;
      if (index >= currentVisibleItems.length) index = 0;
      currentIndex = index;

      const item = currentVisibleItems[currentIndex];
      const src = item.getAttribute('data-src');
      const title = item.getAttribute('data-title') || '';
      const desc = item.getAttribute('data-desc') || '';

      imgEl.src = src;
      imgEl.alt = title;
      titleEl.textContent = title;
      descEl.textContent = desc;
      counterEl.textContent = `${currentIndex + 1} / ${currentVisibleItems.length}`;
    };

    const openLightbox = (item) => {
      const idx = currentVisibleItems.indexOf(item);
      currentIndex = idx >= 0 ? idx : 0;
      updateLightbox(currentIndex);
      modal.classList.add('active');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    const closeLightbox = () => {
      modal.classList.remove('active');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    galleryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });

    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    if (backdrop) backdrop.addEventListener('click', closeLightbox);

    if (prevBtn) {
      prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentIndex - 1);
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLightbox(currentIndex + 1);
      });
    }

    document.addEventListener('keydown', (e) => {
      if (!modal.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') updateLightbox(currentIndex - 1);
      if (e.key === 'ArrowRight') updateLightbox(currentIndex + 1);
    });
  };

  initTeamSectionAnimation();
  initGalleryLightbox();
});
