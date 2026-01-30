import {
  AlertCircle,
  DollarSign,
  Download,
  FileSpreadsheet,
  LayoutDashboard,
  Package,
  Upload,
  Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import api from "@/services/api";
import { useAuthStore } from "@/store/authStore";
import { useCurrencyFormat } from "@/lib/currency";

export default function AdminDashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const user = useAuthStore((state) => state.user);
  const formatCurrency = useCurrencyFormat();
  const [stats, setStats] = useState<{
    totalRevenue: number;
    totalProducts: number;
    totalSales: number;
    activeNow: number;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get("/admin/stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch admin stats", error);
      }
    };
    fetchStats();
  }, []);

  // Guard: Only show to admins
  if (!user || user.role !== "admin") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
        <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
        <p className="text-gray-600 max-w-md">
          You do not have permission to view the admin dashboard. Please contact
          your system administrator if you believe this is an error.
        </p>
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => (window.location.href = "/")}
        >
          Return to Home
        </Button>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!file) {
      toast.error("Please select a CSV file first");
      return;
    }

    const formData = new FormData();
    formData.append("csvFile", file);

    setUploading(true);
    try {
      await api.post("/admin/csv/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Products imported successfully!");
      setFile(null);
      // Optionally refresh product list here
    } catch (error: any) {
      console.error("Import failed:", error);
      toast.error(error.response?.data?.message || "Import failed");
    } finally {
      setUploading(false);
    }
  };

  const handleExport = async () => {
    try {
      const response = await api.get("/admin/csv/export", {
        responseType: "blob",
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute(
        "download",
        `products_export_${new Date().toISOString().split("T")[0]}.csv`,
      );
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Export started");
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export products");
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await api.get("/admin/csv/template", {
        responseType: "blob",
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "product_template.csv");
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Template download failed:", error);
      toast.error("Failed to download template");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your store, products, and inventory.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-lg text-sm font-medium">
          <Users className="w-4 h-4" />
          Logged in as {user.username || "Admin"}
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? formatCurrency(stats.totalRevenue) : "..."}
            </div>
            <p className="text-xs text-muted-foreground">Inventory Value</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Active Products
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.totalProducts : "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              Total items in catalog
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
            <LayoutDashboard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.totalSales : "..."}
            </div>
            <p className="text-xs text-muted-foreground">Completed orders</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats ? stats.activeNow : "..."}
            </div>
            <p className="text-xs text-muted-foreground">
              Users active recently
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Product Management Section */}
      <div className="grid gap-8 md:grid-cols-2">
        {/* Import Section */}
        <Card className="border-blue-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="w-5 h-5 text-blue-600" />
              Bulk Import Products
            </CardTitle>
            <CardDescription>
              Upload a CSV file to add or update multiple products at once.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert className="bg-blue-50 border-blue-100">
              <FileSpreadsheet className="h-4 w-4 text-blue-600" />
              <AlertTitle>Need the format?</AlertTitle>
              <AlertDescription className="text-xs text-blue-700 mt-1">
                Download the official CSV template to ensure your data is
                formatted correctly before uploading.
                <br />
                <Button
                  variant="link"
                  className="p-0 h-auto font-semibold text-blue-800"
                  onClick={handleDownloadTemplate}
                >
                  Download Template
                </Button>
              </AlertDescription>
            </Alert>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium">Select CSV File</label>
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>

            <Button
              className="w-full bg-blue-600 hover:bg-blue-700"
              onClick={handleImport}
              disabled={uploading || !file}
            >
              {uploading ? "Importing..." : "Run Import Job"}
            </Button>
          </CardContent>
        </Card>

        {/* Export Section */}
        <Card className="border-purple-100 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="w-5 h-5 text-purple-600" />
              Export Data
            </CardTitle>
            <CardDescription>
              Download your product catalog for backup or analysis.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="p-4 bg-purple-50 rounded-lg flex flex-col justify-between h-full space-y-4">
              <p className="text-sm text-purple-800">
                This will generate a full CSV export of all products currently
                in the database, including stock levels and pricing.
              </p>
              <Button
                variant="outline"
                className="w-full border-purple-200 text-purple-700 hover:bg-purple-100"
                onClick={handleExport}
              >
                Export All Products
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
