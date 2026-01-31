import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  User,
  Mail,
  Lock,
  ArrowRight,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import {
  Button,
  TextInput,
  Label,
  Checkbox,
  Card,
  Spinner,
  Alert,
} from "flowbite-react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const registerSchema = z
    .object({
      name: z.string().min(2, "Name must be at least 2 characters"),
      email: z.string().email("Invalid email address"),
      password: z.string().min(6, "Password must be at least 6 characters"),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const password = watch("password");

  const onSubmit = async (data: RegisterFormValues) => {
    if (!agreeTerms) {
      toast.error("Please agree to the terms and conditions");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      login(response.data);
      toast.success("Account created successfully!");
      navigate("/home");
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage = error instanceof Error && 'response' in error 
        ? (error as { response?: { data?: { message?: string } } }).response?.data?.message 
        : "Registration failed";
      setError(errorMessage || "Registration failed");
      toast.error(errorMessage || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const hasMinLength = password?.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");

  return (
    <div 
      className="min-h-screen w-full flex items-center justify-center bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: "url('https://images.unsplash.com/photo-1498049860654-af1e5e5667ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')"
      }}
    >
      {/* Overlay for better contrast */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Register Card */}
      <div className="relative z-10 w-full max-w-md px-4">
        <Card className="bg-white/90 backdrop-blur-sm shadow-2xl border-0">
          <div className="p-6 sm:p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </h1>
              <p className="text-gray-600">
                Join Smart S3r today
              </p>
            </div>

            {error && (
              <Alert color="failure" className="mb-4">
                <span className="font-medium">Error:</span> {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name Field */}
              <div>
                <Label htmlFor="name" className="mb-2 block">Full Name</Label>
                <div className="relative">
                  <TextInput
                    id="name"
                    type="text"
                    placeholder="John Doe"
                    icon={User}
                    color={errors.name ? "failure" : "gray"}
                    className="w-full"
                    {...register("name")}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email" className="mb-2 block">Email Address</Label>
                <div className="relative">
                  <TextInput
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    icon={Mail}
                    color={errors.email ? "failure" : "gray"}
                    className="w-full"
                    {...register("email")}
                  />
                </div>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password" className="mb-2 block">Password</Label>
                <div className="relative">
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={Lock}
                    color={errors.password ? "failure" : "gray"}
                    className="w-full"
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
                )}
                
                {/* Password Requirements */}
                {password && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`text-xs flex items-center gap-1 ${hasMinLength ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasMinLength ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      6+ chars
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${hasUpperCase ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasUpperCase ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Uppercase
                    </span>
                    <span className={`text-xs flex items-center gap-1 ${hasNumber ? 'text-green-600' : 'text-gray-500'}`}>
                      {hasNumber ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      Number
                    </span>
                  </div>
                )}
              </div>

              {/* Confirm Password Field */}
              <div>
                <Label htmlFor="confirmPassword" className="mb-2 block">Confirm Password</Label>
                <div className="relative">
                  <TextInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={Lock}
                    color={errors.confirmPassword ? "failure" : "gray"}
                    className="w-full"
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute right-0 top-1/2 -translate-y-1/2 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="flex items-start gap-2">
                <Checkbox
                  id="agree"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                />
                <Label htmlFor="agree" className="text-sm">
                  I agree to the{" "}
                  <Link to="/terms" className="text-blue-600 hover:underline">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    Privacy Policy
                  </Link>
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white border-0"
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" size="sm" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 pt-4">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-semibold text-blue-600 hover:underline"
                >
                  Sign in
                </Link>
              </p>
            </form>
          </div>
        </Card>
      </div>
    </div>
  );
}
