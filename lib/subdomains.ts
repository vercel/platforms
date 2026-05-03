import { supabase } from '@/lib/supabase';

export function isValidIcon(str: string) {
  if (str.length > 10) {
    return false;
  }

  try {
    const emojiPattern = /[\p{Emoji}]/u;
    if (emojiPattern.test(str)) {
      return true;
    }
  } catch (error) {
    console.warn(
      'Emoji regex validation failed, using fallback validation',
      error
    );
  }

  return str.length >= 1 && str.length <= 10;
}

export async function getSubdomainData(subdomain: string) {
  const sanitizedSubdomain = subdomain.toLowerCase().replace(/[^a-z0-9-]/g, '');

  const { data } = await supabase
    .from('subdomains')
    .select('emoji, created_at')
    .eq('name', sanitizedSubdomain)
    .single();

  if (!data) return null;

  return {
    emoji: data.emoji as string,
    createdAt: new Date(data.created_at as string).getTime()
  };
}

export async function getAllSubdomains() {
  const { data } = await supabase
    .from('subdomains')
    .select('name, emoji, created_at')
    .order('created_at', { ascending: false });

  if (!data) return [];

  return data.map(row => ({
    subdomain: row.name as string,
    emoji: row.emoji as string,
    createdAt: new Date(row.created_at as string).getTime()
  }));
}
