import React, { useRef } from 'react';
import { Upload, FileText, Sparkles } from 'lucide-react';
import "./Hero.scss";

const HeroSection: React.FC = () => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("file", file);

        try {
            const res = await fetch("https://<your-backend-url>/api/analyze", {
                method: "POST",
                body: formData
            });

            const data = await res.json();
            console.log("Analysis result:", data);
            // TODO: Save to state and show in results section
        } catch (err) {
            console.error("Error uploading file:", err);
        }
    };

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
                        className="text-lg px-12 py-6 h-auto rounded-2xl group relative overflow-hidden bg-gold text-black font-semibold hover:bg-gold/90 transition-all flex items-center gap-3 mx-auto shadow-lg"
                    >
                        <Upload className="w-6 h-6 group-hover:animate-bounce" />
                        <span>Upload Document</span>
                        <Sparkles className="w-5 h-5 text-gold-foreground/80" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-shimmer"></div>
                    </button>

                    <p className="text-white/70 text-sm mt-4 font-medium">
                        Supports PDF, DOCX, and TXT files • AI-powered analysis
                    </p>
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
