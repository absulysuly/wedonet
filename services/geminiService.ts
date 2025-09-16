import { GoogleGenAI, Type } from "@google/genai";
import { SERVICE_CATEGORIES } from '../constants';
// FIX: Added AnalysisResult to import to support legal document analysis.
import type { AIRecommendation, AIOpportunityScoreData, AIProposalDraft, Freelancer, Project, Proposal, AnalysisResult } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY! });

const serviceCategoryNames = SERVICE_CATEGORIES.map(p => p.name).join(', ');

export const getAIRecommendations = async (projectDescription: string): Promise<AIRecommendation[] | null> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Project Description: "${projectDescription}". Based on this, analyze the request and recommend the top 3 most relevant service categories from the following list: ${serviceCategoryNames}.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              serviceCategory: {
                type: Type.STRING,
                description: 'The recommended freelance service category from the provided list.',
              },
              relevanceScore: {
                type: Type.NUMBER,
                description: 'A score from 1 (low) to 10 (high) indicating how relevant this service category is.',
              },
              reasoning: {
                type: Type.STRING,
                description: 'A brief, one-sentence explanation for why this category is recommended.',
              },
            },
            propertyOrdering: ["serviceCategory", "relevanceScore", "reasoning"],
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const recommendations = JSON.parse(jsonString);
    return recommendations as AIRecommendation[];

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    return null;
  }
};

export const scoreProposal = async (project: Project, freelancer: Freelancer, proposal: Proposal): Promise<AIOpportunityScoreData | null> => {
    try {
        const prompt = `
            As a hiring expert, analyze and score this freelance proposal based on the project requirements and freelancer's profile.
            - Project Title: ${project.title}
            - Project Description: ${project.description}
            - Project Budget: $${project.budget}
            - Required Skills: ${project.skills.join(', ')}

            - Freelancer Name: ${freelancer.name}
            - Freelancer Bio: ${freelancer.bio}
            - Freelancer Skills: ${freelancer.services.join(', ')}
            - Freelancer Rating: ${freelancer.rating}/5 from ${freelancer.reviewCount} reviews
            - Freelancer Experience: ${freelancer.experienceYears} years

            - Proposal Cover Letter: "${proposal.coverLetter}"
            - Proposed Bid: $${proposal.proposedBid}

            Provide a score out of 10 and a brief analysis for each factor: Skill Match, Proposal Relevance, Budget Fit, and Platform History. Finally, give an overall score and a summary.
        `;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        overallScore: { type: Type.NUMBER, description: "A score from 0.0 to 10.0 representing the overall quality of this proposal." },
                        summary: { type: Type.STRING, description: "A one or two-sentence summary explaining the score and recommendation." },
                        scoreBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    factor: { type: Type.STRING, description: "The factor being analyzed (e.g., 'Skill Match', 'Proposal Relevance')." },
                                    score: { type: Type.NUMBER, description: "A score from 1 to 10 for this specific factor." },
                                    reasoning: { type: Type.STRING, description: "A brief explanation for the factor's score." }
                                }
                            }
                        }
                    }
                }
            }
        });

        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error scoring proposal with Gemini API:", error);
        return null;
    }
};

export const generateProposalDraft = async (project: Project, freelancer: Freelancer): Promise<AIProposalDraft | null> => {
    try {
        const prompt = `
            As a career coach for freelancers, create a compelling proposal draft.
            Analyze the project and the freelancer's profile to write a cover letter that highlights the most relevant skills and experience.
            Also, suggest a competitive bid range based on the project's scope.

            - Project Title: ${project.title}
            - Project Description: ${project.description}
            - Project Budget: $${project.budget}
            - Required Skills: ${project.skills.join(', ')}

            - Freelancer Name: ${freelancer.name}
            - Freelancer Bio: ${freelancer.bio}
            - Freelancer Skills: ${freelancer.services.join(', ')}
            - Freelancer Experience: ${freelancer.experienceYears} years

            Generate a response that includes:
            1. A professional, engaging draft cover letter (around 150 words).
            2. A suggested bid range (min and max).
            3. A brief reasoning for your recommendation.
        `;
        
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        draftCoverLetter: { type: Type.STRING, description: "The generated draft of the cover letter." },
                        suggestedBidMin: { type: Type.NUMBER, description: "The suggested minimum bid for the project." },
                        suggestedBidMax: { type: Type.NUMBER, description: "The suggested maximum bid for the project." },
                        reasoning: { type: Type.STRING, description: "A brief explanation for the suggested bid and cover letter approach." }
                    }
                }
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating proposal draft with Gemini API:", error);
        return null;
    }
};

