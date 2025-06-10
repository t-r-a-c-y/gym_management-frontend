import { useState } from "react";
import Layout from "../components/Layout";
import DataTable from "../components/DataTable";
import { useApi } from "../hooks/useApi";
import { workoutService } from "../services/api";
import { Clock, Plus, Loader, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Workout } from "../types";
import React from "react";
import { Button } from "@/components/ui/button";
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

const Workouts = () => {
  const [type, setType] = useState("");
  const [duration, setDuration] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ type?: string; duration?: string }>({});
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [editFormData, setEditFormData] = useState({
    type: "",
    duration: "",
  });

  const { data, isLoading, error, refetch } = useApi<Workout[]>({
    method: "GET",
    url: "/workouts",
  });

  const workoutTypes = [
    "Cardio",
    "Strength Training",
    "HIIT",
    "Yoga",
    "Pilates",
    "CrossFit",
    "Swimming",
    "Cycling",
    "Running",
    "Boxing",
  ];

  const columns = [
    { 
      header: "Type", 
      accessor: "type" as keyof Workout,
      cell: (workout: Workout): React.ReactNode => (
        <span className="font-medium text-gray-900">{workout.type}</span>
      )
    },
    {
      header: "Duration (minutes)",
      accessor: (workout: Workout): React.ReactNode => (
        <div className="flex items-center">
          <Clock className="mr-2 h-4 w-4 text-gray-500" />
          <span>{workout.duration} mins</span>
        </div>
      ),
    },
  ];

  const renderActions = (workout: Workout) => (
    <div className="flex space-x-2">
      <Button 
        variant="outline" 
        size="sm" 
        onClick={() => handleEdit(workout)}
      >
        <Edit className="h-4 w-4 mr-1" /> Edit
      </Button>
      <Button 
        variant="destructive" 
        size="sm" 
        onClick={() => handleDelete(workout)}
      >
        <Trash2 className="h-4 w-4 mr-1" /> Delete
      </Button>
    </div>
  );

  const validateForm = (formType: string, formDuration: string) => {
    const newErrors: { type?: string; duration?: string } = {};
    let isValid = true;

    if (!formType) {
      newErrors.type = "Workout type is required";
      isValid = false;
    }

    if (!formDuration) {
      newErrors.duration = "Duration is required";
      isValid = false;
    } else if (isNaN(Number(formDuration)) || Number(formDuration) <= 0) {
      newErrors.duration = "Duration must be a positive number";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm(type, duration)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await workoutService.addWorkout({
        type,
        duration: Number(duration),
      });
      
      // Reset form
      setType("");
      setDuration("");
      setErrors({});
      
      // Refresh workout list
      refetch();
      
      toast.success("Workout added successfully!");
    } catch (error) {
      console.error("Failed to add workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (workout: Workout) => {
    setCurrentWorkout(workout);
    setEditFormData({
      type: workout.type,
      duration: String(workout.duration),
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = (workout: Workout) => {
    setCurrentWorkout(workout);
    setIsDeleteDialogOpen(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentWorkout?.id || !validateForm(editFormData.type, editFormData.duration)) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await workoutService.updateWorkout(currentWorkout.id, {
        type: editFormData.type,
        duration: Number(editFormData.duration),
      });
      
      setIsEditDialogOpen(false);
      toast.success("Workout updated successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to update workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!currentWorkout?.id) return;
    
    setIsSubmitting(true);
    
    try {
      await workoutService.deleteWorkout(currentWorkout.id);
      
      setIsDeleteDialogOpen(false);
      toast.success("Workout deleted successfully!");
      refetch();
    } catch (error) {
      console.error("Failed to delete workout:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="animate-fadeIn">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Workout Tracking</h1>
          <p className="text-gray-600">Add and view workouts</p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Add Workout Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold mb-6">Add Workout</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="type" className="block text-gray-700 font-medium mb-2">
                    Workout Type
                  </label>
                  <select
                    id="type"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.type ? "border-red-500" : "border-gray-300"
                    }`}
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    disabled={isSubmitting}
                  >
                    <option value="">Select workout type</option>
                    {workoutTypes.map((workoutType) => (
                      <option key={workoutType} value={workoutType}>
                        {workoutType}
                      </option>
                    ))}
                  </select>
                  {errors.type && (
                    <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                  )}
                </div>
                
                <div className="mb-6">
                  <label htmlFor="duration" className="block text-gray-700 font-medium mb-2">
                    Duration (minutes)
                  </label>
                  <input
                    type="number"
                    id="duration"
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      errors.duration ? "border-red-500" : "border-gray-300"
                    }`}
                    placeholder="Enter duration in minutes"
                    value={duration}
                    onChange={(e) => setDuration(e.target.value)}
                    disabled={isSubmitting}
                  />
                  {errors.duration && (
                    <p className="text-red-500 text-sm mt-1">{errors.duration}</p>
                  )}
                </div>
                
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-2 px-4 rounded-md hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-70 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader className="animate-spin mr-2 h-4 w-4" />
                      Adding...
                    </>
                  ) : (
                    <>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Workout
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
          
          {/* Workouts List */}
          <div className="lg:col-span-2">
            {error ? (
              <div className="bg-red-50 text-red-500 p-4 rounded-lg">
                Failed to load workouts. Please try again.
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
        </div>
      </div>

      {/* Edit Workout Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit Workout</DialogTitle>
            <DialogDescription>
              Make changes to workout information here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="edit-type" className="text-sm font-medium">Workout Type</label>
              <select
                id="edit-type"
                className={`w-full p-2 border rounded-md ${
                  errors.type ? "border-red-500" : ""
                }`}
                value={editFormData.type}
                onChange={(e) => setEditFormData({ ...editFormData, type: e.target.value })}
                required
              >
                <option value="">Select workout type</option>
                {workoutTypes.map((workoutType) => (
                  <option key={workoutType} value={workoutType}>
                    {workoutType}
                  </option>
                ))}
              </select>
              {errors.type && (
                <p className="text-red-500 text-sm">{errors.type}</p>
              )}
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-duration" className="text-sm font-medium">Duration (minutes)</label>
              <input
                id="edit-duration"
                type="number"
                className={`w-full p-2 border rounded-md ${
                  errors.duration ? "border-red-500" : ""
                }`}
                value={editFormData.duration}
                onChange={(e) => setEditFormData({ ...editFormData, duration: e.target.value })}
                required
              />
              {errors.duration && (
                <p className="text-red-500 text-sm">{errors.duration}</p>
              )}
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
              This action cannot be undone. This will permanently delete the workout
              "{currentWorkout?.type}" and all associated data.
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

export default Workouts;