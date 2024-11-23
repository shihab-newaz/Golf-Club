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
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteTeeTime, addTeeTime, updateTeeTime } from "./actions";
import TeeTimeDetailsDialog from "./details";
import { AddTeeTimeDialog, EditTeeTimeDialog } from "./dialogs";
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
  const [editingTeeTime, setEditingTeeTime] = useState<TeeTime | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchDate, setSearchDate] = useState("");
  const itemsPerPage = 30;

  const filteredTeeTimes = teeTimes.filter((teeTime) => {
    if (!searchDate) return true;
    const teeTimeDate = new Date(teeTime.date).toISOString().split("T")[0];
    return teeTimeDate === searchDate;
  });

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
        toast.success("Tee time deleted successfully");
      } catch (err) {
        console.error(err);
        toast.error("Failed to delete tee time");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddTeeTime = async (data: any) => {
    setIsLoading(true);
    try {
      const newTeeTime = await addTeeTime(data);
      setTeeTimes([...teeTimes, newTeeTime]);
      setIsAddTeeTimeOpen(false);
      toast.success("Tee time added successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to add tee time");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateTeeTime = async (data: any) => {
    setIsLoading(true);
    try {
      const updatedTeeTime = await updateTeeTime(editingTeeTime?._id as string, data);
      setTeeTimes(
        teeTimes.map((teeTime) =>
          teeTime._id === updatedTeeTime._id ? updatedTeeTime : teeTime
        )
      );
      setEditingTeeTime(null);
      toast.success("Tee time updated successfully");
    } catch (error: any) {
      console.error(error);
      toast.error(error.message || "Failed to update tee time");
    } finally {
      setIsLoading(false);
    }
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Manage Tee Times</h1>
      <div className="flex gap-2 w-full sm:w-auto mb-4">
        <Input
          type="date"
          value={searchDate}
          onChange={(e) => setSearchDate(e.target.value)}
          className="max-w-[200px]"
        />
        <Search className="w-6 h-6" />
        <Button onClick={() => setIsAddTeeTimeOpen(true)} className="ml-auto">
          Add New Tee Time
        </Button>
      </div>

      <AddTeeTimeDialog
        isOpen={isAddTeeTimeOpen}
        onOpenChange={setIsAddTeeTimeOpen}
        onSubmit={handleAddTeeTime}
      />

      {editingTeeTime && (
        <EditTeeTimeDialog
          isOpen={!!editingTeeTime}
          onOpenChange={(open) => !open && setEditingTeeTime(null)}
          onSubmit={handleUpdateTeeTime}
          initialData={editingTeeTime}
        />
      )}

      {/* Desktop view */}
      <div className="hidden md:block overflow-x-auto">
        <Table className="w-full">
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Price</TableHead>
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
                <TableCell>${teeTime.price}</TableCell>
                <TableCell>{teeTime.availableSlots}</TableCell>
                <TableCell className="space-x-2">
                  <TeeTimeDetailsDialog teeTime={teeTime} />
                  <Button
                    variant="outline"
                    onClick={() => setEditingTeeTime(teeTime)}
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
              <p>Price: ${teeTime.price}</p>
              <p>Available Slots: {teeTime.availableSlots}</p>
              <div className="mt-4 space-x-2">
                <TeeTimeDetailsDialog teeTime={teeTime} />
                <Button
                  variant="outline"
                  onClick={() => setEditingTeeTime(teeTime)}
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
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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