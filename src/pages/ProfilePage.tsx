import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  MapPin,
  Phone,
  Shield,
  LogOut,
  Package,
  Heart,
  Settings,
  Edit2,
  Check,
  X,
  Camera,
  ChevronRight,
  Menu,
} from "lucide-react";
import {
  Avatar,
  Badge,
  Button,
  Card,
  Label,
  TextInput,
  Spinner,
  Tabs,
  TabItem,
} from "flowbite-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useUpdateUserProfile, useUpdateUserAddress } from "@/hooks/useUser";

export default function ProfilePage() {
  const { user, logout, updateUser } = useAuthStore();
  const navigate = useNavigate();

  const { updateUserProfile, loading: profileLoading } = useUpdateUserProfile();
  const { updateUserAddress, loading: addressLoading } = useUpdateUserAddress();

  const [activeTab, setActiveTab] = useState("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [profileForm, setProfileForm] = useState({
    first_name: user?.profile?.first_name || "",
    last_name: user?.profile?.last_name || "",
    phone: user?.profile?.phone || "",
  });

  const [addressForm, setAddressForm] = useState({
    address: user?.profile?.address || "",
    city: user?.profile?.city || "",
    state: user?.profile?.state || "",
    zip_code: user?.profile?.zip_code || "",
    country: user?.profile?.country || "",
  });

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleProfileSubmit = async () => {
    const result = await updateUserProfile({
      firstName: profileForm.first_name,
      lastName: profileForm.last_name,
      phone: profileForm.phone,
    });

    if (result) {
      toast.success("Profile updated successfully");
      if (user) {
        updateUser({
          ...user,
          profile: {
            id: user.profile?.id || 0,
            user_id: user.id,
            ...user.profile,
            first_name: profileForm.first_name,
            last_name: profileForm.last_name,
            phone: profileForm.phone,
          },
        });
      }
      setIsEditingProfile(false);
    } else {
      toast.error("Failed to update profile");
    }
  };

  const handleAddressSubmit = async () => {
    const result = await updateUserAddress(addressForm);

    if (result) {
      toast.success("Address updated successfully");
      if (user) {
        updateUser({
          ...user,
          profile: {
            id: user.profile?.id || 0,
            user_id: user.id,
            ...user.profile,
            ...addressForm,
          },
        });
      }
      setIsEditingAddress(false);
    } else {
      toast.error("Failed to update address");
    }
  };

  const cancelProfileEdit = () => {
    setProfileForm({
      first_name: user?.profile?.first_name || "",
      last_name: user?.profile?.last_name || "",
      phone: user?.profile?.phone || "",
    });
    setIsEditingProfile(false);
  };

  const cancelAddressEdit = () => {
    setAddressForm({
      address: user?.profile?.address || "",
      city: user?.profile?.city || "",
      state: user?.profile?.state || "",
      zip_code: user?.profile?.zip_code || "",
      country: user?.profile?.country || "",
    });
    setIsEditingAddress(false);
  };

  const handleTabChange = (tabId: string) => {
    if (tabId === "orders") {
      navigate("/orders");
    } else if (tabId === "wishlist") {
      navigate("/wishlist");
    } else {
      setActiveTab(tabId);
    }
    setIsMobileMenuOpen(false);
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-xl md:text-2xl font-bold mb-4 text-gray-900">
          Please log in to view your profile
        </h2>
        <Button color="dark" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  const menuItems = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "My Orders", icon: Package },
    { id: "wishlist", label: "Wishlist", icon: Heart },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="container mx-auto px-4 py-4 sm:py-6 md:py-10">
      <div className="max-w-5xl mx-auto">
        {/* Profile Header Card */}
        <Card className="mb-4 sm:mb-6 shadow-sm">
          <div className="p-4 sm:p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center gap-4 sm:gap-6">
              {/* Avatar with upload button */}
              <div className="relative flex-shrink-0">
                <Avatar
                  img={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`}
                  alt={user.username}
                  rounded
                  size="xl"
                  className="border-4 border-gray-100 w-20 h-20 sm:w-24 sm:h-24"
                />
                <button className="absolute bottom-0 right-0 bg-gray-900 text-white p-1.5 sm:p-2 rounded-full hover:bg-gray-800 transition-colors">
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>

              {/* User Info */}
              <div className="flex-1 text-center md:text-left">
                <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900 mb-1">
                  {user.username}
                </h1>
                <p className="text-gray-500 text-sm sm:text-base mb-2 sm:mb-3">{user.email}</p>
                <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
                  <Badge
                    color={user.role.toUpperCase() === "ADMIN" ? "red" : "gray"}
                  >
                    {user.role.toUpperCase() === "ADMIN" ? (
                      <Shield className="w-3 h-3 mr-1 inline" />
                    ) : (
                      <User className="w-3 h-3 mr-1 inline" />
                    )}
                    {user.role.toUpperCase()}
                  </Badge>
                  <span className="text-xs sm:text-sm text-gray-400">
                    Member since {user.created_at ? new Date(user.created_at).toLocaleDateString() : "Recently"}
                  </span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-row gap-2 w-full md:w-auto mt-2 md:mt-0">
                {user.role.toUpperCase() === "ADMIN" && (
                  <Button
                    color="dark"
                    onClick={() => navigate("/admin")}
                    className="flex-1 md:flex-none"
                  >
                    Admin
                  </Button>
                )}
                <Button
                  color="light"
                  onClick={handleLogout}
                  className="flex-1 md:flex-none"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  <span className="hidden sm:inline">Logout</span>
                  <span className="sm:hidden">Exit</span>
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Mobile Menu Toggle */}
        <div className="lg:hidden mb-4">
          <Button
            color="light"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="w-full flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <Menu className="w-5 h-5" />
              Menu
            </span>
            <ChevronRight className={`w-5 h-5 transition-transform ${isMobileMenuOpen ? "rotate-90" : ""}`} />
          </Button>
        </div>

        {/* Main Content with Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Sidebar Navigation */}
          <div className={`lg:col-span-1 ${isMobileMenuOpen ? "block" : "hidden lg:block"}`}>
            <Card className="shadow-sm">
              <div className="p-2">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => handleTabChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg text-sm font-medium transition-colors ${
                          isActive
                            ? "bg-gray-900 text-white"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="flex-1 text-left">{item.label}</span>
                        {!isActive && <ChevronRight className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </Card>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            <Tabs>
              <TabItem active={activeTab === "profile"} title="Personal Info">
                <Card className="shadow-sm">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-blue-100 rounded-lg">
                          <User className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Personal Information
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Manage your personal details
                          </p>
                        </div>
                      </div>
                      {!isEditingProfile && (
                        <Button
                          color="light"
                          onClick={() => setIsEditingProfile(true)}
                          className="w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          Edit
                        </Button>
                      )}
                    </div>

                    {isEditingProfile ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="first_name" className="mb-1.5 sm:mb-2 block text-sm">
                              First Name
                            </Label>
                            <TextInput
                              id="first_name"
                              value={profileForm.first_name}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, first_name: e.target.value })
                              }
                              placeholder="Enter first name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="last_name" className="mb-1.5 sm:mb-2 block text-sm">
                              Last Name
                            </Label>
                            <TextInput
                              id="last_name"
                              value={profileForm.last_name}
                              onChange={(e) =>
                                setProfileForm({ ...profileForm, last_name: e.target.value })
                              }
                              placeholder="Enter last name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="phone" className="mb-1.5 sm:mb-2 block text-sm">
                            Phone Number
                          </Label>
                          <TextInput
                            id="phone"
                            type="tel"
                            value={profileForm.phone}
                            onChange={(e) =>
                              setProfileForm({ ...profileForm, phone: e.target.value })
                            }
                            placeholder="Enter phone number"
                            icon={Phone}
                          />
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                          <Button
                            color="dark"
                            onClick={handleProfileSubmit}
                            disabled={profileLoading}
                            className="w-full sm:w-auto"
                          >
                            {profileLoading ? (
                              <>
                                <Spinner className="mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Save Changes
                              </>
                            )}
                          </Button>
                          <Button
                            color="light"
                            onClick={cancelProfileEdit}
                            disabled={profileLoading}
                            className="w-full sm:w-auto"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6">
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                            Full Name
                          </Label>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {user.profile?.first_name || user.profile?.last_name
                              ? `${user.profile?.first_name || ""} ${user.profile?.last_name || ""}`
                              : "Not set"}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                            Email Address
                          </Label>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{user.email}</p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                            Phone Number
                          </Label>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">
                            {user.profile?.phone || "Not set"}
                          </p>
                        </div>
                        <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                          <Label className="text-xs font-semibold text-gray-500 uppercase block mb-1">
                            Username
                          </Label>
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{user.username}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </Card>

                {/* Address Section */}
                <Card className="shadow-sm mt-4 sm:mt-6">
                  <div className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0 mb-4 sm:mb-6">
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="p-1.5 sm:p-2 bg-green-100 rounded-lg">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-semibold text-gray-900">
                            Shipping Address
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-500">
                            Manage your delivery address
                          </p>
                        </div>
                      </div>
                      {!isEditingAddress && (
                        <Button
                          color="light"
                          onClick={() => setIsEditingAddress(true)}
                          className="w-full sm:w-auto"
                        >
                          <Edit2 className="w-4 h-4 mr-2" />
                          {user.profile?.address ? "Edit" : "Add Address"}
                        </Button>
                      )}
                    </div>

                    {isEditingAddress ? (
                      <div className="space-y-3 sm:space-y-4">
                        <div>
                          <Label htmlFor="address" className="mb-1.5 sm:mb-2 block text-sm">
                            Street Address
                          </Label>
                          <TextInput
                            id="address"
                            value={addressForm.address}
                            onChange={(e) =>
                              setAddressForm({ ...addressForm, address: e.target.value })
                            }
                            placeholder="Enter street address"
                          />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="city" className="mb-1.5 sm:mb-2 block text-sm">
                              City
                            </Label>
                            <TextInput
                              id="city"
                              value={addressForm.city}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, city: e.target.value })
                              }
                              placeholder="Enter city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state" className="mb-1.5 sm:mb-2 block text-sm">
                              State / Province
                            </Label>
                            <TextInput
                              id="state"
                              value={addressForm.state}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, state: e.target.value })
                              }
                              placeholder="Enter state"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                          <div>
                            <Label htmlFor="zip_code" className="mb-1.5 sm:mb-2 block text-sm">
                              ZIP / Postal Code
                            </Label>
                            <TextInput
                              id="zip_code"
                              value={addressForm.zip_code}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, zip_code: e.target.value })
                              }
                              placeholder="Enter ZIP code"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country" className="mb-1.5 sm:mb-2 block text-sm">
                              Country
                            </Label>
                            <TextInput
                              id="country"
                              value={addressForm.country}
                              onChange={(e) =>
                                setAddressForm({ ...addressForm, country: e.target.value })
                              }
                              placeholder="Enter country"
                            />
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-3 sm:pt-4 border-t">
                          <Button
                            color="dark"
                            onClick={handleAddressSubmit}
                            disabled={addressLoading}
                            className="w-full sm:w-auto"
                          >
                            {addressLoading ? (
                              <>
                                <Spinner className="mr-2" />
                                Saving...
                              </>
                            ) : (
                              <>
                                <Check className="w-4 h-4 mr-2" />
                                Save Address
                              </>
                            )}
                          </Button>
                          <Button
                            color="light"
                            onClick={cancelAddressEdit}
                            disabled={addressLoading}
                            className="w-full sm:w-auto"
                          >
                            <X className="w-4 h-4 mr-2" />
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        {user.profile?.address ? (
                          <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-start gap-2 sm:gap-3">
                              <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                              <div>
                                <p className="font-medium text-gray-900 text-sm sm:text-base">
                                  {user.profile.address}
                                </p>
                                <p className="text-gray-600 text-sm">
                                  {user.profile.city}, {user.profile.state} {user.profile.zip_code}
                                </p>
                                <p className="text-gray-600 text-sm">{user.profile.country}</p>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center py-6 sm:py-8 bg-gray-50 rounded-lg">
                            <MapPin className="w-10 h-10 sm:w-12 sm:h-12 mx-auto text-gray-300 mb-3" />
                            <p className="text-gray-500 mb-4 text-sm sm:text-base">No address saved yet</p>
                            <Button
                              color="dark"
                              onClick={() => setIsEditingAddress(true)}
                              className="w-full sm:w-auto"
                            >
                              Add Your Address
                            </Button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </Card>
              </TabItem>

              <TabItem active={activeTab === "settings"} title="Settings">
                <Card className="shadow-sm">
                  <div className="p-4 sm:p-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-4">
                      Account Settings
                    </h3>
                    <p className="text-gray-500 text-sm sm:text-base">
                      Settings options will be available soon.
                    </p>
                  </div>
                </Card>
              </TabItem>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
}
