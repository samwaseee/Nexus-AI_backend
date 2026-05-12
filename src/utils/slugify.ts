import slugifyLib from "slugify";

export const slugify = (text: string): string => {
  return slugifyLib(text, {
    lower: true,
    strict: true,
    trim: true,
  });
};

export const uniqueSlug = (text: string): string => {
  const base = slugify(text);
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${base}-${suffix}`;
};