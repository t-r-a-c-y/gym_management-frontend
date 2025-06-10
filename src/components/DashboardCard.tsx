
import { ReactNode } from "react";

interface DashboardCardProps {
  title: string;
  value: number | string;
  icon: ReactNode;
  className?: string;
}

const DashboardCard = ({ title, value, icon, className = "" }: DashboardCardProps) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 transition-all hover:shadow-lg ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-700">{title}</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full text-white">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default DashboardCard;
