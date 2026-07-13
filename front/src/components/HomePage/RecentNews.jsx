import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaChevronRight, FaNewspaper } from 'react-icons/fa';
import { getNewsArticles } from '../../api/football/NewsApi';

const formatDate = (value) => {
    if(!value){
        return 'No date';
    }

    return new Date(value).toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
    });
};

const RecentNews = () => {
    const [articles, setArticles] = useState([]);
    const [message, setMessage] = useState('Loading news...');

    useEffect(() => {
        const loadNews = async () => {
            const result = await getNewsArticles({
                limit: 4,
            });

            if(result.ok){
                setArticles(result.data?.articles || []);
                setMessage(result.data?.message || 'News loaded successfully');
            }else{
                setArticles([]);
                setMessage(result.data?.message || result.data?.error || 'Failed to load news');
            }
        };

        const timer = setTimeout(() => {
            loadNews();
        }, 0);

        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] p-4 transition-all duration-300 hover:border-[#8b5cf6]/20">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-semibold">
                    <FaNewspaper className="text-[#8b5cf6]" />
                    Football News
                </h3>
                <Link to="/news" className="flex items-center gap-1 text-xs text-[#8b5cf6] transition-colors hover:text-[#a78bfa]">
                    Open
                    <FaChevronRight className="text-[8px]" />
                </Link>
            </div>

            {articles.length === 0 ? (
                <div className="rounded-lg border border-dashed border-[#2a2a2a] p-4 text-center">
                    <p className="text-sm font-medium text-white">No News Added Yet</p>
                    <p className="mt-2 text-xs text-gray-500">{message}</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {articles.map((article) => (
                        <a
                            key={article.id}
                            href={article.url}
                            target="_blank"
                            rel="noreferrer"
                            className="block rounded-lg border border-[#2a2a2a] bg-[#111111] p-3 transition hover:border-[#8b5cf6]/50"
                        >
                            <div className="flex gap-3">
                                {article.image ? (
                                    <img
                                        src={article.image}
                                        alt={article.title}
                                        className="h-14 w-16 shrink-0 rounded-md object-cover"
                                        loading="lazy"
                                    />
                                ) : (
                                    <div className="flex h-14 w-16 shrink-0 items-center justify-center rounded-md bg-[#8b5cf6]/15 text-[#a78bfa]">
                                        <FaNewspaper />
                                    </div>
                                )}
                                <div className="min-w-0">
                                    <p className="line-clamp-2 text-sm font-medium text-white">{article.title}</p>
                                    <p className="mt-1 text-[11px] text-gray-500">
                                        {article.source_name || 'Football News'} - {formatDate(article.published_at)}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}
        </div>
    );
};

export default RecentNews;
