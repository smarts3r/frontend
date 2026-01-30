// Updated button section for ProductCard.tsx
        <Button
          variant={isInCart ? "default" : "outline"}
          size="lg"
          className={`w-full transition-all duration-300 font-semibold ${
            isInCart
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300"
          }`}
          onClick={() => onAddToCart?.(product.id)}
        >
          <ShoppingCart className="w-4 h-4" />
          {isInCart ? t("productCard.inCart") : t("productCard.addToCart")}
        </Button>
