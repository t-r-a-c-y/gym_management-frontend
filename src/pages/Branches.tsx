import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DataTable from "../components/DataTable";
import { branchService } from "../services/api";
import { MapPin, Mail, Edit, Trash2 } from "lucide-react";
import { Branch } from "../types";
import React from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const Branches = () => {
  const [data, setData] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBranches = async () => {
    setIsLoading(true);
    try {
      const branches = await branchService.getAllBranches();
      setData(branches);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch branches:", err);
      setError("Failed to load branches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  }, []);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBranch, setCurrentBranch] = useState<Branch | null>(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    email: "",
    location: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (branch: Branch) => {
    setCurrentBranch(branch);
    setEditFormData({
      name: branch.name,
      email: branch.email,
      location: branch.location,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (branch: Branch) => {
    setCurrentBranch(branch);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentBranch) return;
    
    setIsSubmitting(true);
    
    try {
      await branchService.updateBranch(currentBranch.id, editFormData);
      
      setIsEditDialogOpen(false);
      toast.success("Branch updated successfully!");
      fetchBranches();
    } catch (error) {
      console.error("Failed to update branch:", error);
      toast.error("Failed to update branch. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentBranch) return;
    
    setIsSubmitting(true);
    
    try {
      await branchService.deleteBranch(currentBranch.id);
      
      setIsDeleteDialogOpen(false);
      toast.success("Branch deleted successfully!");
      fetchBranches();
    } catch (error: any) {
      console.error("Failed to delete branch:", error);
      if (error.response?.status === 409) {
        const errorMessage = error.response.headers["x-error-message"] || "Cannot delete branch due to associated users.";
        toast.error(errorMessage);
      } else {
        toast.error("Failed to delete branch. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof Branch },
    { header: "Name", accessor: "name" as keyof Branch },
    { 
      header: "Email", 
      accessor: (branch: Branch): React.ReactNode => (
        <div className="flex items-center">
          <Mail className="mr-2 h-4 w-4 text-gray-500" />
          <span>{branch.email}</span>
        </div>
      )
    },
    {
      header: "Location",
      accessor: (branch: Branch): React.ReactNode => (
        <div className="flex items-center">
          <MapPin className="mr-2 h-4 w-4 text-gray-500" />
          <span>{branch.location}</span>
        </div>
      )
    },
  ];

  const renderActions = (branch: Branch) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(branch)}
      >
        <Edit className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(branch)}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Branch Management</h1>
          <p className="text-gray-600">View and manage your gym branches</p>
        </div>
        
        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <DataTable
            data={data || []}
            columns={columns}
            isLoading={isLoading}
            actions={renderActions}
          />
        )}
      </div>

      {/* Edit Branch Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Branch</DialogTitle>
            <DialogDescription>
              Make changes to branch information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium">Name</label>
              <input
                id="name"
                className="w-full p-2 border rounded-md"
                value={editFormData.name}
                onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">Email</label>
              <input
                id="email"
                type="email"
                className="w-full p-2 border rounded-md"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="location" className="text-sm font-medium">Location</label>
              <input
                id="location"
                className="w-full p-2 border rounded-md"
                value={editFormData.location}
                onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                required
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the branch
              "{currentBranch?.name}" and all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteConfirm} 
              disabled={isSubmitting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isSubmitting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Layout>
  );
};

export default Branches;