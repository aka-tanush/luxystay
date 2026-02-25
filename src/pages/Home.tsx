import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Shield, Heart, ArrowRight, Compass, Home as HomeIcon, Users, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { storage } from '../utils/storage';

const FEATURED_DESTINATIONS = [
  { name: 'Jaipur', image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800', count: '120+ Stays' },
  { name: 'Goa', image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800', count: '350+ Stays' },
  { name: 'Manali', image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&q=80&w=800', count: '85+ Stays' },
  { name: 'Kerala', image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800', count: '210+ Stays' },
];

export default function Home() {
  useEffect(() => {
    // Initialize some dummy data if empty
    if (storage.getHomestays().length === 0) {
      const dummyHomestays = [
        {
          id: '1',
          name: 'Royal Heritage Haveli',
          location: 'Jaipur',
          price: 4500,
          rating: 4.9,
          image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&q=80&w=800',
          hostId: 'host1',
          description: 'Experience the grandeur of Rajasthan in this beautifully restored 18th-century haveli.'
        },
        {
          id: '2',
          name: 'Beachside Bamboo Hut',
          location: 'Goa',
          price: 2800,
          rating: 4.7,
          image: 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=800',
          hostId: 'host1',
          description: 'Wake up to the sound of waves in our eco-friendly bamboo huts right on the beach.'
        }
      ];
      dummyHomestays.forEach(h => storage.saveHomestay(h));
    }
  }, []);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1548013146-72479768bbaa?auto=format&fit=crop&q=80&w=2000" 
            alt="Hero" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight">
              Your Home <span className="text-emerald-400">Anywhere</span> in India
            </h1>
            <p className="text-xl md:text-2xl text-emerald-50 mb-10 max-w-3xl mx-auto leading-relaxed">
              Book unique homestays and discover hidden local gems with our expert guides. Experience India like never before.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/homestays" 
                className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-900/20 flex items-center justify-center gap-2"
              >
                Explore Homestays <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/attractions" 
                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-10 py-4 rounded-2xl font-bold text-lg hover:bg-white/20 transition-all flex items-center justify-center gap-2"
              >
                Explore Attractions <Compass className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Stats */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 hidden md:block">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl flex justify-around border border-white/20">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">500+</p>
              <p className="text-sm text-gray-500 font-medium">Verified Homestays</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">120+</p>
              <p className="text-sm text-gray-500 font-medium">Local Guides</p>
            </div>
            <div className="h-12 w-px bg-gray-200"></div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">15k+</p>
              <p className="text-sm text-gray-500 font-medium">Happy Travelers</p>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Destinations */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Popular Destinations</h2>
            <p className="text-gray-500 mt-2">Explore India's most loved travel spots</p>
          </div>
          <Link to="/homestays" className="text-emerald-600 font-bold hover:underline flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURED_DESTINATIONS.map((dest, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -10 }}
              className="group relative h-80 rounded-3xl overflow-hidden cursor-pointer"
            >
              <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              <div className="absolute bottom-6 left-6 text-white">
                <h3 className="text-2xl font-bold mb-1">{dest.name}</h3>
                <p className="text-sm text-emerald-300 font-medium">{dest.count}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900">Why Book With Us?</h2>
            <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We provide a seamless experience for both travelers and hosts, ensuring safety and quality.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Verified Hosts</h3>
              <p className="text-gray-500 leading-relaxed">Every homestay is personally visited and verified for quality and safety standards.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Local Expertise</h3>
              <p className="text-gray-500 leading-relaxed">Our local guides provide insider tips that you won't find in any guidebook.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold mb-4">Authentic Stays</h3>
              <p className="text-gray-500 leading-relaxed">Experience the true culture of India by staying with local families in authentic homes.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-600 rounded-[3rem] p-12 md:p-20 text-white text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-400/20 rounded-full -ml-32 -mb-32 blur-3xl"></div>
          
          <h2 className="text-4xl md:text-5xl font-bold mb-8 relative z-10">Ready to Start Your Adventure?</h2>
          <p className="text-xl text-emerald-50 mb-12 max-w-2xl mx-auto relative z-10">Join thousands of travelers who have discovered the magic of authentic Indian hospitality.</p>
          <Link 
            to="/login" 
            className="bg-white text-emerald-600 px-12 py-4 rounded-2xl font-bold text-lg hover:bg-emerald-50 transition-all shadow-xl relative z-10 inline-block"
          >
            Join LuxeStay Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-2xl">
            <HomeIcon className="w-8 h-8" /> LuxeStay
          </div>
          <div className="flex gap-8 text-sm text-gray-500 font-medium">
            <Link to="/homestays" className="hover:text-emerald-600 transition-colors">Homestays</Link>
            <Link to="/attractions" className="hover:text-emerald-600 transition-colors">Attractions</Link>
            <Link to="/login" className="hover:text-emerald-600 transition-colors">Join as Host</Link>
            <Link to="/login" className="hover:text-emerald-600 transition-colors">Local Guides</Link>
          </div>
          <div className="text-sm text-gray-400">
            © 2026 LuxeStay India. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
