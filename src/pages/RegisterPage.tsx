import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Shield,
  Smartphone,
  Zap,
  Laptop,
  Check
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
  Checkbox,
  Label,
  Alert,
  Spinner,
  Card
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
      name: z.string().min(2, t("registerPage.nameMinLength")),
      email: z.string().email(t("registerPage.invalidEmail")),
      password: z.string().min(6, t("registerPage.passwordMinLength")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("registerPage.passwordsDontMatch"),
      path: ["confirmPassword"],
    });

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    if (!agreeTerms) {
      toast.error(t("registerPage.agreeTermsError"));
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
      toast.success(t("registerPage.successMessage"));
      navigate("/home");
    } catch (error: any) {
      console.error("Registration Error:", error);
      const errorMessage = error.response?.data?.message || t("registerPage.registrationFailed");
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-gray-50 text-gray-900">

      {/* Left Side - Visual Branding (Desktop Only) - Fixed Height */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative flex-col justify-between p-12 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700 z-0" />
        <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:20px_20px]" />

        {/* Brand Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="p-2.5 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
            <Zap className="w-6 h-6 text-yellow-300 fill-yellow-300" />
          </div>
          <span className="text-2xl font-bold tracking-tight">Smart S3r</span>
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-lg mt-auto mb-20">
          <h1 className="text-5xl font-extrabold mb-6 leading-tight tracking-tight">
            {t("registerPage.theFutureOfTechIsHere", "Join the Future of Tech")}
          </h1>
          <p className="text-lg text-blue-100 mb-8 leading-relaxed font-medium opacity-90">
            {t("registerPage.experienceNextGen", "Create an account to unlock exclusive deals, track orders, and experience next-gen shopping.")}
          </p>

          <div className="flex gap-3">
            {[
              { icon: Laptop, text: "Latest Tech" },
              { icon: Shield, text: "Secure" },
              { icon: Smartphone, text: "Mobile Ready" }
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/10 px-4 py-2 rounded-full text-sm font-medium">
                <item.icon className="w-4 h-4" />
                <span>{item.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="relative z-10 text-sm text-blue-200 opacity-60">
          © 2024 Smart S3r. All rights reserved.
        </div>
      </div>

      {/* Right Side - Registration Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 bg-white overflow-y-auto">

        {/* Mobile Header (Only visible on mobile) */}
        <div className="lg:hidden w-full max-w-md mb-8 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-blue-50 rounded-2xl">
              <Zap className="w-8 h-8 text-blue-600 fill-blue-600" />
            </div>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Smart S3r</h1>
          <p className="text-sm text-gray-500">Create your account to get started</p>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="hidden lg:block mb-8">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              {t("registerPage.createAccount", "Create an account")}
            </h2>
            <p className="mt-2 text-gray-500">
              {t("registerPage.pleaseEnterDetails", "Enter your details below to create your account")}
            </p>
          </div>

          {error && (
            <Alert color="failure" icon={Shield} className="animate-pulse">
              <span className="font-medium">Error:</span> {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
            {/* Name Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="name" value={t("registerPage.name", "Full Name")} />
              </div>
              <TextInput
                id="name"
                type="text"
                placeholder="John Doe"
                color={errors.name ? "failure" : "gray"}
                helperText={errors.name?.message}
                {...register("name")}
                shadow
              />
            </div>

            {/* Email Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="email" value={t("loginPage.email", "Email Address")} />
              </div>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
                color={errors.email ? "failure" : "gray"}
                helperText={errors.email?.message}
                {...register("email")}
                shadow
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="password" value={t("loginPage.password", "Password")} />
              </div>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  color={errors.password ? "failure" : "gray"}
                  helperText={errors.password?.message}
                  {...register("password")}
                  shadow
                />
                <button
                  type="button"
                  className="absolute top-[10px] right-3 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <div className="mb-2 block">
                <Label htmlFor="confirmPassword" value={t("registerPage.confirmPassword", "Confirm Password")} />
              </div>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  color={errors.confirmPassword ? "failure" : "gray"}
                  helperText={errors.confirmPassword?.message}
                  {...register("confirmPassword")}
                  shadow
                />
                <button
                  type="button"
                  className="absolute top-[10px] right-3 text-gray-400 hover:text-blue-600 transition-colors"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Password Strength/Reqs (Simplified UI) */}
            <div className="text-xs text-gray-500 space-y-1 bg-gray-50 p-3 rounded-lg border border-gray-100">
              <p className="font-medium text-gray-700 mb-1">Password must have:</p>
              <div className="flex gap-4">
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div> 6+ chars
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div> Uppercase
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div> Number
                </span>
              </div>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-start gap-2 mt-2">
              <Checkbox
                id="agree"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="text-blue-600 focus:ring-blue-600 mt-0.5"
              />
              <Label htmlFor="agree" className="text-sm text-gray-500 font-normal leading-tight">
                I agree to the <Link to="/terms" className="text-blue-600 hover:underline">Terms of Service</Link> and <Link to="/privacy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
              </Label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              color="blue"
              size="lg"
              disabled={isLoading || !agreeTerms}
              isProcessing={isLoading}
              className="w-full mt-2"
            >
              {t("registerPage.createAccountButton", "Create Account")}
              {!isLoading && <ArrowRight className="ml-2 w-4 h-4" />}
            </Button>

            {/* Divider */}
            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink-0 mx-4 text-gray-400 text-sm">Or</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>

            {/* Sign In Link */}
            <p className="text-center text-sm text-gray-600">
              {t("registerPage.alreadyHaveAccount", "Already have an account?")}{" "}
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline transition-all"
              >
                {t("registerPage.signIn", "Log in")}
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}