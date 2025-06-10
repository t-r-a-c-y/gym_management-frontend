import { useState, useEffect } from "react";
import Layout from "../components/Layout";
import DataTable from "../components/DataTable";
import { userService, branchService } from "../services/api";
import { Building, User as UserIcon, Edit, Trash2 } from "lucide-react";
import { User as UserType, Branch } from "../types";
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

interface UserData extends UserType {}

const Users = () => {
  const [users, setUsers] = useState<UserData[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [usersData, branchesData] = await Promise.all([
        userService.getAllUsers(),
        branchService.getAllBranches(),
      ]);
      setUsers(usersData);
      setBranches(branchesData);
      setError(null);
    } catch (err: any) {
      console.error("Failed to fetch data:", err);
      setError("Failed to load users or branches. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);
  const [editFormData, setEditFormData] = useState({
    email: "",
    role: "",
    branchId: 0,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleEdit = (user: UserData) => {
    setCurrentUser(user);
    setEditFormData({
      email: user.email,
      role: user.role,
      branchId: user.branch?.id || 0,
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (user: UserData) => {
    setCurrentUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      await userService.updateUser(currentUser.id, editFormData);
      
      setIsEditDialogOpen(false);
      toast.success("User updated successfully!");
      fetchData();
    } catch (error) {
      console.error("Failed to update user:", error);
      toast.error("Failed to update user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentUser) return;
    
    setIsSubmitting(true);
    
    try {
      await userService.deleteUser(currentUser.id);
      
      setIsDeleteDialogOpen(false);
      toast.success("User deleted successfully!");
      fetchData();
    } catch (error) {
      console.error("Failed to delete user:", error);
      toast.error("Failed to delete user. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadgeClass = (role: string) => {
    switch (role.toUpperCase()) {
      case "ADMIN":
        return "bg-red-100 text-red-800";
      case "MANAGER":
        return "bg-blue-100 text-blue-800";
      case "TRAINER":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns = [
    { header: "ID", accessor: "id" as keyof UserData },
    {
      header: "Email",
      accessor: (user: UserData): React.ReactNode => (
        <div className="flex items-center">
          <UserIcon className="mr-2 h-4 w-4 text-gray-500" />
          <span>{user.email}</span>
        </div>
      ),
    },
    {
      header: "Role",
      accessor: (user: UserData): React.ReactNode => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleBadgeClass(user.role)}`}>
          {user.role}
        </span>
      ),
    },
    {
      header: "Branch",
      accessor: (user: UserData): React.ReactNode => (
        <div className="flex items-center">
          <Building className="mr-2 h-4 w-4 text-gray-500" />
          <span>{user.branch?.name || "N/A"}</span>
        </div>
      ),
    },
  ];

  const renderActions = (user: UserData) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(user)}
      >
        <Edit className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(user)}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  const roles = ["ADMIN", "MANAGER", "TRAINER", "MEMBER"];

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600">View and manage your gym users</p>
        </div>
        
        {error ? (
          <div className="bg-red-50 text-red-500 p-4 rounded-lg mb-6">
            {error}
          </div>
        ) : (
          <DataTable
            data={users || []}
            columns={columns}
            isLoading={isLoading}
            actions={renderActions}
          />
        )}
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Make changes to user information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
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
              <label htmlFor="role" className="text-sm font-medium">Role</label>
              <select
                id="role"
                className="w-full p-2 border rounded-md"
                value={editFormData.role}
                onChange={(e) => setEditFormData({ ...editFormData, role: e.target.value })}
                required
              >
                <option value="">Select role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="branch" className="text-sm font-medium">Branch</label>
              <select
                id="branch"
                className="w-full p-2 border rounded-md"
                value={editFormData.branchId}
                onChange={(e) => setEditFormData({ ...editFormData, branchId: Number(e.target.value) })}
              >
                <option value={0}>No branch</option>
                {branches?.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name}
                  </option>
                ))}
              </select>
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
              This action cannot be undone. This will permanently delete the user
              "{currentUser?.email}" and all associated data.
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

export default Users;