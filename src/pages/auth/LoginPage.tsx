import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Button from "../../components/ui/Button";
import { loginUser } from "../../api/auth";
import { useAuthStore } from "../../store/authStore";
import { loginSchema, type LoginCredentials } from "./auth.dto";

export default function LoginPage() {
  const navigate = useNavigate();
  const setToken = useAuthStore((state) => state.setToken);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  const loginMutation = useMutation({
    mutationFn: (credentials: LoginCredentials) => loginUser(credentials),
    onSuccess: (data) => {
      // Customer credentials authenticate fine against the same API — they just
      // don't belong here. Refuse before storing anything, otherwise the session
      // exists and every dashboard request comes back 403.
      if (data.data.user?.role !== "admin") {
        setErrors({ form: "This account doesn't have dashboard access." });
        return;
      }

      setToken(data.data.accessToken, data.data.refreshToken, data.data.user);
      navigate("/");
    },
    onError: (error: Error | import("axios").AxiosError) => {
      let message = "Login failed. Please try again.";
      if ("isAxiosError" in error && error.isAxiosError) {
        message =
          (error.response?.data as { message?: string })?.message || message;
      }
      setErrors({ form: message });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({}); // reset errors

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
      const fieldErrors: { email?: string; password?: string } = {};
      validationResult.error.issues.forEach((issue) => {
        if (issue.path[0] === "email") fieldErrors.email = issue.message;
        if (issue.path[0] === "password") fieldErrors.password = issue.message;
      });
      setErrors(fieldErrors);
      return;
    }

    loginMutation.mutate({ email, password });
  };

  return (
    <div className="min-h-screen bg-background-light flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-['Urbanist']">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-sm sm:rounded-2xl sm:px-10 border border-slate-200">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.form && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-600 font-medium">
                {errors.form}
              </div>
            )}

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>
              <div className="mt-2 text-slate-900">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email)
                      setErrors({ ...errors, email: undefined });
                  }}
                  className={`block w-full appearance-none rounded-xl border ${errors.email ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:border-primary focus:ring-primary/10"} bg-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-4 sm:text-sm transition-all duration-200`}
                  placeholder="admin@soho.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-slate-700"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (errors.password)
                      setErrors({ ...errors, password: undefined });
                  }}
                  className={`block w-full appearance-none rounded-xl border ${errors.password ? "border-red-500 focus:border-red-500 focus:ring-red-500/10" : "border-slate-200 focus:border-primary focus:ring-primary/10"} bg-white px-3 py-2 placeholder-slate-400 focus:outline-none focus:ring-4 sm:text-sm transition-all duration-200`}
                  placeholder="••••••••"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="size-4 rounded border-slate-300 text-primary focus:ring-primary"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-slate-700 font-medium"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                variant="primary"
                fullWidth
                size="lg"
                isLoading={loginMutation.isPending}
              >
                Sign in
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
