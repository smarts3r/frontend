"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterPage;
var jsx_runtime_1 = require("react/jsx-runtime");
var zod_1 = require("@hookform/resolvers/zod");
var lucide_react_1 = require("lucide-react");
var react_1 = require("react");
var react_hook_form_1 = require("react-hook-form");
var react_i18next_1 = require("react-i18next");
var react_router_dom_1 = require("react-router-dom");
var sonner_1 = require("sonner");
var z = __importStar(require("zod"));
var flowbite_react_1 = require("flowbite-react");
var api_1 = __importDefault(require("@/services/api"));
var authStore_1 = require("@/store/authStore");
function RegisterPage() {
    var _this = this;
    var _a = (0, react_i18next_1.useTranslation)(), t = _a.t, i18n = _a.i18n;
    var _b = (0, react_1.useState)(false), showPassword = _b[0], setShowPassword = _b[1];
    var _c = (0, react_1.useState)(false), showConfirmPassword = _c[0], setShowConfirmPassword = _c[1];
    var _d = (0, react_1.useState)(false), isLoading = _d[0], setIsLoading = _d[1];
    var _e = (0, react_1.useState)(false), agreeTerms = _e[0], setAgreeTerms = _e[1];
    var _f = (0, react_1.useState)(null), error = _f[0], setError = _f[1];
    var navigate = (0, react_router_dom_1.useNavigate)();
    var login = (0, authStore_1.useAuthStore)(function (state) { return state.login; });
    // Create the schema with current translations
    var getRegisterSchema = function () { return z
        .object({
        name: z.string().min(2, { message: t("registerPage.nameMinLength") }),
        email: z.string().email({ message: t("registerPage.invalidEmail") }),
        password: z.string().min(6, { message: t("registerPage.passwordMinLength") }),
        confirmPassword: z.string(),
    })
        .refine(function (data) { return data.password === data.confirmPassword; }, {
        message: t("registerPage.passwordsDontMatch"),
        path: ["confirmPassword"],
    }); };
    var registerSchema = getRegisterSchema();
    var _g = (0, react_hook_form_1.useForm)({
        resolver: (0, zod_1.zodResolver)(registerSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    }), register = _g.register, handleSubmit = _g.handleSubmit, errors = _g.formState.errors, watch = _g.watch, reset = _g.reset;
    // Handle language change by resetting the form to update validation messages
    (0, react_1.useEffect)(function () {
        var handleLanguageChange = function () {
            // Reset the form with current values to refresh validation with new language
            var currentValues = {
                name: watch('name'),
                email: watch('email'),
                password: watch('password'),
                confirmPassword: watch('confirmPassword'),
            };
            reset(currentValues, { keepErrors: false }); // This will re-validate with new language
        };
        // Listen for language change
        i18n.on('languageChanged', handleLanguageChange);
        return function () {
            i18n.off('languageChanged', handleLanguageChange);
        };
    }, [i18n, reset, watch]);
    var password = watch("password");
    var onSubmit = function (data) { return __awaiter(_this, void 0, void 0, function () {
        var response, error_1, errorMessage;
        var _a, _b;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    if (!agreeTerms) {
                        sonner_1.toast.error(t("registerPage.agreeTermsError"));
                        return [2 /*return*/];
                    }
                    setIsLoading(true);
                    setError(null);
                    _c.label = 1;
                case 1:
                    _c.trys.push([1, 3, 4, 5]);
                    return [4 /*yield*/, api_1.default.post("/auth/register", {
                            name: data.name,
                            email: data.email,
                            password: data.password,
                        })];
                case 2:
                    response = _c.sent();
                    login(response.data);
                    sonner_1.toast.success(t("registerPage.successMessage"));
                    navigate("/onboarding");
                    return [3 /*break*/, 5];
                case 3:
                    error_1 = _c.sent();
                    console.error("Registration Error:", error_1);
                    errorMessage = error_1 instanceof Error && "response" in error_1
                        ? (_b = (_a = error_1
                            .response) === null || _a === void 0 ? void 0 : _a.data) === null || _b === void 0 ? void 0 : _b.message
                        : t("registerPage.registrationFailed");
                    setError(errorMessage || t("registerPage.registrationFailed"));
                    sonner_1.toast.error(errorMessage || t("registerPage.registrationFailed"));
                    return [3 /*break*/, 5];
                case 4:
                    setIsLoading(false);
                    return [7 /*endfinally*/];
                case 5: return [2 /*return*/];
            }
        });
    }); };
    // Password strength indicators
    var hasMinLength = (password === null || password === void 0 ? void 0 : password.length) >= 6;
    var hasUpperCase = /[A-Z]/.test(password || "");
    var hasNumber = /[0-9]/.test(password || "");
    return ((0, jsx_runtime_1.jsxs)("div", { className: "flex min-h-screen w-full bg-white", children: [(0, jsx_runtime_1.jsx)("div", { className: "flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24", children: (0, jsx_runtime_1.jsxs)("div", { className: "mx-auto w-full max-w-sm lg:w-96", children: [(0, jsx_runtime_1.jsxs)("div", { className: "mb-10", children: [(0, jsx_runtime_1.jsx)("h2", { className: "text-3xl font-extrabold tracking-tight text-gray-900", children: t("registerPage.title") }), (0, jsx_runtime_1.jsx)("p", { className: "mt-2 text-sm text-gray-600", children: t("registerPage.subtitle") })] }), error && ((0, jsx_runtime_1.jsxs)(flowbite_react_1.Alert, { color: "failure", className: "mb-6", children: [(0, jsx_runtime_1.jsxs)("span", { className: "font-medium", children: [t("registerPage.errorLabel"), ":"] }), " ", error] })), (0, jsx_runtime_1.jsxs)("form", { onSubmit: handleSubmit(onSubmit), className: "space-y-5", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "name", className: "mb-2 block text-sm font-medium text-gray-700", children: t("registerPage.fullName") }), (0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, __assign({ id: "name", type: "text", placeholder: t("registerPage.namePlaceholder"), icon: lucide_react_1.User, color: errors.name ? "failure" : "gray" }, register("name"), { className: "[&_input]:h-11" })), errors.name && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.name.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "email", className: "mb-2 block text-sm font-medium text-gray-700", children: t("registerPage.email") }), (0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, __assign({ id: "email", type: "email", placeholder: t("registerPage.emailPlaceholder"), icon: lucide_react_1.Mail, color: errors.email ? "failure" : "gray" }, register("email"), { className: "[&_input]:h-11" })), errors.email && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.email.message }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "password", className: "mb-2 block text-sm font-medium text-gray-700", children: t("registerPage.password") }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, __assign({ id: "password", type: showPassword ? "text" : "password", placeholder: t("registerPage.passwordPlaceholder"), icon: lucide_react_1.Lock, color: errors.password ? "failure" : "gray" }, register("password"), { className: "[&_input]:h-11 pr-10" })), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600", onClick: function () { return setShowPassword(!showPassword); }, children: showPassword ? ((0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "h-5 w-5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5" })) })] }), errors.password && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.password.message })), password && ((0, jsx_runtime_1.jsxs)("div", { className: "mt-3 flex flex-wrap gap-3", children: [(0, jsx_runtime_1.jsxs)("span", { className: "text-xs flex items-center gap-1.5 ".concat(hasMinLength ? "text-green-600 font-medium" : "text-gray-500"), children: [hasMinLength ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" })), t("registerPage.passwordReqLength")] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs flex items-center gap-1.5 ".concat(hasUpperCase ? "text-green-600 font-medium" : "text-gray-500"), children: [hasUpperCase ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" })), t("registerPage.passwordReqUppercase")] }), (0, jsx_runtime_1.jsxs)("span", { className: "text-xs flex items-center gap-1.5 ".concat(hasNumber ? "text-green-600 font-medium" : "text-gray-500"), children: [hasNumber ? ((0, jsx_runtime_1.jsx)(lucide_react_1.Check, { className: "h-3 w-3" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.X, { className: "h-3 w-3" })), t("registerPage.passwordReqNumber")] })] }))] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Label, { htmlFor: "confirmPassword", className: "mb-2 block text-sm font-medium text-gray-700", children: t("registerPage.confirmPassword") }), (0, jsx_runtime_1.jsxs)("div", { className: "relative", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.TextInput, __assign({ id: "confirmPassword", type: showConfirmPassword ? "text" : "password", placeholder: t("registerPage.confirmPasswordPlaceholder"), icon: lucide_react_1.Lock, color: errors.confirmPassword ? "failure" : "gray" }, register("confirmPassword"), { className: "[&_input]:h-11 pr-10" })), (0, jsx_runtime_1.jsx)("button", { type: "button", className: "absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600", onClick: function () { return setShowConfirmPassword(!showConfirmPassword); }, children: showConfirmPassword ? ((0, jsx_runtime_1.jsx)(lucide_react_1.EyeOff, { className: "h-5 w-5" })) : ((0, jsx_runtime_1.jsx)(lucide_react_1.Eye, { className: "h-5 w-5" })) })] }), errors.confirmPassword && ((0, jsx_runtime_1.jsx)("p", { className: "mt-1 text-sm text-red-600", children: errors.confirmPassword.message }))] }), (0, jsx_runtime_1.jsxs)("div", { className: "flex items-start gap-2", children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Checkbox, { id: "agree", checked: agreeTerms, onChange: function (e) { return setAgreeTerms(e.target.checked); }, className: "h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 mt-1" }), (0, jsx_runtime_1.jsxs)(flowbite_react_1.Label, { htmlFor: "agree", className: "text-sm text-gray-600", children: [t("registerPage.agreeTo"), " ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/terms", className: "text-blue-600 hover:underline", children: t("registerPage.termsOfService") }), " ", t("registerPage.and"), " ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/privacy", className: "text-blue-600 hover:underline", children: t("registerPage.privacyPolicy") })] })] }), (0, jsx_runtime_1.jsx)(flowbite_react_1.Button, { type: "submit", size: "lg", className: "w-full bg-gray-900 hover:bg-gray-800 text-white [&>span]:py-3", disabled: isLoading || !agreeTerms, children: isLoading ? ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)(flowbite_react_1.Spinner, { className: "mr-2", size: "sm" }), t("registerPage.creatingAccount")] })) : ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [t("registerPage.createAccount"), (0, jsx_runtime_1.jsx)(lucide_react_1.ArrowRight, { className: "ml-2 h-5 w-5" })] })) })] }), (0, jsx_runtime_1.jsxs)("p", { className: "mt-8 text-center text-sm text-gray-600", children: [t("registerPage.alreadyHaveAccount"), " ", (0, jsx_runtime_1.jsx)(react_router_dom_1.Link, { to: "/login", className: "font-semibold text-blue-600 hover:text-blue-500", children: t("registerPage.signIn") })] })] }) }), (0, jsx_runtime_1.jsxs)("div", { className: "hidden relative lg:block lg:w-1/2", children: [(0, jsx_runtime_1.jsxs)("div", { className: "absolute inset-0 bg-gray-900", children: [(0, jsx_runtime_1.jsx)("img", { className: "h-full w-full object-cover opacity-80", src: "https://images.unsplash.com/photo-1498049860654-af1e5e5667ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80", alt: t("registerPage.backgroundAlt") }), (0, jsx_runtime_1.jsx)("div", { className: "absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" })] }), (0, jsx_runtime_1.jsxs)("div", { className: "absolute bottom-0 left-0 right-0 p-20 text-white", children: [(0, jsx_runtime_1.jsx)("h3", { className: "text-4xl font-bold mb-4", children: t("registerPage.quote") }), (0, jsx_runtime_1.jsx)("p", { className: "text-lg text-gray-300", children: t("registerPage.quoteAuthor") })] })] })] }));
}
