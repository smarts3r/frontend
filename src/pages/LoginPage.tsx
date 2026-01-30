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
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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

  const form = useForm<LoginFormValues>({
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
    } catch (error: any) {
      console.error("Login Error:", error);
      toast.error(error.response?.data?.message || t("loginPage.loginFailed"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex overflow-hidden">
      {/* Left Side - Visual Branding */}
      <div className="hidden lg:flex w-1/2 bg-gray-900 relative flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550009158-9ebf69173e03?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80')] bg-cover bg-center opacity-40 mix-blend-overlay" />
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/90 to-purple-900/90" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 text-2xl font-bold tracking-tighter">
            <Smartphone className="w-8 h-8 text-blue-400" />
            Smart S3r
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 leading-tight">
            {t("loginPage.theFutureOfTechIsHere")}
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            {t("loginPage.experienceNextGen")}
            {t("loginPage.smartS3rBringsYou")}
          </p>
          <div className="flex gap-4 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <Laptop className="w-4 h-4" /> {t("loginPage.latestLaptops")}
            </div>
            <div className="flex items-center gap-2">
              <Headphones className="w-4 h-4" /> {t("loginPage.premiumAudio")}
            </div>
          </div>
        </div>

        <div className="relative z-10 text-sm text-gray-400">
          {t("loginPage.copyright")}
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              {t("loginPage.welcomeBack")}
            </h2>
            <p className="text-muted-foreground mt-2">
              {t("loginPage.pleaseEnterDetails")}
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("loginPage.email")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("loginPage.emailPlaceholder")}
                        className="h-11"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("loginPage.password")}</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          placeholder={t("loginPage.passwordPlaceholder")}
                          className="h-11 pr-10"
                          {...field}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent text-muted-foreground"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex items-center justify-end">
                <Link
                  to="/forgot-password"
                  className="text-sm font-medium text-primary-color hover:underline"
                >
                  {t("loginPage.forgotPassword")}
                </Link>
              </div>

              <Button
                type="submit"
                className="w-full h-11 text-base transition-all font-semibold shadow-lg hover:shadow-xl"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {t("loginPage.signIn")}
              </Button>

              <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">
                    {t("loginPage.orContinueWith")}
                  </span>
                </div>
              </div>

              <div className="text-center text-sm">
                {t("loginPage.dontHaveAccount")}
                <Link
                  to="/register"
                  className="text-blue-600 font-bold hover:underline"
                >
                  {t("loginPage.signUpForFree")}
                </Link>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
}
