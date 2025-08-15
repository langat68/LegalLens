import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, Loader2, CheckCircle, AlertCircle, ArrowUp, Shield, Zap, MessageCircle, Scale, BookOpen, Eye } from 'lucide-react';
import "../components/Hero.scss";

interface AnalysisResult {
    summary: string;
    key_points: string[];
    references: string[];
}

const HeroSection: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const resultsRef = useRef<HTMLDivElement>(null);

    const [isLoading, setIsLoading] = useState(false);
    const [results, setResults] = useState<AnalysisResult | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [uploadedFileName, setUploadedFileName] = useState<string>('');

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        setIsLoading(true);
        setError(null);
        setResults(null);
        setUploadedFileName(file.name);

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("http://localhost:7071/api/analyze", {
                method: "POST",
                body: formData
            });

            if (!res.ok) {
                throw new Error(`Upload failed: ${res.status}`);
            }

            const data = await res.json();
            console.log("Analysis result:", data);
            setResults(data);

            setTimeout(() => {
                resultsRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 300);

        } catch (err) {
            console.error("Error uploading file:", err);
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const resetUpload = () => {
        setResults(null);
        setError(null);
        setUploadedFileName('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Show results page if we have results or error
    if (results || error) {
        return (
            <div className="min-h-screen gradient-hero py-12 px-6 sm:px-8 flex items-center justify-center">
                {/* Enhanced AI background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold rounded-full animate-glow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse-gentle"></div>
                    <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-gold rounded-full animate-glow" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/6 w-20 h-20 bg-gold/30 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
                </div>

                {/* Legal document icons floating */}
                <div className="absolute inset-0 opacity-5">
                    <Scale className="absolute top-1/5 right-1/5 w-8 h-8 text-white animate-float" />
                    <FileText className="absolute bottom-1/3 left-1/5 w-6 h-6 text-gold animate-float-delayed" />
                    <BookOpen className="absolute top-2/3 right-1/3 w-7 h-7 text-white animate-float" style={{ animationDelay: '1.5s' }} />
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    {/* Header with enhanced branding */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-4 mb-6">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-br from-gold to-yellow-400 rounded-2xl flex items-center justify-center shadow-xl">
                                    <Eye className="w-6 h-6 text-primary" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white animate-pulse"></div>
                            </div>
                            <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-gold/90 bg-clip-text">
                                LegalLens
                            </h1>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {error ? (
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            ) : (
                                <CheckCircle className="w-8 h-8 text-emerald-400 animate-pulse" />
                            )}
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                {error ? 'Oops! Something went wrong' : '✨ Analysis Complete!'}
                            </h2>
                        </div>
                        <div className="w-24 h-1 bg-gradient-to-r from-gold via-yellow-400 to-gold mx-auto rounded-full"></div>
                    </div>

                    {error ? (
                        <div className="bg-red-900/20 border border-red-400/30 rounded-2xl p-8 text-center backdrop-blur-sm">
                            <div className="mb-4">
                                <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
                            </div>
                            <h3 className="text-xl font-semibold text-red-300 mb-3">Don't worry, these things happen!</h3>
                            <p className="text-red-300/80 text-lg mb-6 leading-relaxed">{error}</p>
                            <p className="text-red-300/60 text-sm mb-6">Let's give it another try - I'm here to help! 🤝</p>
                            <button
                                onClick={resetUpload}
                                className="bg-gold hover:bg-gold/90 text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                            >
                                <Upload className="w-5 h-5" />
                                Try Again
                            </button>
                        </div>
                    ) : results ? (
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2 custom-scrollbar">
                            {/* Success celebration */}
                            <div className="text-center mb-8">
                                <div className="inline-flex items-center gap-2 bg-emerald-900/20 border border-emerald-400/30 rounded-full px-6 py-3 mb-4">
                                    <Sparkles className="w-5 h-5 text-emerald-400" />
                                    <span className="text-emerald-300 font-medium">Your document has been analyzed!</span>
                                </div>
                                <p className="text-white/70 text-sm">Here's what I found, explained in plain English:</p>
                            </div>

                            {/* Summary Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                        <FileText className="w-4 h-4 text-white" />
                                    </div>
                                    Document Summary
                                </h3>
                                <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-4 border border-blue-400/20">
                                    <p className="text-white/90 text-base leading-relaxed">
                                        {results.summary}
                                    </p>
                                </div>
                            </div>

                            {/* Key Points Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                    <div className="w-8 h-8 bg-gradient-to-br from-gold to-yellow-500 rounded-lg flex items-center justify-center">
                                        <Sparkles className="w-4 h-4 text-primary" />
                                    </div>
                                    Key Highlights
                                </h3>
                                <p className="text-white/60 text-sm mb-4">The most important things you should know:</p>
                                <div className="grid gap-3">
                                    {results.key_points.map((point, index) => (
                                        <div
                                            key={index}
                                            className="bg-gradient-to-r from-gold/10 to-yellow-500/10 border border-gold/20 rounded-xl p-4 hover:bg-gradient-to-r hover:from-gold/15 hover:to-yellow-500/15 transition-all duration-300 group"
                                        >
                                            <div className="flex items-start gap-4">
                                                <div className="w-7 h-7 bg-gradient-to-br from-gold to-yellow-400 rounded-full flex items-center justify-center text-primary text-sm font-bold mt-0.5 flex-shrink-0 shadow-lg group-hover:scale-110 transition-transform">
                                                    {index + 1}
                                                </div>
                                                <p className="text-white/90 leading-relaxed flex-1 text-sm">
                                                    {point}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* References Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-lg font-bold text-white mb-3 text-center flex items-center justify-center gap-2">
                                    <Shield className="w-5 h-5 text-green-400" />
                                    Analysis Details
                                </h3>
                                <div className="space-y-1 text-center">
                                    {results.references.map((ref, index) => (
                                        <p key={index} className="text-white/60 text-xs">
                                            {ref}
                                        </p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ) : null}

                    {/* Action Button */}
                    <div className="text-center mt-8">
                        <button
                            onClick={resetUpload}
                            className="bg-gradient-to-r from-gold to-yellow-400 hover:from-gold/90 hover:to-yellow-400/90 text-primary px-8 py-4 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3 mx-auto shadow-lg hover:shadow-xl transform hover:scale-105"
                        >
                            <Upload className="w-5 h-5" />
                            Analyze Another Document
                            <Sparkles className="w-4 h-4" />
                        </button>
                        <p className="text-white/60 text-sm mt-3">Ready to help with your next document! 📄</p>
                    </div>
                </div>
            </div>
        );
    }

    // Enhanced hero/upload page
    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center relative overflow-hidden">
            {/* Enhanced background elements with legal theme */}
            <div className="absolute inset-0 opacity-8">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold rounded-full animate-glow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse-gentle"></div>
                <div className="absolute top-3/4 left-1/2 w-16 h-16 bg-gold rounded-full animate-glow" style={{ animationDelay: '1s' }}></div>
                <div className="absolute top-1/2 right-1/6 w-20 h-20 bg-white/20 rounded-full animate-pulse-gentle" style={{ animationDelay: '2s' }}></div>
            </div>

            {/* Floating legal icons */}
            <div className="absolute inset-0 opacity-10">
                <Scale className="absolute top-1/5 right-1/5 w-12 h-12 text-gold animate-float" />
                <FileText className="absolute bottom-1/3 left-1/8 w-10 h-10 text-white animate-float-delayed" />
                <BookOpen className="absolute top-2/3 right-1/3 w-11 h-11 text-gold animate-float" style={{ animationDelay: '1.5s' }} />
                <Shield className="absolute bottom-1/5 right-1/6 w-9 h-9 text-white animate-float" style={{ animationDelay: '3s' }} />
                <Eye className="absolute top-1/6 left-1/3 w-8 h-8 text-gold animate-float-delayed" />
            </div>

            {/* Enhanced mesh pattern */}
            <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern id="mesh" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                            <circle cx="30" cy="30" r="1.5" fill="currentColor" />
                            <circle cx="15" cy="15" r="0.5" fill="currentColor" opacity="0.5" />
                            <circle cx="45" cy="45" r="0.5" fill="currentColor" opacity="0.5" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mesh)" />
                </svg>
            </div>

            <div className="relative z-10 text-center px-6 sm:px-8 max-w-5xl mx-auto">
                {/* Enhanced Logo/Brand */}
                <div className="mb-12 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-4 mb-6">
                        <div className="relative group">
                            <div className="w-14 h-14 bg-gradient-to-br from-gold via-yellow-400 to-gold rounded-2xl flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300">
                                <Eye className="w-7 h-7 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-emerald-400 to-green-400 rounded-full border-2 border-white animate-pulse shadow-lg"></div>
                            <div className="absolute inset-0 bg-gold/20 rounded-2xl animate-ping opacity-50"></div>
                        </div>
                        <div className="text-left">
                            <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-white via-gold to-white bg-clip-text text-transparent tracking-tight">
                                LegalLens
                            </h1>
                            <p className="text-gold/80 text-sm font-medium tracking-wider">AI Legal Assistant</p>
                        </div>
                    </div>
                    <div className="w-24 h-1.5 bg-gradient-to-r from-gold via-yellow-400 to-gold mx-auto rounded-full shadow-lg"></div>
                </div>

                {/* Warm welcome message */}
                <div className="mb-12 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                    <div className="mb-8">
                        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                            Hey there! 👋{' '}
                            <span className="block text-3xl sm:text-4xl lg:text-5xl mt-2">
                                I'm <span className="text-gold">your friendly legal translator</span>
                            </span>
                        </h2>
                        <div className="max-w-3xl mx-auto">
                            <p className="text-xl sm:text-2xl text-white/90 font-medium leading-relaxed mb-4">
                                Legal documents can be confusing. I'm here to{' '}
                                <span className="text-gold font-semibold">break them down into plain English</span>{' '}
                                so you can understand exactly what they mean.
                            </p>
                            <p className="text-lg text-white/80 leading-relaxed">
                                No more legal jargon headaches! 🎯
                            </p>
                        </div>
                    </div>

                    {/* Feature highlights */}
                    <div className="flex flex-wrap justify-center gap-4 mb-8">
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-gold" />
                            <span className="text-white/90 text-sm font-medium">Instant Analysis</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                            <MessageCircle className="w-4 h-4 text-emerald-400" />
                            <span className="text-white/90 text-sm font-medium">Plain English</span>
                        </div>
                        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 flex items-center gap-2">
                            <Shield className="w-4 h-4 text-blue-400" />
                            <span className="text-white/90 text-sm font-medium">100% Private</span>
                        </div>
                    </div>
                </div>

                {/* Enhanced Upload Button */}
                <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                    />

                    <div className="mb-6">
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={isLoading}
                            className="group relative overflow-hidden bg-gradient-to-r from-gold via-yellow-400 to-gold hover:from-gold/90 hover:via-yellow-400/90 hover:to-gold/90 text-primary font-bold text-xl px-16 py-6 rounded-2xl transition-all duration-300 flex items-center gap-4 mx-auto shadow-2xl hover:shadow-3xl disabled:opacity-75 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
                        >
                            <div className="flex items-center gap-4">
                                {isLoading ? (
                                    <Loader2 className="w-7 h-7 animate-spin" />
                                ) : (
                                    <div className="relative">
                                        <Upload className="w-7 h-7 group-hover:animate-bounce" />
                                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></div>
                                    </div>
                                )}
                                <span className="text-xl">
                                    {isLoading ? 'Analyzing your document...' : 'Upload Your Document'}
                                </span>
                                {!isLoading && <Sparkles className="w-6 h-6 animate-pulse" />}
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
                        </button>

                        <div className="mt-4 space-y-2">
                            <p className="text-white/70 text-base font-medium">
                                📄 PDF • DOCX • TXT files supported
                            </p>
                            {isLoading && uploadedFileName && (
                                <div className="bg-white/10 backdrop-blur-sm border border-gold/30 rounded-xl p-3 max-w-sm mx-auto">
                                    <p className="text-gold text-sm font-medium animate-pulse flex items-center gap-2">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Working on: {uploadedFileName}
                                    </p>
                                    <div className="w-full bg-white/20 rounded-full h-1 mt-2">
                                        <div className="bg-gold h-1 rounded-full animate-loading-bar"></div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* How it works */}
                    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 max-w-2xl mx-auto">
                        <h3 className="text-white font-semibold mb-4 flex items-center justify-center gap-2">
                            <Sparkles className="w-5 h-5 text-gold" />
                            How I help you understand legal documents
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                            <div className="text-center p-3 rounded-xl bg-white/5">
                                <Upload className="w-6 h-6 text-gold mx-auto mb-2" />
                                <p className="text-white/90 font-medium">Upload</p>
                                <p className="text-white/60 text-xs">Share your document</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5">
                                <Eye className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                                <p className="text-white/90 font-medium">Analyze</p>
                                <p className="text-white/60 text-xs">I read & understand</p>
                            </div>
                            <div className="text-center p-3 rounded-xl bg-white/5">
                                <MessageCircle className="w-6 h-6 text-emerald-400 mx-auto mb-2" />
                                <p className="text-white/90 font-medium">Explain</p>
                                <p className="text-white/60 text-xs">Get clear answers</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;