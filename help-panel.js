const helpOpenBtn = document.getElementById('helpOpenBtn');
const helpCloseBtn = document.getElementById('helpCloseBtn');
const helpPanel = document.getElementById('helpPanel');

function openHelpPanel() {
  if (!helpPanel) return;
  helpPanel.classList.remove('hidden');
  document.body.classList.add('help-open-body');
  helpCloseBtn?.focus();
}

function closeHelpPanel() {
  if (!helpPanel) return;
  helpPanel.classList.add('hidden');
  document.body.classList.remove('help-open-body');
  helpOpenBtn?.focus();
}

helpOpenBtn?.addEventListener('click', openHelpPanel);
helpCloseBtn?.addEventListener('click', closeHelpPanel);
helpPanel?.addEventListener('click', event => {
  if (event.target === helpPanel) closeHelpPanel();
});

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && helpPanel && !helpPanel.classList.contains('hidden')) closeHelpPanel();
});
