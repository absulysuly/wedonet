import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Freelancer, User, Message } from '../types';
import { getChatHistory, sendMessage as apiSendMessage } from '../services/api';
import { useLocale } from '../contexts/LocaleContext';

const BackIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
);
const SendIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>
);
const PaperclipIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
);
const CameraIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
);

interface ChatPageProps {
    freelancer: Freelancer;
    currentUser: User;
    onBack: () => void;
}

export const ChatPage: React.FC<ChatPageProps> = ({ freelancer, currentUser, onBack }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const { t } = useLocale();
    
    const [isCameraOpen, setIsCameraOpen] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        let isMounted = true;
        const fetchMessages = async () => {
            if (!isMounted) return;
            const history = await getChatHistory(currentUser.id, freelancer.id);
            if (isMounted) {
                setMessages(history);
                if (isLoading) setIsLoading(false);
            }
        };

        fetchMessages(); // Initial fetch

        const intervalId = setInterval(fetchMessages, 3000); // Poll for new messages

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, [currentUser.id, freelancer.id, isLoading]);
    
    const streamRef = useRef<MediaStream | null>(null);

    const openCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setIsCameraOpen(true);
        } catch (error) {
            console.error("Error accessing camera:", error);
            alert(t('cameraError'));
        }
    };

    const closeCamera = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
        setIsCameraOpen(false);
        setCapturedImage(null);
    }, []);

    useEffect(() => {
        return () => closeCamera();
    }, [closeCamera]);


    const handleCapture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            const context = canvas.getContext('2d');
            context?.drawImage(video, 0, 0, canvas.width, canvas.height);
            const dataUrl = canvas.toDataURL('image/jpeg');
            setCapturedImage(dataUrl);
            closeCamera();
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setCapturedImage(e.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };
    
    const performSend = async (content: Message['content']) => {
        setIsSending(true);
        setNewMessage('');
        setCapturedImage(null);

        // Optimistic UI update
        const optimisticMessage: Message = {
            id: Date.now(),
            senderId: currentUser.id,
            receiverId: freelancer.id,
            timestamp: new Date(),
            content: content
        };
        setMessages(prev => [...prev, optimisticMessage]);
        
        try {
            await apiSendMessage({ senderId: currentUser.id, receiverId: freelancer.id, content });
            // Message sent successfully, polling will update with real data
        } catch (error) {
            console.error("Failed to send message:", error);
            // Revert optimistic update on failure
            setMessages(prev => prev.filter(m => m.id !== optimisticMessage.id));
        } finally {
            setIsSending(false);
        }
    };

    const handleSend = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (isSending) return;
        
        if (capturedImage) {
            performSend({ type: 'image', value: capturedImage });
        } else if (newMessage.trim()) {
            performSend({ type: 'text', value: newMessage.trim() });
        }
    };

    const renderMessageContent = (message: Message) => {
        if (message.content.type === 'text') {
            return <p className="break-words">{message.content.value}</p>;
        }
        if (message.content.type === 'image') {
            return <img src={message.content.value} alt="shared content" className="rounded-lg w-full cursor-pointer" onClick={() => window.open(message.content.value, '_blank')} />;
        }
        return null;
    };
    
    return (
        <div className="container mx-auto max-w-3xl h-[calc(100vh-150px)] flex flex-col bg-white shadow-lg rounded-lg my-8">
            {isCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center">
                    <video ref={videoRef} autoPlay className="w-full max-w-lg rounded-lg"></video>
                    <canvas ref={canvasRef} className="hidden"></canvas>
                    <div className="mt-4 flex space-x-4 rtl:space-x-reverse">
                        <button onClick={handleCapture} className="bg-amber-600 text-white px-6 py-2 rounded-lg">{t('capture')}</button>
                        <button onClick={closeCamera} className="bg-gray-500 text-white px-6 py-2 rounded-lg">{t('cancel')}</button>
                    </div>
                </div>
            )}
             {capturedImage && !isCameraOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex flex-col items-center justify-center p-4">
                    <h3 className="text-white text-lg mb-4">{t('imagePreview')}</h3>
                    <img src={capturedImage} alt="preview" className="max-w-lg max-h-[60vh] rounded-lg object-contain"/>
                    <div className="mt-4 flex space-x-4 rtl:space-x-reverse">
                        <button onClick={() => handleSend()} disabled={isSending} className="bg-amber-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400">{isSending ? t('sending') : t('sendImage')}</button>
                        <button onClick={() => setCapturedImage(null)} className="bg-gray-500 text-white px-6 py-2 rounded-lg">{t('cancel')}</button>
                    </div>
                </div>
            )}

            <header className="flex items-center p-4 border-b border-gray-200">
                <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100"><BackIcon /></button>
                <img src={freelancer.avatarUrl} alt={freelancer.name} className="h-10 w-10 rounded-full object-cover mx-4" />
                <div>
                    <h2 className="font-bold text-lg">{freelancer.name}</h2>
                    <p className="text-sm text-gray-500">{t('online')}</p>
                </div>
            </header>
            
            <main className="flex-1 p-6 overflow-y-auto bg-gray-50">
                {isLoading ? (
                    <p className="text-center text-gray-500">{t('loadingMessages')}</p>
                ) : messages.length > 0 ? (
                    <div className="space-y-4">
                        {messages.map(msg => {
                            const isSent = msg.senderId === currentUser.id;
                            return (
                                <div key={msg.id} className={`flex flex-col ${isSent ? 'items-end' : 'items-start'}`}>
                                    <div 
                                        className={`px-4 py-3 rounded-2xl max-w-[75%] shadow-sm ${
                                            isSent 
                                            ? 'bg-amber-600 text-white rounded-br-none' 
                                            : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
                                        }`}
                                    >
                                        {renderMessageContent(msg)}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-1 px-2">
                                        {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>
                ) : (
                     <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <p className="font-semibold">No messages yet.</p>
                        <p className="text-sm">Start the conversation!</p>
                    </div>
                )}
            </main>

            <footer className="p-4 border-t border-gray-200 bg-white">
                <form onSubmit={handleSend} className="flex items-center space-x-2 rtl:space-x-reverse">
                    <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                    <button type="button" onClick={() => fileInputRef.current?.click()} className="p-2 text-gray-500 hover:text-amber-600 rounded-full hover:bg-gray-100"><PaperclipIcon/></button>
                    <button type="button" onClick={openCamera} className="p-2 text-gray-500 hover:text-amber-600 rounded-full hover:bg-gray-100"><CameraIcon/></button>
                    <input 
                        type="text" 
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder={t('typeAMessage')}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                    />
                    <button type="submit" disabled={isSending || (!newMessage.trim() && !capturedImage)} className="p-2 text-white bg-amber-600 rounded-full hover:bg-amber-700 disabled:bg-gray-400"><SendIcon/></button>
                </form>
            </footer>
        </div>
    );
};