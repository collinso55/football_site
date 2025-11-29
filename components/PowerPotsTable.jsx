// components/PowerPotsTable.js
'use client';

import TeamLogo from './TeamLogo';
import { useState } from 'react';

export default function PowerPotsTable({ standings, leagueName = "this league" }) {
  const [showExplanation, setShowExplanation] = useState(false);

  if (!standings || standings.length === 0) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-500 text-sm">No standings data available.</p>
      </div>
    );
  }

  // Calculate power pots segments
  const calculatePowerPots = (teams) => {
    if (teams.length === 0) return [];
    
    // Get the maximum points (leader's points)
    const maxPoints = Math.max(...teams.map(team => team.points));
    
    // Calculate segment boundaries (5 segments, each 20% of max points)
    const segmentSize = maxPoints / 5;
    
    const pots = [
      { 
        name: 'Pot 1', 
        min: segmentSize * 4, 
        max: maxPoints, 
        color: 'bg-green-500',
        description: 'Elite Performers'
      },
      { 
        name: 'Pot 2', 
        min: segmentSize * 3, 
        max: segmentSize * 4, 
        color: 'bg-green-400',
        description: 'Strong Contenders'
      },
      { 
        name: 'Pot 3', 
        min: segmentSize * 2, 
        max: segmentSize * 3, 
        color: 'bg-yellow-400',
        description: 'Mid-Table'
      },
      { 
        name: 'Pot 4', 
        min: segmentSize * 1, 
        max: segmentSize * 2, 
        color: 'bg-orange-400',
        description: 'Struggling'
      },
      { 
        name: 'Pot 5', 
        min: 0, 
        max: segmentSize * 1, 
        color: 'bg-red-400',
        description: 'Relegation Zone'
      }
    ];

    // Assign teams to pots
    const teamsWithPots = teams.map(team => {
      const pot = pots.find(p => team.points >= p.min && team.points <= p.max) || pots[4];
      return {
        ...team,
        pot: pot.name,
        potColor: pot.color,
        potDescription: pot.description
      };
    });

    return { teamsWithPots, pots, maxPoints, segmentSize };
  };

  const { teamsWithPots, pots, maxPoints, segmentSize } = calculatePowerPots(standings);

  // Group teams by pot
  const potGroups = {
    'Pot 1': teamsWithPots.filter(team => team.pot === 'Pot 1'),
    'Pot 2': teamsWithPots.filter(team => team.pot === 'Pot 2'),
    'Pot 3': teamsWithPots.filter(team => team.pot === 'Pot 3'),
    'Pot 4': teamsWithPots.filter(team => team.pot === 'Pot 4'),
    'Pot 5': teamsWithPots.filter(team => team.pot === 'Pot 5')
  };

  const potOrder = ['Pot 1', 'Pot 2', 'Pot 3', 'Pot 4', 'Pot 5'];

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      {/* Header with Explanation Toggle */}
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-800">Power Pots Table</h3>
          <button
            onClick={() => setShowExplanation(!showExplanation)}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            {showExplanation ? 'Hide Explanation' : 'What is this?'}
          </button>
        </div>

        {/* Detailed Explanation */}
        {showExplanation && (
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2">Understanding Power Pots</h4>
            <p className="text-blue-700 text-sm mb-3">
              The Power Pots table divides teams into 5 performance segments based on their current points in {leagueName}. 
              This provides a quick visual overview of team performance tiers.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-blue-800 mb-1">How it works:</h5>
                <ul className="text-blue-700 space-y-1">
                  <li>• Based on leader's points: {maxPoints} points</li>
                  <li>• Each pot covers 20% of the points range</li>
                  <li>• Segment size: {segmentSize.toFixed(1)} points</li>
                  <li>• Automatic team allocation</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-blue-800 mb-1">Color Meaning:</h5>
                <ul className="text-blue-700 space-y-1">
                  <li>• <span className="text-green-600 font-semibold">Green</span> - Top performers</li>
                  <li>• <span className="text-yellow-600 font-semibold">Yellow</span> - Average performers</li>
                  <li>• <span className="text-orange-600 font-semibold">Orange</span> - Below average</li>
                  <li>• <span className="text-red-600 font-semibold">Red</span> - Struggling teams</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Brief description always visible */}
        <p className="text-gray-600 text-sm mt-2">
          Teams divided into 5 performance segments based on points. Each segment covers 20% of the leader's points range.
        </p>
      </div>

      {/* Horizontal Power Pots Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-6">
        {potOrder.map(potName => {
          const pot = pots.find(p => p.name === potName);
          return (
            <div key={potName} className="text-center border border-gray-200 rounded-lg overflow-hidden">
              <div className={`${pot.color} p-3`}>
                <h4 className="text-white font-bold text-sm">{potName}</h4>
                <p className="text-white text-xs opacity-90">{pot.description}</p>
                <p className="text-white text-xs mt-1">
                  {Math.ceil(pot.min)} - {Math.ceil(pot.max)} pts
                </p>
              </div>
              <div className="p-3 bg-gray-50 min-h-[180px]">
                {potGroups[potName].length > 0 ? (
                  potGroups[potName].map((team) => (
                    <div 
                      key={team.team.id} 
                      className="flex items-center justify-between mb-2 last:mb-0 p-2 bg-white rounded border border-gray-100"
                    >
                      <div className="flex items-center space-x-2 flex-1 min-w-0">
                        <span className="text-xs font-bold text-gray-600 w-4">
                          {team.position}
                        </span>
                        <TeamLogo
                          src={team.team.crest}
                          alt={team.team.name}
                          className="w-5 h-5 object-contain flex-shrink-0"
                        />
                        <span 
                          className="text-xs font-medium text-gray-800 truncate" 
                          title={team.team.shortName || team.team.name}
                        >
                          {team.team.tla || team.team.shortName || team.team.name}
                        </span>
                      </div>
                      <span className="text-xs font-bold text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {team.points}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-gray-400 text-xs">No teams in this segment</p>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Statistics Summary */}
      <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Current Season Summary</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{maxPoints}</div>
            <div className="text-gray-600">Leader's Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{Math.ceil(segmentSize)}</div>
            <div className="text-gray-600">Points per Segment</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{standings.length}</div>
            <div className="text-gray-600">Total Teams</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">5</div>
            <div className="text-gray-600">Performance Tiers</div>
          </div>
        </div>
      </div>

      {/* Quick Legend */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex flex-wrap justify-center gap-4 text-xs">
          {pots.map(pot => (
            <div key={pot.name} className="flex items-center space-x-2">
              <div className={`w-3 h-3 ${pot.color} rounded`}></div>
              <span className="text-gray-700">{pot.name}: {pot.description}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}