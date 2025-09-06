import React, { useRef, useState } from "react";
import {
    Upload,
    FileText,
    Sparkles,
    Loader2,
    CheckCircle,
    AlertCircle,
    Scale,
    BookOpen,
    Eye,
    Shield,

    MessageCircle,
} from "lucide-react";
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
    const [uploadedFileName, setUploadedFileName] = useState<string>("");

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
                body: formData,
            });

            if (!res.ok) throw new Error(`Upload failed: ${res.status}`);

            const data = await res.json();
            setResults(data);

            setTimeout(() => {
                resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            }, 300);
        } catch (err) {
            setError(err instanceof Error ? err.message : "An unexpected error occurred");
        } finally {
            setIsLoading(false);
        }
    };

    const resetUpload = () => {
        setResults(null);
        setError(null);
        setUploadedFileName("");
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    // Show results if available
    if (results || error) {
        return (
            <div className="hero-results">
                <div className="hero-background" />
                <div className="hero-icons-floating">
                    <Scale className="icon-scale" />
                    <FileText className="icon-file" />
                    <BookOpen className="icon-book" />
                </div>

                <div className="hero-container">
                    <div className="hero-header">
                        <div className="logo-wrapper">
                            <div className="logo-icon">
                                <Eye />
                            </div>
                            <h1 className="brand">LegalLens</h1>
                        </div>

                        <div className="status">
                            {error ? <AlertCircle className="icon-error" /> : <CheckCircle className="icon-success" />}
                            <h2>{error ? "Oops! Something went wrong" : "✨ Analysis Complete!"}</h2>
                        </div>
                    </div>

                    {error ? (
                        <div className="error-box">
                            <AlertCircle className="error-icon" />
                            <h3>Don't worry, these things happen!</h3>
                            <p>{error}</p>
                            <button onClick={resetUpload} className="btn-retry">
                                <Upload /> Try Again
                            </button>
                        </div>
                    ) : results ? (
                        <div className="results-content" ref={resultsRef}>
                            <div className="success-message">
                                <Sparkles />
                                <span>Your document has been analyzed!</span>
                            </div>

                            {/* Summary */}
                            <div className="summary-box">
                                <h3>
                                    <FileText /> Document Summary
                                </h3>
                                <p>{results.summary}</p>
                            </div>

                            {/* Key Points */}
                            <div className="keypoints-box">
                                <h3>
                                    <Sparkles /> Key Highlights
                                </h3>
                                <ul>
                                    {results.key_points.map((point, index) => (
                                        <li key={index}>
                                            <span className="point-number">{index + 1}</span>
                                            <span>{point}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* References */}
                            <div className="references-box">
                                <h3>
                                    <Shield /> Analysis Details
                                </h3>
                                {results.references.map((ref, index) => (
                                    <p key={index}>{ref}</p>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="actions">
                        <button onClick={resetUpload} className="btn-another">
                            <Upload /> Analyze Another Document <Sparkles />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Upload page
    return (
        <div className="hero-upload">
            <div className="hero-background" />
            <div className="hero-icons-floating">
                <Scale className="icon-scale" />
                <FileText className="icon-file" />
                <BookOpen className="icon-book" />
                <Shield className="icon-shield" />
                <Eye className="icon-eye" />
            </div>

            <div className="hero-container">
                <div className="brand-header">
                    <Eye className="brand-logo" />
                    <h1>LegalLens</h1>
                    <p>AI Legal Assistant</p>
                </div>

                <div className="welcome-message">
                    <h2>
                        Hey there! 👋 <br />
                        <span>I’m your friendly legal translator</span>
                    </h2>
                    <p>Legal documents can be confusing. I’ll break them down into plain English for you.</p>
                </div>

                <input type="file" ref={fileInputRef} className="file-input" accept=".pdf,.docx,.txt" onChange={handleFileChange} />

                <div className="upload-section">
                    <button onClick={() => fileInputRef.current?.click()} disabled={isLoading} className="btn-upload">
                        {isLoading ? <Loader2 className="spin" /> : <Upload />}
                        {isLoading ? "Analyzing your document..." : "Upload Your Document"}
                        {!isLoading && <Sparkles />}
                    </button>

                    {isLoading && uploadedFileName && (
                        <div className="loading-file">
                            <Loader2 className="spin" />
                            <p>Working on: {uploadedFileName}</p>
                            <div className="progress-bar">
                                <div className="progress" />
                            </div>
                        </div>
                    )}
                </div>

                <div className="how-it-works">
                    <h3>
                        <Sparkles /> How I help you understand legal documents
                    </h3>
                    <div className="steps">
                        <div className="step">
                            <Upload />
                            <p>Upload</p>
                        </div>
                        <div className="step">
                            <Eye />
                            <p>Analyze</p>
                        </div>
                        <div className="step">
                            <MessageCircle />
                            <p>Explain</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;
