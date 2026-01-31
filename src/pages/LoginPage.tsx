import { zodResolver } from "@hookform/resolvers/zod";
import {
  Eye,
  EyeOff,
  Headphones,
  Laptop,
  Loader2,
  Smartphone,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const loginSchema = z.object({
    email: z.string().email(t("loginPage.invalidEmail")),
    password: z.string().min(6, t("loginPage.passwordMinLength")),
  });

  type LoginFormValues = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await api.post("/auth/login", {
        loginIdentifier: data.email,
        password: data.password,
      });
      login(response.data);
      toast.success(t("loginPage.welcomeBackMessage"));
      navigate("/home");
    } catch (error) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || t("loginPage.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row overflow-hidden bg-gray-50 ">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex w-full lg:w-1/2 bg-gradient-to-br from-indigo-900 to-purple-900 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-20" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 text-2xl font-bold">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Smartphone className="w-6 h-6" />
            </div>
            <span className="tracking-tight">Smart S3r</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-6 leading-tight">
            {t("loginPage.theFutureOfTechIsHere")}
          </h1>
          <p className="text-lg text-gray-200 mb-8 leading-relaxed">
            {t("loginPage.experienceNextGen")}
            {t("loginPage.smartS3rBringsYou")}
          </p>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Laptop className="w-4 h-4" /> {t("loginPage.latestLaptops")}
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg">
              <Headphones className="w-4 h-4" /> {t("loginPage.premiumAudio")}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-300">
          {t("loginPage.copyright")}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8 p-6 lg:p-8 bg-white  rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 ">
              {t("loginPage.welcomeBack")}
            </h2>
            <p className="mt-2 text-gray-600 ">
              {t("loginPage.pleaseEnterDetails")}
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                {t("loginPage.email")}
              </label>
              <input
                type="email"
                id="email"
                className={`bg-gray-50 border ${errors.email
                  ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                  : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                  } text-gray-900 text-sm rounded-lg block w-full p-2.5 `}
                placeholder={t("loginPage.emailPlaceholder")}
                {...register("email")}
              />
              {errors.email && (
                <p className="mt-2 text-sm text-red-600 ">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 "
              >
                {t("loginPage.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`bg-gray-50 border ${errors.password
                    ? "border-red-500 focus:ring-red-500 focus:border-red-500"
                    : "border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                    } text-gray-900 text-sm rounded-lg block w-full p-2.5 `}
                  placeholder={t("loginPage.passwordPlaceholder")}
                  {...register("password")}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 "
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4" />
                  ) : (
                    <Eye className="w-4 h-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="mt-2 text-sm text-red-600 ">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="remember"
                    type="checkbox"
                    className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                  />
                </div>
                <label
                  htmlFor="remember"
                  className="ml-2 text-sm font-medium text-gray-900 "
                >
                  {t("loginPage.rememberMe")}
                </label>
              </div>
              <Link
                to="/forgot-password"
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {t("loginPage.forgotPassword")}
              </Link>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 
              focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center 
              disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {t("loginPage.signingIn")}
                </div>
              ) : (
                t("loginPage.signIn")
              )}
            </button>


            {/* Register Link */}
            <div className="text-center text-sm text-gray-600 ">
              {t("loginPage.dontHaveAccount")}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:underline "
              >
                {t("loginPage.signUpForFree")}
              </Link>
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Branding Header */}
      <div className="lg:hidden w-full bg-linear-to-r from-indigo-900 to-purple-900 text-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xl font-bold">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Smartphone className="w-5 h-5" />
            </div>
            Smart S3r
          </div>
        </div>
        <div className="mt-6">
          <h2 className="text-2xl font-bold mb-3">
            {t("loginPage.theFutureOfTechIsHere")}
          </h2>
          <div className="flex gap-3 text-sm">
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
              <Laptop className="w-3 h-3" /> {t("loginPage.latestLaptops")}
            </div>
            <div className="flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-lg">
              <Headphones className="w-3 h-3" /> {t("loginPage.premiumAudio")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}