// FIX: Added analyzeLegalDocument function to provide AI-powered legal document analysis.
export const analyzeLegalDocument = async (documentText: string): Promise<AnalysisResult | null> => {
  try {
    const prompt = `Analyze the following legal document. Provide a summary, identify key clauses, and highlight potential risks with suggestions for improvement.
    Document:
    ---
    ${documentText}
    ---
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A brief summary of the legal document's purpose and scope." },
            keyClauses: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING, description: "The title or subject of the key clause (e.g., 'Confidentiality', 'Term and Termination')." },
                  explanation: { type: Type.STRING, description: "A simple explanation of what this clause means for the user." }
                },
              }
            },
            potentialRisks: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  risk: { type: Type.STRING, description: "A potential risk or ambiguous term found in the document." },
                  suggestion: { type: Type.STRING, description: "A suggestion to mitigate the risk or clarify the language." }
                },
              }
            }
          },
        }
      }
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as AnalysisResult;

  } catch (error) {
    console.error("Error analyzing legal document with Gemini API:", error);
    return null;
  }
};

// FIX: Added generateLegalAgreement function to provide AI-powered legal agreement generation.
export const generateLegalAgreement = async (agreementDesc: string, agreementType: string): Promise<string | null> => {
  try {
    const prompt = `Generate a standard legal agreement based on the following details. The agreement should be clear, professional, and follow standard legal conventions.

    - Type of Agreement: ${agreementType}
    - Key Details & Purpose: ${agreementDesc}

    Generate the full text of the agreement.
    `;
    
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });
    
    return response.text.trim();

  } catch (error) {
    console.error("Error generating legal agreement with Gemini API:", error);
    return null;
  }
};

// FIX: Added generateLegalPlaybook function to provide AI-powered legal playbooks for common business scenarios.
export const generateLegalPlaybook = async (playbookId: string, step: 'summary' | 'checklist'): Promise<any | null> => {
    try {
        let prompt = '';
        let responseSchema: any;

        if (playbookId === 'first-hire' && step === 'summary') {
            prompt = `As a legal expert for startups, provide a summary playbook for hiring the first employee in Iraq. Focus on key legal and administrative considerations.`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of this playbook step, e.g., 'Summary: Hiring Your First Employee'." },
                    introduction: { type: Type.STRING, description: "A brief introduction to the importance of this process." },
                    considerations: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                point: { type: Type.STRING, description: "The key consideration (e.g., 'Employment Contracts')." },
                                explanation: { type: Type.STRING, description: "A brief explanation of why this point is important." }
                            },
                        }
                    }
                },
            };
        } else if (playbookId === 'first-hire' && step === 'checklist') {
            prompt = `As a legal expert for startups, create a detailed checklist of actions required when hiring the first employee in Iraq.`;
            responseSchema = {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING, description: "The title of this playbook step, e.g., 'Checklist: First Employee Onboarding'." },
                    checklist: {
                        type: Type.ARRAY,
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                step: { type: Type.STRING, description: "A single, actionable checklist item." }
                            },
                        }
                    }
                },
            };
        } else {
            console.error(`Playbook not implemented for id: ${playbookId}, step: ${step}`);
            return null;
        }

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema,
            }
        });
        
        const jsonString = response.text.trim();
        return JSON.parse(jsonString);

    } catch (error) {
        console.error("Error generating legal playbook with Gemini API:", error);
        return null;
    }
};