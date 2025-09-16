import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { FreelancerDirectoryPage } from './components/FreelancerDirectoryPage';
import { CommunityEventsPage } from './components/CommunityEventsPage';
import { DashboardPage } from './components/DashboardPage';
import { FreelancerProfilePage } from './components/FreelancerProfilePage';
import { ChatPage } from './components/ChatPage';
import { useAuth } from './contexts/AuthContext';
import { SERVICE_CATEGORIES } from './constants';
import type { Freelancer, CommunityEvent, Project, Proposal, ProjectStatus, Notification } from './types';
import { ServiceCategoryCard } from './components/PracticeAreaCard';
import { useLocale } from './contexts/LocaleContext';
import { ProjectListingsPage } from './components/ProjectListingsPage';
import { AboutPage } from './components/AboutPage';
import { ContactPage } from './components/ContactPage';
import { SettingsPage } from './components/SettingsPage';
import { AdminDashboardPage } from './components/AdminDashboardPage';
import { RoleSelectionModal } from './components/RoleSelectionModal';
import { PostProjectPage } from './components/PostProjectPage';
import { getProjects, deleteProject as apiDeleteProject, hireFreelancerForProject as apiHireFreelancer, submitProposal as apiSubmitProposal, updateProjectStatus as apiUpdateProjectStatus, getNotifications, markNotificationAsRead } from './services/api';
import { BlogPage, HowItWorksPage, PricingPage, PrivacyPolicyPage, TermsOfServicePage } from './components/PlaceholderPages';
import { UserManagementPage } from './components/UserManagementPage';
import { HireModal } from './components/HireModal';
import { ProjectDetailsPage } from './components/ProjectDetailsPage';
import { ManageProjectPage } from './components/ManageProjectPage';
import { InboxPage } from './components/InboxPage';
import { AiMatcher } from './components/AiMatcher';
import { FreelancerCard } from './components/FreelancerCard';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { NotificationsPage } from './components/NotificationsPage';
import { LegalHubPage } from './components/LegalHubPage';
import { LegalAssistantPage } from './components/LegalAssistantPage';
import { LegalPlaybookPage } from './components/LegalPlaybookPage';
import { LoginPage } from './components/LoginPage';
import { SignupPage } from './components/SignupPage';
import { CheckEmailPage } from './components/CheckEmailPage';
import { VerifyEmailPage } from './components/VerifyEmailPage';


// MOCK DATA
export const MOCK_FREELANCERS: Freelancer[] = [
  {
    id: 101,
    name: 'Aisha Al-Jamil',
    avatarUrl: 'https://i.pravatar.cc/150?img=1',
    services: ['Web Development', 'UI/UX Design'],
    category: 'Web Development',
    rating: 4.9,
    reviewCount: 124,
    location: 'Baghdad',
    experienceYears: 8,
    isVerified: true,
    bio: 'freelancer.aisha.bio',
    reviews: [
        { id: 1, author: 'Ahmed K.', rating: 5, comment: 'freelancer.aisha.review1.comment' },
        { id: 2, author: 'Fatima H.', rating: 5, comment: 'freelancer.aisha.review2.comment' }
    ]
  },
  {
    id: 102,
    name: 'Yusuf Ahmed',
    avatarUrl: 'https://i.pravatar.cc/150?img=2',
    services: ['Graphic Design', 'Logo Design', 'Branding'],
    category: 'Graphic Design',
    rating: 4.8,
    reviewCount: 88,
    location: 'Erbil',
    experienceYears: 6,
    isVerified: true,
    bio: 'freelancer.yusuf.bio',
    reviews: [
        { id: 3, author: 'Omar S.', rating: 5, comment: 'freelancer.yusuf.review1.comment' },
    ]
  },
  {
    id: 103,
    name: 'Layla Ibrahim',
    avatarUrl: 'https://i.pravatar.cc/150?img=3',
    services: ['Content Writing', 'SEO', 'Translation'],
    category: 'Writing & Translation',
    rating: 4.7,
    reviewCount: 210,
    location: 'Basra',
    experienceYears: 10,
    isVerified: false,
    bio: 'freelancer.layla.bio',
    reviews: [
         { id: 4, author: 'Dana R.', rating: 4, comment: 'freelancer.layla.review1.comment' },
         { id: 5, author: 'Hassan M.', rating: 5, comment: 'freelancer.layla.review2.comment' },
    ]
  },
  {
    id: 104,
    name: 'Mustafa Hassan',
    avatarUrl: 'https://i.pravatar.cc/150?img=4',
    services: ['Digital Marketing', 'Social Media Management'],
    category: 'Digital Marketing',
    rating: 3.9,
    reviewCount: 45,
    location: 'Baghdad',
    experienceYears: 4,
    isVerified: true,
    bio: 'freelancer.mustafa.bio',
    reviews: [
        { id: 6, author: 'Nadia A.', rating: 3, comment: 'freelancer.mustafa.review1.comment' },
    ]
  }
];

