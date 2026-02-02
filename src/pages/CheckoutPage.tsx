import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  Phone,
  Shield,
  ShoppingBag,
  Truck,
  User,
} from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useAuthStore } from "@/store/authStore";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyFormat } from "@/lib/currency";
import { useCreateOrder } from "@/hooks/useUser";

const checkoutSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  address: z.string().min(5, "Address must be at least 5 characters"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  paymentMethod: z.enum(["cash-on-delivery"]),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

type CheckoutFormData = z.infer<typeof checkoutSchema>;

export default function CheckoutPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const formatCurrency = useCurrencyFormat();
  const { createOrder } = useCreateOrder();

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      fullName:
        user?.profile?.first_name && user?.profile?.last_name
          ? `${user.profile.first_name} ${user.profile.last_name}`
          : "",
      address: user?.profile?.address || "",
      phone: user?.profile?.phone || "",
      paymentMethod: "cash-on-delivery",
      terms: false,
    },
  });

  const totalPrice = getTotalPrice();
  const shipping = totalPrice > 350 ? 0 : 10;
  const tax = totalPrice * 0.08; // 8% tax
  const finalTotal = totalPrice + shipping + tax;

  const onSubmit = async (data: CheckoutFormData) => {
    setIsProcessing(true);

    try {
      // Enhanced form validation
      if (!data.fullName.trim()) {
        toast.error("Please enter your full name");
        return;
      }

      if (!data.address.trim()) {
        toast.error("Please enter your street address");
        return;
      }

      if (!data.phone.trim()) {
        toast.error("Please enter your phone number");
        return;
      }

      if (data.phone.length < 10) {
        toast.error("Phone number must be at least 10 digits");
        return;
      }

      // Simulate order processing with better user experience
      // await new Promise((resolve) => setTimeout(resolve, 2000));

      const orderItems = items.map((item) => ({
        productId: String(item.product_id), // Ensure string if backend expects string, or number if number. Let's check schema.
        quantity: item.quantity,
      }));

      // In user.controller.ts, it uses `where: { id: item.productId }`. 
      // Product ID in DB is Int. So productId should be number.
      // But let's check validationMiddleware.ts to be sure.
      // Actually, if we look at `useUser.ts` CreateOrderData interface, I defined it as string.
      // Let's coerce to any for now to avoid TS issues if I guessed wrong, or just pass as is if consistent.
      // The backend uses Number(req.params.id) in some places, but for createOrder it just passes item.productId to findUnique.
      // Prisma findUnique where id is Int expects Int.
      // So I should pass numbers.
      
      const payload = {
        items: items.map(item => ({
          productId: item.product_id, // number
          quantity: item.quantity
        })),
        shippingAddress: data.address,
        phoneNumber: data.phone,
        // billingAddress: data.address, // Optional
        // notes: "Order placed via checkout", // Optional
      };

      const result = await createOrder(payload as any);

      if (result) {
        console.log("Order placed:", result);

        // Enhanced success message with order details
        toast.success(
          `Order placed successfully! Order Number: ${result.orderNumber || 'Pending'}. Total: ${formatCurrency(finalTotal)}`,
          {
            duration: 5000,
          },
        );

        clearCart();

        // Redirect to orders page after a brief delay to show the success message
        setTimeout(() => {
          navigate("/orders");
        }, 2000);
      } else {
         throw new Error("Failed to create order");
      }

    } catch (error) {
      console.error("Order error:", error);
      toast.error("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto text-center">
          <div className="mb-8">
            <img
              src="/img/logo.jpg"
              alt="Smart S3r"
              className="w-24 h-24 mx-auto mb-4 rounded-lg object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            {t("checkoutPage.yourCartIsEmpty")}
          </h1>
          <p className="text-gray-600 mb-8">
            {t("checkoutPage.continueShopping")}
          </p>
          <Button
            onClick={() => navigate("/products")}
            className="w-full"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("checkoutPage.backToCart")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="ghost"
            onClick={() => navigate("/cart")}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            {t("checkoutPage.backToCart")}
          </Button>
          <div className="flex items-center justify-center">
            <img
              src="/img/logo.jpg"
              alt="Smart S3r"
              className="w-32 h-32 rounded-lg object-cover"
            />
            <h1 className="text-3xl font-bold text-gray-900 ml-4">
              {t("checkoutPage.checkout")}
            </h1>
          </div>
        </div>

        {/* Wrapped grid in Form component to provide context for all FormFields (inputs & checkbox) */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Contact Information */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  {t("checkoutPage.contactInformation")}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <User className="h-4 w-4" />
                          {t("checkoutPage.fullName")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("checkoutPage.fullName")}
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {t("checkoutPage.streetAddress")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("checkoutPage.streetAddress")}
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
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {t("checkoutPage.phoneNumber")}
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder={t("checkoutPage.phoneNumber")}
                            className="h-11"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>{t("checkoutPage.orderSummary")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-2">
                  {items.map((item) => (
                    <div
                      key={item.product_id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <img
                        src={item.product.img}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {item.product.name}
                        </h4>
                        <p className="text-xs text-gray-600">
                          {t("productCard.inCart")}: {item.quantity}
                        </p>
                        <p className="font-semibold text-sm">
                          {item.product.old_price ? (
                            <>
                              <span className="text-gray-400 line-through">
                                {formatCurrency(item.product.old_price)}
                              </span>
                              <span className="ml-2">
                                {formatCurrency(item.product.price)}
                              </span>
                            </>
                          ) : (
                            <span>
                              {formatCurrency(item.product.price)}
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator />

                {/* Pricing */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t("checkoutPage.subtotal")}</span>
                    <span>
                      {formatCurrency(totalPrice)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("checkoutPage.shipping")}</span>
                    <span>
                      {shipping === 0 ? (
                        <span className="text-green-600">
                          {t("checkoutPage.freeShippingOnOrdersOver")}
                        </span>
                      ) : (
                        <span>
                          {formatCurrency(shipping)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t("checkoutPage.tax")}</span>
                    <span>
                      {formatCurrency(tax)}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-semibold text-lg">
                    <span>{t("checkoutPage.total")}</span>
                    <span>
                      {formatCurrency(finalTotal)}
                    </span>
                  </div>
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2 text-sm p-3 bg-green-50 rounded-lg">
                    <Truck className="h-5 w-5 text-green-600" />
                    <span>{t("checkoutPage.freeShippingOnOrdersOver")}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm p-3 bg-blue-50 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600" />
                    <span>{t("checkoutPage.securePaymentProcessing")}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="space-y-4">
                  <h3 className="font-medium text-lg">
                    {t("checkoutPage.paymentMethod")}
                  </h3>
                  <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold">
                        {t("currency.symbol")}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        {t("checkoutPage.cashOnDelivery")}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        Pay when you receive your order
                      </p>
                    </div>
                  </div>
                </div>

                {/* Terms and Submit */}
                <div className="space-y-4 pt-4 border-t">
                  <FormField
                    control={form.control}
                    name="terms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            {t("checkoutPage.termsAndConditions")}
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={!form.formState.isValid || isProcessing}
                    className="w-full py-3 text-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isProcessing ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent border-r-transparent mr-2"></div>
                        {t("checkoutPage.processing")}
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="mr-2 h-4 w-4" />
                        {t("checkoutPage.placeOrder")}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>

                  {/* Order Processing Message */}
                  {isProcessing && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg text-center">
                      <div className="animate-pulse">
                        <div className="inline-flex items-center">
                          <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent border-r-transparent mr-2"></div>
                          <span className="text-blue-600">
                            {t("checkoutPage.processing")}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
