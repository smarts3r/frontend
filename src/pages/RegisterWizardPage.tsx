import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Camera,
  ChevronRight, 
  ChevronLeft,
  Check,
  Eye,
  EyeOff,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  Button, 
  Label, 
  TextInput,
  FileInput,
  Progress,
  Spinner
} from 'flowbite-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import api from '@/services/api';

interface RegistrationData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  avatar?: string;
}

export default function RegisterWizardPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    avatar: ''
  });
  
  const [errors, setErrors] = useState<Partial<Record<keyof RegistrationData, string>>>({});
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  const totalSteps = 4;

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<Record<keyof RegistrationData, string>> = {};
    
    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = t('registerWizard.step1.errors.nameRequired');
      if (!formData.email.trim()) {
        newErrors.email = t('registerWizard.step1.errors.emailRequired');
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = t('registerWizard.step1.errors.emailInvalid');
      }
      if (!formData.password) {
        newErrors.password = t('registerWizard.step1.errors.passwordRequired');
      } else if (formData.password.length < 6) {
        newErrors.password = t('registerWizard.step1.errors.passwordMinLength');
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = t('registerWizard.step1.errors.passwordsNotMatch');
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof RegistrationData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const uploadAvatar = async (): Promise<string | null> => {
    if (!avatarFile) return null;
    
    const formDataUpload = new FormData();
    formDataUpload.append('image', avatarFile);
    
    try {
      const response = await api.post('/api/admin/upload', formDataUpload, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data.url;
    } catch (error) {
      console.error('Avatar upload failed:', error);
      return null;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep(prev => prev + 1);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      const registerResponse = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      login(registerResponse.data);
      
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      if (formData.phone || formData.address || formData.city || formData.country || avatarUrl) {
        await api.post('/api/users/profile', {
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          country: formData.country,
          avatar: avatarUrl
        });
      }
      
      toast.success(t('registerWizard.successMessage'));
      navigate('/home');
    } catch (error: any) {
      console.error('Registration failed:', error);
      const errorMessage = error.response?.data?.message || t('registerWizard.errors.registrationFailed');
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{t('registerWizard.step', { current: currentStep, total: totalSteps })}</span>
        <span className="text-sm text-gray-500">{t('registerWizard.percentComplete', { percent: Math.round((currentStep / totalSteps) * 100) })}</span>
      </div>
      <Progress 
        progress={(currentStep / totalSteps) * 100} 
        size="sm" 
        color="dark"
      />
      <div className="flex justify-between mt-3">
        {[t('registerWizard.steps.account'), t('registerWizard.steps.personal'), t('registerWizard.steps.address'), t('registerWizard.steps.profile')].map((label, index) => (
          <div key={label} className="flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              currentStep > index + 1 
                ? 'bg-green-500 text-white' 
                : currentStep === index + 1 
                  ? 'bg-gray-900 text-white' 
                  : 'bg-gray-200 text-gray-500'
            }`}>
              {currentStep > index + 1 ? (
                <Check className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            <span className={`text-xs mt-1 ${currentStep === index + 1 ? 'text-gray-900 font-medium' : 'text-gray-500'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step1.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step1.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="name" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step1.fullName')} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <User className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="name"
            type="text"
            placeholder={t('registerWizard.step1.placeholders.name')}
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            color={errors.name ? 'failure' : 'gray'}
            className="pl-10 [&_input]:h-11"
          />
        </div>
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Label htmlFor="email" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step1.email')} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Mail className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="email"
            type="email"
            placeholder={t('registerWizard.step1.placeholders.email')}
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            color={errors.email ? 'failure' : 'gray'}
            className="pl-10 [&_input]:h-11"
          />
        </div>
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <Label htmlFor="password" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step1.password')} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('registerWizard.step1.placeholders.password')}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            color={errors.password ? 'failure' : 'gray'}
            className="pl-10 pr-10 [&_input]:h-11"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
      </div>
      
      <div>
        <Label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step1.confirmPassword')} <span className="text-red-500">*</span>
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('registerWizard.step1.placeholders.confirmPassword')}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            color={errors.confirmPassword ? 'failure' : 'gray'}
            className="pl-10 pr-10 [&_input]:h-11"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          >
            {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
          </button>
        </div>
        {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
      </div>
      
      <p className="text-xs text-gray-500">
        {t('registerWizard.step1.passwordRequirements')}
      </p>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step2.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step2.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="phone" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step2.phone')}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Phone className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="phone"
            type="tel"
            placeholder={t('registerWizard.step2.placeholder')}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            className="pl-10 [&_input]:h-11"
          />
        </div>
        <p className="text-sm text-gray-500 mt-1">{t('registerWizard.step2.phoneHelper')}</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step3.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step3.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="address" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step3.streetAddress')}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="address"
            type="text"
            placeholder={t('registerWizard.step3.placeholders.address')}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            className="pl-10 [&_input]:h-11"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="city" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step3.city')}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Building className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="city"
            type="text"
            placeholder={t('registerWizard.step3.placeholders.city')}
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            className="pl-10 [&_input]:h-11"
          />
        </div>
      </div>
      
      <div>
        <Label htmlFor="country" className="mb-2 block text-sm font-medium text-gray-700">
          {t('registerWizard.step3.country')}
        </Label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Globe className="h-5 w-5 text-gray-400" />
          </div>
          <TextInput
            id="country"
            type="text"
            placeholder={t('registerWizard.step3.placeholders.country')}
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
            className="pl-10 [&_input]:h-11"
          />
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step4.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step4.subtitle')}</p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {avatarPreview ? (
            <div className="relative">
              <img 
                src={avatarPreview} 
                alt={t('registerWizard.step4.avatarPreview')} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={() => {
                  setAvatarPreview('');
                  setAvatarFile(null);
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
                <span className="sr-only">{t('registerWizard.step4.remove')}</span>
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="w-full">
          <Label htmlFor="avatar" className="mb-2 block text-sm font-medium text-gray-700">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" />
              {t('registerWizard.step4.uploadPhoto')}
            </div>
          </Label>
          <FileInput
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-1">{t('registerWizard.step4.fileTypes')}</p>
        </div>
      </div>
      
      <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-sm text-green-800">{t('registerWizard.step4.almostDone')}</p>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen w-full bg-white">
      {/* Left Side - Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-lg">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {t('registerWizard.title')}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {t('registerWizard.subtitle')}
            </p>
          </div>
          
          {/* Step Indicator */}
          {renderStepIndicator()}
          
          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
            {currentStep === 4 && renderStep4()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {currentStep > 1 && (
                <Button 
                  color="gray" 
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center gap-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                  {t('registerWizard.navigation.back')}
                </Button>
              )}
            </div>
            
            <div>
              {currentStep < totalSteps ? (
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
                  onClick={handleNext}
                  disabled={isLoading}
                >
                  {t('registerWizard.navigation.continue')}
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white flex items-center gap-2"
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Spinner size="sm" className="mr-2" />
                      {t('registerWizard.navigation.creating')}
                    </>
                  ) : (
                    <>
                      {t('registerWizard.navigation.createAccount')}
                      <Check className="w-4 h-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          
          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {t('registerWizard.navigation.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="font-semibold text-blue-600 hover:text-blue-500"
              >
                {t('registerWizard.navigation.signIn')}
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Image/Visual */}
      <div className="hidden relative lg:block lg:w-1/2">
        <div className="absolute inset-0 bg-gray-900">
          <img
            className="h-full w-full object-cover opacity-80"
            src="https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=2000&q=80"
            alt="Register background"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-20 text-white">
          <h3 className="text-4xl font-bold mb-4">
            {t('registerPage.theFutureOfTechIsHere')}
          </h3>
          <p className="text-lg text-gray-300">
            {t('registerPage.smartS3rBringsYou')}
          </p>
        </div>
      </div>
    </div>
  );
}
