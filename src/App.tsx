import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { PortfolioProvider } from './context/PortfolioContext';
import { Toast } from './components/Toast';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

// Pages
import { LandingPage } from './pages/LandingPage';
import { UploadPage } from './pages/UploadPage';
import { DashboardPage } from './pages/DashboardPage';
import { EditorPage } from './pages/EditorPage';
import { TemplatesPage } from './pages/TemplatesPage';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { CoachPage } from './pages/CoachPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { BuildFromScratchPage } from './pages/BuildFromScratchPage';
import { LoginPage } from './pages/LoginPage';
import { SignInPage } from './pages/SignInPage';
import { SignUpPage } from './pages/SignUpPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';

// Layout wrapper for standard pages (Navbar + Content + Footer)
const StandardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-blue-500 selection:text-white">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

// Helper to reset window scroll position on route changes
const ScrollToTop: React.FC = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [pathname, hash]);

  return null;
};

export const App: React.FC = () => {
  return (
    <PortfolioProvider>
      <BrowserRouter>
        <ScrollToTop />
        <Toast />
        <Routes>
          {/* Landing Page */}
          <Route
            path="/"
            element={
              <StandardLayout>
                <LandingPage />
              </StandardLayout>
            }
          />

          {/* Resume Upload & Extraction */}
          <Route
            path="/upload"
            element={
              <StandardLayout>
                <UploadPage />
              </StandardLayout>
            }
          />

          {/* Build From Scratch Multi-step Wizard */}
          <Route path="/scratch" element={<BuildFromScratchPage />} />
          <Route path="/builder" element={<BuildFromScratchPage />} />

          {/* Authentication Pages */}
          <Route
            path="/signin"
            element={
              <StandardLayout>
                <SignInPage />
              </StandardLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <StandardLayout>
                <SignUpPage />
              </StandardLayout>
            }
          />
          <Route
            path="/login"
            element={
              <StandardLayout>
                <SignInPage />
              </StandardLayout>
            }
          />

          {/* Privacy Policy Page */}
          <Route
            path="/privacy"
            element={
              <StandardLayout>
                <PrivacyPolicyPage />
              </StandardLayout>
            }
          />

          {/* Terms of Service Page */}
          <Route
            path="/terms"
            element={
              <StandardLayout>
                <TermsOfServicePage />
              </StandardLayout>
            }
          />

          {/* User Dashboard */}
          <Route
            path="/dashboard"
            element={
              <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900">
                <Navbar />
                <main className="flex-1">
                  <DashboardPage />
                </main>
              </div>
            }
          />

          {/* Full-screen 3-Pane Visual Editor */}
          <Route path="/editor" element={<EditorPage />} />

          {/* Template Gallery */}
          <Route
            path="/templates"
            element={
              <StandardLayout>
                <TemplatesPage />
              </StandardLayout>
            }
          />

          {/* Public Portfolio (Recruiter view) */}
          <Route path="/p/:slug" element={<PublicPortfolioPage />} />
          <Route path="/portfolio" element={<Navigate to="/p/alex-johnson" replace />} />

          {/* AI Coach & Optimizer */}
          <Route
            path="/coach"
            element={
              <StandardLayout>
                <CoachPage />
              </StandardLayout>
            }
          />

          {/* Analytics Dashboard */}
          <Route
            path="/analytics"
            element={
              <StandardLayout>
                <AnalyticsPage />
              </StandardLayout>
            }
          />

          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </PortfolioProvider>
  );
};

export default App;
