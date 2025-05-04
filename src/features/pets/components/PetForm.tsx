import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/shared/components/ui/Button";
import { Input } from "@/shared/components/ui/Input";
import { Label } from "@/shared/components/ui/Label";
import { Textarea } from "@/shared/components/ui/Textarea";
import { Animal } from "@/types";
import { toast } from "@/hooks/use-toast";

const petFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  species: z.string().min(1, "Species is required"),
  breed: z.string().optional(),
  age: z.number().min(0, "Age must be a positive number").optional(),
  description: z.string().optional(),
  microchip_id: z.string().optional(),
});

type PetFormData = z.infer<typeof petFormSchema>;

interface PetFormProps {
  initialData?: Partial<Animal>;
  onSubmit: (data: Partial<Animal>) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

const PetForm = ({ initialData, onSubmit, onCancel, isLoading = false }: PetFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<PetFormData>({
    resolver: zodResolver(petFormSchema),
    defaultValues: initialData,
  });

  const handleFormSubmit = async (data: PetFormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save pet information",
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          {...register("name")}
          placeholder="Enter pet's name"
        />
        {errors.name && (
          <p className="text-sm text-red-500">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="species">Species</Label>
        <Input
          id="species"
          {...register("species")}
          placeholder="Enter species"
        />
        {errors.species && (
          <p className="text-sm text-red-500">{errors.species.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="breed">Breed</Label>
        <Input
          id="breed"
          {...register("breed")}
          placeholder="Enter breed"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="age">Age</Label>
        <Input
          id="age"
          type="number"
          {...register("age", { valueAsNumber: true })}
          placeholder="Enter age"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...register("description")}
          placeholder="Enter description"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="microchip_id">Microchip ID</Label>
        <Input
          id="microchip_id"
          {...register("microchip_id")}
          placeholder="Enter microchip ID"
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
};

export default PetForm; 