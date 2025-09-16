import React from 'react';

export interface Review {
    id: number;
    author: string;
    rating: number;
    comment: string;
}

export interface Proposal {
    id: number;
    freelancerId: number;
    freelancerName: string;
    freelancerAvatarUrl: string;
    coverLetter: string;
    proposedBid: number;
    timestamp: Date;
}

export interface Freelancer {
    id: number;
    name: string;
    avatarUrl: string;
    services: string[];
    category: string;
    rating: number;
    reviewCount: number;
    location: string;
    experienceYears: number;
    isVerified: boolean;
    bio: string;
    reviews: Review[];
}

export interface ServiceCategory {
    id: number;
    name: string;
    icon: React.ReactNode;
}

export interface AIRecommendation {
    serviceCategory: string;
    relevanceScore: number;
    reasoning: string;
}

export interface AIOpportunityScoreData {
    overallScore: number;
    summary: string;
    scoreBreakdown: {
        factor: string;
        score: number;
        reasoning: string;
    }[];
}

export interface AIProposalDraft {
    draftCoverLetter: string;
    suggestedBidMin: number;
    suggestedBidMax: number;
    reasoning: string;
}

// FIX: Added AnalysisResult interface for legal document analysis.
export interface AnalysisResult {
    summary: string;
    keyClauses: { title: string; explanation: string }[];
    potentialRisks: { risk: string; suggestion: string }[];
}

export interface User {
    id: number;
    name: string;
    email: string;
    role: 'client' | 'freelancer' | 'admin';
    isNew?: boolean;
    password?: string;
    isVerified?: boolean;
    verificationToken?: string;
}

export interface Message {
    id: number;
    senderId: number;
    receiverId: number;
    timestamp: Date;
    content: {
        type: 'text' | 'image';
        value: string;
    };
}

export interface CommunityEvent {
    id: number;
    title: string;
    description: string;
    date: string;
    location: string;
    imageUrl: string;
}

export interface AddReviewData {
    rating: number;
    comment: string;
}

export type ProjectStatus = 'open' | 'in-progress' | 'review' | 'completed';

export interface Project {
    id: number;
    title: string;
    clientName: string;
    budget: number;
    postedDate: string;
    description: string;
    skills: string[];
    status: ProjectStatus;
    freelancerId?: number;
    freelancerName?: string;
    proposals?: Proposal[];
}

export interface Conversation {
    partner: User | Freelancer;
    lastMessage: Message;
}

export interface Notification {
  id: number;
  userId: number;
  type: 'proposal' | 'message' | 'project' | 'system';
  textKey: string;
  textPayload?: Record<string, string | number>;
  link: string;
  isRead: boolean;
  timestamp: Date;
}