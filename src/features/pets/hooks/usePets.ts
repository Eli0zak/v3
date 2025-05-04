import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { petsApi } from '../api/petsApi';
import { useAuth } from '@/features/auth/context/AuthContext';
import { toast } from 'sonner';

export const usePets = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['pets', user?.id],
    queryFn: () => petsApi.getPets(user?.id || ''),
    enabled: !!user?.id,
  });

  const createPetMutation = useMutation({
    mutationFn: petsApi.createPet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet created successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const updatePetMutation = useMutation({
    mutationFn: petsApi.updatePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet updated successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  const deletePetMutation = useMutation({
    mutationFn: petsApi.deletePet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pets'] });
      toast.success('Pet deleted successfully');
    },
    onError: (error: Error) => {
      toast.error(error.message);
    },
  });

  return {
    pets,
    isLoading,
    error,
    createPet: createPetMutation.mutate,
    updatePet: updatePetMutation.mutate,
    deletePet: deletePetMutation.mutate,
    isCreating: createPetMutation.isPending,
    isUpdating: updatePetMutation.isPending,
    isDeleting: deletePetMutation.isPending,
  };
}; 