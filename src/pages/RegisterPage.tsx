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
import { useState, useEffect } from "react";
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
  Alert,
} from "flowbite-react";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
  const { t, i18n } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  // Create the schema with current translations
  const getRegisterSchema = () => z
    .object({
      name: z.string().min(2, { message: t("registerPage.nameMinLength") }),
      email: z.string().email({ message: t("registerPage.invalidEmail") }),
      password: z.string().min(6, { message: t("registerPage.passwordMinLength") }),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: t("registerPage.passwordsDontMatch"),
      path: ["confirmPassword"],
    });

  const registerSchema = getRegisterSchema();

  type RegisterFormValues = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    reset,
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle language change by resetting the form to update validation messages
  useEffect(() => {
    const handleLanguageChange = () => {
      // Reset the form with current values to refresh validation with new language
      const currentValues = {
        name: watch('name'),
        email: watch('email'),
        password: watch('password'),
        confirmPassword: watch('confirmPassword'),
      };
      reset(currentValues, { keepErrors: false }); // This will re-validate with new language
    };

    // Listen for language change
    i18n.on('languageChanged', handleLanguageChange);

    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n, reset, watch]);

  const password = watch("password");

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
      navigate("/onboarding");
    } catch (error) {
      console.error("Registration Error:", error);
      const errorMessage =
        error instanceof Error && "response" in error
          ? (error as { response?: { data?: { message?: string } } })
            .response?.data?.message
          : t("registerPage.registrationFailed");
      setError(errorMessage || t("registerPage.registrationFailed"));
      toast.error(errorMessage || t("registerPage.registrationFailed"));
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
              {t("registerPage.title")}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t("registerPage.subtitle")}
            </p>
          </div>

          {error && (
            <Alert color="failure" className="mb-6">
              <span className="font-medium">{t("registerPage.errorLabel")}:</span> {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div>
              <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
                {t("registerPage.fullName")}
              </Label>
              <TextInput
                id="name"
                type="text"
                placeholder={t("registerPage.namePlaceholder")}
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
                {t("registerPage.email")}
              </Label>
              <TextInput
                id="email"
                type="email"
                placeholder={t("registerPage.emailPlaceholder")}
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
                {t("registerPage.password")}
              </Label>
              <div className="relative">
                <TextInput
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("registerPage.passwordPlaceholder")}
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
                    {t("registerPage.passwordReqLength")}
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
                    {t("registerPage.passwordReqUppercase")}
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
                    {t("registerPage.passwordReqNumber")}
                  </span>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
                {t("registerPage.confirmPassword")}
              </Label>
              <div className="relative">
                <TextInput
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder={t("registerPage.confirmPasswordPlaceholder")}
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
                {t("registerPage.agreeTo")}{" "}
                <Link to="/terms" className="text-blue-600 hover:underline">
                  {t("registerPage.termsOfService")}
                </Link>{" "}
                {t("registerPage.and")}{" "}
                <Link to="/privacy" className="text-blue-600 hover:underline">
                  {t("registerPage.privacyPolicy")}
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
                  {t("registerPage.creatingAccount")}
                </>
              ) : (
                <>
                  {t("registerPage.createAccount")}
                  <ArrowRight className="ml-2 h-5 w-5" />
                </>
              )}
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            {t("registerPage.alreadyHaveAccount")}{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:text-blue-500"
            >
              {t("registerPage.signIn")}
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
            alt={t("registerPage.backgroundAlt")}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-20 text-white">
          <h3 className="text-4xl font-bold mb-4">
            {t("registerPage.quote")}
          </h3>
          <p className="text-lg text-gray-300">
            {t("registerPage.quoteAuthor")}
          </p>
        </div>
      </div>
    </div>
  );
}
