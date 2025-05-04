import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/supabase';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
});

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): never => {
  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(error.message, 500);
  }

  throw new ApiError('An unexpected error occurred', 500);
};

export const api = {
  async get<T>(table: string, query?: string): Promise<T[]> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select(query || '*');

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getById<T>(table: string, id: string): Promise<T> {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new ApiError(`${table} not found`, 404);
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async create<T>(table: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new ApiError(`Failed to create ${table}`, 500);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async update<T>(table: string, id: string, data: Partial<T>): Promise<T> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!result) throw new ApiError(`${table} not found`, 404);
      return result;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async delete(table: string, id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 