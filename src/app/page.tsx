import Link from 'next/link';
import { Service } from '@/types';

async function getServices(): Promise<Service[]> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/api/services`, {
      cache: 'no-store',
    });
    const data = await response.json();
    return data.success ? data.data : [];
  } catch (error) {
    console.error('Error fetching services:', error);
    return [];
  }
}

export default async function HomePage() {
  const services = await getServices();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <div className="text-2xl font-bold text-primary">Copperway Car Wash</div>
          <nav>
            <ul className="flex space-x-6">
              <li><Link href="/" className="hover:text-primary">Home</Link></li>
              <li><Link href="/#services" className="hover:text-primary">Services</Link></li>
              <li><Link href="/booking" className="text-primary font-semibold">Book Now</Link></li>
              <li><Link href="/status" className="hover:text-primary">Check Status</Link></li>
            </ul>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-primary to-secondary text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">Professional Car Wash Services</h1>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Experience premium car care with our state-of-the-art facilities and expert team. 
            Book your service today and give your vehicle the attention it deserves.
          </p>
          <Link 
            href="/booking" 
            className="bg-white text-primary px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
          >
            Book Your Wash Now
          </Link>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div key={service.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-primary">
                    ${service.price.toFixed(2)}
                  </span>
                  <span className="text-gray-500">{service.duration} min</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">Why Choose Us?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quick Service</h3>
              <p className="text-gray-600">Fast and efficient service to get you back on the road quickly.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Quality Guaranteed</h3>
              <p className="text-gray-600">Professional-grade equipment and trained staff for superior results.</p>
            </div>
            <div className="text-center">
              <div className="bg-primary text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2">Easy Booking</h3>
              <p className="text-gray-600">Simple online booking system with real-time availability.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2025 Copperway Car Wash. All rights reserved.</p>
          <p className="mt-2">Contact: +260 123 456789 | contact@copperwaywash.com</p>
        </div>
      </footer>
    </div>
  );
}
