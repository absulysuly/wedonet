import type { User, Message, AddReviewData, Freelancer, Project, Proposal, Conversation, ProjectStatus, Notification } from '../types';

// Mock database
const users: User[] = [
    { id: 1, name: 'Client User', email: 'client@test.com', role: 'client', password: 'password123', isVerified: true },
    { id: 2, name: 'Freelancer User', email: 'freelancer@test.com', role: 'freelancer', password: 'password123', isVerified: true },
    { id: 101, name: 'Aisha Al-Jamil', email: 'aisha@test.com', role: 'freelancer', password: 'password123', isVerified: true },
    { id: 102, name: 'Yusuf Ahmed', email: 'yusuf@test.com', role: 'freelancer', password: 'password123', isVerified: true },
    { id: 103, name: 'Layla Ibrahim', email: 'layla@test.com', role: 'freelancer', password: 'password123', isVerified: true },
    { id: 104, name: 'Mustafa Hassan', email: 'mustafa@test.com', role: 'freelancer', password: 'password123', isVerified: true },
    { id: 999, name: 'Admin User', email: 'admin@test.com', role: 'admin', password: 'password123', isVerified: true },
];

let messages: Message[] = [
    { id: 1, senderId: 1, receiverId: 101, timestamp: new Date(Date.now() - 1000 * 60 * 5), content: { type: 'text', value: 'Hello! I saw your profile and I am interested in your services.' } },
    { id: 2, senderId: 101, receiverId: 1, timestamp: new Date(Date.now() - 1000 * 60 * 4), content: { type: 'text', value: 'Hi there! Thanks for reaching out. How can I help you today?' } },
    { id: 3, senderId: 1, receiverId: 102, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24), content: { type: 'text', value: 'Can you help with a branding project?' } },
];

let projects: Project[] = [
    {
        id: 1,
        title: 'project.reactNative.title',
        clientName: 'Client User',
        budget: 2500,
        postedDate: '2 days ago',
        description: 'project.reactNative.description',
        skills: ['React Native', 'Firebase', 'UI/UX Design'],
        status: 'completed',
        freelancerId: 101,
        freelancerName: 'Aisha Al-Jamil',
        proposals: [],
    },
    {
        id: 2,
        title: 'project.rebranding.title',
        clientName: 'Innovate Solutions',
        budget: 1200,
        postedDate: '5 days ago',
        description: 'project.rebranding.description',
        skills: ['Branding', 'Logo Design', 'Adobe Illustrator'],
        status: 'open',
        proposals: [],
    },
     {
        id: 3,
        title: 'project.landingPage.title',
        clientName: 'Client User',
        budget: 800,
        postedDate: '1 week ago',
        description: 'project.landingPage.description',
        skills: ['HTML', 'CSS', 'JavaScript'],
        status: 'in-progress',
        freelancerId: 102,
        freelancerName: 'Yusuf Ahmed',
        proposals: [],
    }
];

let notifications: Notification[] = [
    { id: 1, userId: 1, type: 'proposal', textKey: 'notif.newProposal', textPayload: { freelancerName: 'Layla Ibrahim', projectTitle: 'project.landingPage.title' }, link: 'project-details/3', isRead: false, timestamp: new Date(Date.now() - 1000 * 60 * 10) },
    { id: 2, userId: 1, type: 'message', textKey: 'notif.newMessage', textPayload: { senderName: 'Aisha Al-Jamil' }, link: 'inbox', isRead: false, timestamp: new Date(Date.now() - 1000 * 60 * 60) },
    { id: 3, userId: 102, type: 'project', textKey: 'notif.projectStatusUpdate', textPayload: { projectTitle: 'project.landingPage.title', status: 'In Progress' }, link: 'dashboard', isRead: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 25) },
    { id: 4, userId: 1, type: 'system', textKey: 'notif.systemWelcome', link: 'home', isRead: true, timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48) }
];

let nextUserId = 105;
let nextMessageId = 4;
let nextProjectId = 4;
let nextProposalId = 1;
let nextNotificationId = 5;

export const login = async (email: string, password_unused: string): Promise<{ user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
            if (user) {
                if (!user.isVerified) {
                    reject(new Error('emailNotVerified'));
                    return;
                }
                user.isNew = false;
                resolve({ user });
            } else {
                reject(new Error('Invalid email or password'));
            }
        }, 500);
    });
};

