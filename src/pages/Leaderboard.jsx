import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Leaderboard.css';

// This would be passed in from App.jsx
const MOCK_CAMPAIGN = {
  "name": "Chiến dịch Giáng Sinh",
  "prizes": {
    "weekly": [
      { "rank": 1, "reward": "Giải Nhất Tuần" },
      { "rank": 2, "reward": "Giải Nhì Tuần" },
      { "rank": 3, "reward": "Giải Ba Tuần" }
    ],
    "campaign": [
      { "rank": 1, "reward": "Giải Nhất Chung Cuộc" },
      { "rank": 2, "reward": "Giải Nhì Chung Cuộc" },
      { "rank": 3, "reward": "Giải Ba Chung Cuộc" }
    ]
  }
};

function Leaderboard({ campaign = MOCK_CAMPAIGN }) {
  const [activeTab, setActiveTab] = useState('campaign'); // weekly, monthly, campaign
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      // NOTE: This is a simplified fetch. For real-time leaderboards,
      // you would create Supabase RPC functions to get top scorers
      // based on weekly, monthly, or campaign timeframes.
      
      let query = supabase.from('profiles').select('phone_number, total_score').order('total_score', { ascending: false }).limit(10);
      
      // The logic for weekly/monthly filtering would be more complex
      // and best handled by a database function.
      // Example: .rpc('get_weekly_leaderboard')

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching leaderboard:', error);
      } else {
        setLeaderboardData(data);
      }
      setLoading(false);
    };

    fetchLeaderboard();
  }, [activeTab]);

  return (
    <div className="leaderboard-container">
      <div className="prizes-section">
        <h3>Giải Thưởng Chiến Dịch</h3>
        <ul>
          {campaign.prizes.campaign.map(p => (
            <li key={p.rank}><strong>Top {p.rank}:</strong> {p.reward}</li>
          ))}
        </ul>
      </div>

      <div className="leaderboard-card">
        <div className="tabs">
          <button onClick={() => setActiveTab('weekly')} className={activeTab === 'weekly' ? 'active' : ''}>Tuần</button>
          <button onClick={() => setActiveTab('monthly')} className={activeTab === 'monthly' ? 'active' : ''}>Tháng</button>
          <button onClick={() => setActiveTab('campaign')} className={activeTab === 'campaign' ? 'active' : ''}>Chiến Dịch</button>
        </div>
        
        <div className="leaderboard-list">
          {loading ? (
            <p>Loading...</p>
          ) : (
            leaderboardData.map((player, index) => (
              <div key={index} className="leaderboard-row">
                <span className="rank">{index + 1}</span>
                <span className="name">{player.phone_number.replace(/(\d{2})\d{6}(\d{2})/, '$1******$2')}</span>
                <span className="score">{player.total_score}</span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
