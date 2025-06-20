import mongoose from 'mongoose';

const LeetCodeProblemSchema = new mongoose.Schema({
  title: String,
  difficulty: String,
  date: String,
  time: String
}, { _id: false });

const LeetCodeSchema = new mongoose.Schema({
  easy: Number,
  medium: Number,
  hard: Number,
  total: Number,
  problems: [LeetCodeProblemSchema]
}, { _id: false });

const GitHubRepoSchema = new mongoose.Schema({
  repo_name: String,
  last_commit_time: String
}, { _id: false });

const GitHubSchema = new mongoose.Schema({
  username: String,
  repositories: [GitHubRepoSchema]
}, { _id: false });

const EvidenceSchema = new mongoose.Schema({
  leetcode: LeetCodeSchema,
  github: GitHubSchema
}, { _id: false });

const StructuredOKRSchema = new mongoose.Schema({
  objective: String,
  keyResults: [String],
  skillFocus: [String],
  ambiguityLevel: String
}, { _id: false });

const BenchmarksSchema = new mongoose.Schema({
  benchmarkedObjective: String,
  benchmarkedKeyResults: [String],
  benchmarkedSkillFocus: [String],
  recommendedProficiencyLevel: String
}, { _id: false });

const ValidationSchema = new mongoose.Schema({
  relevance: Number,
  completeness: Number,
  quality: Number,
  totalScore: Number,
  status: String
}, { _id: false });

const FeedbackResourceSchema = new mongoose.Schema({
  title: String,
  type: String,
  link: String
}, { _id: false });

const FeedbackSchema = new mongoose.Schema({
  progressSummary: String,
  gaps: [String],
  nextSteps: [String],
  resources: [FeedbackResourceSchema]
}, { _id: false });

const ProgressSchema = new mongoose.Schema({
  summary: String,
  completionTrend: String,
  evidenceTrend: String,
  feedbackIncorporation: String,
  status: String
}, { _id: false });

const OKRSchema = new mongoose.Schema({
  userId: { type: Number, required: true },
  name: { type: String },
  leetcodeId: { type: String },
  githubId: { type: String },
  linkedinId: { type: String },
  cleaned_okr_text: { type: String },
  structured_okr: StructuredOKRSchema,
  benchmarks: BenchmarksSchema,
  evidence: EvidenceSchema,
  validation: ValidationSchema,
  feedback: FeedbackSchema,
  progress: ProgressSchema,
  isYourOKR: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

const OKR = mongoose.model('OKR', OKRSchema);
export default OKR; 