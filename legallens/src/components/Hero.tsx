import React, { useRef, useState, useEffect } from 'react';
import { Upload, FileText, Sparkles, Loader2, CheckCircle, AlertCircle, ArrowUp } from 'lucide-react';
import "./Hero.scss";

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

            // Scroll to results after a brief delay
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
                {/* AI-inspired background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold rounded-full animate-glow"></div>
                    <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse-gentle"></div>
                    <div
                        className="absolute top-3/4 left-1/2 w-16 h-16 bg-gold rounded-full animate-glow"
                        style={{ animationDelay: '1s' }}
                    ></div>
                </div>

                {/* Subtle mesh pattern overlay */}
                <div className="absolute inset-0 opacity-5">
                    <svg width="100%" height="100%" className="absolute inset-0">
                        <defs>
                            <pattern
                                id="mesh"
                                x="0"
                                y="0"
                                width="50"
                                height="50"
                                patternUnits="userSpaceOnUse"
                            >
                                <circle cx="25" cy="25" r="1" fill="currentColor" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#mesh)" />
                    </svg>
                </div>

                <div className="relative z-10 w-full max-w-4xl mx-auto">
                    {/* Header with Logo */}
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <div className="w-10 h-10 bg-gold rounded-2xl flex items-center justify-center shadow-soft">
                                <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                                LegalLens
                            </h1>
                        </div>
                        <div className="flex items-center justify-center gap-3 mb-4">
                            {error ? (
                                <AlertCircle className="w-8 h-8 text-red-400" />
                            ) : (
                                <CheckCircle className="w-8 h-8 text-gold" />
                            )}
                            <h2 className="text-3xl sm:text-4xl font-bold text-white">
                                {error ? 'Analysis Failed' : 'Analysis Complete'}
                            </h2>
                        </div>
                        <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
                    </div>

                    {error ? (
                        /* Error State */
                        <div className="bg-red-900/20 border border-red-500/30 rounded-2xl p-8 text-center">
                            <p className="text-red-300 text-lg mb-6">{error}</p>
                            <button
                                onClick={resetUpload}
                                className="bg-gold text-black px-8 py-4 rounded-xl font-semibold hover:bg-gold/90 transition-colors flex items-center gap-2 mx-auto"
                            >
                                <Upload className="w-5 h-5" />
                                Try Again
                            </button>
                        </div>
                    ) : results ? (
                        /* Results Display */
                        <div className="space-y-6 max-h-[80vh] overflow-y-auto pr-2">
                            {/* Summary Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-gold" />
                                    Document Summary
                                </h3>
                                <p className="text-white/90 text-base leading-relaxed">
                                    {results.summary}
                                </p>
                            </div>

                            {/* Key Points Section */}
                            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6">
                                <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                    <Sparkles className="w-5 h-5 text-gold" />
                                    Key Points
                                </h3>
                                <div className="grid gap-3">
                                    {results.key_points.map((point, index) => (
                                        <div
                                            key={index}
                                            className="bg-gold/10 border border-gold/20 rounded-xl p-4 hover:bg-gold/15 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-gold rounded-full flex items-center justify-center text-black text-sm font-bold mt-0.5 flex-shrink-0">
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
                                <h3 className="text-lg font-bold text-white mb-3 text-center">
                                    Analysis Details
                                </h3>
                                <div className="space-y-1">
                                    {results.references.map((ref, index) => (
                                        <p key={index} className="text-white/60 text-xs text-center">
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
                            className="bg-gold text-black px-8 py-4 rounded-xl font-semibold hover:bg-gold/90 transition-colors flex items-center gap-2 mx-auto"
                        >
                            <Upload className="w-5 h-5" />
                            Analyze Another Document
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Show hero/upload page
    return (
        <div className="min-h-screen gradient-hero flex items-center justify-center relative overflow-hidden">
            {/* AI-inspired background elements */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gold rounded-full animate-glow"></div>
                <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-white rounded-full animate-pulse-gentle"></div>
                <div
                    className="absolute top-3/4 left-1/2 w-16 h-16 bg-gold rounded-full animate-glow"
                    style={{ animationDelay: '1s' }}
                ></div>
            </div>

            {/* Subtle mesh pattern overlay */}
            <div className="absolute inset-0 opacity-5">
                <svg width="100%" height="100%" className="absolute inset-0">
                    <defs>
                        <pattern
                            id="mesh"
                            x="0"
                            y="0"
                            width="50"
                            height="50"
                            patternUnits="userSpaceOnUse"
                        >
                            <circle cx="25" cy="25" r="1" fill="currentColor" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#mesh)" />
                </svg>
            </div>

            <div className="relative z-10 text-center px-6 sm:px-8 max-w-4xl mx-auto">
                {/* Logo/Brand */}
                <div className="mb-8 animate-fade-in-up">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="w-12 h-12 bg-gold rounded-2xl flex items-center justify-center shadow-soft">
                            <FileText className="w-6 h-6 text-primary" />
                        </div>
                        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
                            LegalLens
                        </h1>
                    </div>
                    <div className="w-20 h-1 bg-gold mx-auto rounded-full"></div>
                </div>

                {/* Main Headline */}
                <div
                    className="mb-12 animate-fade-in-up"
                    style={{ animationDelay: '0.2s' }}
                >
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        Hello 👋 I'm LegalLens —{' '}
                        <span className="text-gold">your friendly legal sidekick</span>
                    </h2>
                    <p className="text-xl sm:text-2xl text-white/90 font-medium max-w-3xl mx-auto leading-relaxed">
                        Upload your document and I'll make it{' '}
                        <span className="text-gold font-semibold">crystal clear</span>
                    </p>
                </div>

                {/* Upload Button */}
                <div
                    className="animate-fade-in-up"
                    style={{ animationDelay: '0.4s' }}
                >
                    {/* Hidden file input */}
                    <input
                        type="file"
                        ref={fileInputRef}
                        className="hidden"
                        accept=".pdf,.docx,.txt"
                        onChange={handleFileChange}
                    />

                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className="text-lg px-12 py-6 h-auto rounded-2xl group relative overflow-hidden bg-gold text-black font-semibold hover:bg-gold/90 transition-all flex items-center gap-3 mx-auto shadow-lg disabled:opacity-75 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <Loader2 className="w-6 h-6 animate-spin" />
                        ) : (
                            <Upload className="w-6 h-6 group-hover:animate-bounce" />
                        )}
                        <span>{isLoading ? 'Analyzing...' : 'Upload Document'}</span>
                        {!isLoading && <Sparkles className="w-5 h-5 text-gold-foreground/80" />}
                        {!isLoading && (
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                        )}
                    </button>

                    <p className="text-white/70 text-sm mt-4 font-medium">
                        Supports PDF, DOCX, and TXT files • AI-powered analysis
                    </p>

                    {/* Show uploaded file name when loading */}
                    {isLoading && uploadedFileName && (
                        <p className="text-gold text-sm mt-2 font-medium animate-pulse">
                            Analyzing: {uploadedFileName}
                        </p>
                    )}
                </div>

                {/* Trust indicators */}
                <div
                    className="mt-16 flex flex-wrap justify-center items-center gap-8 text-white/60 text-sm animate-fade-in-up"
                    style={{ animationDelay: '0.6s' }}
                >
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold rounded-full"></div>
                        <span>Secure & Private</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold rounded-full"></div>
                        <span>Instant Analysis</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-gold rounded-full"></div>
                        <span>Plain English</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;