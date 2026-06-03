import { useNavigate } from "react-router-dom";
import Button from "../../components/ui/Button";

export default function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-slate-50 text-center px-4">
      <span className="material-symbols-outlined text-[72px] text-slate-300 mb-4">
        search_off
      </span>
      <h1 className="text-6xl font-bold text-slate-800 mb-2">404</h1>
      <p className="text-xl font-medium text-slate-600 mb-1">Page Not Found</p>
      <p className="text-sm text-slate-400 mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button onClick={() => navigate("/")}>Go to Dashboard</Button>
    </div>
  );
}
