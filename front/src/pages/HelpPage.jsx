import { useState } from 'react';
import { FaSearch, FaEnvelope, FaPhone, FaBook, FaVideo, FaQuestionCircle, FaArrowRight, FaChevronDown, FaChevronUp, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const HelpPage = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedFaq, setExpandedFaq] = useState(null);

    const faqs = [
        {
            id: 1,
            question: 'How do I create an account?',
            answer: 'Click on the "Login" button in the sidebar, then select "Sign Up". Fill in your details and submit the form.'
        },
        {
            id: 2,
            question: 'How do I make predictions on matches?',
            answer: 'Navigate to the "Matches" page, select a match, and click on the "Predict" button. Choose your prediction and submit.'
        },
        {
            id: 3,
            question: 'How does the leaderboard scoring work?',
            answer: 'Points are awarded based on prediction accuracy. Correct predictions earn more points, and streaks give bonus points.'
        },
        {
            id: 4,
            question: 'How do I update my profile?',
            answer: 'Go to your "Profile" page and click "Edit Profile". You can update your personal information and preferences.'
        },
        {
            id: 5,
            question: 'What is the Dream Team feature?',
            answer: 'Dream Team allows you to select your favorite players and create your ideal lineup. Compete with other users!'
        },
        {
            id: 6,
            question: 'How do I change my password?',
            answer: 'Go to "Settings & Privacy" in the sidebar, select "Security", and choose "Change Password".'
        },
    ];

    const filteredFaqs = faqs.filter(faq =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const toggleFaq = (id) => {
        setExpandedFaq(expandedFaq === id ? null : id);
    };

    const supportOptions = [
        { icon: <FaEnvelope />, title: 'Email Support', description: 'Get help via email', action: 'support@foothub.com', link: 'mailto:support@foothub.com' },
        { icon: <FaBook />, title: 'Documentation', description: 'Read our guides', action: 'View Docs', link: '#' },
        { icon: <FaVideo />, title: 'Video Tutorials', description: 'Watch step-by-step guides', action: 'Watch Now', link: '#' },
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <p className="text-sm font-medium text-[#8b5cf6]">Help & Support</p>
                <h1 className="mt-1 text-2xl font-bold">How can we help you?</h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                    Find answers to common questions or contact our support team for personalized assistance.
                </p>
            </div>

            <div className="relative max-w-2xl">
                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                    type="text"
                    placeholder="Search for help articles..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] py-3 pl-11 pr-4 text-white placeholder-gray-500 focus:border-[#8b5cf6] focus:outline-none transition-colors"
                />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {supportOptions.map((option, index) => (
                    <a
                        key={index}
                        href={option.link}
                        className="group rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-4 transition-all hover:border-[#8b5cf6]/30 hover:bg-[#2a2a2a]"
                    >
                        <div className="flex items-center gap-3">
                            <div className="text-2xl text-[#8b5cf6]">{option.icon}</div>
                            <div>
                                <h3 className="text-sm font-semibold text-white group-hover:text-[#8b5cf6] transition-colors">{option.title}</h3>
                                <p className="text-xs text-gray-400">{option.description}</p>
                                <span className="text-xs text-[#8b5cf6] flex items-center gap-1 mt-1">
                                    {option.action}
                                    <FaArrowRight className="text-[10px] group-hover:translate-x-1 transition-transform" />
                                </span>
                            </div>
                        </div>
                    </a>
                ))}
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] overflow-hidden">
                <div className="border-b border-[#2a2a2a] px-6 py-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                        <FaQuestionCircle className="text-[#8b5cf6]" />
                        Frequently Asked Questions
                    </h2>
                </div>

                {filteredFaqs.length === 0 ? (
                    <div className="p-6 text-center text-gray-400">
                        <p>No results found for "{searchTerm}"</p>
                    </div>
                ) : (
                    <div className="divide-y divide-[#2a2a2a]">
                        {filteredFaqs.map((faq) => (
                            <div key={faq.id}>
                                <button
                                    onClick={() => toggleFaq(faq.id)}
                                    className="flex w-full items-center justify-between px-6 py-4 text-left transition-colors hover:bg-[#2a2a2a]/50"
                                >
                                    <span className="text-sm font-medium text-white">{faq.question}</span>
                                    {expandedFaq === faq.id ? (
                                        <FaChevronUp className="text-[#8b5cf6] shrink-0 ml-4" />
                                    ) : (
                                        <FaChevronDown className="text-gray-500 shrink-0 ml-4" />
                                    )}
                                </button>
                                {expandedFaq === faq.id && (
                                    <div className="px-6 pb-4 text-sm text-gray-400 leading-relaxed">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="rounded-lg border border-[#8b5cf6]/30 bg-linear-to-br from-[#8b5cf6]/10 to-[#1a1a1a] p-6">
                <div className="flex flex-col items-center text-center sm:flex-row sm:text-left sm:justify-between">
                    <div>
                        <h3 className="text-lg font-semibold text-[#8b5cf6]">Still need help?</h3>
                        <p className="text-sm text-gray-400 mt-1">
                            Our support team is ready to assist you with any questions.
                        </p>
                    </div>
                    <div className="mt-4 sm:mt-0 flex flex-wrap gap-3">
                        <a
                            href="mailto:support@foothub.com"
                            className="flex items-center gap-2 rounded-lg bg-[#8b5cf6] px-6 py-2 text-sm font-medium text-white transition-colors hover:bg-[#7c3aed]"
                        >
                            <FaEnvelope className="text-xs" />
                            Contact Support
                        </a>
                    </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-center gap-4 text-xs text-gray-400 sm:justify-start">
                    <span className="flex items-center gap-1">
                        <FaCheckCircle className="text-green-400" />
                        Response within 24 hours
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                        <FaPhone className="text-[#8b5cf6]" />
                        +855 0987654321
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="flex items-center gap-1">
                        <FaEnvelope className="text-[#8b5cf6]" />
                        support@foothub.com
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <Link to="/privacy" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Privacy Policy
                </Link>
                <Link to="/terms" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Terms of Service
                </Link>
                <Link to="/cookies" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Cookie Policy
                </Link>
                <Link to="/about" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    About FootHub
                </Link>
            </div>
        </div>
    );
};

export default HelpPage;