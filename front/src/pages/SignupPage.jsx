import { Link } from 'react-router-dom';
import Layout from '../layouts/Login&SignupLayout';
import { useSignupPage } from '../hooks/useSignupPage';

const SignupPage = () => {
  const {
    agreeTerms,
    formData,
    handleChange,
    handleSubmit,
    setAgreeTerms,
    showConfirmPassword,
    showPassword,
    toggleConfirmPassword,
    togglePassword,
  } = useSignupPage();

  return (
    <Layout>
      <div className="min-h-[calc(100vh-200px)] flex items-center px-4 sm:px-6 md:px-8 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 items-center">
            
            <div className="space-y-4 sm:space-y-6 order-1">
              <div className="inline-flex items-center gap-2 bg-[#1a1a1a] border border-[#2a2a2a] rounded-full px-3 sm:px-4 py-1 text-xs sm:text-sm text-[#8b5cf6]">
                <span className="w-1.5 h-1.5 bg-[#8b5cf6] rounded-full animate-pulse"></span>
                New here?
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
                Unleash the <br className="hidden sm:block" />
                <span className="bg-linear-to-r from-[#8b5cf6] to-[#3b82f6] bg-clip-text text-transparent">
                  Football Fan
                </span>
                <br className="hidden sm:block" />Inside You
              </h1>

              <p className="text-sm sm:text-base md:text-lg text-gray-400 max-w-md leading-relaxed">
                Create your account and get access to live scores, team stats, 
                predictions, and everything about football.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3 pt-2 sm:pt-4">
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-[#8b5cf6] shrink-0">✦</span>
                  <span>Real-time match coverage</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-[#8b5cf6] shrink-0">✦</span>
                  <span>Detailed player & team analytics</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-[#8b5cf6] shrink-0">✦</span>
                  <span>Personalized football feed</span>
                </div>
                <div className="flex items-center gap-2 sm:gap-3 text-gray-300 text-sm sm:text-base">
                  <span className="text-[#8b5cf6] shrink-0">✦</span>
                  <span>Exclusive match predictions</span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4 max-w-md">
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">50K+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Active Fans</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">200+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Leagues</div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl sm:text-2xl font-bold text-white">10K+</div>
                  <div className="text-xs sm:text-sm text-gray-500">Matches</div>
                </div>
              </div>

              <div className="hidden sm:flex gap-3 pt-4">
                <div className="w-8 sm:w-12 h-1 bg-[#8b5cf6] rounded"></div>
                <div className="w-8 sm:w-12 h-1 bg-[#3b82f6] rounded"></div>
                <div className="w-8 sm:w-12 h-1 bg-[#2a2a2a] rounded"></div>
              </div>
            </div>

            <div className="order-2">
              <div className="bg-[#0d0d0d] border border-[#2a2a2a] rounded-xl sm:rounded-2xl p-6 sm:p-8 lg:p-10 hover:border-[#3b82f6]/30 transition-all duration-300">
                
                <div className="mb-6 sm:mb-8">
                  <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-gray-400 text-sm sm:text-base">
                    Start your football experience
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5 sm:mb-2">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      placeholder="Choose a username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5 sm:mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      placeholder="yourname@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all duration-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5 sm:mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create a strong password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={togglePassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-1.5 sm:mb-2">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <input
                        type={showConfirmPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg px-4 py-2.5 sm:py-3 text-white text-sm sm:text-base placeholder-gray-500 focus:outline-none focus:border-[#8b5cf6] focus:ring-1 focus:ring-[#8b5cf6] transition-all duration-200 pr-12"
                        required
                      />
                      <button
                        type="button"
                        onClick={toggleConfirmPassword}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors">
                        {showConfirmPassword ? (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        ) : (
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <input
                      type="checkbox"
                      id="agreeTerms"
                      checked={agreeTerms}
                      onChange={(e) => setAgreeTerms(e.target.checked)}
                      className="w-4 h-4 mt-1 bg-[#1a1a1a] border-[#2a2a2a] rounded focus:ring-[#8b5cf6] text-[#8b5cf6] shrink-0"
                      required
                    />
                    <label htmlFor="agreeTerms" className="text-xs sm:text-sm text-gray-400 cursor-pointer leading-relaxed">
                      I agree to the{' '}
                      <Link to="/terms" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                        Terms of Service
                      </Link>
                      {' '}and{' '}
                      <Link to="/privacy" className="text-[#3b82f6] hover:text-[#60a5fa] transition-colors">
                        Privacy Policy
                      </Link>
                    </label>
                  </div>

                  <button type="submit" className="w-full bg-linear-to-r from-[#8b5cf6] to-[#3b82f6] text-white font-semibold py-2.5 sm:py-3 px-4 rounded-lg hover:shadow-lg hover:shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] text-sm sm:text-base">
                    Create Account
                  </button>

                  <div className="text-center text-gray-400 text-sm pt-2">
                    Already a member?{' '}
                    <Link to="/login" className="text-[#8b5cf6] hover:text-[#a78bfa] font-medium transition-colors">
                      Log In
                    </Link>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SignupPage;
