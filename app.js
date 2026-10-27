const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');
const toast = document.querySelector('[data-toast]');
const recordDialog = document.querySelector('[data-record-dialog]');
const originRecord = document.querySelector('[data-origin]');
const unlockForm = document.querySelector('[data-unlock-form]');
const unlockStatus = document.querySelector('[data-unlock-status]');

const ARCHIVE_REFERENCE = 'PANACEA-0917';
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('is-visible');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), 3200);
}

menuButton?.addEventListener('click', () => {
  const open = navigation.classList.toggle('is-open');
  menuButton.setAttribute('aria-expanded', String(open));
});

navigation?.addEventListener('click', (event) => {
  if (!event.target.closest('a')) return;
  navigation.classList.remove('is-open');
  menuButton?.setAttribute('aria-expanded', 'false');
});

document.querySelectorAll('[data-placeholder-message]').forEach((button) => {
  button.addEventListener('click', () => showToast(button.dataset.placeholderMessage));
});

document.querySelectorAll('.archive-card').forEach((card) => {
  card.addEventListener('click', () => {
    recordDialog.querySelector('[data-dialog-record]').textContent = card.dataset.record;
    recordDialog.querySelector('[data-dialog-title]').textContent = card.dataset.title;
    recordDialog.querySelector('[data-dialog-copy]').textContent = card.dataset.copy;
    recordDialog.showModal();
  });
});

document.querySelectorAll('[data-dialog]').forEach((button) => {
  button.addEventListener('click', () => {
    const dialog = document.getElementById(button.dataset.dialog);
    dialog?.showModal();
  });
});

document.querySelectorAll('[data-close-dialog]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog')?.close());
});

document.querySelectorAll('dialog').forEach((dialog) => {
  dialog.addEventListener('click', (event) => {
    const bounds = dialog.getBoundingClientRect();
    const outside =
      event.clientX < bounds.left ||
      event.clientX > bounds.right ||
      event.clientY < bounds.top ||
      event.clientY > bounds.bottom;
    if (outside) dialog.close();
  });
});

unlockForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const value = new FormData(unlockForm)
    .get('archive-key')
    ?.toString()
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '');

  if (value !== ARCHIVE_REFERENCE) {
    unlockStatus.textContent = 'Reference not recognized.';
    return;
  }

  unlockStatus.textContent = 'Reference accepted.';
  originRecord.hidden = false;
  originRecord.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

document.querySelector('[data-lock-record]')?.addEventListener('click', () => {
  originRecord.hidden = true;
  document.querySelector('#archive')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

const revealItems = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08, rootMargin: '0px 0px -5% 0px' },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add('is-visible'));
}
