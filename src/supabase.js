import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const BUCKET = "dna-cards";

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Upload a PNG dataURL to Supabase Storage.
 * Returns the public URL of the uploaded file, or throws on error.
 */
export async function uploadCard(dataUrl, filename) {
  // Convert base64 dataURL → Blob
  const res = await fetch(dataUrl);
  const blob = await res.blob();

  const mimeType = dataUrl.split(";")[0].split(":")[1] || "image/png";
  const path = `cards/${filename}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, blob, { contentType: mimeType, upsert: true });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Save profile metadata to the `profiles` table.
 * Returns the created row (including its uuid `id`).
 */
export async function saveProfile({ name, email, problem_id, impact_id, profile_key, card_url, photo_url }) {
  const { data, error } = await supabase
    .from("profiles")
    .insert([{ name, email, problem_id, impact_id, profile_key, card_url, photo_url }])
    .select()
    .single();

  if (error) throw new Error(`DB save failed: ${error.message}`);
  return data;
}

/**
 * Fetch a single profile by uuid.
 */
export async function getProfileById(id) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(`Profile not found: ${error.message}`);
  return data;
}
