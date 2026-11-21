(() => {
  const state = { lang: 'th', index: -1, presentationStep: 0 };
  const $ = (selector) => document.querySelector(selector);
  const parts = window.COURSE_PARTS;

  function icon(name, size = 16) {
    return `<i data-lucide="${name}" style="width:${size}px;height:${size}px"></i>`;
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>'"]/g, char => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', "'":"&#39;", '"':'&quot;' }[char]));
  }

  function labels() {
    return window.I18N[state.lang];
  }

  function updatePresentationButton() {
    const button = $('#presentationButton');
    const isFullscreen = document.fullscreenElement === $('#appShell');
    const label = isFullscreen ? labels().exitPresentationMode : labels().presentationMode;
    button.setAttribute('aria-label', label);
    button.setAttribute('title', label);
    button.setAttribute('aria-pressed', String(isFullscreen));
    button.innerHTML = icon(isFullscreen ? 'minimize' : 'maximize');
    const advanceButton = $('#presentationAdvance');
    if (advanceButton) {
      advanceButton.hidden = !isFullscreen;
      advanceButton.disabled = state.presentationStep >= 5;
      advanceButton.setAttribute('aria-label', labels().revealNext);
      advanceButton.setAttribute('title', labels().revealNext);
    }
    if (window.lucide) window.lucide.createIcons();
  }

  function presentationItems() {
    return [...document.querySelectorAll('[data-presentation-item]')]
      .sort((left, right) => Number(left.dataset.presentationOrder) - Number(right.dataset.presentationOrder));
  }

  function syncPresentationItems() {
    const isFullscreen = document.fullscreenElement === $('#appShell');
    $('#appShell').classList.toggle('presentation-active', isFullscreen);
    presentationItems().forEach((item, index) => {
      item.classList.toggle('is-revealed', isFullscreen && index < state.presentationStep);
    });
  }

  function revealNextPresentationItem() {
    if (document.fullscreenElement !== $('#appShell')) return;
    const item = presentationItems()[state.presentationStep];
    if (!item) return;
    item.classList.add('is-revealed');
    state.presentationStep += 1;
    $('#presentationAdvance').disabled = state.presentationStep >= presentationItems().length;
  }

  function handleFullscreenChange() {
    state.presentationStep = 0;
    syncPresentationItems();
    updatePresentationButton();
  }

  function renderNav() {
    const coverActive = state.index === -1;
    const coverButton = `<button data-index="-1" class="relative flex w-full items-center gap-3 rounded-[8px] px-2 py-3 text-left transition ${coverActive ? 'nav-active bg-white shadow-[0_2px_12px_rgba(24,33,31,.06)]' : 'hover:bg-white/60'}" style="--accent:#E4B85C">
      <span class="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-xs font-bold ${coverActive ? 'bg-ink text-white' : 'bg-black/[0.06] text-black/55'}">00</span>
      <span class="sidebar-label min-w-0"><span class="block truncate text-[13px] font-semibold">${escapeHtml(labels().coverLabel || 'หน้าปก')}</span></span>
    </button>`;
    const navContent = coverButton + parts.map((part, index) => {
      const active = index === state.index;
      return `<button data-index="${index}" class="relative flex w-full items-center gap-3 rounded-[8px] px-2 py-3 text-left transition ${active ? 'nav-active bg-white shadow-[0_2px_12px_rgba(24,33,31,.06)]' : 'hover:bg-white/60'}" style="--accent:${part.accent}">
        <span class="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] text-xs font-bold ${active ? 'text-white' : 'bg-black/[0.06] text-black/55'}" style="${active ? `background:${part.accent}` : ''}">${String(index + 1).padStart(2,'0')}</span>
        <span class="sidebar-label min-w-0"><span class="block truncate text-[13px] font-semibold">${escapeHtml(part[state.lang].title)}</span></span>
      </button>`;
    }).join('');
    $('#lessonNav').innerHTML = navContent;
    $('#mobileLessonNav').innerHTML = navContent;
  }

  function render() {
    const t = labels();
    if (state.index === -1) {
      const cover = window.COURSE_COVER;
      const coverContent = cover ? cover[state.lang] : null;
      document.documentElement.lang = state.lang;
      document.title = `${coverContent?.title || t.title} | NAN YANG`;
      $('#brand').textContent = t.brand;
      $('#eyebrow').textContent = t.eyebrow;
      $('#sidebarProgress').textContent = `${t.progress} · 00/${String(parts.length).padStart(2,'0')}`;
      $('#progressBar').style.width = '0%';
      $('#mobileMenuTitle').textContent = t.menu;
      $('#closeMenu').setAttribute('aria-label', t.close);

      $('#lessonContent').className = 'w-full px-0 pt-0 pb-0 lg:h-full lg:overflow-hidden';
      $('#lessonContent').innerHTML = `
      <article class="cover-enter relative isolate grid h-full min-h-[calc(100vh-4rem)] overflow-hidden bg-[#F7F8F4] lg:min-h-[calc(100vh-4rem)]">
        <div class="cover-grid absolute inset-0 opacity-70" aria-hidden="true"></div>
        <div class="cover-orbit absolute -right-[12%] -top-[24%] h-[70vw] max-h-[620px] w-[70vw] max-w-[620px] rounded-full border border-[#E4B85C]/30" aria-hidden="true"><span></span></div>
        <div class="cover-orbit cover-orbit-two absolute -bottom-[30%] -left-[18%] h-[55vw] max-h-[480px] w-[55vw] max-w-[480px] rounded-full border border-[#5F746F]/20" aria-hidden="true"><span></span></div>
        <div class="relative z-10 flex flex-col justify-between p-6 sm:p-10 lg:p-12 xl:p-16">
          <div class="flex items-center gap-3">
            <span class="grid h-10 w-10 place-items-center rounded-full border border-black/10 bg-white text-xs font-bold shadow-sm">00</span>
            <span class="h-px w-12 bg-[#E4B85C]"></span>
            <span class="text-[11px] font-bold uppercase tracking-[0.18em] text-black/45">${escapeHtml(coverContent?.coverLabel || t.coverLabel || 'หน้าปก')}</span>
          </div>
          <div class="my-10 max-w-[1180px]">
            <p class="cover-kicker mb-5 text-xs font-bold uppercase tracking-[0.22em] text-[#A87935]">${escapeHtml(t.brand)}</p>
            <h1 class="cover-title text-[clamp(2.8rem,6vw,6.25rem)] font-semibold leading-[1] tracking-normal text-ink lg:whitespace-nowrap">${escapeHtml(coverContent?.title || t.title)}</h1>
            <p class="cover-subtitle mt-6 max-w-[680px] text-base leading-7 text-black/55 sm:text-xl sm:leading-8">${escapeHtml(coverContent?.subtitle || t.subtitle)}</p>
          </div>
          <div class="flex items-end justify-end border-t border-black/[0.08] pt-5">
            <button id="startCourse" class="group flex h-12 items-center gap-3 rounded-full bg-ink px-5 text-sm font-bold text-white shadow-[0_12px_30px_rgba(24,33,31,.18)] transition hover:-translate-y-1 hover:shadow-[0_18px_38px_rgba(24,33,31,.24)]" type="button">
              <span>${escapeHtml(coverContent?.startLabel || t.next)}</span><span class="grid h-8 w-8 place-items-center rounded-full bg-white/12 transition group-hover:translate-x-1">${icon('arrow-right',16)}</span>
            </button>
          </div>
        </div>
      </article>`;
      renderNav();
      syncPresentationItems();
      updatePresentationButton();
      if (window.lucide) window.lucide.createIcons();
      $('#startCourse')?.addEventListener('click', () => changeLesson(0));
      $('#lessonNav').querySelectorAll('[data-index]').forEach(button => button.addEventListener('click', () => changeLesson(Number(button.dataset.index))));
      $('#mobileLessonNav').querySelectorAll('[data-index]').forEach(button => button.addEventListener('click', () => changeLesson(Number(button.dataset.index))));
      return;
    }

    const part = parts[state.index];
    const content = part[state.lang];
    document.documentElement.lang = state.lang;
    document.title = `${content.title} | NAN YANG`;

    $('#brand').textContent = t.brand;
    $('#eyebrow').textContent = t.eyebrow;
    $('#sidebarProgress').textContent = `${t.progress} · ${String(state.index + 1).padStart(2,'0')}/${String(parts.length).padStart(2,'0')}`;
    $('#progressBar').style.width = `${((state.index + 1) / parts.length) * 100}%`;
    $('#mobileMenuTitle').textContent = t.menu;
    $('#closeMenu').setAttribute('aria-label', t.close);

    document.querySelectorAll('[data-lang]').forEach(button => {
      const active = button.dataset.lang === state.lang;
      button.className = `h-7 min-w-8 rounded-[6px] px-2 text-xs font-semibold transition ${active ? 'bg-ink text-white' : 'text-black/55 hover:bg-black/[0.05]'}`;
    });

    $('#lessonContent').className = 'mx-auto w-full max-w-none px-5 py-6 sm:px-8 lg:h-full lg:px-10 lg:pt-8 lg:pb-8 xl:px-12 2xl:px-16';
    $('#lessonContent').innerHTML = `
      <article class="lesson-enter grid gap-5 lg:min-h-[calc(100vh-7.5rem)] lg:grid-cols-[minmax(0,1fr)_45%] lg:gap-8 xl:min-h-[calc(100vh-8rem)]">
        <div class="flex min-w-0 flex-col lg:pb-0 lg:pt-6 xl:pb-0 xl:pt-8">
          <div class="mb-5 flex items-center gap-3">
            <span class="text-[11px] font-bold tracking-[0.16em] text-black/40">${t.partsLabel}</span>
            <span class="h-px w-8" style="background:${part.accent}"></span>
            <span class="text-[11px] font-bold" style="color:${part.accent}">${String(state.index + 1).padStart(2,'0')} / ${String(parts.length).padStart(2,'0')}</span>
          </div>
          <h1 data-presentation-item="title" data-presentation-order="1" class="max-w-[760px] text-[clamp(2rem,4vw,4.8rem)] leading-[1.02] font-semibold tracking-normal">${escapeHtml(content.title)}</h1>
          <p data-presentation-item="subtitle" data-presentation-order="3" class="mt-4 max-w-[700px] text-base leading-7 text-black/58 sm:text-lg">${escapeHtml(content.short)}</p>

          <div class="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 md:max-w-[760px] lg:mt-8 lg:grid-cols-1 lg:gap-5 xl:max-w-[820px] xl:grid-cols-2 xl:gap-6">
            <section data-presentation-item="important" data-presentation-order="4" class="rounded-[8px] border border-black/[0.07] border-l-[3px] bg-white p-5 shadow-[0_8px_24px_rgba(24,33,31,.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(24,33,31,.09)]" style="border-left-color:${part.accent}">
              <div class="mb-3 flex items-center gap-3 text-[13px] font-bold" style="color:${part.accent}"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] bg-[#F4F5F1]">${icon('lightbulb',17)}</span><span>${t.important}</span></div>
              <p class="text-[15px] leading-7 text-black/65">${escapeHtml(content.keyPoint)}</p>
            </section>
            <section data-presentation-item="practice" data-presentation-order="5" class="rounded-[8px] border border-black/[0.07] border-l-[3px] bg-white p-5 shadow-[0_8px_24px_rgba(24,33,31,.04)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_14px_32px_rgba(24,33,31,.09)]" style="border-left-color:${part.accent}">
              <div class="mb-3 flex items-center gap-3 text-[13px] font-bold" style="color:${part.accent}"><span class="grid h-9 w-9 shrink-0 place-items-center rounded-[7px] bg-[#F4F5F1]">${icon('check-circle-2',17)}</span><span>${t.practice}</span></div>
              <p class="text-[15px] leading-7 text-black/65">${escapeHtml(content.practice)}</p>
            </section>
          </div>
        </div>

        <div class="flex min-h-0 flex-col gap-4 lg:pb-0 lg:pt-6 xl:pt-8">
          <div data-presentation-item="image" data-presentation-order="2" class="lesson-image-frame relative aspect-[4/3] min-h-[220px] overflow-hidden rounded-[8px] bg-[#E9ECE5] sm:min-h-[300px] lg:aspect-auto lg:min-h-0 lg:flex-1 lg:max-h-none">
            <img src="${part.image}" alt="" class="absolute inset-0 h-full w-full object-contain p-3 sm:p-5 lg:p-0 lg:object-cover">
            <span class="liquid-wash" aria-hidden="true"></span>
          </div>
          <div class="mt-auto flex items-center justify-between border-t border-black/[0.07] pt-4 lg:pb-0">
            <button id="prevLesson" class="flex h-11 items-center gap-2 rounded-[8px] border border-black/10 px-4 text-xs font-bold transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-35" ${state.index === 0 ? 'disabled' : ''}>${icon('arrow-left',16)}<span class="hidden sm:inline">${t.previous}</span></button>
            <div class="flex items-center gap-3">
              <button id="nextLesson" class="flex h-11 items-center gap-2 rounded-[8px] bg-ink px-4 text-xs font-bold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-35" ${state.index === parts.length - 1 ? 'disabled' : ''}><span class="hidden sm:inline">${t.next}</span>${icon('arrow-right',16)}</button>
              <button id="presentationAdvance" class="grid h-11 w-11 place-items-center rounded-[8px] border border-black/10 bg-white transition hover:bg-black/[0.05] disabled:cursor-not-allowed disabled:opacity-35" type="button" aria-label="${t.revealNext}" title="${t.revealNext}" hidden disabled>${icon('step-forward',16)}</button>
            </div>
          </div>
        </div>
      </article>`;

    renderNav();
    syncPresentationItems();
    updatePresentationButton();
    if (window.lucide) window.lucide.createIcons();

    $('#prevLesson')?.addEventListener('click', () => changeLesson(state.index - 1));
    $('#nextLesson')?.addEventListener('click', () => changeLesson(state.index + 1));
    $('#presentationAdvance')?.addEventListener('click', revealNextPresentationItem);
    document.querySelectorAll('.lesson-image-frame').forEach(frame => {
      const washLeft = 8 + Math.random() * 64;
      const washTop = 8 + Math.random() * 64;
      const washSize = 34 + Math.random() * 24;
      const washDelay = -(Math.random() * 9);
      const washDuration = 7 + Math.random() * 5;
      const wash = frame.querySelector('.liquid-wash');
      if (wash) {
        frame.style.setProperty('--wash-left', `${washLeft}%`);
        frame.style.setProperty('--wash-top', `${washTop}%`);
        wash.style.width = `${washSize}%`;
        wash.style.animationDelay = `${washDelay}s`;
        wash.style.animationDuration = `${washDuration}s`;
      }
      frame.addEventListener('pointermove', event => {
        const rect = frame.getBoundingClientRect();
        frame.style.setProperty('--mouse-x', `${event.clientX - rect.left}px`);
        frame.style.setProperty('--mouse-y', `${event.clientY - rect.top}px`);
      });
      frame.addEventListener('pointerleave', () => {
        frame.style.removeProperty('--mouse-x');
        frame.style.removeProperty('--mouse-y');
      });
    });
    $('#lessonNav').querySelectorAll('[data-index]').forEach(button => button.addEventListener('click', () => changeLesson(Number(button.dataset.index))));
    $('#mobileLessonNav').querySelectorAll('[data-index]').forEach(button => button.addEventListener('click', () => changeLesson(Number(button.dataset.index))));
  }

  function changeLesson(index) {
    if (index < -1 || index >= parts.length) return;
    state.index = index;
    state.presentationStep = 0;
    closeMenu();
    render();

    window.scrollTo({ top: 0, behavior: 'auto' });
    const main = document.querySelector('main');
    if (main) main.scrollTo({ top: 0, behavior: 'auto' });
  }

  function openMenu() { $('#mobileOverlay').classList.remove('hidden'); }
  function closeMenu() { $('#mobileOverlay').classList.add('hidden'); }

  $('#presentationButton').addEventListener('click', async () => {
    if (window.matchMedia('(max-width: 1023px)').matches) return;
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await $('#appShell').requestFullscreen();
      }
    } catch {
      updatePresentationButton();
    }
  });
  document.addEventListener('fullscreenchange', handleFullscreenChange);

  document.querySelectorAll('[data-lang]').forEach(button => button.addEventListener('click', () => { state.lang = button.dataset.lang; render(); }));
  $('#menuButton').addEventListener('click', openMenu);
  $('#closeMenu').addEventListener('click', closeMenu);
  $('#mobileOverlay').addEventListener('click', event => { if (event.target === $('#mobileOverlay')) closeMenu(); });

  render();
})();