export const register = async (name: string, email: string, password_unused: string): Promise<{ user: User }> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (users.some(u => u.email.toLowerCase() === email.toLowerCase())) {
                reject(new Error('An account with this email already exists.'));
                return;
            }
            const verificationToken = Math.random().toString(36).substring(2);
            const newUser: User = {
                id: nextUserId++,
                name,
                email,
                role: 'client', // Default role, user will select after this
                isNew: true,
                password: 'password123', // Dummy password
                isVerified: false,
                verificationToken: verificationToken,
            };
            users.push(newUser);
            // In a real app, you would send an email. Here we log the link to the console.
            console.log(`
                --- EMAIL VERIFICATION (DEV ONLY) ---
                To: ${email}
                Subject: Verify your email for Wedonet

                Click this link to verify your account:
                ${window.location.origin}${window.location.pathname}?page=verify-email&token=${verificationToken}
                -------------------------------------
            `);
            resolve({ user: newUser });
        }, 500);
    });
};

const socialLogin = async (provider: 'google' | 'facebook'): Promise<{ user: User }> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const email = `${provider}.user@test.com`;
            let user = users.find(u => u.email === email);
            if (!user) {
                user = {
                    id: nextUserId++,
                    name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
                    email,
                    role: 'client', // Default role which will be confirmed by user
                    isNew: true, // Flag for the frontend to show role selection
                    password: 'password123',
                    isVerified: true, // Social logins are considered verified
                };
                users.push(user);
            } else {
                 user.isNew = false;
            }
            resolve({ user });
        }, 500);
    });
};

export const loginWithGoogle = async (): Promise<{ user: User }> => {
    return socialLogin('google');
};

export const loginWithFacebook = async (): Promise<{ user: User }> => {
    return socialLogin('facebook');
};

export const updateUserRole = async (userId: number, role: 'client' | 'freelancer'): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.id === userId);
            if (user) {
                user.role = role;
                console.log(`User ${userId} role updated to ${role}`);
                resolve(user);
            } else {
                reject(new Error('User not found'));
            }
        }, 300);
    });
};

export const verifyEmail = async (token: string): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const user = users.find(u => u.verificationToken === token);
            if (user) {
                user.isVerified = true;
                user.verificationToken = undefined;
                resolve(user);
            } else {
                reject(new Error('Invalid verification token.'));
            }
        }, 500);
    });
};

export const resendVerificationEmail = async (email: string): Promise<void> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const user = users.find(u => u.email === email && !u.isVerified);
            if (user && user.verificationToken) {
                 console.log(`
                    --- RESEND EMAIL VERIFICATION (DEV ONLY) ---
                    To: ${email}
                    Subject: Verify your email for Wedonet

                    Click this link to verify your account:
                    ${window.location.origin}${window.location.pathname}?page=verify-email&token=${user.verificationToken}
                    -------------------------------------
                `);
            }
            resolve();
        }, 500);
    });
};


export const getProjects = async (): Promise<Project[]> => {
    return new Promise((resolve) => {
        setTimeout(() => resolve([...projects]), 300);
    });
};

export const createProject = async (projectData: Omit<Project, 'id' | 'postedDate' | 'clientName' | 'proposals' | 'status'>, clientName: string): Promise<Project> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newProject: Project = {
                ...projectData,
                id: nextProjectId++,
                postedDate: 'Just now',
                clientName: clientName,
                proposals: [],
                status: 'open',
            };
            projects.unshift(newProject); // Add to the beginning of the list
            resolve(newProject);
        }, 500);
    });
};

export const submitProposal = async (projectId: number, proposalData: Omit<Proposal, 'id' | 'timestamp'>): Promise<Proposal> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                if (!project.proposals) {
                    project.proposals = [];
                }
                const newProposal: Proposal = {
                    ...proposalData,
                    id: nextProposalId++,
                    timestamp: new Date(),
                };
                project.proposals.push(newProposal);
                resolve(newProposal);
            } else {
                reject(new Error('Project not found'));
            }
        }, 500);
    });
};


export const deleteProject = async (projectId: number): Promise<void> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const projectIndex = projects.findIndex(p => p.id === projectId);
            if (projectIndex > -1) {
                projects.splice(projectIndex, 1);
                resolve();
            } else {
                reject(new Error('Project not found'));
            }
        }, 400);
    });
};

