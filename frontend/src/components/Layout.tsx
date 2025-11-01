import { Outlet, Link, useLocation } from 'react-router-dom';

export default function Layout() {
  const location = useLocation();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="sticky top-0 bg-white shadow-md z-50">
        <div className="container mx-auto flex justify-between items-center p-4">
          <Link to="/" className="text-2xl font-bold text-primary">
            Copperway Car Wash
          </Link>
          <nav>
            <ul className="flex space-x-6">
              <li>
                <Link 
                  to="/" 
                  className={`hover:text-primary ${location.pathname === '/' ? 'text-primary font-semibold' : ''}`}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link 
                  to="/booking" 
                  className={`hover:text-primary ${location.pathname === '/booking' ? 'text-primary font-semibold' : ''}`}
                >
                  Book Now
                </Link>
              </li>
              <li>
                <Link 
                  to="/status" 
                  className={`hover:text-primary ${location.pathname === '/status' ? 'text-primary font-semibold' : ''}`}
                >
                  Check Status
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

