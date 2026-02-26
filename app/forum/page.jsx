'use client'

import { useState, useEffect, useRef, useCallback, memo } from 'react'
import { useRouter } from 'next/navigation'
import Navigation from '@/components/navigation'
import Footer from '@/components/Footer'
import { 
  Search, 
  Filter, 
  MessageSquare, 
  ThumbsUp, 
  Eye, 
  Clock, 
  User,
  TrendingUp,
  Tag,
  Pin,
  Lock,
  ChevronRight,
  Plus,
  MoreVertical,
  Bookmark,
  Share2,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

// Mock forum data
const FORUM_CATEGORIES = [
  { id: 'general', name: 'General Discussion', count: 245, description: 'General topics about EstateSecure', icon: '💬' },
  { id: 'security', name: 'Security & Safety', count: 189, description: 'Security features and best practices', icon: '🛡️' },
  { id: 'technical', name: 'Technical Support', count: 312, description: 'Technical issues and troubleshooting', icon: '🔧' },
  { id: 'features', name: 'Feature Requests', count: 156, description: 'Suggest and vote on new features', icon: '💡' },
  { id: 'announcements', name: 'Official Announcements', count: 42, description: 'Updates from EstateSecure team', icon: '📢' },
  { id: 'success', name: 'Success Stories', count: 89, description: 'Community implementations and results', icon: '🎯' },
]

const MOCK_THREADS = [
  {
    id: 1,
    title: 'How to set up emergency contacts for all residents?',
    category: 'security',
    author: { name: 'SecurityPro', role: 'Community Admin', verified: true },
    replies: 24,
    views: 345,
    likes: 42,
    timestamp: '2 hours ago',
    isPinned: true,
    isLocked: false,
    tags: ['emergency', 'setup', 'best-practices'],
    excerpt: 'Looking for best practices to configure emergency contacts for our 200+ unit community...'
  },
  {
    id: 2,
    title: 'QR Code scanner not working at main gate',
    category: 'technical',
    author: { name: 'GateGuard', role: 'Security Staff', verified: true },
    replies: 15,
    views: 198,
    likes: 8,
    timestamp: '5 hours ago',
    isPinned: false,
    isLocked: false,
    tags: ['bug', 'access-control', 'urgent'],
    excerpt: 'The QR code scanner at our main gate has been intermittently failing since yesterday...'
  },
  {
    id: 3,
    title: 'Request: Monthly security report automation',
    category: 'features',
    author: { name: 'CommunityManager', role: 'Resident', verified: false },
    replies: 56,
    views: 423,
    likes: 89,
    timestamp: '1 day ago',
    isPinned: false,
    isLocked: false,
    tags: ['feature-request', 'reports', 'automation'],
    excerpt: 'Would love to see automated monthly security reports that can be shared with residents...'
  },
  {
    id: 4,
    title: 'EstateSecure v2.5 Update Release Notes',
    category: 'announcements',
    author: { name: 'EstateSecure Team', role: 'Admin', verified: true },
    replies: 12,
    views: 567,
    likes: 102,
    timestamp: '2 days ago',
    isPinned: true,
    isLocked: true,
    tags: ['update', 'release', 'official'],
    excerpt: 'We are excited to announce the release of EstateSecure v2.5 with several new features...'
  },
  {
    id: 5,
    title: 'Visitor management workflow for large events',
    category: 'general',
    author: { name: 'EventPlanner', role: 'Resident', verified: false },
    replies: 31,
    views: 234,
    likes: 27,
    timestamp: '3 days ago',
    isPinned: false,
    isLocked: false,
    tags: ['visitors', 'events', 'workflow'],
    excerpt: 'Our community is hosting a Diwali celebration with 500+ expected visitors...'
  },
  {
    id: 6,
    title: 'Payment gateway integration issues',
    category: 'technical',
    author: { name: 'Treasurer', role: 'Committee Member', verified: true },
    replies: 8,
    views: 145,
    likes: 3,
    timestamp: '4 days ago',
    isPinned: false,
    isLocked: false,
    tags: ['payments', 'integration', 'help'],
    excerpt: 'Having trouble integrating our local bank with the payment system...'
  },
  {
    id: 7,
    title: 'How we reduced unauthorized entries by 95%',
    category: 'success',
    author: { name: 'GreenValleyAdmin', role: 'Community Admin', verified: true },
    replies: 47,
    views: 389,
    likes: 76,
    timestamp: '1 week ago',
    isPinned: false,
    isLocked: false,
    tags: ['success-story', 'security', 'results'],
    excerpt: 'Sharing our journey of implementing EstateSecure in our 1500-unit township...'
  },
  {
    id: 8,
    title: 'Biometric data privacy concerns',
    category: 'security',
    author: { name: 'PrivacyAdvocate', role: 'Resident', verified: false },
    replies: 63,
    views: 512,
    likes: 34,
    timestamp: '1 week ago',
    isPinned: false,
    isLocked: true,
    tags: ['privacy', 'biometrics', 'discussion'],
    excerpt: 'I have concerns about how biometric data is stored and managed...'
  },
]

const TRENDING_TAGS = [
  { name: 'emergency-response', count: 42 },
  { name: 'qr-codes', count: 38 },
  { name: 'payment-issues', count: 31 },
  { name: 'mobile-app', count: 29 },
  { name: 'cctv-integration', count: 27 },
  { name: 'biometric', count: 25 },
  { name: 'reports', count: 23 },
  { name: 'api', count: 21 },
]

// Memoized Components
const CategoryCard = memo(({ category, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4   transition-all duration-300 cursor-pointer ${
      isActive
        ? ' border-blue-600 bg-blue-50 shadow-sm'
        : ' border-gray-200 hover:border-gray-300 hover:bg-gray-50'
    }`}
  >
    <div className="flex items-start gap-3">
      <div className="text-2xl">{category.icon}</div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <h3 className="font-semibold text-gray-900">{category.name}</h3>
          <span className={`px-2 py-1 text-xs font-medium rounded ${
            isActive ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'
          }`}>
            {category.count}
          </span>
        </div>
        <p className="text-sm text-gray-600 mt-1">{category.description}</p>
      </div>
    </div>
  </div>
))

CategoryCard.displayName = 'CategoryCard'

const ThreadCard = memo(({ thread, onClick }) => (
  <div
    onClick={() => onClick(thread.id)}
    className=" border-gray-200 hover:border-gray-300 hover:shadow-sm transition-all duration-300 cursor-pointer bg-white"
  >
    <div className="p-4">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            {thread.isPinned && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-50 text-yellow-700 text-xs font-medium">
                <Pin className="w-3 h-3" />
                Pinned
              </span>
            )}
            {thread.isLocked && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium">
                <Lock className="w-3 h-3" />
                Locked
              </span>
            )}
            <span className="text-xs text-gray-500">{thread.timestamp}</span>
          </div>
          
          <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
            {thread.title}
          </h3>
          
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
            {thread.excerpt}
          </p>
          
          <div className="flex flex-wrap gap-2 mb-3">
            {thread.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                  <User className="w-3 h-3 text-gray-600" />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-medium text-gray-700">{thread.author.name}</span>
                    {thread.author.verified && (
                      <CheckCircle className="w-3 h-3 text-blue-600" />
                    )}
                  </div>
                  <span className="text-xs text-gray-500">{thread.author.role}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {thread.replies}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-4 h-4" />
                {thread.views}
              </span>
              <span className="flex items-center gap-1">
                <ThumbsUp className="w-4 h-4" />
                {thread.likes}
              </span>
            </div>
          </div>
        </div>
        
        <button className="p-2 hover:bg-gray-100 rounded">
          <MoreVertical className="w-5 h-5 text-gray-400" />
        </button>
      </div>
    </div>
  </div>
))

ThreadCard.displayName = 'ThreadCard'

const TrendingTag = memo(({ tag }) => (
  <button className="group flex items-center justify-between p-3 border-gray-200 hover:border-gray-300 hover:bg-gray-50 transition-all duration-300 w-full">
    <div className="flex items-center gap-2">
      <Tag className="w-4 h-4 text-gray-400" />
      <span className="text-sm font-medium text-gray-700">#{tag.name}</span>
    </div>
    <div className="flex items-center gap-2">
      <span className="text-xs text-gray-500">{tag.count} posts</span>
      <ChevronRight className="w-4 h-4 text-gray-400 group-hover:translate-x-1 transition-transform" />
    </div>
  </button>
))

TrendingTag.displayName = 'TrendingTag'

const QuickStats = memo(() => (
  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    <div className=" border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Total Threads</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">1,284</p>
    </div>
    <div className=" border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <User className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Active Users</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">892</p>
    </div>
    <div className=" border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <ThumbsUp className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Solutions</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">456</p>
    </div>
    <div className=" border-gray-200 p-4">
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-gray-600" />
        <span className="text-sm text-gray-600">Avg. Response</span>
      </div>
      <p className="text-2xl font-bold text-gray-900">2.4h</p>
    </div>
  </div>
))

QuickStats.displayName = 'QuickStats'

export default function ForumPage() {
  const router = useRouter()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredThreads, setFilteredThreads] = useState(MOCK_THREADS)
  const [sortBy, setSortBy] = useState('latest')
  const [showFilters, setShowFilters] = useState(false)

  // Filter threads based on category and search
  useEffect(() => {
    let threads = MOCK_THREADS
    
    if (activeCategory !== 'all') {
      threads = threads.filter(thread => thread.category === activeCategory)
    }
    
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      threads = threads.filter(thread => 
        thread.title.toLowerCase().includes(query) ||
        thread.excerpt.toLowerCase().includes(query) ||
        thread.tags.some(tag => tag.toLowerCase().includes(query)) ||
        thread.author.name.toLowerCase().includes(query)
      )
    }
    
    // Sort threads
    switch(sortBy) {
      case 'latest':
        threads.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        break
      case 'popular':
        threads.sort((a, b) => b.views - a.views)
        break
      case 'most-replies':
        threads.sort((a, b) => b.replies - a.replies)
        break
      case 'most-likes':
        threads.sort((a, b) => b.likes - a.likes)
        break
    }
    
    setFilteredThreads(threads)
  }, [activeCategory, searchQuery, sortBy])

  const handleCategoryClick = useCallback((categoryId) => {
    setActiveCategory(categoryId)
  }, [])

  const handleThreadClick = useCallback((threadId) => {
    router.push(`/forum/thread/${threadId}`)
  }, [router])

  const handleNewThread = useCallback(() => {
    router.push('/forum/new')
  }, [router])

  const handleSearch = useCallback((e) => {
    e.preventDefault()
    // Search logic handled by useEffect
  }, [])

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <Navigation />

      {/* Forum Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">Community Forum</h1>
              <p className="text-gray-600">
                Connect with other EstateSecure users, share experiences, and get help
              </p>
            </div>
            <button
              onClick={handleNewThread}
              className="px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300 flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              New Thread
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="bg-white border-gray-200 p-4">
              <form onSubmit={handleSearch}>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search forum..."
                    className="w-full pl-10 pr-4 py-2 border-gray-300 focus:border-gray-900 focus:outline-none focus:ring-1 focus:ring-gray-900"
                  />
                </div>
              </form>
            </div>

            {/* Categories */}
            <div className="bg-white border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  Categories
                </h3>
              </div>
              <div className="p-4">
                <button
                  onClick={() => handleCategoryClick('all')}
                  className={`w-full text-left px-3 py-2 mb-2 rounded ${
                    activeCategory === 'all'
                      ? 'bg-gray-900 text-white'
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  All Discussions
                </button>
                {FORUM_CATEGORIES.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.id)}
                    className={`w-full text-left px-3 py-2 mb-2 rounded ${
                      activeCategory === category.id
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span>{category.name}</span>
                      <span className="text-sm text-gray-500">{category.count}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Trending Tags */}
            <div className="bg-white border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Trending Tags
                </h3>
              </div>
              <div className="p-4 space-y-2">
                {TRENDING_TAGS.map((tag, index) => (
                  <TrendingTag key={index} tag={tag} />
                ))}
              </div>
            </div>

            {/* Quick Stats */}
            <div className="bg-white border-gray-200 p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Forum Stats</h3>
              <QuickStats />
            </div>
          </div>

          {/* Main Content Area */}
          <div className="lg:col-span-3">
            {/* Filters */}
            <div className="bg-white border-gray-200 mb-6">
              <div className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 px-3 py-2 border-gray-300 hover:border-gray-400"
                  >
                    <Filter className="w-4 h-4" />
                    Filter
                  </button>
                  
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3 py-2 border-gray-300 focus:outline-none focus:border-gray-900"
                  >
                    <option value="latest">Latest</option>
                    <option value="popular">Most Viewed</option>
                    <option value="most-replies">Most Replies</option>
                    <option value="most-likes">Most Likes</option>
                  </select>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing {filteredThreads.length} of {MOCK_THREADS.length} threads
                </div>
              </div>

              {/* Expanded Filters */}
              {showFilters && (
                <div className="p-4 border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Thread Status
                      </label>
                      <div className="space-y-2">
                        {['All', 'Open', 'Closed', 'Pinned'].map((status) => (
                          <label key={status} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm text-gray-700">{status}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Time Period
                      </label>
                      <div className="space-y-2">
                        {['Last 24 hours', 'Last week', 'Last month', 'All time'].map((period) => (
                          <label key={period} className="flex items-center gap-2">
                            <input type="radio" name="period" className="rounded" />
                            <span className="text-sm text-gray-700">{period}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        User Type
                      </label>
                      <div className="space-y-2">
                        {['All users', 'Verified only', 'Admins only', 'Residents only'].map((type) => (
                          <label key={type} className="flex items-center gap-2">
                            <input type="checkbox" className="rounded" />
                            <span className="text-sm text-gray-700">{type}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Threads List */}
            <div className="space-y-4">
              {filteredThreads.length > 0 ? (
                filteredThreads.map((thread) => (
                  <ThreadCard
                    key={thread.id}
                    thread={thread}
                    onClick={handleThreadClick}
                  />
                ))
              ) : (
                <div className="bg-white border-gray-200 p-8 text-center">
                  <div className="max-w-md mx-auto">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <MessageSquare className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      No threads found
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Try adjusting your search or filter criteria
                    </p>
                    <button
                      onClick={handleNewThread}
                      className="px-6 py-3 bg-gray-900 text-white font-semibold hover:bg-gray-800 transition-all duration-300"
                    >
                      Start a New Discussion
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Pagination */}
            {filteredThreads.length > 0 && (
              <div className="mt-8 flex justify-center">
                <nav className="flex items-center gap-2">
                  <button className="px-3 py-2 border-gray-300 hover:border-gray-400 disabled:opacity-50">
                    Previous
                  </button>
                  {[1, 2, 3, 4, 5].map((page) => (
                    <button
                      key={page}
                      className={`px-3 py-2   ${
                        page === 1
                          ? ' border-gray-900 bg-gray-900 text-white'
                          : ' border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                  <button className="px-3 py-2 border-gray-300 hover:border-gray-400">
                    Next
                  </button>
                </nav>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Forum Guidelines */}
      <div className="bg-white border-t border-gray-200 mt-12">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Community Guidelines</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className=" border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold">Do</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Be respectful and professional</li>
                  <li>• Share your experiences and solutions</li>
                  <li>• Use appropriate categories for your posts</li>
                  <li>• Mark helpful replies as solutions</li>
                  <li>• Report inappropriate content</li>
                </ul>
              </div>
              
              <div className=" border-gray-200 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <h3 className="font-semibold">Don't</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Share sensitive or private information</li>
                  <li>• Post spam or advertisements</li>
                  <li>• Engage in personal attacks</li>
                  <li>• Share login credentials</li>
                  <li>• Discuss illegal activities</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}