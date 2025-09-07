import React, { useRef, useState } from "react";
import "../components/Hero.scss";
import {
    Upload,
    FileText,
    Sparkles,
    Loader2,
    CheckCircle,
    AlertCircle,
    Scale,

    Shield,

    Gavel,
    Award,
    Users,
    Clock,
    TrendingUp,
    Lock
} from "lucide-react";

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

    // Results view
    if (results || error) {
        return (
            <div className="hero-results">
                <div className="hero-background" />

                {/* Professional floating icons */}
                <div className="hero-icons-floating">
                    <Gavel className="icon-gavel" />
                    <Scale className="icon-scale" />
                    <Shield className="icon-shield" />
                    <Award className="icon-award" />
                    <Lock className="icon-lock" />
                    <TrendingUp className="icon-trending" />
                </div>

                <div className="hero-container">
                    {/* Brand Header */}
                    <div className="hero-header">
                        <div className="brand-wrapper">
                            <div className="brand-icon">
                                <Gavel />
                            </div>
                            <div className="brand-info">
                                <h1 className="brand-title">LegalLens</h1>
                                <p className="brand-subtitle">Professional Legal Analysis</p>
                            </div>
                        </div>
                    </div>

                    {/* Status */}
                    <div className="status-section">
                        {error ? (
                            <AlertCircle className="status-icon error" />
                        ) : (
                            <CheckCircle className="status-icon success" />
                        )}
                        <h2 className="status-title">
                            {error ? "Analysis Failed" : "Analysis Complete"}
                        </h2>
                    </div>

                    {/* Content */}
                    {error ? (
                        <div className="error-container">
                            <AlertCircle className="error-icon-large" />
                            <h3 className="error-title">Analysis Error</h3>
                            <p className="error-message">{error}</p>
                            <button onClick={resetUpload} className="btn-retry">
                                <Upload />
                                Try Again
                            </button>
                        </div>
                    ) : results && (
                        <div className="results-container" ref={resultsRef}>
                            {/* Success Message */}
                            <div className="success-banner">
                                <Sparkles />
                                <span>Document analysis completed successfully</span>
                            </div>

                            {/* Summary Card */}
                            <div className="card summary-card">
                                <div className="card-header">
                                    <FileText />
                                    <h3>Executive Summary</h3>
                                </div>
                                <div className="card-content">
                                    <p>{results.summary}</p>
                                </div>
                            </div>

                            {/* Key Points Card */}
                            <div className="card keypoints-card">
                                <div className="card-header">
                                    <TrendingUp />
                                    <h3>Key Findings</h3>
                                </div>
                                <div className="card-content">
                                    <ul className="keypoints-list">
                                        {results.key_points.map((point, index) => (
                                            <li key={index} className="keypoint-item">
                                                <span className="point-number">{index + 1}</span>
                                                <span className="point-text">{point}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>

                            {/* References Card */}
                            <div className="card references-card">
                                <div className="card-header">
                                    <Shield />
                                    <h3>Compliance Notes</h3>
                                </div>
                                <div className="card-content">
                                    {results.references.map((ref, index) => (
                                        <p key={index} className="reference-item">{ref}</p>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Action Button */}
                    <div className="actions-section">
                        <button onClick={resetUpload} className="btn-primary">
                            <Upload />
                            Analyze Another Document
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Upload view
    return (
        <div className="hero-upload">
            <div className="hero-background" />

            {/* Professional floating icons */}
            <div className="hero-icons-floating">
                <Gavel className="icon-gavel" />
                <Scale className="icon-scale" />
                <Shield className="icon-shield" />
                <Award className="icon-award" />
                <Lock className="icon-lock" />
                <Users className="icon-users" />
            </div>

            <div className="hero-container">
                {/* Brand Header */}
                <div className="brand-header">
                    <div className="brand-logo-wrapper">
                        <div className="brand-logo">
                            <Gavel />
                        </div>
                        <div className="brand-text">
                            <h1 className="brand-name">LegalLens</h1>
                            <p className="brand-tagline">AI Legal Assistant</p>
                        </div>
                    </div>
                </div>

                {/* Welcome Message */}
                <div className="welcome-section">
                    <h2 className="welcome-title">
                        Professional Legal Document Analysis
                    </h2>
                    <p className="welcome-description">
                        Transform complex legal documents into clear, actionable insights
                        with our AI-powered analysis platform.
                    </p>
                </div>

                {/* File Input */}
                <input
                    type="file"
                    ref={fileInputRef}
                    className="file-input"
                    accept=".pdf,.docx,.txt"
                    onChange={handleFileChange}
                />

                {/* Upload Section */}
                <div className="upload-section">
                    <button
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isLoading}
                        className={`btn-upload ${isLoading ? 'loading' : ''}`}
                    >
                        {isLoading ? <Loader2 className="spin" /> : <Upload />}
                        <span>{isLoading ? "Analyzing Document..." : "Upload Document"}</span>
                        {!isLoading && <Award />}
                    </button>

                    {/* Loading State */}
                    {isLoading && uploadedFileName && (
                        <div className="loading-section">
                            <div className="loading-info">
                                <Clock />
                                <span>Processing: {uploadedFileName}</span>
                            </div>
                            <div className="progress-bar">
                                <div className="progress-fill" />
                            </div>
                        </div>
                    )}
                </div>

                {/* How It Works */}
                <div className="how-it-works">
                    <h3 className="section-title">
                        <Users />
                        Professional Analysis Process
                    </h3>
                    <div className="steps-container">
                        <div className="step">
                            <div className="step-icon">
                                <Upload />
                            </div>
                            <span className="step-label">Secure Upload</span>
                        </div>
                        <div className="step">
                            <div className="step-icon">
                                <Gavel />
                            </div>
                            <span className="step-label">AI Analysis</span>
                        </div>
                        <div className="step">
                            <div className="step-icon">
                                <TrendingUp />
                            </div>
                            <span className="step-label">Insights Report</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HeroSection;