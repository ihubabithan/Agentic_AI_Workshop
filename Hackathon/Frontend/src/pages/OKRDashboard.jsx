import { useState, useEffect } from 'react';
import { fetchOKRs, fetchOKRsByUser, getPrimaryOKR } from '../api/Service/okr';

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('current');
  const [okrData, setOkrData] = useState(null);
  const [leetcodeStats, setLeetcodeStats] = useState(null);

  useEffect(() => {
    const loadOKR = async () => {
      try {
        const okr = await getPrimaryOKR();
        setOkrData({
          objective: okr.structured_okr?.objective || '',
          keyResults: (okr.structured_okr?.keyResults || []).map((kr, idx) => ({
            id: idx + 1,
            text: kr,
            progress: 0,
            target: 1,
            current: 0
          })),
          overallProgress: okr.progress?.completionTrend === 'Decreasing' ? 42 : 0,
          status: okr.progress?.status || 'off_track',
          skillFocus: okr.structured_okr?.skillFocus || [],
          validation: okr.validation || { relevance: 0, completeness: 0, quality: 0, totalScore: 0 }
        });
        setLeetcodeStats({
          total: okr.evidence?.leetcode?.total || 0,
          easy: okr.evidence?.leetcode?.easy || 0,
          medium: okr.evidence?.leetcode?.medium || 0,
          hard: okr.evidence?.leetcode?.hard || 0,
          recentActivity: (okr.evidence?.leetcode?.problems || []).slice(0, 5).map(p => ({
            date: p.date,
            problems: 1,
            difficulty: p.difficulty
          }))
        });
      } catch {
        setOkrData(null);
        setLeetcodeStats(null);
      }
    };
    loadOKR();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'on_track': return 'text-green-600 bg-green-100';
      case 'at_risk': return 'text-yellow-600 bg-yellow-100';
      case 'off_track': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 60) return 'bg-blue-500';
    if (progress >= 40) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (!okrData || !leetcodeStats) {
    return <div className="min-h-screen flex items-center justify-center text-xl">You need to submit your OKR to view the Analytics</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">OKR Progress Dashboard</h1>
              <p className="text-gray-600">Track your objectives and key results</p>
            </div>
            <div className="flex items-center space-x-4">
              <select 
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="current">Current Quarter</option>
                <option value="previous">Previous Quarter</option>
                <option value="yearly">Yearly View</option>
              </select>
              <div className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(okrData.status)}`}>
                {okrData.status.replace('_', ' ').toUpperCase()}
              </div>
            </div>
          </div>
        </div>

        {/* Main Objective Card */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl shadow-lg p-6 text-white">
          <h2 className="text-2xl font-bold mb-4">{okrData.objective}</h2>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <span className="text-blue-100 mr-2">Overall Progress</span>
                <span className="text-2xl font-bold">{okrData.overallProgress}%</span>
              </div>
              <div className="w-full bg-blue-400 rounded-full h-3">
                <div 
                  className="bg-white rounded-full h-3 transition-all duration-700 ease-out"
                  style={{ width: `${okrData.overallProgress}%` }}
                />
              </div>
            </div>
            <div className="ml-8 text-right">
              <div className="text-blue-100 text-sm">Skills Focus</div>
              <div className="flex flex-wrap gap-2 mt-2">
                {okrData.skillFocus.map((skill, index) => (
                  <span key={index} className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm text-black-400">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Key Results Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {okrData.keyResults.map((kr, index) => (
            <div key={kr.id} className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 mb-2">{kr.text}</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">{kr.progress}%</span>
                    <span className="text-sm text-gray-500">({kr.current}/{kr.target})</span>
                  </div>
                </div>
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                  <div className="text-2xl">
                    {index === 0 ? '🚀' : index === 1 ? '🗄️' : '📚'}
                  </div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className={`h-2 rounded-full transition-all duration-700 ease-out ${getProgressColor(kr.progress)}`}
                  style={{ width: `${kr.progress}%` }}
                />
              </div>
              
              <div className="flex justify-between text-sm text-gray-500">
                <span>Started</span>
                <span>{kr.progress >= 100 ? 'Completed' : 'In Progress'}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Analytics Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* LeetCode Activity */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">LeetCode Activity</h3>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{leetcodeStats.total}</div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{leetcodeStats.easy}</div>
                <div className="text-sm text-gray-500">Easy</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-yellow-600">{leetcodeStats.medium}</div>
                <div className="text-sm text-gray-500">Medium</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{leetcodeStats.hard}</div>
                <div className="text-sm text-gray-500">Hard</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Recent Activity</h4>
              {leetcodeStats.recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{activity.date}</span>
                  <span className="text-sm font-medium">{activity.problems} problem(s) - {activity.difficulty}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Validation Metrics */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Quality Metrics</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Relevance</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${okrData.validation.relevance * 10}%` }} />
                  </div>
                  <span className="text-sm font-medium">{okrData.validation.relevance}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Completeness</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${okrData.validation.completeness * 10}%` }} />
                  </div>
                  <span className="text-sm font-medium">{okrData.validation.completeness}/10</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Quality</span>
                <div className="flex items-center space-x-2">
                  <div className="w-32 bg-gray-200 rounded-full h-2">
                    <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${okrData.validation.quality * 10}%` }} />
                  </div>
                  <span className="text-sm font-medium">{okrData.validation.quality}/10</span>
                </div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">Total Score</span>
                  <span className="text-2xl font-bold text-blue-600">{okrData.validation.totalScore}/30</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Progress Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Progress Timeline</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            <div className="space-y-6">
              <div className="relative flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">OKR Created</div>
                  <div className="text-sm text-gray-500">Objective set with 3 key results</div>
                </div>
              </div>
              
              <div className="relative flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">Progress Started</div>
                  <div className="text-sm text-gray-500">Began working on Node.js projects</div>
                </div>
              </div>
              
              <div className="relative flex items-center">
                <div className="flex-shrink-0 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div className="ml-4">
                  <div className="font-medium text-gray-900">Current Status</div>
                  <div className="text-sm text-gray-500">42% overall progress achieved</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}