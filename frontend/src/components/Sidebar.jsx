import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Heart, Brain, FileText, History } from 'lucide-react';
import { motion } from 'framer-motion';

const Sidebar = () => {
    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/diabetes', label: 'Diabetes', icon: Activity },
        { path: '/heart', label: 'Heart Disease', icon: Heart },
        { path: '/parkinsons', label: "Parkinson's", icon: Brain },
        { path: '/history', label: "History", icon: History },
    ];

    return (
        <aside className="w-72 hidden md:flex flex-col relative z-20">
            <div className="fixed w-72 h-full glass border-r border-white/10 flex flex-col">
                <div className="p-8 pb-4 flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                        <Heart className="w-6 h-6 fill-current" />
                    </div>
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                        MediPredict
                    </span>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            className={({ isActive }) =>
                                `relative flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-200 group ${isActive
                                    ? 'text-white font-medium bg-white/10 shadow-lg border border-white/10'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:text-blue-300'}`} />
                                    <span className="relative z-10">{item.label}</span>
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"
                                            initial={false}
                                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                        />
                                    )}
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-6 border-t border-white/5 mx-4 mb-4">
                    <div className="flex items-center space-x-3 text-xs text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        <span>System Operational v2.1</span>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
