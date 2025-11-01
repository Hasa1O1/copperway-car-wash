import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">
          Welcome to Copperway Car Wash
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Professional car wash services with pickup & delivery
        </p>
        <Link
          to="/booking"
          className="inline-block bg-primary text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors"
        >
          Book Your Service Now
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🚗</div>
          <h3 className="text-xl font-semibold mb-2">Saloon Cars</h3>
          <p className="text-gray-600 mb-4">Complete car wash with pickup & delivery</p>
          <div className="text-2xl font-bold text-primary">K50</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🚙</div>
          <h3 className="text-xl font-semibold mb-2">SUVs</h3>
          <p className="text-gray-600 mb-4">Larger vehicle service</p>
          <div className="text-2xl font-bold text-primary">K100</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🚐</div>
          <h3 className="text-xl font-semibold mb-2">Vans</h3>
          <p className="text-gray-600 mb-4">Premium vehicle care</p>
          <div className="text-2xl font-bold text-primary">K70</div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <div className="text-3xl mb-4">🧹</div>
          <h3 className="text-xl font-semibold mb-2">Carpets</h3>
          <p className="text-gray-600 mb-4">Professional cleaning per sqm</p>
          <div className="text-2xl font-bold text-primary">K200</div>
        </div>
      </div>

      <div className="bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">Why Choose Us?</h2>
        <ul className="space-y-2 text-gray-600">
          <li>✅ Professional cleaning service</li>
          <li>✅ Pickup & delivery available</li>
          <li>✅ Convenient online booking</li>
          <li>✅ Real-time queue updates</li>
          <li>✅ Flexible payment options</li>
        </ul>
      </div>
    </div>
  );
}

