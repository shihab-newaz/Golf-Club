// app/admin/teetimes/TeeTimeClient.tsx
"use client";
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
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteTeeTime, addTeeTime } from "./actions";
import TeeTimeDetailsDialog from "./details";

interface Course {
  _id: string;
  name: string;
}

interface TeeTime {
  _id: string;
  date: Date;
  time: string;
  course: Course;
  maxPlayers: number;
  availableSlots: number;
  price: number;
  isAvailable: boolean;
}

interface AdminTeeTimesPageProps {
  initialTeeTimes: TeeTime[];
}

export default function AdminTeeTimesPage({
  initialTeeTimes,
}: AdminTeeTimesPageProps) {
  const router = useRouter();
  const [teeTimes, setTeeTimes] = useState<TeeTime[]>(initialTeeTimes);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAddTeeTimeOpen, setIsAddTeeTimeOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const itemsPerPage = 30;
  // Filter tee times based on search date
  const filteredTeeTimes = teeTimes.filter((teeTime) => {
    if (!searchDate) return true;
    const teeTimeDate = new Date(teeTime.date).toISOString().split("T")[0];
    return teeTimeDate === searchDate;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredTeeTimes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTeeTimes = filteredTeeTimes.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this tee time?")) {
      setIsLoading(true);
      try {
        await deleteTeeTime(id);
        setTeeTimes(teeTimes.filter((teeTime) => teeTime._id !== id));
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
      date: formData.get("date") as string,
      time: formData.get("time") as string,
      course: formData.get("course") as string,
      availableSlots: Number(formData.get("slots")),
    };

    try {
      const newTeeTime = await addTeeTime(teeTimeData);
      setTeeTimes([...teeTimes, newTeeTime]);
      setIsAddTeeTimeOpen(false);
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
      <div className="flex gap-2 w-full sm:w-auto">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="max-w-[200px]"
        />
        <Search />
        <Dialog open={isAddTeeTimeOpen} onOpenChange={setIsAddTeeTimeOpen}>
          <DialogTrigger asChild>
            <Button className="mb-4 text-white">Add New Tee Time</Button>
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
                <Input
                  id="course"
                  name="course"
                  placeholder="Course Name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="slots">Available Slots</Label>
                <Input
                  id="slots"
                  name="slots"
                  type="number"
                  min="1"
                  max="4"
                  required
                />
              </div>
              <Button type="submit">Add Tee Time</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full">
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
            {currentTeeTimes.map((teeTime) => (
              <TableRow key={teeTime._id}>
                <TableCell>
                  {new Date(teeTime.date).toLocaleDateString()}
                </TableCell>
                <TableCell>{teeTime.time}</TableCell>
                <TableCell>{teeTime.course.name}</TableCell>
                <TableCell>{teeTime.availableSlots}</TableCell>
                <TableCell className="space-x-2">
                  <TeeTimeDetailsDialog teeTime={teeTime} />
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(`/admin/teetimes/${teeTime._id}`)
                    }
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

      {/* Mobile view */}
      <div className="md:hidden space-y-4">
        {currentTeeTimes.map((teeTime) => (
          <Card key={teeTime._id}>
            <CardHeader>
              <CardTitle>
                {new Date(teeTime.date).toLocaleDateString()}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>Time: {teeTime.time}</p>
              <p>Course: {teeTime.course.name}</p>
              <p>Available Slots: {teeTime.availableSlots}</p>
              <div className="mt-4 space-x-2">
                <TeeTimeDetailsDialog teeTime={teeTime} />
                <Button
                  variant="outline"
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className="gap-1"
                >
                  Previous
                </Button>
              </PaginationItem>

              {Array.from({ length: totalPages }, (_, i) => i + 1)
                .filter((page) => {
                  if (totalPages <= 7) return true;
                  if (page === 1 || page === totalPages) return true;
                  if (page >= currentPage - 1 && page <= currentPage + 1)
                    return true;
                  return false;
                })
                .map((page, i, array) => (
                  <React.Fragment key={page}>
                    {i > 0 && array[i - 1] !== page - 1 && (
                      <PaginationItem>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )}
                    <PaginationItem>
                      <Button
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Button>
                    </PaginationItem>
                  </React.Fragment>
                ))}

              <PaginationItem>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="gap-1"
                >
                  Next
                </Button>
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}
