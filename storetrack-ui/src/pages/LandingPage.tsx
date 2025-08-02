import { Link } from 'react-router-dom';
import { Target, ShieldCheck, Truck } from 'lucide-react'; // More mission-oriented icons

export default function LandingPage() {
  return (
    <div className="bg-white text-gray-800">
      {/* Hero Section */}
      <section className="text-center py-24 px-6 bg-gray-900 text-white">
        <h1 className="text-5xl font-bold mb-4 tracking-tight">StoreTrack: Powering Our Operations</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          This is the central hub for our logistics. We manage inventory and fulfill orders for one of the world's leading companies, ensuring every item is tracked with precision.
        </p>
        <Link 
          to="/auth" 
          className="bg-blue-600 text-white font-bold py-3 px-8 rounded-md hover:bg-blue-700 transition-transform transform hover:scale-105 text-lg"
        >
          Access the System
        </Link>
      </section>

      {/* Core Mission Section */}
      <section className="py-20 px-6 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold">Our Mission is Our Commitment</h2>
            <p className="text-gray-600 mt-2 text-lg">Every task we perform is critical to our partner's success.</p>
          </div>
          <div className="flex flex-wrap text-center gap-10 justify-center">
            
            <div className="w-full md:w-1/3 p-4">
              <div className="bg-gray-100 rounded-full p-5 inline-block mb-4">
                <Target className="text-gray-800" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Precision Tracking</h3>
              <p className="text-gray-700 text-base">
                From warehouse to delivery, every product's journey is monitored through this system. Our work ensures flawless inventory management.
              </p>
            </div>

            <div className="w-full md:w-1/3 p-4">
              <div className="bg-gray-100 rounded-full p-5 inline-block mb-4">
                <ShieldCheck className="text-gray-800" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Unwavering Reliability</h3>
              <p className="text-gray-700 text-base">
                Our partner relies on our accuracy. StoreTrack is the backbone of that trust, built for zero-error operations and steadfast performance.
              </p>
            </div>

            <div className="w-full md:w-1/3 p-4">
              <div className="bg-gray-100 rounded-full p-5 inline-block mb-4">
                <Truck className="text-gray-800" size={40} />
              </div>
              <h3 className="text-2xl font-bold mb-2">Efficient Fulfillment</h3>
              <p className="text-gray-700 text-base">
                We place and process orders with maximum efficiency. This system is key to our promise of speed and operational excellence.
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}