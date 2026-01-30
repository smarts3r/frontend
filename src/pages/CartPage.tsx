import { ArrowRight, Minus, Plus, ShoppingCart, Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cartStore";
import { useCurrencyFormat } from "@/lib/currency";
import { useTranslation } from "react-i18next";

export default function CartPage() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const [isUpdating, setIsUpdating] = useState<number | null>(null);
  const formatCurrency = useCurrencyFormat();

  const handleQuantityChange = async (
    productId: number,
    newQuantity: number,
  ) => {
    setIsUpdating(productId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      updateQuantity(productId, newQuantity);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleRemoveItem = async (productId: number) => {
    setIsUpdating(productId);
    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      removeItem(productId);
    } finally {
      setIsUpdating(null);
    }
  };

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const shipping = totalPrice > 350 ? 0 : 10;
  const finalTotal = totalPrice + shipping;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto text-center">
          <div className="mb-6">
            <ShoppingCart className="mx-auto h-16 w-16 text-gray-400 mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              {t("checkoutPage.yourCartIsEmpty")}
            </h1>
            <p className="text-gray-600">
              Looks like you haven't added anything to your cart yet.
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={() => navigate("/products")}
              className="w-full sm:w-auto"
            >
              {t("checkoutPage.continueShopping")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        {t("navbar.cart")} ({totalItems} items)
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <Card key={item.product_id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="sm:w-24 sm:h-24 w-32 h-32 mx-auto sm:mx-0 flex-shrink-0">
                    <img
                      src={item.product.img}
                      alt={item.product.name}
                      className="w-full h-full object-cover rounded-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {item.product.category}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg">
                          {formatCurrency(
                            (item.product.old_price || item.product.price) *
                              item.quantity,
                          )}
                        </p>
                        {item.product.old_price && (
                          <p className="text-sm text-gray-500 line-through">
                            {formatCurrency(
                              item.product.old_price * item.quantity,
                            )}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.product_id,
                              item.quantity - 1,
                            )
                          }
                          disabled={
                            isUpdating === item.product_id || item.quantity <= 1
                          }
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="w-12 text-center font-medium">
                          {item.quantity}
                        </span>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            handleQuantityChange(
                              item.product_id,
                              item.quantity + 1,
                            )
                          }
                          disabled={isUpdating === item.product_id}
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-600">
                          {formatCurrency(item.product.old_price || item.product.price)} each
                        </p>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveItem(item.product_id)}
                          disabled={isUpdating === item.product_id}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={() => navigate("/products")}
              className="hidden sm:flex"
            >
              {t("checkoutPage.continueShopping")}
            </Button>
            <Button
              variant="outline"
              onClick={clearCart}
              className="text-red-500 hover:text-red-700 hover:bg-red-50"
            >
              Clear Cart
            </Button>
          </div>
        </div>

        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardHeader>
              <CardTitle>{t("checkoutPage.orderSummary")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>{t("checkoutPage.subtotal")} ({totalItems} items)</span>
                <span>{formatCurrency(totalPrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>{t("checkoutPage.shipping")}</span>
                <span>
                  {shipping === 0 ? "FREE" : formatCurrency(shipping)}
                </span>
              </div>
              {shipping > 0 && (
                <p className="text-sm text-green-600">
                  Add {formatCurrency(350 - totalPrice)} more for FREE shipping
                </p>
              )}
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>{t("checkoutPage.total")}</span>
                <span>{formatCurrency(finalTotal)}</span>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button onClick={handleCheckout} className="w-full" size="lg">
                {t("checkoutPage.checkout")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/products")}
                className="w-full sm:hidden"
              >
                {t("checkoutPage.continueShopping")}
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
