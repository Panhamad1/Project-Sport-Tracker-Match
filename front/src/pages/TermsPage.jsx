import { Link } from 'react-router-dom';
import { FaArrowLeft, FaFileContract, FaUserCheck, FaChartLine, FaBan, FaCopyright, FaExclamationTriangle, FaBalanceScale, FaTimesCircle, FaGavel, FaEnvelope } from 'react-icons/fa';

const TermsPage = () => {
    const sections = [
        {
            icon: <FaFileContract className="text-[#8b5cf6]" />,
            title: '1. Acceptance of Terms',
            content: [
                'By accessing or using FootHub, you agree to be bound by these Terms of Service and all applicable laws and regulations.',
                'If you do not agree with any part of these terms, you must not use our platform.',
                'These terms apply to all visitors, registered users, and anyone who accesses or uses FootHub.',
                'We reserve the right to update these terms at any time. Continued use after changes constitutes acceptance.'
            ]
        },
        {
            icon: <FaUserCheck className="text-green-400" />,
            title: '2. User Accounts',
            content: [
                'You must provide accurate and complete information when creating an account on FootHub.',
                'You are responsible for maintaining the confidentiality of your login credentials and for all activities under your account.',
                'Each user may only create and maintain one account. Duplicate accounts may be removed without notice.',
                'You must notify us immediately if you suspect any unauthorized access to or use of your account.',
                'We reserve the right to suspend or delete accounts that violate these terms or remain inactive for extended periods.'
            ]
        },
        {
            icon: <FaChartLine className="text-blue-400" />,
            title: '3. Predictions & Leaderboard',
            content: [
                'Prediction features on FootHub are for entertainment and community engagement purposes only.',
                'FootHub does not facilitate real-money gambling, betting, or wagering of any kind.',
                'Prediction points and leaderboard rankings hold no monetary value and cannot be exchanged for cash or prizes.',
                'Prediction odds displayed are sourced from third-party data providers and are used solely for point calculation.',
                'We reserve the right to adjust points, reset leaderboards, or modify the scoring system at our discretion.'
            ]
        },
        {
            icon: <FaBan className="text-red-400" />,
            title: '4. Prohibited Conduct',
            content: [
                'Using automated scripts, bots, or tools to access or interact with FootHub without authorization.',
                'Attempting to manipulate predictions, leaderboard rankings, or any scoring mechanisms.',
                'Creating multiple accounts to gain unfair advantages in predictions or other features.',
                'Impersonating other users, administrators, or FootHub staff members.',
                'Uploading or sharing content that is offensive, harmful, illegal, or infringes on the rights of others.',
                'Attempting to reverse engineer, decompile, or access the source code of FootHub without permission.'
            ]
        },
        {
            icon: <FaCopyright className="text-yellow-400" />,
            title: '5. Intellectual Property',
            content: [
                'All content on FootHub, including design, logos, text, graphics, and software, is owned by FootHub or its licensors.',
                'Football data is provided through licensed third-party APIs and is subject to their respective terms of use.',
                'Team logos, player images, and league branding are the property of their respective owners and are displayed under fair use.',
                'You may not reproduce, distribute, or create derivative works from FootHub content without our prior written consent.'
            ]
        },
        {
            icon: <FaExclamationTriangle className="text-orange-400" />,
            title: '6. Disclaimers',
            content: [
                'FootHub is provided on an "as is" and "as available" basis without warranties of any kind, express or implied.',
                'We do not guarantee the accuracy, completeness, or timeliness of match data, scores, or statistics displayed.',
                'Football data relies on third-party providers and may occasionally experience delays, errors, or interruptions.',
                'We are not responsible for any decisions made based on information displayed on FootHub.'
            ]
        },
        {
            icon: <FaBalanceScale className="text-cyan-400" />,
            title: '7. Limitation of Liability',
            content: [
                'FootHub and its team shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform.',
                'Our total liability for any claims related to FootHub shall not exceed the amount you have paid to us, if any.',
                'This limitation applies to all causes of action, whether based on warranty, contract, tort, or any other legal theory.'
            ]
        },
        {
            icon: <FaTimesCircle className="text-pink-400" />,
            title: '8. Account Termination',
            content: [
                'You may delete your account at any time by contacting our support team.',
                'We reserve the right to suspend or terminate accounts that violate these terms without prior notice.',
                'Upon termination, your prediction history, dream team data, favorites, and other user data may be permanently deleted.',
                'Provisions of these terms that by their nature should survive termination will remain in effect.'
            ]
        },
        {
            icon: <FaGavel className="text-[#8b5cf6]" />,
            title: '9. Governing Law',
            content: [
                'These terms shall be governed by and construed in accordance with the laws of the Kingdom of Cambodia.',
                'Any disputes arising from these terms or your use of FootHub shall be resolved through appropriate legal channels.',
                'If any provision of these terms is found to be unenforceable, the remaining provisions will continue in full force and effect.'
            ]
        },
        {
            icon: <FaEnvelope className="text-[#8b5cf6]" />,
            title: '10. Contact Us',
            content: [
                'If you have any questions about these Terms of Service, please reach out to us.',
                'Email: support@foothub.com',
                'Phone: +855 0987654321',
                'We aim to respond to all inquiries within 48 hours.'
            ]
        }
    ];

    return (
        <div className="space-y-6 text-white">
            {/* Back Arrow & Header */}
            <div>
                <Link
                    to="/help"
                    className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#8b5cf6] transition-colors mb-4"
                >
                    <FaArrowLeft className="text-xs" />
                    Back to Help & Support
                </Link>
                <p className="text-sm font-medium text-[#8b5cf6]">Legal</p>
                <h1 className="mt-1 text-2xl font-bold">Terms of Service</h1>
                <p className="mt-2 max-w-3xl text-sm text-gray-400">
                    Please read these terms carefully before using FootHub. By accessing our platform, you agree to comply with and be bound by the following terms and conditions.
                </p>
                <p className="mt-1 text-xs text-gray-500">Last updated: July 2026</p>
            </div>

            {/* Sections */}
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

            {/* Footer Links */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                <Link to="/privacy" className="rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] p-3 text-center text-xs text-gray-400 transition-colors hover:border-[#8b5cf6]/30 hover:text-white">
                    Privacy Policy
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

export default TermsPage;