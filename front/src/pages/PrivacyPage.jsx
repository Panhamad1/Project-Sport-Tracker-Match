import { Link } from 'react-router-dom';
import { FaArrowLeft, FaShieldAlt, FaUserShield, FaDatabase, FaLock, FaEye, FaCookieBite, FaChild, FaBell, FaEnvelope } from 'react-icons/fa';

const PrivacyPage = () => {
    const sections = [
        {
            icon: <FaDatabase className="text-[#8b5cf6]" />,
            title: '1. Information We Collect',
            content: [
                'Account information such as your username, email address, and password when you register.',
                'Profile data including your favorite teams, prediction history, and dream team selections.',
                'Usage data such as pages visited, features used, match details viewed, and time spent on the platform.',
                'Device information including your browser type, operating system, and IP address for security and analytics purposes.'
            ]
        },
        {
            icon: <FaEye className="text-blue-400" />,
            title: '2. How We Use Your Information',
            content: [
                'Providing and personalizing your FootHub experience, including match recommendations and fixture displays.',
                'Processing your predictions, maintaining leaderboard rankings, and calculating prediction points.',
                'Sending important account notifications such as password resets and security alerts.',
                'Improving our platform through usage analytics and identifying popular features.',
                'Maintaining platform security, preventing fraud, and enforcing our terms of service.'
            ]
        },
        {
            icon: <FaUserShield className="text-green-400" />,
            title: '3. Information Sharing',
            content: [
                'We do not sell your personal information to third parties under any circumstances.',
                'Your username and prediction stats may appear on public leaderboards if you participate in predictions.',
                'We may share anonymized, aggregated data for analytical purposes that cannot identify individual users.',
                'We may disclose information when required by law or to protect the rights and safety of our users.'
            ]
        },
        {
            icon: <FaLock className="text-yellow-400" />,
            title: '4. Data Security',
            content: [
                'All passwords are encrypted using bcrypt hashing and are never stored in plain text.',
                'Authentication is handled through secure JWT tokens with expiration policies.',
                'We use HTTPS encryption for all data transmitted between your browser and our servers.',
                'Regular security reviews are conducted to identify and address potential vulnerabilities.',
                'Access to user data is restricted to authorized personnel only on a need-to-know basis.'
            ]
        },
        {
            icon: <FaShieldAlt className="text-[#8b5cf6]" />,
            title: '5. Your Rights',
            content: [
                'Access and review the personal data we hold about you at any time through your profile page.',
                'Update or correct your account information including your username and email address.',
                'Request deletion of your account and associated data by contacting our support team.',
                'Remove your favorite teams, pinned matches, prediction picks, and dream team data at any time.',
                'Opt out of non-essential communications and notifications.'
            ]
        },
        {
            icon: <FaCookieBite className="text-orange-400" />,
            title: '6. Cookies & Local Storage',
            content: [
                'We use essential cookies for authentication and maintaining your logged-in session.',
                'Local storage is used to save recent search history for your convenience on the platform.',
                'No third-party advertising cookies or tracking pixels are used on FootHub.',
                'You can manage cookie preferences through your browser settings at any time.'
            ]
        },
        {
            icon: <FaChild className="text-pink-400" />,
            title: '7. Children\'s Privacy',
            content: [
                'FootHub is not intended for children under the age of 13.',
                'We do not knowingly collect personal information from children under 13.',
                'If we discover that a child under 13 has created an account, we will take steps to delete it promptly.',
                'Parents or guardians who believe their child has provided personal data should contact us immediately.'
            ]
        },
        {
            icon: <FaBell className="text-cyan-400" />,
            title: '8. Changes to This Policy',
            content: [
                'We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons.',
                'Significant changes will be communicated through a notice on our platform or via email.',
                'Continued use of FootHub after policy updates constitutes acceptance of the revised terms.',
                'We encourage you to review this policy periodically to stay informed about how we protect your data.'
            ]
        },
        {
            icon: <FaEnvelope className="text-[#8b5cf6]" />,
            title: '9. Contact Us',
            content: [
                'If you have any questions, concerns, or requests regarding this Privacy Policy, please reach out to us.',
                'Email: support@foothub.com',
                'Phone: +855 0987654321',
                'We aim to respond to all privacy-related inquiries within 48 hours.'
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
                <h1 className="mt-1 text-2xl font-bold">Privacy Policy</h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                    Your privacy matters to us. This policy explains how FootHub collects, uses, and protects your personal information.
                </p>
                <p className="mt-1 text-xs text-gray-500">Last updated: July 2026</p>
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

export default PrivacyPage;