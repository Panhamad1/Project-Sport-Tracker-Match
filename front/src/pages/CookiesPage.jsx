import { Link } from 'react-router-dom';
import { FaArrowLeft, FaInfoCircle, FaList, FaCog, FaDatabase, FaGlobe, FaSlidersH, FaCheckCircle, FaEnvelope } from 'react-icons/fa';

const CookiesPage = () => {
    const cookieTypes = [
        { name: 'Essential', description: 'Required for core functionality such as authentication and session management', duration: 'Session / 7 days', required: true },
        { name: 'Preference', description: 'Remember your settings like timezone, favorite leagues, and display preferences', duration: '1 year', required: false },
        { name: 'Analytics', description: 'Help us understand how users interact with FootHub to improve our platform', duration: '90 days', required: false },
    ];

    const sections = [
        {
            icon: <FaInfoCircle className="text-[#8b5cf6]" />,
            title: '1. What Are Cookies',
            content: [
                'Cookies are small text files that are stored on your device (computer, tablet, or mobile phone) when you visit a website.',
                'They are widely used to make websites work more efficiently and to provide information to website owners.',
                'Cookies allow websites to recognize your device and remember certain information about your visits, such as your login status and preferences.',
                'Cookies do not typically contain personal information that directly identifies you, but they may be linked to personal data we store about you.'
            ]
        },
        {
            icon: <FaCog className="text-blue-400" />,
            title: '2. How FootHub Uses Cookies',
            content: [
                'Keeping you signed in so you don\'t have to log in every time you visit FootHub.',
                'Remembering your selected timezone (Asia/Phnom_Penh) for displaying match fixtures in your local time.',
                'Securing your account by verifying your JWT authentication token on each request.',
                'Understanding which features are most popular so we can focus on improving them.',
                'Ensuring the platform functions correctly and providing a consistent experience across visits.'
            ]
        },
        {
            icon: <FaDatabase className="text-green-400" />,
            title: '3. Local Storage',
            content: [
                'In addition to cookies, FootHub uses browser Local Storage for certain functionality.',
                'Recent search history is saved in Local Storage so you can quickly access previous searches.',
                'Your authentication token is stored securely in Local Storage for maintaining your login session.',
                'Local Storage data remains on your device until you clear your browser data or explicitly remove it.',
                'You can view and clear Local Storage data through your browser\'s developer tools.'
            ]
        },
        {
            icon: <FaGlobe className="text-orange-400" />,
            title: '4. Third-Party Cookies',
            content: [
                'FootHub does not use any third-party advertising or tracking cookies.',
                'We do not share cookie data with advertisers or ad networks.',
                'Football data is fetched server-side from API-FOOTBALL, so no third-party API cookies are set in your browser.',
                'If we integrate third-party services in the future, this policy will be updated accordingly.'
            ]
        },
        {
            icon: <FaSlidersH className="text-yellow-400" />,
            title: '5. Managing Your Cookie Preferences',
            content: [
                'You can control and manage cookies through your browser settings at any time.',
                'Most browsers allow you to block or delete cookies through the privacy or settings menu.',
                'Please note that disabling essential cookies may prevent you from logging in or using key features of FootHub.',
                'Clearing cookies will log you out and reset any saved preferences on the platform.',
                'For specific instructions on managing cookies, refer to your browser\'s help documentation.'
            ]
        },
        {
            icon: <FaCheckCircle className="text-cyan-400" />,
            title: '6. Your Consent',
            content: [
                'By continuing to use FootHub, you consent to our use of cookies as described in this policy.',
                'You can withdraw your consent at any time by adjusting your browser settings or clearing your cookies.',
                'Essential cookies are necessary for the platform to function and cannot be individually disabled while using FootHub.',
                'We will notify you of any significant changes to our cookie practices.'
            ]
        },
        {
            icon: <FaEnvelope className="text-[#8b5cf6]" />,
            title: '7. Contact Us',
            content: [
                'If you have any questions about our use of cookies or this Cookie Policy, please contact us.',
                'Email: support@foothub.com',
                'Phone: +855 0987654321',
                'We aim to respond to all cookie-related inquiries within 48 hours.'
            ]
        }
    ];

    return (
        <div className="space-y-6 text-white">
            <div>
                <Link
                    to="/help"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#8b5cf6] transition-colors mb-4"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to Help & Support
                </Link>
                <p className="text-sm font-medium text-[#8b5cf6]">Legal</p>
                <h1 className="mt-1 text-2xl font-bold">Cookie Policy</h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                    This policy explains how FootHub uses cookies and similar technologies to recognize you when you visit our platform.
                </p>
                <p className="mt-1 text-xs text-gray-500">Last updated: July 2026</p>
            </div>

            <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <FaList className="text-[#8b5cf6]" />
                    Types of Cookies We Use
                </h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-[#2a2a2a] text-left">
                                <th className="pb-3 text-gray-400 font-medium">Type</th>
                                <th className="pb-3 text-gray-400 font-medium">Purpose</th>
                                <th className="pb-3 text-gray-400 font-medium">Duration</th>
                                <th className="pb-3 text-gray-400 font-medium">Required</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#2a2a2a]">
                            {cookieTypes.map((cookie, index) => (
                                <tr key={index}>
                                    <td className="py-3 text-white font-medium">{cookie.name}</td>
                                    <td className="py-3 text-gray-400">{cookie.description}</td>
                                    <td className="py-3 text-gray-400">{cookie.duration}</td>
                                    <td className="py-3">
                                        {cookie.required ? (
                                            <span className="inline-flex items-center gap-1 text-xs text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                                                <FaCheckCircle className="text-[10px]" /> Yes
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center text-xs text-gray-500 bg-[#2a2a2a] px-2 py-1 rounded-full">
                                                Optional
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="space-y-4">
                {sections.map((section, index) => (
                    <div key={index} className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-6">
                        <h2 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                            {section.icon}
                            {section.title}
                        </h2>
                        <ul className="space-y-2">
                            {section.content.map((item, i) => (
                                <li key={i} className="text-sm text-gray-400 leading-relaxed flex items-start gap-2">
                                    <span className="text-[#8b5cf6] mt-1.5 text-[6px]">●</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Link to="/privacy" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Privacy Policy
                </Link>
                <Link to="/terms" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Terms of Service
                </Link>
                <Link to="/about" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    About FootHub
                </Link>
            </div>
        </div>
    );
};

export default CookiesPage;