import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, Heart, Brain, History, Menu, X, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { logout } = useAuth();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: LayoutDashboard },
        { path: '/diabetes', label: 'Diabetes', icon: Activity },
        { path: '/heart', label: 'Heart Disease', icon: Heart },
        { path: '/parkinsons', label: "Parkinson's", icon: Brain },
        { path: '/history', label: "History", icon: History },
    ];

    const handleLogout = () => {
        logout();
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            {/* Mobile Menu Button - Fixed top-left */}
            <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 glass rounded-xl border border-white/20 hover:bg-white/10 transition-all active:scale-95"
                aria-label="Open menu"
            >
                <Menu className="w-6 h-6 text-white" />
            </button>

            {/* Mobile Backdrop Overlay */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={closeMobileMenu}
                        className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
                    />
                )}
            </AnimatePresence>

            {/* Mobile Sidebar Drawer */}
            <AnimatePresence>
                {isMobileMenuOpen && (
                    <motion.aside
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                        className="md:hidden fixed left-0 top-0 bottom-0 w-72 glass border-r border-white/10 flex flex-col z-50"
                    >
                        {/* Mobile Header */}
                        <div className="p-6 flex items-center justify-between border-b border-white/10">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-500/30">
                                    <Heart className="w-6 h-6 fill-current" />
                                </div>
                                <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                                    MediPredict
                                </span>
                            </div>
                            <button
                                onClick={closeMobileMenu}
                                className="p-2 hover:bg-white/10 rounded-lg transition-colors active:scale-95"
                                aria-label="Close menu"
                            >
                                <X className="w-6 h-6 text-gray-400" />
                            </button>
                        </div>

                        {/* Mobile Navigation */}
                        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    onClick={closeMobileMenu}
                                    className={({ isActive }) =>
                                        `relative flex items-center space-x-3 px-4 py-4 rounded-xl transition-all duration-200 group min-h-[48px] ${isActive
                                            ? 'text-white font-medium bg-white/10 shadow-lg border border-white/10'
                                            : 'text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10'
                                        }`
                                    }
                                >
                                    {({ isActive }) => (
                                        <>
                                            <item.icon className={`w-6 h-6 transition-transform duration-200 ${isActive ? 'scale-110 text-blue-400' : 'group-hover:text-blue-300'}`} />
                                            <span className="relative z-10 text-base">{item.label}</span>
                                            {isActive && (
                                                <motion.div
                                                    layoutId="activeMobileTab"
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

                        {/* Mobile Logout Button */}
                        <div className="p-4 border-t border-white/10">
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center space-x-2 px-4 py-4 rounded-xl text-red-400 hover:bg-red-500/10 transition-all min-h-[48px] active:scale-95"
                            >
                                <LogOut className="w-5 h-5" />
                                <span>Logout</span>
                            </button>
                        </div>

                        {/* Mobile Footer */}
                        <div className="p-4 border-t border-white/5">
                            <div className="flex items-center space-x-3 text-xs text-gray-500 bg-black/20 p-3 rounded-lg border border-white/5">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                <span>System Operational v2.1</span>
                            </div>
                        </div>
                    </motion.aside>
                )}
            </AnimatePresence>

            {/* Desktop Sidebar - Unchanged */}
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
        </>
    );
};

export default Sidebar;
