import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

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
  mode: 'add' | 'edit';
}

export function AddTeeTimeDialog({
  isOpen,
  onOpenChange,
  onSubmit,
}: Omit<TeeTimeFormProps, 'initialData' | 'mode'>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        date: formData.get('date'),
        time: formData.get('time'),
        maxPlayers: parseInt(formData.get('maxPlayers') as string),
        availableSlots: parseInt(formData.get('availableSlots') as string),
        price: parseFloat(formData.get('price') as string),
        isAvailable: formData.get('isAvailable') === 'on'
      };
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to add tee time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="mb-4 text-white">Add New Tee Time</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Tee Time</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxPlayers">Max Players</Label>
              <Input id="maxPlayers" name="maxPlayers" type="number" min={1} max={4} defaultValue={4} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="availableSlots">Available Slots</Label>
              <Input id="availableSlots" name="availableSlots" type="number" min={0} max={4} defaultValue={4} required />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="price">Price</Label>
            <Input id="price" name="price" type="number" min={0} step="0.01" required />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="isAvailable">Available for Booking</Label>
            <Switch id="isAvailable" name="isAvailable" defaultChecked />
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
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
}: Omit<TeeTimeFormProps, 'mode'>) {
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData(e.currentTarget);
      const data = {
        date: formData.get('date'),
        time: formData.get('time'),
        maxPlayers: parseInt(formData.get('maxPlayers') as string),
        availableSlots: parseInt(formData.get('availableSlots') as string),
        price: parseFloat(formData.get('price') as string),
        isAvailable: formData.get('isAvailable') === 'on'
      };
      await onSubmit(data);
      onOpenChange(false);
    } catch (error) {
      console.error('Failed to update tee time:', error);
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date">Date</Label>
              <Input 
                id="date" 
                name="date" 
                type="date" 
                defaultValue={new Date(initialData.date).toISOString().split('T')[0]}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Updating..." : "Update Tee Time"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}