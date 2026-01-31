import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  Headphones,
  ArrowRight,
  User,
  Mail,
  Lock,
  Chrome,
  Facebook,
  Shield,
  Check,
  X,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
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
    } catch (error: any) {
      console.error("Registration Error:", error);
      const errorMessage = error.response?.data?.message || "Registration failed";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicators
  const hasMinLength = password?.length >= 6;
  const hasUpperCase = /[A-Z]/.test(password || "");
  const hasNumber = /[0-9]/.test(password || "");

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-gray-50">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-gray-900 to-gray-800 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-blue-600 rounded-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <span>Smart S3r</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-bold mb-6 leading-tight">
            Join Smart S3r Today
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Create an account to unlock exclusive deals, track orders, and experience next-gen shopping.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
              <Laptop className="w-4 h-4" /> Latest Tech
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
              <Shield className="w-4 h-4" /> Secure Shopping
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg text-sm">
              <Headphones className="w-4 h-4" /> 24/7 Support
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-400">
          © 2024 Smart S3r. All rights reserved.
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 overflow-y-auto">
        {/* Mobile Header */}
        <div className="lg:hidden w-full max-w-md mb-6 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-100 rounded-2xl">
              <Smartphone className="w-8 h-8 text-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Smart S3r</h1>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        <Card className="w-full max-w-md shadow-lg">
          <div className="p-6 sm:p-8">
            <div className="hidden lg:block mb-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                Create Account
              </h2>
              <p className="mt-2 text-gray-600">
                Fill in your details to get started
              </p>
            </div>

            {error && (
              <Alert color="failure" className="mb-4">
                <span className="font-medium">Error:</span> {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name Field */}
              <div>
                <Label htmlFor="name">Full Name</Label>
                <TextInput
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  icon={User}
                  color={errors.name ? "failure" : "gray"}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                )}
              </div>

              {/* Email Field */}
              <div>
                <Label htmlFor="email">Email Address</Label>
                <TextInput
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  icon={Mail}
                  color={errors.email ? "failure" : "gray"}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Password Field */}
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <TextInput
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={Lock}
                    color={errors.password ? "failure" : "gray"}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <TextInput
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    icon={Lock}
                    color={errors.confirmPassword ? "failure" : "gray"}
                    {...register("confirmPassword")}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
                color="dark"
                size="lg"
                className="w-full"
                disabled={isLoading || !agreeTerms}
              >
                {isLoading ? (
                  <>
                    <Spinner className="mr-2" />
                    Creating account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </>
                )}
              </Button>

              {/* Divider */}
              <div className="relative flex items-center py-2">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">
                  Or sign up with
                </span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>

              {/* Social Login */}
              <div className="grid grid-cols-2 gap-3">
                <Button color="light" size="sm" className="w-full">
                  <Chrome className="w-4 h-4 mr-2" />
                  Google
                </Button>
                <Button color="light" size="sm" className="w-full">
                  <Facebook className="w-4 h-4 mr-2" />
                  Facebook
                </Button>
              </div>

              {/* Login Link */}
              <p className="text-center text-sm text-gray-600 pt-2">
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
