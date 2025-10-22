import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from '@/components/ui/sonner'

// Providers
import { AuthProvider } from './hooks/useAuth'
import { AppointmentFlowProvider } from './hooks/useAppointmentFlow'

// Pages
import HomePage from './pages/public/HomePage'
import AppointmentPage from './pages/public/AppointmentPage'
import SuccessPage from './pages/public/SuccessPage'
import AdminLoginPage from './pages/admin/AdminLoginPage'
import AdminDashboardPage from './pages/admin/AdminDashboardPage'
import AppointmentsPage from './pages/admin/AppointmentsPage'
import ProfessionalsPage from './pages/admin/ProfessionalsPage'
import ReportsPage from './pages/admin/ReportsPage'

// Components
import ProtectedRoute from './components/ProtectedRoute'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppointmentFlowProvider>
          <Router>
            <div className="min-h-screen bg-gray-50">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/agendar" element={<AppointmentPage />} />
                <Route path="/sucesso" element={<SuccessPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboardPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/appointments" 
                  element={
                    <ProtectedRoute>
                      <AppointmentsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/professionals" 
                  element={
                    <ProtectedRoute>
                      <ProfessionalsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/reports" 
                  element={
                    <ProtectedRoute>
                      <ReportsPage />
                    </ProtectedRoute>
                  } 
                />
              </Routes>
              
              <Toaster />
            </div>
          </Router>
        </AppointmentFlowProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
