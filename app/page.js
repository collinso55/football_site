// app/page.js
import Link from 'next/link';
import LeagueLogo from '../components/LeagueLogo';

export default function Home() {
  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to FootballSite ⚽
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Your ultimate destination for football statistics and standings from top leagues around the world.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Link 
            href="/leagues/2021" 
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-blue-500 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-center">
              <LeagueLogo
                src="https://crests.football-data.org/PL.png"
                alt="Premier League"
                className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-xl font-semibold mb-2">Premier League</h2>
              <p className="text-gray-600 text-sm">England</p>
            </div>
          </Link>
          
          <Link 
            href="/leagues/2014" 
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-red-500 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-center">
              <LeagueLogo
                src="https://crests.football-data.org/PD.png"
                alt="La Liga"
                className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-xl font-semibold mb-2">La Liga</h2>
              <p className="text-gray-600 text-sm">Spain</p>
            </div>
          </Link>
          
          <Link 
            href="/leagues/2002" 
            className="bg-white p-6 rounded-lg shadow-md border-2 border-transparent hover:border-yellow-500 hover:shadow-lg transition-all duration-200 group"
          >
            <div className="text-center">
              <LeagueLogo
                src="https://crests.football-data.org/BL1.png"
                alt="Bundesliga"
                className="w-16 h-16 mx-auto mb-3 group-hover:scale-110 transition-transform"
              />
              <h2 className="text-xl font-semibold mb-2">Bundesliga</h2>
              <p className="text-gray-600 text-sm">Germany</p>
            </div>
          </Link>
        </div>

        <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
          <h3 className="text-lg font-semibold text-blue-800 mb-2">How to use:</h3>
          <ul className="text-blue-700 list-disc list-inside space-y-1">
            <li>Click on any league in the sidebar to view standings</li>
            <li>Use the quick links above for popular leagues</li>
            <li>Browse "Top Leagues" or "All Leagues" in the sidebar</li>
          </ul>
        </div>
      </div>
    </div>
  );
}