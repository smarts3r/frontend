import { Headphones, ShieldCheck, Truck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/components/ui/card";

interface TrustSignal {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
}

export const TrustSignals: React.FC = () => {
  const { t } = useTranslation();

  const trustSignals: TrustSignal[] = [
    {
      icon: <Truck className="w-8 h-8" />,
      title: t("homePage.trustSignals.freeShipping.title"),
      subtitle: t("homePage.trustSignals.freeShipping.subtitle"),
    },
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: t("homePage.trustSignals.securePayment.title"),
      subtitle: t("homePage.trustSignals.securePayment.subtitle"),
    },
    {
      icon: <Headphones className="w-8 h-8" />,
      title: t("homePage.trustSignals.support247.title"),
      subtitle: t("homePage.trustSignals.support247.subtitle"),
    },
  ];

  const getIconColor = (index: number) => {
    const colors = [
      "bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform",
      "bg-green-100 text-green-600 group-hover:scale-110 transition-transform",
      "bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform",
    ];
    return colors[index % colors.length];
  };

  return (
    <section className="container mx-auto px-6 py-16">
      {/* Section Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          {t("homePage.trustSignals.title")}
        </h2>
        <p className="text-gray-600 max-w-2xl mx-auto">
          {t("homePage.trustSignals.subtitle")}
        </p>
      </div>

      {/* Trust Signals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {trustSignals.map((signal, index) => (
          <Card
            key={index}
            className="group hover:shadow-xl transition-all duration-300 border-0 shadow-md bg-white"
          >
            <CardContent className="flex items-center gap-6 p-8">
              <div className={`p-4 rounded-full ${getIconColor(index)}`}>
                {signal.icon}
              </div>
              <div className="text-left">
                <h3 className="font-bold text-lg text-gray-900 mb-2">
                  {signal.title}
                </h3>
                <p className="text-sm text-gray-600">{signal.subtitle}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
};
