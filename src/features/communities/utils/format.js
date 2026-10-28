/** 18420 → "18.4k", 950 → "950". */
export const compact = (n) => {
  if (n < 1000) return String(n);
  const k = n / 1000;
  return `${k < 10 ? k.toFixed(1).replace(/\.0$/, '') : Math.round(k)}k`;
};

/** Hours → "just now", "5h", "3d". */
export const timeAgo = (hours) => {
  if (hours < 1) return 'just now';
  if (hours < 24) return `${Math.floor(hours)}h`;
  return `${Math.floor(hours / 24)}d`;
};
