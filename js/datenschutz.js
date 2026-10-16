// Widerruf gespeicherter Einwilligungen für externe Inhalte (siehe js/utils.js → requireExternalConsent)
document.getElementById('revoke-consent').addEventListener('click', () => {
  let removed = 0;
  try {
    Object.keys(localStorage).filter(k => k.startsWith('krankomat_consent_')).forEach(k => { localStorage.removeItem(k); removed++; });
  } catch (e) {}
  document.getElementById('revoke-status').textContent = removed
    ? 'Einwilligungen widerrufen. Externe Inhalte werden erst nach erneuter Zustimmung geladen.'
    : 'Es waren keine Einwilligungen gespeichert.';
});
