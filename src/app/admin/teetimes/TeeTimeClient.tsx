// app/admin/teetimes/page.tsx
'use client';

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getTeeTimes, deleteTeeTime, addTeeTime } from "./actions";

interface TeeTime {
  _id: string;
  date: string;
  time: string;
  course: { name: string };
  availableSlots: number;
}

interface AdminTeeTimesPageProps {
  initialTeeTimes: TeeTime[];
}

export default function AdminTeeTimesPage({ initialTeeTimes }: AdminTeeTimesPageProps) {
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>(initialTeeTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tee time?")) {
      setIsLoading(true);
      try {
        await deleteTeeTime(id);
        setTeeTimes(teeTimes.filter(teeTime => teeTime._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete tee time");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddTeeTime = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const teeTimeData = {
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      course: formData.get('course') as string,
      availableSlots: Number(formData.get('slots')),
    };

    try {
      const newTeeTime = await addTeeTime(teeTimeData);
      setTeeTimes([...teeTimes, newTeeTime]);
      // Close the dialog (you might need to implement this logic)
    } catch (err) {
      console.error(err);
      setError("Failed to add tee time");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tee Times</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Tee Time</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Tee Time</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddTeeTime} className="space-y-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input id="date" name="date" type="date" required />
            </div>
            <div>
              <Label htmlFor="time">Time</Label>
              <Input id="time" name="time" type="time" required />
            </div>
            <div>
              <Label htmlFor="course">Course</Label>
              <Input id="course" name="course" placeholder="Course Name" required />
            </div>
            <div>
              <Label htmlFor="slots">Available Slots</Label>
              <Input id="slots" name="slots" type="number" min="1" max="4" required />
            </div>
            <Button type="submit">Add Tee Time</Button>
          </form>
        </DialogContent>
      </Dialog>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Time</TableHead>
            <TableHead>Course</TableHead>
            <TableHead>Available Slots</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teeTimes.map((teeTime) => (
            <TableRow key={teeTime._id}>
              <TableCell>
                {new Date(teeTime.date).toLocaleDateString()}
              </TableCell>
              <TableCell>{teeTime.time}</TableCell>
              <TableCell>{teeTime.course.name}</TableCell>
              <TableCell>{teeTime.availableSlots}</TableCell>
              <TableCell>
                <Button
                  variant="outline"
                  className="mr-2"
                  onClick={() => router.push(`/admin/teetimes/${teeTime._id}`)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(teeTime._id)}
                >
                  Delete
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}