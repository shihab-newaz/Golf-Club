// app/admin/teetimes/dialogs.tsx
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

interface TeeTime {
  _id: string;
  date: string;
  time: string;
  maxPlayers: number;
  availableSlots: number;
  price: number;
  isAvailable: boolean;
}

interface TeeTimeFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: any) => Promise<void>;
  initialData?: TeeTime;
}

export function AddTeeTimeDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Omit<TeeTimeFormProps, 'initialData'>) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (formData: FormData) => {
    const date = new Date(formData.get('date') as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return "Date cannot be in the past";
    }

    const time = formData.get('time') as string;
    if (!time) {
      return "Time is required";
    }

    const price = parseFloat(formData.get('price') as string);
    if (isNaN(price) || price <= 0) {
      return "Price must be greater than 0";
    }

    const maxPlayers = parseInt(formData.get('maxPlayers') as string);
    const availableSlots = parseInt(formData.get('availableSlots') as string);
    
    if (availableSlots > maxPlayers) {
      return "Available slots cannot be greater than max players";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setValidationError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate form
      const error = validateForm(formData);
      if (error) {
        setValidationError(error);
        toast.error(error);
        setIsLoading(false);
        return;
      }

      // Create a proper date object from date and time
      const dateStr = formData.get('date') as string;
      const timeStr = formData.get('time') as string;
      const dateTime = new Date(`${dateStr}T${timeStr}`);

      const data = {
        date: dateTime.toISOString(),
        time: timeStr,
        maxPlayers: parseInt(formData.get('maxPlayers') as string),
        availableSlots: parseInt(formData.get('availableSlots') as string),
        price: parseFloat(formData.get('price') as string),
        isAvailable: formData.get('isAvailable') === 'on'
      };

      await onSubmit(data);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to add tee time:', error);
      toast.error(error.message || "Failed to add tee time");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tee Time</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="text-red-500 text-sm">{validationError}</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                name="time" 
                type="time"
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input 
                id="maxPlayers" 
                name="maxPlayers" 
                type="number" 
                min={1} 
                max={4} 
                defaultValue={4}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSlots">Available Slots</Label>
              <Input 
                id="availableSlots" 
                name="availableSlots" 
                type="number" 
                min={0} 
                max={4} 
                defaultValue={4}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              min={0} 
              step="0.01"
              placeholder="Enter price"
              required 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available for Booking</Label>
            <Switch 
              id="isAvailable" 
              name="isAvailable" 
              defaultChecked 
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Tee Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export function EditTeeTimeDialog({
  isOpen,
  onOpenChange,
  onSubmit,
  initialData,
}: TeeTimeFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateForm = (formData: FormData) => {
    const date = new Date(formData.get('date') as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) {
      return "Date cannot be in the past";
    }

    const time = formData.get('time') as string;
    if (!time) {
      return "Time is required";
    }

    const price = parseFloat(formData.get('price') as string);
    if (isNaN(price) || price <= 0) {
      return "Price must be greater than 0";
    }

    const maxPlayers = parseInt(formData.get('maxPlayers') as string);
    const availableSlots = parseInt(formData.get('availableSlots') as string);
    
    if (availableSlots > maxPlayers) {
      return "Available slots cannot be greater than max players";
    }

    return null;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!initialData) return;
    
    setValidationError(null);
    setIsLoading(true);

    try {
      const formData = new FormData(e.currentTarget);
      
      // Validate form
      const error = validateForm(formData);
      if (error) {
        setValidationError(error);
        toast.error(error);
        setIsLoading(false);
        return;
      }

      // Create a proper date object from date and time
      const dateStr = formData.get('date') as string;
      const timeStr = formData.get('time') as string;
      const dateTime = new Date(`${dateStr}T${timeStr}`);

      const data = {
        date: dateTime.toISOString(),
        time: timeStr,
        maxPlayers: parseInt(formData.get('maxPlayers') as string),
        availableSlots: parseInt(formData.get('availableSlots') as string),
        price: parseFloat(formData.get('price') as string),
        isAvailable: formData.get('isAvailable') === 'on'
      };

      await onSubmit(data);
      onOpenChange(false);
    } catch (error: any) {
      console.error('Failed to update tee time:', error);
      toast.error(error.message || "Failed to update tee time");
    } finally {
      setIsLoading(false);
    }
  };

  if (!initialData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Tee Time</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {validationError && (
            <div className="text-red-500 text-sm">{validationError}</div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date"
                defaultValue={new Date(initialData.date).toISOString().split('T')[0]}
                min={new Date().toISOString().split('T')[0]}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input 
                id="time" 
                name="time" 
                type="time"
                defaultValue={initialData.time}
                required 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input 
                id="maxPlayers" 
                name="maxPlayers" 
                type="number" 
                min={1} 
                max={4} 
                defaultValue={initialData.maxPlayers}
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSlots">Available Slots</Label>
              <Input 
                id="availableSlots" 
                name="availableSlots" 
                type="number" 
                min={0} 
                max={4} 
                defaultValue={initialData.availableSlots}
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input 
              id="price" 
              name="price" 
              type="number" 
              min={0} 
              step="0.01"
              defaultValue={initialData.price}
              required 
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available for Booking</Label>
            <Switch 
              id="isAvailable" 
              name="isAvailable" 
              defaultChecked={initialData.isAvailable}
            />
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isLoading}
          >
            {isLoading ? "Updating..." : "Update Tee Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}