export const hireFreelancerForProject = async (projectId: number, freelancerId: number, freelancerName: string): Promise<Project> => {
     return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                project.freelancerId = freelancerId;
                project.freelancerName = freelancerName;
                project.status = 'in-progress';
                resolve(project);
            } else {
                reject(new Error('Project not found'));
            }
        }, 400);
    });
};

export const updateProjectStatus = async (projectId: number, status: ProjectStatus): Promise<Project> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const project = projects.find(p => p.id === projectId);
            if (project) {
                project.status = status;
                resolve(project);
            } else {
                reject(new Error('Project not found'));
            }
        }, 300);
    });
};

export const getAllUsers = async (): Promise<User[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([...users]);
        }, 300);
    });
};


export const getChatHistory = async (userId1: number, userId2: number): Promise<Message[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const history = messages.filter(
                msg => (msg.senderId === userId1 && msg.receiverId === userId2) || (msg.senderId === userId2 && msg.receiverId === userId1)
            );
            resolve(history.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()));
        }, 300);
    });
};

export const getConversations = async (userId: number): Promise<Conversation[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userMessages = messages.filter(m => m.senderId === userId || m.receiverId === userId);
            const conversationPartners = new Map<number, Message>();

            userMessages.forEach(message => {
                const partnerId = message.senderId === userId ? message.receiverId : message.senderId;
                const existingLastMessage = conversationPartners.get(partnerId);
                if (!existingLastMessage || message.timestamp > existingLastMessage.timestamp) {
                    conversationPartners.set(partnerId, message);
                }
            });

            const conversations: Conversation[] = Array.from(conversationPartners.entries()).map(([partnerId, lastMessage]) => {
                 const partner = users.find(u => u.id === partnerId);
                 return { partner: partner!, lastMessage };
            }).filter(c => c.partner);

            resolve(conversations.sort((a, b) => b.lastMessage.timestamp.getTime() - a.lastMessage.timestamp.getTime()));
        }, 300);
    });
};

export const sendMessage = async (data: { senderId: number, receiverId: number, content: Message['content'] }): Promise<Message> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newMessage: Message = {
                id: nextMessageId++,
                senderId: data.senderId,
                receiverId: data.receiverId,
                timestamp: new Date(),
                content: data.content,
            };
            messages.push(newMessage);
            
            // Simulate a reply after a short delay
            if (data.content.type === 'text' || data.content.type === 'image') {
                setTimeout(() => {
                    const replyMessage: Message = {
                         id: nextMessageId++,
                         senderId: data.receiverId,
                         receiverId: data.senderId,
                         timestamp: new Date(),
                         content: { type: 'text', value: 'Thanks for your message! I will get back to you shortly.' },
                    };
                    messages.push(replyMessage);
                }, 2500);
            }

            resolve(newMessage);
        }, 200);
    });
};

export const updateFreelancerProfile = async (freelancerId: number, data: Partial<Freelancer>): Promise<User> => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const userToUpdate = users.find(u => u.id === freelancerId);
            if (userToUpdate) {
                if(data.name) userToUpdate.name = data.name;
                console.log(`Updated user profile in mock DB for ID ${freelancerId}`, data);
                resolve(userToUpdate);
            } else {
                 reject(new Error('User not found'));
            }
        }, 500);
    });
};

export const addReview = async (freelancerId: number, reviewData: AddReviewData, authorName: string): Promise<void> => {
     console.log(`Adding review for freelancer ${freelancerId}`, { ...reviewData, author: authorName });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 500);
    });
};

// --- NOTIFICATIONS API ---
export const getNotifications = async (userId: number): Promise<Notification[]> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const userNotifications = notifications
                .filter(n => n.userId === userId)
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
            resolve(userNotifications);
        }, 400);
    });
};

export const markNotificationAsRead = async (notificationId: number): Promise<boolean> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const notification = notifications.find(n => n.id === notificationId);
            if (notification) {
                notification.isRead = true;
                resolve(true);
            }
            resolve(false);
        }, 200);
    });
};

export const markAllNotificationsAsRead = async (userId: number): Promise<boolean> => {
     return new Promise((resolve) => {
        setTimeout(() => {
            notifications.forEach(n => {
                if (n.userId === userId) {
                    n.isRead = true;
                }
            });
            resolve(true);
        }, 300);
    });
};