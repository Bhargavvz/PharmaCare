import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import DashboardLayout from './components/layout/DashboardLayout';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Features from './pages/Features';
import NotFound from './pages/NotFound';
import Pricing from './pages/Pricing';
import FAQ from './pages/FAQ';
import Blog from './pages/Blog';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Dashboard from './pages/dashboard/Dashboard';
import Medications from './pages/dashboard/Medications';
import Reminders from './pages/dashboard/Reminders';
import Analytics from './pages/dashboard/Analytics';
import Family from './pages/dashboard/Family';
import Prescriptions from './pages/dashboard/Prescriptions';
import Rewards from './pages/dashboard/Rewards';
import Settings from './pages/dashboard/Settings';
import Profile from './pages/dashboard/Profile';
import Donations from './pages/dashboard/Donations';
import PharmacyDashboard from './pages/pharmacy/PharmacyDashboard';
import CreatePharmacy from './pages/pharmacy/CreatePharmacy';
import Inventory from './pages/pharmacy/Inventory';
import PharmacyLogin from './pages/pharmacy/PharmacyLogin';
import PharmacySignup from './pages/pharmacy/PharmacySignup';
import PharmacyBilling from './pages/pharmacy/PharmacyBilling';
import PharmacyDonations from './pages/pharmacy/PharmacyDonations';
import PharmacyAnalytics from './pages/pharmacy/PharmacyAnalytics';
import PharmacyStaff from './pages/pharmacy/PharmacyStaff';
import LoadingSpinner from './components/common/LoadingSpinner';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OAuth2Callback from './pages/OAuth2Callback';
import BlogPost from './pages/BlogPost';

function App() {
  // Protected Route Component moved inside App
  const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { currentUser, loading } = useAuth();

    if (loading) {
      return <LoadingSpinner />;
    }

    if (!currentUser) {
      return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
  };

  return (
    <Router>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Toaster position="top-right" />
          <Routes>
            {/* Dashboard Routes */}
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardLayout>
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/medications" element={<Medications />} />
                      <Route path="/reminders" element={<Reminders />} />
                      <Route path="/analytics" element={<Analytics />} />
                      <Route path="/family" element={<Family />} />
                      <Route path="/prescriptions" element={<Prescriptions />} />
                      <Route path="/rewards" element={<Rewards />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/donations" element={<Donations />} />
                    </Routes>
                  </DashboardLayout>
                </ProtectedRoute>
              }
            />

            {/* Pharmacy Management Routes */}
            <Route
              path="/pharmacy/*"
              element={
                <Routes>
                  <Route path="/login" element={<PharmacyLogin />} />
                  <Route path="/signup" element={<PharmacySignup />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <PharmacyDashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/create" 
                    element={
                      <ProtectedRoute>
                        <CreatePharmacy />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory" 
                    element={
                      <ProtectedRoute>
                        <Inventory />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory/add" 
                    element={
                      <ProtectedRoute>
                        <div>Add Inventory Item</div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory/edit/:id" 
                    element={
                      <ProtectedRoute>
                        <div>Edit Inventory Item</div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/inventory/view/:id" 
                    element={
                      <ProtectedRoute>
                        <div>View Inventory Item</div>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/billing" 
                    element={
                      <ProtectedRoute>
                        <PharmacyBilling />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/donations" 
                    element={
                      <ProtectedRoute>
                        <PharmacyDonations />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/analytics" 
                    element={
                      <ProtectedRoute>
                        <PharmacyAnalytics />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/staff" 
                    element={
                      <ProtectedRoute>
                        <PharmacyStaff />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              }
            />

            {/* Public Routes */}
            <Route
              path="/*"
              element={
                <div className="flex-grow flex flex-col">
                  <Header />
                  <main className="flex-grow">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/about" element={<About />} />
                      <Route path="/contact" element={<Contact />} />
                      <Route path="/features" element={<Features />} />
                      <Route path="/pricing" element={<Pricing />} />
                      <Route path="/faq" element={<FAQ />} />
                      <Route path="/blog" element={<Blog />} />
                      <Route path="/blog/:slug" element={<BlogPost />} />
                      <Route path="/privacy" element={<PrivacyPolicy />} />
                      <Route path="/terms" element={<TermsOfService />} />
                      <Route path="/login" element={<Login />} />
                      <Route path="/signup" element={<Signup />} />
                      <Route path="/get-started" element={<Navigate to="/signup" replace />} />
                      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                  <Footer />
                </div>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;