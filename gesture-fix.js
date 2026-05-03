function clearSwipeLabel(card) {
  const wrap = card.closest('.swipe-wrap');
  if (wrap) wrap.classList.remove('swiping-left', 'swiping-right');
}

function resetCardSwipe(card) {
  clearSwipeLabel(card);
  card.dataset.swiped = '0';
}

attachHandlers = function () {
  document.querySelectorAll('.swipe-card').forEach(card => {
    let startX = 0;
    let startY = 0;
    let mode = null;

    card.addEventListener('touchstart', e => {
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      mode = null;
      resetCardSwipe(card);
      card.style.transition = 'none';
    }, { passive: true });

    card.addEventListener('touchmove', e => {
      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;
      const absX = Math.abs(dx);
      const absY = Math.abs(dy);
      const width = card.offsetWidth || window.innerWidth || 320;
      const intent = Math.max(24, width * 0.08);
      const reveal = Math.max(80, width * 0.25);
      const limit = Math.min(width * 0.58, width - 28);
      const wrap = card.closest('.swipe-wrap');

      if (mode === 'vertical') return;

      if (!mode) {
        if (absY > 12 && absY > absX * 1.15) {
          mode = 'vertical';
          resetCardSwipe(card);
          card.style.transform = 'translateX(0)';
          return;
        }

        if (absX > intent && absX > absY * 1.8) mode = 'horizontal';
        else {
          clearSwipeLabel(card);
          return;
        }
      }

      if (mode === 'horizontal') {
        e.preventDefault();
        card.dataset.swiped = '1';
        if (wrap) {
          wrap.classList.toggle('swiping-left', absX >= reveal && dx < 0);
          wrap.classList.toggle('swiping-right', absX >= reveal && dx > 0);
        }
        card.style.transform = `translateX(${Math.max(-limit, Math.min(limit, dx))}px)`;
      }
    }, { passive: false });

    card.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - startX;
      const width = card.offsetWidth || window.innerWidth || 320;
      const action = Math.max(150, width * 0.5);
      const limit = Math.min(width * 0.58, width - 28);
      const id = card.dataset.id;
      card.style.transition = 'transform .24s cubic-bezier(.2,.8,.2,1)';

      if (mode === 'horizontal' && dx <= -action) {
        card.style.transform = `translateX(${-limit}px)`;
        setTimeout(() => markCleared(id), 90);
        return;
      }

      if (mode === 'horizontal' && dx >= action) {
        card.style.transform = `translateX(${limit}px)`;
        setTimeout(() => markWorkedOn(id), 90);
        return;
      }

      clearSwipeLabel(card);
      card.style.transform = 'translateX(0)';
      setTimeout(() => {
        card.style.transition = '';
        resetCardSwipe(card);
      }, 260);
    });

    card.addEventListener('touchcancel', () => {
      card.style.transition = 'transform .18s ease';
      card.style.transform = 'translateX(0)';
      setTimeout(() => {
        card.style.transition = '';
        resetCardSwipe(card);
      }, 200);
    });
  });
};

render();
