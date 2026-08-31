import { supabase } from "../supabaseClient";

export const saveTrackerEntry = async (entry) => {
  const { data, error } = await supabase
    .from("pcos_entries")
    .insert([entry])
    .select();

  if (error) throw error;
  return data;
};

export const getTrackerHistory = async (userId) => {
  const { data, error } = await supabase
    .from("pcos_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

export const getLatestTrackerEntry = async (userId) => {
  const { data, error } = await supabase
    .from("pcos_entries")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};

export const updateTrackerEntry = async (record) => {
  let query = supabase.from("pcos_entries").update(record);

  if (record.id) {
    query = query.eq("id", record.id);
  } else {
    query = query
      .eq("user_id", record.user_id)
      .eq("created_at", record.created_at);
  }

  const { data, error } = await query.select();

  if (error) throw error;
  return data;
};

export const deleteTrackerEntry = async (record) => {
  let query = supabase.from("pcos_entries").delete();

  if (record.id) {
    query = query.eq("id", record.id);
  } else {
    query = query
      .eq("user_id", record.user_id)
      .eq("created_at", record.created_at);
  }

  const { error } = await query;

  if (error) throw error;
};