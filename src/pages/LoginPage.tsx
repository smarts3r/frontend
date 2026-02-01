import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
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
  Spinner,
} from "flowbite-react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
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
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
            .response?.data?.message
          : t("loginPage.loginFailed");

      toast.error(errorMessage || t("loginPage.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-10">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              Please enter your details to sign in
            </p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
              <Label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder="name@company.com"
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
              <div className="flex items-center justify-between mb-2">
                <Label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                  Forgot password?
                </Link>
              </div>
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
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
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
            </div>

            <div className="flex items-center">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor="remember-me"
                className="ml-2 block text-sm text-gray-900"
              >
                Remember me for 30 days
              </Label>
            </div>

            <div>
              <Button
                type="submit"
                size="lg"
                className="w-full bg-gray-900 hover:bg-gray-800 text-white [&>span]:py-3"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Spinner size="sm" className="mr-2" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </>
                )}
              </Button>
            </div>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              Sign up for free
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image/Visual */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gray-900">
          <img
            className="h-full w-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=2000&q=80"
            alt="Login background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-20 text-white">
          <h3 className="text-4xl font-bold mb-4">
            "The best way to predict the future is to wait for it."
          </h3>
          <p className="text-lg text-gray-300">
            Not really, go create it with Smart S3r.
          </p>
        </div>
      </div>
    </div>
  );
}
