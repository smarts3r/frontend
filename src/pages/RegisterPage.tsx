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
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
            .response?.data?.message
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
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Join Smart S3r today
            </p>
          </div>

          {error && (
            <Alert color="failure" className="mb-6">
              <span className="font-medium">Error:</span> {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                Full Name
              </Label>
              <TextInput
                id="name"
                type="text"
                placeholder="John Doe"
                icon={User}
                color={errors.name ? "failure" : "gray"}
                {...register("name")}
                className="[&_input]:h-11"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
                Email Address
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@example.com"
                icon={Mail}
                color={errors.email ? "failure" : "gray"}
                {...register("email")}
                className="[&_input]:h-11"
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.email.message}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
                Password
              </Label>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  color={errors.password ? "failure" : "gray"}
                  {...register("password")}
                  className="[&_input]:h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.password.message}
                </p>
              )}

              {/* Password Requirements */}
              {password && (
                <div className="mt-3 flex flex-wrap gap-3">
                  <span
                    className={`text-xs flex items-center gap-1.5 ${hasMinLength ? "text-green-600 font-medium" : "text-gray-500"
                      }`}
                  >
                    {hasMinLength ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    6+ chars
                  </span>
                  <span
                    className={`text-xs flex items-center gap-1.5 ${hasUpperCase ? "text-green-600 font-medium" : "text-gray-500"
                      }`}
                  >
                    {hasUpperCase ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Uppercase
                  </span>
                  <span
                    className={`text-xs flex items-center gap-1.5 ${hasNumber ? "text-green-600 font-medium" : "text-gray-500"
                      }`}
                  >
                    {hasNumber ? (
                      <Check className="h-3 w-3" />
                    ) : (
                      <X className="h-3 w-3" />
                    )}
                    Number
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                Confirm Password
              </Label>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  icon={Lock}
                  color={errors.confirmPassword ? "failure" : "gray"}
                  {...register("confirmPassword")}
                  className="[&_input]:h-11 pr-10"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.confirmPassword.message}
                </p>
              )}
            </div>

            <div className="flex items-start gap-2">
              <Checkbox
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1"
              />
              <Label htmlFor="agree" className="text-sm text-gray-600">
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

            <Button
              type="submit"
              size="lg"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white [&>span]:py-3"
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
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Visual */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gray-900">
          <img
            className="h-full w-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1498049860654-af1e5e5667ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Register background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-20 text-white">
          <h3 className="text-4xl font-bold mb-4">
            "Join the future of SaaS"
          </h3>
          <p className="text-lg text-gray-300">
            Start your journey with Smart S3r today.
          </p>
        </div>
      </div>
    </div>
  );
}
