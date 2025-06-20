import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h1 className="text-4xl font-bold mb-4 text-red-600">404 - Page Not Found</h1>
      <p className="mb-6 text-gray-700">Sorry, the page you are looking for does not exist.</p>
      <Link to="/" className="text-blue-600 hover:underline">Go to Home</Link>
    </div>
  );
} 