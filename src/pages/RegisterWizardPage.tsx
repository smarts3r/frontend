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
  ArrowRight
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Label, 
  TextInput,
  FileInput,
  Badge,
  Alert,
  Progress
} from 'flowbite-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import api from '@/services/api';

interface RegistrationData {
  // Step 1: Account
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Step 2: Personal
  phone: string;
  
  // Step 3: Address
  address: string;
  city: string;
  country: string;
  
  // Step 4: Profile
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
    // Clear error when user types
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
      // Step 1: Register user
      const registerResponse = await api.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      
      // Login the user
      login(registerResponse.data);
      
      // Upload avatar if selected
      let avatarUrl = formData.avatar;
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Update profile with additional info
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
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step1.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step1.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="name" className="mb-2 block">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step1.fullName')} <span className="text-red-500">*</span>
          </div>
        </Label>
        <TextInput
          id="name"
          type="text"
          placeholder={t('registerWizard.step1.placeholders.name')}
          value={formData.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          color={errors.name ? 'failure' : undefined}
        />
        {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
      </div>
      
      <div>
        <Label htmlFor="email" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step1.email')} <span className="text-red-500">*</span>
          </div>
        </Label>
        <TextInput
          id="email"
          type="email"
          placeholder={t('registerWizard.step1.placeholders.email')}
          value={formData.email}
          onChange={(e) => handleInputChange('email', e.target.value)}
          color={errors.email ? 'failure' : undefined}
        />
        {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
      </div>
      
      <div>
        <Label htmlFor="password" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step1.password')} <span className="text-red-500">*</span>
          </div>
        </Label>
        <div className="relative">
          <TextInput
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder={t('registerWizard.step1.placeholders.password')}
            value={formData.password}
            onChange={(e) => handleInputChange('password', e.target.value)}
            color={errors.password ? 'failure' : undefined}
          />
          {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <div>
        <Label htmlFor="confirmPassword" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step1.confirmPassword')} <span className="text-red-500">*</span>
          </div>
        </Label>
        <div className="relative">
          <TextInput
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder={t('registerWizard.step1.placeholders.confirmPassword')}
            value={formData.confirmPassword}
            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
            color={errors.confirmPassword ? 'failure' : undefined}
          />
          {errors.confirmPassword && <p className="text-sm text-red-600 mt-1">{errors.confirmPassword}</p>}
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      
      <Alert color="info">
        {t('registerWizard.step1.passwordRequirements')}
      </Alert>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step2.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step2.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="phone" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step2.phone')}
          </div>
        </Label>
        <TextInput
          id="phone"
          type="tel"
          placeholder={t('registerWizard.step2.placeholder')}
          value={formData.phone}
          onChange={(e) => handleInputChange('phone', e.target.value)}
        />
        <p className="text-sm text-gray-500 mt-1">{t('registerWizard.step2.phoneHelper')}</p>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('registerWizard.step3.title')}</h2>
        <p className="text-gray-600 mt-1">{t('registerWizard.step3.subtitle')}</p>
      </div>
      
      <div>
        <Label htmlFor="address" className="mb-2 block">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step3.streetAddress')}
          </div>
        </Label>
        <TextInput
          id="address"
          type="text"
          placeholder={t('registerWizard.step3.placeholders.address')}
          value={formData.address}
          onChange={(e) => handleInputChange('address', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="city" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step3.city')}
          </div>
        </Label>
        <TextInput
          id="city"
          type="text"
          placeholder={t('registerWizard.step3.placeholders.city')}
          value={formData.city}
          onChange={(e) => handleInputChange('city', e.target.value)}
        />
      </div>
      
      <div>
        <Label htmlFor="country" className="mb-2 block">
          <div className="flex items-center gap-2">
            <Globe className="w-4 h-4 text-gray-500" />
            {t('registerWizard.step3.country')}
          </div>
        </Label>
        <TextInput
          id="country"
          type="text"
          placeholder={t('registerWizard.step3.placeholders.country')}
          value={formData.country}
          onChange={(e) => handleInputChange('country', e.target.value)}
        />
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-5">
      <div className="text-center mb-6">
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
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ) : (
            <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center border-4 border-gray-200">
              <User className="w-16 h-16 text-gray-400" />
            </div>
          )}
        </div>
        
        <div className="w-full">
          <Label htmlFor="avatar" className="mb-2 block">
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
      
      <Alert color="success">
        {t('registerWizard.step4.almostDone')}
      </Alert>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('registerWizard.title')}</h1>
            <p className="text-gray-600 mt-1">{t('registerWizard.subtitle')}</p>
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
                      <span className="animate-spin">⏳</span>
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
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {t('registerWizard.navigation.alreadyHaveAccount')}{' '}
              <button
                onClick={() => navigate('/login')}
                className="text-gray-900 font-semibold hover:underline"
              >
                {t('registerWizard.navigation.signIn')}
              </button>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