const MOCK_EVENTS: CommunityEvent[] = [
    {
        id: 1,
        title: 'event.baghdadTech.title',
        description: 'event.baghdadTech.description',
        date: 'October 28, 2024',
        location: 'The Station, Baghdad',
        imageUrl: 'https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2070&auto=format&fit=crop',
    },
    {
        id: 2,
        title: 'event.erbilWorkshop.title',
        description: 'event.erbilWorkshop.description',
        date: 'November 5, 2024',
        location: 'Divan Hotel, Erbil',
        imageUrl: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=2232&auto=format&fit=crop',
    }
];

const HomePage: React.FC<{ onNavigate: (page: string) => void, onStartChat: (freelancer: Freelancer) => void, onViewProfile: (freelancer: Freelancer) => void }> = ({ onNavigate, onStartChat, onViewProfile }) => {
    const { t } = useLocale();
    const aiMatcherRef = React.useRef<HTMLDivElement>(null);

    const scrollToMatcher = () => {
        aiMatcherRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <>
            {/* Hero Section */}
            <section className="bg-gray-800 text-white text-center py-20" style={{backgroundImage: 'url(https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=2070&auto=format&fit=crop)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundBlendMode: 'overlay', backgroundColor: 'rgba(0,0,0,0.6)'}}>
                <div className="container mx-auto px-6">
                    <h1 className="text-4xl md:text-5xl font-bold">{t('heroTitle')}</h1>
                    <p className="mt-4 text-lg text-gray-300 max-w-2xl mx-auto">{t('heroSubtitle')}</p>
                    <div className="mt-8 flex justify-center">
                        <LanguageSwitcher />
                    </div>
                    <button onClick={scrollToMatcher} className="mt-6 bg-amber-600 hover:bg-amber-700 text-white font-bold py-3 px-8 rounded-lg transition-colors">
                        {t('getStarted')}
                    </button>
                </div>
            </section>

             {/* AI Matcher Section */}
            <section ref={aiMatcherRef} className="py-16 bg-gray-100">
                <div className="container mx-auto px-6">
                     <h2 className="text-3xl font-bold text-center text-gray-800 mb-4">{t('tellUsAboutProject')}</h2>
                    <AiMatcher />
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 bg-white">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800 mb-12">{t('exploreCategories')}</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {SERVICE_CATEGORIES.map(category => {
                            const isLegal = category.name === 'Legal Services';
                            return (
                                <div key={category.id} onClick={isLegal ? () => onNavigate('legal-hub') : undefined} className={isLegal ? 'cursor-pointer' : ''}>
                                    <ServiceCategoryCard category={category} />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

             {/* Featured Freelancers Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-6">
                    <h2 className="text-3xl font-bold text-center text-gray-800">{t('featuredFreelancers')}</h2>
                    <p className="text-center text-gray-600 mt-2 mb-12">{t('featuredFreelancersSubtitle')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {MOCK_FREELANCERS.slice(0, 4).map(freelancer => (
                           <FreelancerCard 
                                key={freelancer.id} 
                                freelancer={freelancer}
                                onStartChat={onStartChat}
                                onViewProfile={onViewProfile}
                           />
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
};

const App: React.FC = () => {
    const [currentPage, setCurrentPage] = useState('home');
    const [pagePayload, setPagePayload] = useState<any>(null);
    const [selectedFreelancer, setSelectedFreelancer] = useState<Freelancer | null>(null);
    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [managedProject, setManagedProject] = useState<Project | null>(null);
    const [chattingWith, setChattingWith] = useState<Freelancer | null>(null);
    const { user, updateUser, isRoleSelectionNeeded, isLoading, isAuthenticated } = useAuth();
    const { t } = useLocale();
    
    const [freelancers, setFreelancers] = useState(MOCK_FREELANCERS);
    const [projects, setProjects] = useState<Project[]>([]);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isHireModalOpen, setIsHireModalOpen] = useState(false);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const page = params.get('page');
        const token = params.get('token');

        if (page === 'verify-email' && token) {
            setCurrentPage('verify-email');
            setPagePayload({ token });
        }
    }, []);

    useEffect(() => {
        const fetchProjects = async () => {
            const fetchedProjects = await getProjects();
            setProjects(fetchedProjects);
        };
        fetchProjects();
    }, []);
    
    useEffect(() => {
        if (user) {
            const fetchNotifications = async () => {
                const fetchedNotifications = await getNotifications(user.id);
                setNotifications(fetchedNotifications);
            };
            fetchNotifications();
        } else {
            setNotifications([]);
        }
    }, [user]);

    const handleProfileUpdate = (updatedFreelancer: Freelancer) => {
        setFreelancers(prev => prev.map(f => f.id === updatedFreelancer.id ? updatedFreelancer : f));
        if (selectedFreelancer?.id === updatedFreelancer.id) {
            setSelectedFreelancer(updatedFreelancer);
        }
        if (user && user.id === updatedFreelancer.id) {
            updateUser({ name: updatedFreelancer.name });
        }
    };
    
    const handleProjectCreated = (newProject: Project) => {
        setProjects(prev => [newProject, ...prev]);
        navigate('dashboard');
    };

    const handleProjectDeleted = async (projectId: number) => {
        try {
            await apiDeleteProject(projectId);
            setProjects(prev => prev.filter(p => p.id !== projectId));
        } catch (error) {
            console.error("Failed to delete project:", error);
            alert(t('deleteError'));
        }
    };

    const handleUpdateProjectStatus = async (projectId: number, status: ProjectStatus) => {
        try {
            const updatedProject = await apiUpdateProjectStatus(projectId, status);
            const updateProjectState = (p: Project) => p.id === projectId ? updatedProject : p;
            setProjects(prev => prev.map(updateProjectState));
            if (managedProject?.id === projectId) {
                setManagedProject(updatedProject);
            }
        } catch (error) {
            console.error("Failed to update project status:", error);
            alert(t('errorUnexpected'));
        }
    };

    const handleAcceptProposal = async (projectId: number, proposal: Proposal) => {
        const freelancerToHire = freelancers.find(f => f.id === proposal.freelancerId);
        if (!freelancerToHire) {
             alert(t('hireError'));
             return;
        }
        await handleHireFreelancer(projectId, freelancerToHire);
    };

    const handleSubmitProposal = async (projectId: number, proposalData: Omit<Proposal, 'id' | 'timestamp'>) => {
        try {
            const newProposal = await apiSubmitProposal(projectId, proposalData);
            setProjects(prevProjects => prevProjects.map(p => {
                if (p.id === projectId) {
                    return { ...p, proposals: [...(p.proposals || []), newProposal] };
                }
                return p;
            }));
            // Also update the selected project state if it's being viewed
            if (selectedProject?.id === projectId) {
                setSelectedProject(prev => prev ? ({...prev, proposals: [...(prev.proposals || []), newProposal]}) : null);
            }
            alert(t('proposalSuccess'));
        } catch (error) {
             console.error("Failed to submit proposal:", error);
            alert(t('proposalError'));
        }
    };

    const handleHireFreelancer = async (projectId: number, freelancer: Freelancer) => {
        try {
            const updatedProject = await apiHireFreelancer(projectId, freelancer.id, freelancer.name);
            setProjects(prev => prev.map(p => p.id === projectId ? updatedProject : p));
            setIsHireModalOpen(false);
            alert(t('hireSuccess', { freelancerName: freelancer.name, projectTitle: t(updatedProject.title) }));
        } catch (error) {
            console.error("Failed to hire freelancer:", error);
            alert(t('hireError'));
        }
    };

    const handleNotificationRead = async (notificationId: number) => {
        await markNotificationAsRead(notificationId);
        setNotifications(prev => prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n));
    };
    
    const currentUserProfile = freelancers.find(f => f.id === user?.id);

    const navigate = (page: string, payload?: any) => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
        setPagePayload(payload);
    };
    
    useEffect(() => {
        if (currentPage === 'project-details' && pagePayload?.id) {
            const project = projects.find(p => p.id === pagePayload.id);
            if (project) setSelectedProject(project);
            else navigate('projects');
        }
    }, [currentPage, pagePayload, projects]);

    const viewProfile = (freelancer: Freelancer) => {
        setSelectedFreelancer(freelancer);
        navigate('profile');
    };

    const viewProjectDetails = (project: Project) => {
        setSelectedProject(project);
        navigate('project-details');
    };

    const manageProject = (project: Project) => {
        setManagedProject(project);
        navigate('manage-project');
    };

    const startChat = (freelancer: Freelancer) => {
        if (user) {
            setChattingWith(freelancer);
            navigate('chat');
        } else {
            navigate('login');
        }
    };

    const renderPage = () => {
        if (chattingWith && currentPage === 'chat' && user) {
            const partner = freelancers.find(f => f.id === chattingWith.id);
            if (!partner) { navigate('inbox'); return null; }
            return <ChatPage freelancer={partner} currentUser={user} onBack={() => { setChattingWith(null); navigate('inbox'); }} />;
        }
        if (selectedFreelancer && currentPage === 'profile') {
            const clientProjects = user?.role === 'client' ? projects.filter(p => p.clientName === user.name && !p.freelancerId) : [];
            return <FreelancerProfilePage 
                        freelancer={selectedFreelancer} 
                        onBack={() => { setSelectedFreelancer(null); navigate('directory'); }} 
                        onStartChat={startChat} 
                        onProfileUpdate={handleProfileUpdate}
                        onHire={() => setIsHireModalOpen(true)}
                        clientProjects={clientProjects}
                    />;
        }
        if (selectedProject && currentPage === 'project-details') {
            return <ProjectDetailsPage
                        project={selectedProject}
                        onBack={() => { setSelectedProject(null); navigate('projects'); }}
                        onSubmitProposal={handleSubmitProposal}
                        onAcceptProposal={handleAcceptProposal}
                        currentUserProfile={currentUserProfile}
                   />
        }
        if (managedProject && currentPage === 'manage-project' && user?.role === 'client') {
             const hiredFreelancer = freelancers.find(f => f.id === managedProject.freelancerId);
             if (!hiredFreelancer) { navigate('dashboard'); return null; }
             return <ManageProjectPage
                        project={managedProject}
                        freelancer={hiredFreelancer}
                        onBack={() => { setManagedProject(null); navigate('dashboard'); }}
                        onUpdateStatus={handleUpdateProjectStatus}
                        onContact={() => startChat(hiredFreelancer)}
                    />
        }
        switch (currentPage) {
            case 'login':
                return <LoginPage onNavigate={navigate} />;
            case 'signup':
                return <SignupPage onNavigate={navigate} />;
            case 'check-email':
                return <CheckEmailPage email={pagePayload?.email} onNavigate={navigate} />;
            case 'verify-email':
                return <VerifyEmailPage token={pagePayload?.token} onNavigate={navigate} />;
            case 'directory':
                return <FreelancerDirectoryPage freelancers={freelancers} serviceCategories={SERVICE_CATEGORIES} onViewProfile={viewProfile} onStartChat={startChat} />;
            case 'projects':
                return <ProjectListingsPage projects={projects} onViewDetails={viewProjectDetails} />;
            case 'post-project':
                 return <PostProjectPage onProjectCreated={handleProjectCreated} onBack={() => navigate('dashboard')} />;
            case 'events':
                return <CommunityEventsPage events={MOCK_EVENTS} />;
            case 'inbox':
                return <InboxPage onStartChat={(partnerId) => {
                    const partner = freelancers.find(f => f.id === partnerId);
                    if (partner) startChat(partner);
                }} />;
            case 'dashboard':
                return <DashboardPage 
                            freelancerProfile={currentUserProfile} 
                            projects={projects}
                            freelancers={freelancers}
                            onProfileUpdate={handleProfileUpdate} 
                            onNavigate={navigate}
                            onStartChat={startChat}
                            onProjectDeleted={handleProjectDeleted}
                            onAcceptProposal={handleAcceptProposal}
                            onManageProject={manageProject}
                        />;
            case 'notifications':
                return <NotificationsPage notifications={notifications} onNavigate={navigate} onNotificationRead={handleNotificationRead} />;
            case 'about':
                return <AboutPage />;
            case 'contact':
                return <ContactPage />;
            case 'settings':
                return <SettingsPage />;
            case 'admin':
                return <AdminDashboardPage onNavigate={navigate} />;
            case 'user-management':
                return <UserManagementPage onBack={() => navigate('admin')} />;
            case 'how-it-works':
                return <HowItWorksPage />;
            case 'pricing':
                return <PricingPage />;
            case 'blog':
                return <BlogPage />;
            case 'privacy-policy':
                return <PrivacyPolicyPage />;
            case 'terms-of-service':
                return <TermsOfServicePage />;
            case 'legal-hub':
                return <LegalHubPage onNavigate={navigate} />;
            case 'legal-assistant':
                return <LegalAssistantPage />;
            case 'legal-playbooks':
                return <LegalPlaybookPage onNavigate={navigate} />;
            case 'home':
            default:
                return <HomePage onNavigate={navigate} onStartChat={startChat} onViewProfile={viewProfile} />;
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col min-h-screen bg-gray-50">
            {isRoleSelectionNeeded && <RoleSelectionModal />}
            {isHireModalOpen && selectedFreelancer && (
                <HireModal 
                    freelancer={selectedFreelancer}
                    projects={projects.filter(p => p.clientName === user?.name && !p.freelancerId)}
                    onClose={() => setIsHireModalOpen(false)}
                    onHire={handleHireFreelancer}
                />
            )}
            <Header onNavigate={navigate} notifications={notifications} onNotificationRead={handleNotificationRead} />
            <main className="flex-grow">
                {renderPage()}
            </main>
            <Footer onNavigate={navigate} />
        </div>
    );
};

export default App;