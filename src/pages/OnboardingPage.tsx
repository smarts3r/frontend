import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  User, 
  Phone, 
  MapPin, 
  Building, 
  Globe, 
  Camera, 
  ChevronRight, 
  Check,
  ArrowRight,
  X
} from 'lucide-react';
import { 
  Button, 
  Card, 
  Label, 
  TextInput, 
  FileInput,
  Badge,
  Alert
} from 'flowbite-react';
import { useAuthStore } from '@/store/authStore';
import { toast } from 'sonner';
import api from '@/services/api';

interface ProfileFormData {
  phone: string;
  address: string;
  city: string;
  country: string;
  avatar?: string;
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, updateUser } = useAuthStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    phone: '',
    address: '',
    city: '',
    country: '',
    avatar: ''
  });
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    // If profile already complete, redirect home
    if (user.profile?.phone && user.profile?.address) {
      navigate('/home');
    }
  }, [user, navigate]);

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
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
    
    const formData = new FormData();
    formData.append('image', avatarFile);
    
    try {
      const response = await api.post('/api/admin/upload', formData, {
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

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
      let avatarUrl = formData.avatar;
      
      // Upload avatar if file selected
      if (avatarFile) {
        const uploadedUrl = await uploadAvatar();
        if (uploadedUrl) {
          avatarUrl = uploadedUrl;
        }
      }
      
      // Update profile
      const response = await api.post('/api/users/profile', {
        ...formData,
        avatar: avatarUrl
      });
      
      // Update local user state
      updateUser({
        ...user!,
        profile: response.data.profile
      });
      
      toast.success(t('onboarding.success'));
      navigate('/home');
    } catch (error) {
      console.error('Profile completion failed:', error);
      toast.error(t('onboarding.errors.failedToComplete'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    toast.info(t('onboarding.skipMessage'));
    navigate('/home');
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('onboarding.step1.title')}</h2>
        <p className="text-gray-600">{t('onboarding.step1.subtitle')}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="phone" className="mb-2 block">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-gray-500" />
              {t('onboarding.step1.phone')}
            </div>
          </Label>
          <TextInput
            id="phone"
            type="tel"
            placeholder={t('onboarding.step1.placeholder')}
            value={formData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('onboarding.step2.title')}</h2>
        <p className="text-gray-600">{t('onboarding.step2.subtitle')}</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <Label htmlFor="address" className="mb-2 block">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-gray-500" />
              {t('onboarding.step2.streetAddress')}
            </div>
          </Label>
          <TextInput
            id="address"
            type="text"
            placeholder={t('onboarding.step2.placeholders.address')}
            value={formData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="city" className="mb-2 block">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-gray-500" />
              {t('onboarding.step2.city')}
            </div>
          </Label>
          <TextInput
            id="city"
            type="text"
            placeholder={t('onboarding.step2.placeholders.city')}
            value={formData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
          />
        </div>
        
        <div>
          <Label htmlFor="country" className="mb-2 block">
            <div className="flex items-center gap-2">
              <Globe className="w-4 h-4 text-gray-500" />
              {t('onboarding.step2.country')}
            </div>
          </Label>
          <TextInput
            id="country"
            type="text"
            placeholder={t('onboarding.step2.placeholders.country')}
            value={formData.country}
            onChange={(e) => handleInputChange('country', e.target.value)}
          />
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">{t('onboarding.step3.title')}</h2>
        <p className="text-gray-600">{t('onboarding.step3.subtitle')}</p>
      </div>
      
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          {avatarPreview ? (
            <div className="relative">
              <img 
                src={avatarPreview} 
                alt={t('onboarding.step3.avatarAlt')} 
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
              />
              <button
                onClick={() => {
                  setAvatarPreview('');
                  setAvatarFile(null);
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
              >
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
          <Label htmlFor="avatar" className="mb-2 block">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-gray-500" />
              {t('onboarding.step3.uploadPhoto')}
            </div>
          </Label>
          <FileInput
            id="avatar"
            onChange={handleAvatarChange}
            accept="image/*"
          />
          <p className="text-sm text-gray-500 mt-1">{t('onboarding.step3.fileTypes')}</p>
        </div>
      </div>
      
      <Alert color="info">
        {t('onboarding.step3.tip')}
      </Alert>
    </div>
  );

  const renderProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{t('onboarding.step', { current: currentStep, total: 3 })}</span>
        <span className="text-sm text-gray-500">{t('onboarding.percentComplete', { percent: Math.round((currentStep / 3) * 100) })}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-gray-900 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / 3) * 100}%` }}
        />
      </div>
      <div className="flex justify-between mt-2">
        <Badge color={currentStep >= 1 ? 'success' : 'gray'} className="flex items-center gap-1">
          {currentStep > 1 ? <Check className="w-3 h-3" /> : '1'}
          <span className="hidden sm:inline">{t('onboarding.steps.personal')}</span>
        </Badge>
        <Badge color={currentStep >= 2 ? 'success' : 'gray'} className="flex items-center gap-1">
          {currentStep > 2 ? <Check className="w-3 h-3" /> : '2'}
          <span className="hidden sm:inline">{t('onboarding.steps.address')}</span>
        </Badge>
        <Badge color={currentStep >= 3 ? 'success' : 'gray'} className="flex items-center gap-1">
          {currentStep > 3 ? <Check className="w-3 h-3" /> : '3'}
          <span className="hidden sm:inline">{t('onboarding.steps.photo')}</span>
        </Badge>
      </div>
    </div>
  );

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <div className="p-6">
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">{t('onboarding.title', { name: user?.username || user?.email })}</h1>
            <p className="text-gray-600 mt-1">{t('onboarding.subtitle')}</p>
          </div>
          
          {/* Progress Bar */}
          {renderProgressBar()}
          
          {/* Step Content */}
          <div className="mb-8">
            {currentStep === 1 && renderStep1()}
            {currentStep === 2 && renderStep2()}
            {currentStep === 3 && renderStep3()}
          </div>
          
          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {currentStep > 1 && (
                <Button color="gray" onClick={handlePreviousStep} disabled={isLoading}>
                  {t('onboarding.navigation.back')}
                </Button>
              )}
              <button
                onClick={handleSkip}
                disabled={isLoading}
                className="text-gray-500 hover:text-gray-700 underline text-sm"
              >
                {t('onboarding.navigation.skip')}
              </button>
            </div>
            
            <div className="flex items-center gap-2">
              {currentStep < 3 ? (
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={handleNextStep}
                  disabled={isLoading}
                >
                  {t('onboarding.navigation.continue')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button 
                  className="bg-gray-900 hover:bg-gray-800 text-white"
                  onClick={handleComplete}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      {t('onboarding.navigation.completing')}
                    </>
                  ) : (
                    <>
                      {t('onboarding.navigation.completeProfile')}
                      <Check className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
