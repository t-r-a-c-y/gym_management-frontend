export interface Branch {
  id: number;
  name: string;
  email: string;
  location: string;
}

export interface User {
  id: number;
  email: string;
  role: string;
  branch: {
    id?: number;
    name: string;
  };
}

export interface Workout {
  id?: number;
  type: string;
  duration: number;
}

export interface DashboardStats {
  branches: number;
  users: number;
  workouts: number;
}