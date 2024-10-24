// app/admin/holes/client.tsx
"use client";
import React, { useState } from "react";
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
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { deleteHole } from "./actions";
import HoleForm from "./form";
import ShowMoreDetailsDialog from "./detalis";
import { IHole } from "@/models/Hole";

interface HoleListProps {
  initialHoles: IHole[];
}

export default function HoleList({ initialHoles }: HoleListProps) {
  const [holes, setHoles] = useState<IHole[]>(initialHoles);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingHole, setEditingHole] = useState<IHole | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this hole?")) {
      setIsLoading(true);
      try {
        await deleteHole(id);
        setHoles(holes.filter((hole) => hole._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete hole");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const onHoleUpdated = (updatedHole: IHole) => {
    setHoles(holes.map(hole => 
      hole._id === updatedHole._id ? updatedHole : hole
    ));
    setEditingHole(null);
  };

  const onHoleAdded = (newHole: IHole) => {
    setHoles([...holes, newHole]);
  };

  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      {/* Add hole dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Hole</Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Add New Hole</DialogTitle>
          </DialogHeader>
          <HoleForm onSuccess={onHoleAdded} />
        </DialogContent>
      </Dialog>

      {/* Edit hole dialog */}
      <Dialog
        open={!!editingHole}
        onOpenChange={(open) => !open && setEditingHole(null)}
      >
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Edit Hole {editingHole?.number}</DialogTitle>
          </DialogHeader>
          {editingHole && (
            <HoleForm hole={editingHole} onSuccess={onHoleUpdated} />
          )}
        </DialogContent>
      </Dialog>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hole #</TableHead>
              <TableHead>Par</TableHead>
              <TableHead>Handicap</TableHead>
              <TableHead>Layout Type</TableHead>
              <TableHead>Fairway Width</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holes.map((hole) => (
              <TableRow key={hole._id}>
                <TableCell>{hole.number}</TableCell>
                <TableCell>{hole.par}</TableCell>
                <TableCell>{hole.handicapStroke}</TableCell>
                <TableCell>{hole.holeLayout.type}</TableCell>
                <TableCell>{hole.holeLayout.fairwayWidth}</TableCell>
                <TableCell className="space-x-2">
                  <ShowMoreDetailsDialog hole={hole} />
                  <Button
                    variant="outline"
                    onClick={() => setEditingHole(hole)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(hole._id)}
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
        {holes.map((hole) => (
          <Card key={hole._id}>
            <CardHeader>
              <CardTitle>Hole {hole.number}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Par: {hole.par}</p>
              <p>Handicap: {hole.handicapStroke}</p>
              <p>Layout: {hole.holeLayout.type}</p>
              <p>Width: {hole.holeLayout.fairwayWidth}</p>
              <div className="mt-4 space-x-2">
                <ShowMoreDetailsDialog hole={hole} />
                <Button
                  variant="outline"
                  onClick={() => setEditingHole(hole)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(hole._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}