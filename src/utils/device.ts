export function slugifyFaqId(question: string): string {
  const cleaned = question
    .toLowerCase()
    .replace(/[,']/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `faq-${cleaned}`;
}

export function buildImageSrcSet(imgUrl: string): string | undefined {
  if (!imgUrl || !imgUrl.includes('width=800')) {
    return undefined;
  }
  const w480 = imgUrl.replace('width=800', 'width=480');
  const w1200 = imgUrl.replace('width=800', 'width=1200');
  return `${w480} 480w, ${imgUrl} 800w, ${w1200} 1200w`;
}

export function isSaveDataEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  const nav = navigator as Navigator & {
    connection?: { saveData?: boolean };
  };
  return Boolean(nav.connection?.saveData);
}

export function isReducedMotionPreferred(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches || isSaveDataEnabled();
}

export function triggerHaptic(pattern: number | number[] = 8): void {
  if (isReducedMotionPreferred()) return;
  try {
    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      navigator.vibrate(pattern);
    }
  } catch {
    // Ignore when vibration API is restricted or unsupported
  }
}

export async function copyTextWithFallback(text: string): Promise<boolean> {
  try {
    if (
      typeof navigator !== 'undefined' &&
      navigator.clipboard &&
      typeof navigator.clipboard.writeText === 'function'
    ) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
    // Fall through to execCommand fallback
  }

  try {
    if (typeof document === 'undefined') return false;
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.setAttribute('readonly', '');
    textarea.style.position = 'fixed';
    textarea.style.top = '-9999px';
    textarea.style.left = '-9999px';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    const copied = document.execCommand('copy');
    document.body.removeChild(textarea);
    return copied;
  } catch {
    return false;
  }
}
