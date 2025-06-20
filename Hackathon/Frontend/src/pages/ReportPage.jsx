import React, { useState, useEffect } from 'react';
import { 
  User, 
  Github, 
  Linkedin, 
  Code2, 
  Target, 
  CheckCircle, 
  AlertTriangle, 
  TrendingUp, 
  Calendar, 
  Clock, 
  ExternalLink,
  BookOpen,
  Award,
  GitBranch,
  Database,
  Server
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { getOKRById } from '../api/Service/okr';

const OKRReportDashboard = () => {
  const { okrId } = useParams();
  const [userData, setUserData] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  
  useEffect(() => {
    const loadOKR = async () => {
      const okr = await getOKRById(okrId);
      setUserData(okr);
    };
    loadOKR();
  }, [okrId]);

  if (!userData) {
    return <div className="min-h-screen flex items-center justify-center text-xl">Loading...</div>;
  }

  const getDifficultyColor = (difficulty) => {
    switch(difficulty.toLowerCase()) {
      case 'easy': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'hard': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusColor = (status) => {
    switch(status.toLowerCase()) {
      case 'pass': return 'text-green-600 bg-green-100';
      case 'fail': return 'text-red-600 bg-red-100';
      case 'at_risk': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const ProgressBar = ({ value, max, label, color = "blue" }) => {
    const percentage = (value / max) * 100;
    return (
      <div className="mb-4">
        <div className="flex justify-between mb-1">
          <span className="text-sm font-medium text-gray-700">{label}</span>
          <span className="text-sm text-gray-500">{value}/{max}</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className={`bg-${color}-600 h-2 rounded-full transition-all duration-300`}
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center">
                  <User size={32} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">{userData.name}</h1>
                  <p className="text-blue-100 mt-1">Backend Development Journey</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <a 
                  href={`https://leetcode.com/${userData.leetcodeId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <Code2 size={20} />
                  <span>LeetCode</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href={`https://github.com/${userData.githubId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <Github size={20} />
                  <span>GitHub</span>
                  <ExternalLink size={16} />
                </a>
                <a 
                  href={`https://linkedin.com/in/${userData.linkedinId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
                >
                  <Linkedin size={20} />
                  <span>LinkedIn</span>
                  <ExternalLink size={16} />
                </a>
              </div>
            </div>
          </div>

          {/* Status Banner */}
          
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-8 p-2">
          <div className="flex space-x-2">
            {['overview', 'objectives', 'evidence', 'feedback'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Score Card */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-2 text-blue-600" />
                Validation Scores
              </h3>
              <div className="space-y-4">
                <ProgressBar value={userData.validation.relevance} max={10} label="Relevance" color="green" />
                <ProgressBar value={userData.validation.completeness} max={10} label="Completeness" color="blue" />
                <ProgressBar value={userData.validation.quality} max={10} label="Quality" color="red" />
                <div className="pt-4 border-t">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Total Score</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(userData.validation.status)}`}>
                      {userData.validation.totalScore}/30
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* LeetCode Stats */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Code2 className="mr-2 text-blue-600" />
                LeetCode Progress
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{userData.evidence.leetcode.easy}</div>
                  <div className="text-sm text-green-600">Easy</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{userData.evidence.leetcode.medium}</div>
                  <div className="text-sm text-yellow-600">Medium</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{userData.evidence.leetcode.hard}</div>
                  <div className="text-sm text-red-600">Hard</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{userData.evidence.leetcode.total}</div>
                  <div className="text-sm text-blue-600">Total</div>
                </div>
              </div>
            </div>

            {/* Skills Focus */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Target className="mr-2 text-blue-600" />
                Skills Focus
              </h3>
              <div className="space-y-2">
                {userData.structured_okr.skillFocus.map((skill, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    {skill.toLowerCase().includes('node') && <Server size={16} className="text-green-600" />}
                    {skill.toLowerCase().includes('mongo') && <Database size={16} className="text-green-600" />}
                    {skill.toLowerCase().includes('git') && <GitBranch size={16} className="text-gray-600" />}
                    {!skill.toLowerCase().includes('node') && !skill.toLowerCase().includes('mongo') && !skill.toLowerCase().includes('git') && <Code2 size={16} className="text-blue-600" />}
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <span className="text-sm text-gray-500">Proficiency Level: </span>
                <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-sm font-medium">
                  {userData.benchmarks.recommendedProficiencyLevel}
                </span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'objectives' && (
          <div className="space-y-8">
            {/* Original OKR */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Target className="mr-2 text-blue-600" />
                Original Objective
              </h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-4">
                <p className="text-blue-800 font-medium">{userData.structured_okr.objective}</p>
              </div>
              <h4 className="font-semibold mb-2">Key Results:</h4>
              <ul className="space-y-2">
                {userData.structured_okr.keyResults.map((result, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <CheckCircle size={16} className="text-green-500" />
                    <span>{result}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Benchmarked OKR */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-purple-600" />
                Benchmarked Objective
              </h3>
              <div className="bg-purple-50 p-4 rounded-lg mb-4">
                <p className="text-purple-800 font-medium">{userData.benchmarks.benchmarkedObjective}</p>
              </div>
              <h4 className="font-semibold mb-2">Enhanced Key Results:</h4>
              <ul className="space-y-3">
                {userData.benchmarks.benchmarkedKeyResults.map((result, index) => (
                  <li key={index} className="flex items-start space-x-2 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle size={16} className="text-purple-500 mt-1 flex-shrink-0" />
                    <span className="text-sm">{result}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'evidence' && (
          <div className="space-y-8">
            {/* Recent LeetCode Problems */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Code2 className="mr-2 text-blue-600" />
                Recent LeetCode Activity
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {userData.evidence.leetcode.problems.slice(0, 10).map((problem, index) => (
                  <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{problem.title}</h4>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span className="flex items-center">
                          <Calendar size={14} className="mr-1" />
                          {problem.date}
                        </span>
                        <span className="flex items-center">
                          <Clock size={14} className="mr-1" />
                          {problem.time}
                        </span>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(problem.difficulty)}`}>
                      {problem.difficulty}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* GitHub Activity */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Github className="mr-2 text-gray-800" />
                GitHub Repositories
              </h3>
              {userData.evidence.github.repositories.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Github size={48} className="mx-auto mb-4 opacity-30" />
                  <p>No repositories found</p>
                  <p className="text-sm">Consider creating repositories for your Node.js projects</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {userData.evidence.github.repositories.map((repo, index) => (
                    <div key={index} className="p-3 border border-gray-200 rounded-lg">
                      <h4 className="font-medium">{repo.name}</h4>
                      <p className="text-sm text-gray-600">{repo.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'feedback' && (
          <div className="space-y-8">
            {/* Progress Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <TrendingUp className="mr-2 text-blue-600" />
                Progress Summary
              </h3>
              <p className="text-gray-700 leading-relaxed">{userData.feedback.progressSummary}</p>
            </div>

            {/* Gaps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-red-600">
                <AlertTriangle className="mr-2" />
                Areas for Improvement
              </h3>
              <ul className="space-y-3">
                {userData.feedback.gaps.map((gap, index) => (
                  <li key={index} className="flex items-start space-x-3 p-3 bg-red-50 rounded-lg">
                    <AlertTriangle size={16} className="text-red-500 mt-1 flex-shrink-0" />
                    <span className="text-red-800">{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Next Steps */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-green-600">
                <CheckCircle className="mr-2" />
                Next Steps
              </h3>
              <ul className="space-y-3">
                {userData.feedback.nextSteps.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
                    <CheckCircle size={16} className="text-green-500 mt-1 flex-shrink-0" />
                    <span className="text-green-800">{step}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center text-purple-600">
                <BookOpen className="mr-2" />
                Recommended Resources
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {userData.feedback.resources.map((resource, index) => (
                  <a
                    key={index}
                    href={resource.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:bg-purple-50 transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-purple-800 group-hover:text-purple-900">
                          {resource.title}
                        </h4>
                        <p className="text-sm text-purple-600 capitalize">{resource.type}</p>
                      </div>
                      <ExternalLink size={20} className="text-purple-400 group-hover:text-purple-600" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OKRReportDashboard;