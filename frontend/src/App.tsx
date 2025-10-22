import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { AuthenticatedRoute, ClientRoute, FreelancerRoute, AdminRoute } from "@/components/auth/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Contact from "./pages/Contact";
import AvailableProjects from "./pages/AvailableProjects";
import Freelancers from "./pages/Freelancers";
import SuccessStories from "./pages/SuccessStories";
import ClientExperiences from "./pages/ClientExperiences";
import Reviews from "./pages/Reviews";
import HowToHire from "./pages/HowToHire";
import HowToFindWork from "./pages/HowToFindWork";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import Help from "./pages/Help";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfUse from "./pages/TermsOfUse";
import CookiePolicy from "./pages/CookiePolicy";
import ClientDashboard from "./pages/ClientDashboard";
import FreelancerDashboard from "./pages/FreelancerDashboard";
import AdminDashboard from './pages/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';
import { useActiveRole } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserType } from '@/types/api';
import Profile from "./pages/Profile";
import UserProfile from "./pages/UserProfile";
import Messages from "./pages/Messages";
import Settings from "./pages/Settings";
import Contracts from "./pages/Contracts";
import Proposals from "./pages/Proposals";
import Notifications from "./pages/Notifications";
import CreateProject from "./pages/CreateProject";
import ProjectsManagement from "./pages/ProjectsManagement";
import MyProposals from "./pages/MyProposals";
import ProjectDetails from "./pages/ProjectDetails";
import ClientProjectDetails from "./pages/ClientProjectDetails";
import MyProjects from "./pages/MyProjects";

// Configure QueryClient with proper defaults
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 401/403 errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: false,
    },
  },
});

const DashboardRedirect = () => {
  const activeRole = useActiveRole();
  const navigate = useNavigate();

  useEffect(() => {
    const target = activeRole === UserType.FREELANCER
      ? '/freelancer-dashboard'
      : activeRole === UserType.CLIENT
      ? '/client-dashboard'
      : '/admin-dashboard';

    navigate(target, { replace: true });
  }, [activeRole, navigate]);

  return null;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Index />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/available-projects" element={<AvailableProjects />} />
            <Route path="/projects" element={<AvailableProjects />} />
            <Route path="/freelancers" element={<Freelancers />} />
            <Route path="/success-stories" element={<SuccessStories />} />
            <Route path="/client-experiences" element={<ClientExperiences />} />
            <Route path="/reviews" element={<Reviews />} />
            <Route path="/reviews/contract/:contractId" element={<Reviews />} />
            <Route path="/reviews/project/:projectId" element={<Reviews />} />
            <Route path="/how-to-hire" element={<HowToHire />} />
            <Route path="/how-to-find-work" element={<HowToFindWork />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/help" element={<Help />} />
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-use" element={<TermsOfUse />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            
            {/* Protected routes */}
            <Route path="/client-dashboard" element={
              <ClientRoute>
                <ClientDashboard />
              </ClientRoute>
            } />
            <Route path="/freelancer-dashboard" element={
              <FreelancerRoute>
                <FreelancerDashboard />
              </FreelancerRoute>
            } />
            <Route path="/admin-dashboard" element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            } />
            <Route path="/admin/users" element={
              <AdminRoute>
                <UserManagement />
              </AdminRoute>
            } />
            <Route path="/dashboard" element={<DashboardRedirect />} />
            <Route path="/create-project" element={
              <ClientRoute>
                <CreateProject />
              </ClientRoute>
            } />
            <Route path="/projects-management" element={
              <ClientRoute>
                <ProjectsManagement />
              </ClientRoute>
            } />
            <Route path="/profile" element={
              <AuthenticatedRoute>
                <Profile />
              </AuthenticatedRoute>
            } />
            <Route path="/user/:userId" element={<UserProfile />} />
            <Route path="/messages" element={
              <AuthenticatedRoute>
                <Messages />
              </AuthenticatedRoute>
            } />
            <Route path="/settings" element={
              <AuthenticatedRoute>
                <Settings />
              </AuthenticatedRoute>
            } />
            <Route path="/contracts" element={
              <AuthenticatedRoute>
                <Contracts />
              </AuthenticatedRoute>
            } />
            <Route path="/proposals" element={
              <AuthenticatedRoute>
                <Proposals />
              </AuthenticatedRoute>
            } />
            <Route path="/notifications" element={
              <AuthenticatedRoute>
                <Notifications />
              </AuthenticatedRoute>
            } />
            <Route path="/my-proposals" element={
              <FreelancerRoute>
                <MyProposals />
              </FreelancerRoute>
            } />
            <Route path="/project/:id" element={
              <FreelancerRoute>
                <ProjectDetails />
              </FreelancerRoute>
            } />
            <Route path="/client/project/:id" element={
              <ClientRoute>
                <ClientProjectDetails />
              </ClientRoute>
            } />
            <Route path="/my-projects" element={
              <ClientRoute>
                <MyProjects />
              </ClientRoute>
            } />
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
