import { supabase, handleApiError } from '@/core/api/client';
import { Pet } from '@/types/pet';

export interface CreatePetInput {
  name: string;
  species: string;
  breed?: string;
  birthDate?: string;
  color?: string;
  microchipId?: string;
  ownerId: string;
}

export interface UpdatePetInput extends Partial<CreatePetInput> {
  id: string;
}

export const petsApi = {
  async getPets(ownerId: string): Promise<Pet[]> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async getPet(id: string): Promise<Pet> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) throw new Error('Pet not found');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async createPet(input: CreatePetInput): Promise<Pet> {
    try {
      const { data, error } = await supabase
        .from('pets')
        .insert([input])
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to create pet');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async updatePet(input: UpdatePetInput): Promise<Pet> {
    try {
      const { id, ...updateData } = input;
      const { data, error } = await supabase
        .from('pets')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Failed to update pet');
      return data;
    } catch (error) {
      throw handleApiError(error);
    }
  },

  async deletePet(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('pets')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      throw handleApiError(error);
    }
  },
}; 