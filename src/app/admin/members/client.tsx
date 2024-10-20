// app/admin/members/client.tsx
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { addMember, updateMember, deleteMember } from "./actions";

interface Member {
  _id: string;
  name: string;
  username: string;
  email: string;
  phoneNumber: string;
  membershipTier: 'free' | 'silver' | 'gold' | 'platinum';
}

interface MemberListProps {
  initialMembers: Member[];
}

export default function MemberList({ initialMembers }: MemberListProps) {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editingMember, setEditingMember] = useState<Member | null>(null);

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this member?")) {
      setIsLoading(true);
      try {
        await deleteMember(id);
        setMembers(members.filter(member => member._id !== id));
      } catch (err) {
        console.error(err);
        setError("Failed to delete member");
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleAddMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const memberData = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      membershipTier: formData.get('membershipTier'),
      password: formData.get('password'), // Note: In a real app, you'd want to handle this more securely
    };

    try {
      const newMember = await addMember(memberData);
      setMembers([...members, newMember]);
      // Close the dialog (you might need to implement this logic)
    } catch (err) {
      console.error(err);
      setError("Failed to add member");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMember = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingMember) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const memberData = {
      name: formData.get('name'),
      username: formData.get('username'),
      email: formData.get('email'),
      phoneNumber: formData.get('phoneNumber'),
      membershipTier: formData.get('membershipTier'),
    };

    try {
      const updatedMember = await updateMember(editingMember._id, memberData);
      setMembers(members.map(member => 
        member._id === updatedMember._id ? updatedMember : member
      ));
      setEditingMember(null);
    } catch (err) {
      console.error(err);
      setError("Failed to update member");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">Add New Member</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Member</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddMember} className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input id="username" name="username" required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input id="phoneNumber" name="phoneNumber" required />
            </div>
            <div>
              <Label htmlFor="membershipTier">Membership Tier</Label>
              <Select name="membershipTier">
                <SelectTrigger>
                  <SelectValue placeholder="Select membership tier" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Free</SelectItem>
                  <SelectItem value="silver">Silver</SelectItem>
                  <SelectItem value="gold">Gold</SelectItem>
                  <SelectItem value="platinum">Platinum</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <Button type="submit">Add Member</Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Desktop view */}
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone Number</TableHead>
              <TableHead>Membership Tier</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id}>
                <TableCell>{member.name}</TableCell>
                <TableCell>{member.username}</TableCell>
                <TableCell>{member.email}</TableCell>
                <TableCell>{member.phoneNumber}</TableCell>
                <TableCell>{member.membershipTier}</TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    className="mr-2"
                    onClick={() => setEditingMember(member)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDelete(member._id)}
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
        {members.map((member) => (
          <Card key={member._id}>
            <CardHeader>
              <CardTitle>{member.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p><strong>Username:</strong> {member.username}</p>
              <p><strong>Email:</strong> {member.email}</p>
              <p><strong>Phone:</strong> {member.phoneNumber}</p>
              <p><strong>Membership:</strong> {member.membershipTier}</p>
              <div className="mt-4 space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setEditingMember(member)}
                >
                  Edit
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => handleDelete(member._id)}
                >
                  Delete
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!editingMember} onOpenChange={(open) => !open && setEditingMember(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Member</DialogTitle>
          </DialogHeader>
          {editingMember && (
            <form onSubmit={handleUpdateMember} className="space-y-4">
              <div>
                <Label htmlFor="edit-name">Name</Label>
                <Input id="edit-name" name="name" defaultValue={editingMember.name} required />
              </div>
              <div>
                <Label htmlFor="edit-username">Username</Label>
                <Input id="edit-username" name="username" defaultValue={editingMember.username} required />
              </div>
              <div>
                <Label htmlFor="edit-email">Email</Label>
                <Input id="edit-email" name="email" type="email" defaultValue={editingMember.email} required />
              </div>
              <div>
                <Label htmlFor="edit-phoneNumber">Phone Number</Label>
                <Input id="edit-phoneNumber" name="phoneNumber" defaultValue={editingMember.phoneNumber} required />
              </div>
              <div>
                <Label htmlFor="edit-membershipTier">Membership Tier</Label>
                <Select name="membershipTier" defaultValue={editingMember.membershipTier}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select membership tier" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free</SelectItem>
                    <SelectItem value="silver">Silver</SelectItem>
                    <SelectItem value="gold">Gold</SelectItem>
                    <SelectItem value="platinum">Platinum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button type="submit">Update Member</Button>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}