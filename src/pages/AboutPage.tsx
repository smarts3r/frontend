import { Building2, Users, Trophy, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function AboutPage() {
    return (
        <div className="bg-white">
            {/* Hero Section */}
            <section className="relative bg-gray-900 text-white py-24 px-6 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-90" />
                <div className="relative container mx-auto text-center max-w-3xl space-y-6">
                    <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
                        Empowering Your <span className="text-blue-400">Digital Life</span>
                    </h1>
                    <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
                        At Smart S3r, we believe technology should be accessible, reliable, and cutting-edge. We are more than just a store; we are your partners in innovation.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6 container mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                            <Building2 className="w-4 h-4" /> Our Mission
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Bridging the Gap to the Future
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Founded in 2024, Smart S3r started with a simple vision: to create an electronics shopping experience that is as smart as the devices we sell. We curate only the best products, ensuring quality, durability, and performance.
                        </p>
                        <div className="grid grid-cols-2 gap-6 pt-4">
                            <div>
                                <h4 className="text-3xl font-bold text-blue-600">50K+</h4>
                                <p className="text-gray-500">Happy Customers</p>
                            </div>
                            <div>
                                <h4 className="text-3xl font-bold text-purple-600">100%</h4>
                                <p className="text-gray-500">Authentic Products</p>
                            </div>
                        </div>
                    </div>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                        <img
                            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80"
                            alt="Team collaboration"
                            className="absolute inset-0 w-full h-full object-cover"
                        />
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="bg-gray-50 py-20 px-6">
                <div className="container mx-auto">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Us?</h2>
                        <p className="text-gray-600">We stand by our core values to deliver the best experience possible.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center mb-6">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Premium Quality</h3>
                            <p className="text-gray-600">We partner directly with top brands to ensure every product is genuine and high-performing.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-lg flex items-center justify-center mb-6">
                                <Users className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Customer First</h3>
                            <p className="text-gray-600">Our support team is available 24/7 to assist you with any questions or concerns.</p>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-lg flex items-center justify-center mb-6">
                                <Truck className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Fast Delivery</h3>
                            <p className="text-gray-600">We offer expedited shipping options to get your gadgets to you as quickly as possible.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 container mx-auto text-center">
                <div className="bg-blue-600 rounded-3xl p-12 md:p-20 text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                    <div className="relative z-10 space-y-6">
                        <h2 className="text-3xl md:text-5xl font-bold">Ready to Experience the Future?</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto text-lg">Join thousands of satisfied customers who have upgraded their tech game with Smart S3r.</p>
                        <Link to="/products">
                            <Button size="lg" className="text-lg px-8 py-6 rounded-full font-bold shadow-lg mt-4">
                                Start Shopping Now
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
