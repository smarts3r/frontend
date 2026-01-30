import { useNavigate } from "react-router-dom";
import { User, Mail, MapPin, Phone, Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
    const { user, logout } = useAuthStore();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    if (!user) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <h2 className="text-2xl font-bold mb-4">Please log in to view your profile</h2>
                <Button onClick={() => navigate("/login")}>Go to Login</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto space-y-8">

                {/* Header / Overview */}
                <div className="flex flex-col md:flex-row gap-6 items-center md:items-start bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <Avatar className="w-24 h-24 border-4 border-gray-50 shadow-md">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                        <AvatarFallback>{user.username?.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-center md:text-left space-y-2">
                        <h1 className="text-3xl font-bold text-gray-900">{user.username}</h1>
                        <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500">
                            <Mail className="w-4 h-4" />
                            <span>{user.email}</span>
                        </div>
                        <div className="pt-2">
                            <Badge variant={user.role === 'admin' ? "destructive" : "secondary"}>
                                {user.role === 'admin' ? <Shield className="w-3 h-3 mr-1" /> : <User className="w-3 h-3 mr-1" />}
                                {user.role.toUpperCase()}
                            </Badge>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[140px]">
                        <Button variant="outline" onClick={() => navigate("/orders")}>
                            My Orders
                        </Button>
                        {user.role === 'admin' && (
                            <Button variant="secondary" onClick={() => navigate("/admin")}>
                                Admin Dashboard <ExternalLink className="ml-2 w-3 h-3" />
                            </Button>
                        )}
                        <Button variant="destructive" onClick={handleLogout}>
                            Log Out
                        </Button>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Personal Info */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Personal Information
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">First Name</label>
                                    <p className="font-medium">{user.profile?.first_name || "—"}</p>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-500 uppercase">Last Name</label>
                                    <p className="font-medium">{user.profile?.last_name || "—"}</p>
                                </div>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-gray-500 uppercase">Phone</label>
                                <div className="flex items-center gap-2 mt-1">
                                    {user.profile?.phone ? (
                                        <>
                                            <Phone className="w-4 h-4 text-gray-400" />
                                            <span>{user.profile.phone}</span>
                                        </>
                                    ) : (
                                        <span className="text-gray-400 italic">Not set</span>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Address */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-green-600" /> Shipping Address
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {user.profile?.address ? (
                                <div className="space-y-1">
                                    <p className="font-medium">{user.profile.address}</p>
                                    <p className="text-gray-600">
                                        {user.profile.city}, {user.profile.state} {user.profile.zip_code}
                                    </p>
                                    <p className="text-gray-600">{user.profile.country}</p>
                                </div>
                            ) : (
                                <div className="text-center py-6 text-gray-400">
                                    <p>No address saved.</p>
                                    <Button variant="link" className="text-blue-600 h-auto p-0 mt-2">Add Address</Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
