import React, { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

interface Course {
  _id: string;
  name: string;
  description?: string;
  holes: number;
  par: number;
  length?: number;
  difficulty: 'easy' | 'medium' | 'hard';
  imageUrl?: string;
  isOpen: boolean;
}

interface CourseFormProps {
  course?: Course;
  onSubmit: (courseData: Partial<Course>) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CourseForm({ course, onSubmit, isOpen, onOpenChange }: CourseFormProps) {
  const [formData, setFormData] = useState<Partial<Course>>(course || {
    name: "",
    holes: 18,
    par: 72,
    difficulty: "medium",
    isOpen: true,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string) => (value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleSwitchChange = (checked: boolean) => {
    setFormData({ ...formData, isOpen: checked });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{course ? "Edit Course" : "Add New Course"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Course Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Course Name"
              required
            />
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description || ""}
              onChange={handleChange}
              placeholder="Course Description"
            />
          </div>
          <div>
            <Label htmlFor="holes">Number of Holes</Label>
            <Input
              id="holes"
              name="holes"
              type="number"
              min="9"
              max="18"
              value={formData.holes}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="par">Par</Label>
            <Input
              id="par"
              name="par"
              type="number"
              value={formData.par}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="length">Length (yards)</Label>
            <Input
              id="length"
              name="length"
              type="number"
              value={formData.length || ""}
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="difficulty">Difficulty</Label>
            <Select
              name="difficulty"
              value={formData.difficulty}
              onValueChange={handleSelectChange("difficulty")}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select difficulty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Easy</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="hard">Hard</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="imageUrl">Image URL</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="text"
              value={formData.imageUrl || ""}
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center space-x-2">
            <Switch
              id="isOpen"
              checked={formData.isOpen}
              onCheckedChange={handleSwitchChange}
            />
            <Label htmlFor="isOpen">Is Open</Label>
          </div>
          <Button type="submit">{course ? "Update Course" : "Add Course"}</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}