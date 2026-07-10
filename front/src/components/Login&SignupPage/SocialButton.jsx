import { FaTwitter, FaFacebook, FaTelegram, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';

const SocialButtons = () => {
  const socialLinks = [
    { 
      name: 'X (Twitter)', 
      icon: <FaTwitter />, 
      url: 'https://twitter.com/foothub',
      color: 'hover:text-[#1DA1F2]'
    },
    { 
      name: 'Facebook', 
      icon: <FaFacebook />, 
      url: 'https://facebook.com/foothub',
      color: 'hover:text-[#1877F2]'
    },
    { 
      name: 'Telegram', 
      icon: <FaTelegram />, 
      url: 'https://t.me/foothub',
      color: 'hover:text-[#0088CC]'
    },
    { 
      name: 'Instagram', 
      icon: <FaInstagram />, 
      url: 'https://instagram.com/foothub',
      color: 'hover:text-[#E4405F]'
    },
    { 
      name: 'YouTube', 
      icon: <FaYoutube />, 
      url: 'https://youtube.com/foothub',
      color: 'hover:text-[#FF0000]'
    },
    { 
      name: 'TikTok', 
      icon: <FaTiktok />, 
      url: 'https://tiktok.com/@foothub',
      color: 'hover:text-[#000000]'
    },
  ];

  return (
    <div className="flex items-center gap-3">
      {socialLinks.map((social) => (
        <a key={social.name} href={social.url} target="_blank" rel="noopener noreferrer" className={`w-10 h-10 flex items-center justify-center rounded-full border border-[#2a2a2a] text-gray-400 ${social.color} hover:border-[#8b5cf6] transition-all hover:scale-110 hover:shadow-lg hover:shadow-purple-500/10 text-lg`} aria-label={social.name}>
          {social.icon}
        </a>
      ))}
    </div>
  );
};

export default SocialButtons;