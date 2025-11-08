import React from "react";
import { Toaster } from "@/components/ui/toaster";
// import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Suspense, lazy } from "react";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";

// Lazy loading pour les pages importantes (code splitting)
const Builds = lazy(() => import("@/pages/builds_chasseurs/Builds"));
const BossDeGuilde = lazy(() => import("@/pages/bdg/BossDeGuilde"));
const Ennio = lazy(() => import("@/pages/ennio/Ennio"));
const AtelierDeLaLumiere = lazy(() => import("@/pages/AtelierDeLaLumiere"));
// const Vulcan = lazy(() => import("@/pages/atelier/vulcan/Vulcan"));
// const Baran = lazy(() => import("@/pages/atelier/baran/Baran"));
// const Deimos = lazy(() => import("@/pages/atelier/deimos/Deimos"));
const TierList = lazy(() => import("@/pages/TierList"));
const Guides = lazy(() => import("@/pages/Guides"));

// Pages d'administration avec authentification
const BuildsAdmin = lazy(() => import("@/admin/pages/builds"));
const AdminDashboard = lazy(() => import("@/admin/pages/dashboard"));
const PromoCodesAdmin = lazy(() => import("@/admin/pages/promo-codes/PromoCodesAdminPage"));
const TierListAdmin = lazy(() => import("@/admin/pages/tier-list/TierListAdminPage"));
const ChasseursAdmin = lazy(() => import("@/admin/pages/chasseurs"));
const ArtefactsAdmin = lazy(() => import("@/admin/pages/artefacts"));
const NoyauxAdmin = lazy(() => import("@/admin/pages/noyaux"));
const ArmesAdmin = lazy(() => import("@/admin/pages/armes"));
const YoutubeAdmin = lazy(() => import("@/admin/pages/youtube/YoutubeAdminPage"));
const SetsBonusAdmin = lazy(() => import("@/admin/pages/sets-bonus"));
const ProfilAdmin = lazy(() => import("@/admin/pages/profil"));

// Import des composants d'authentification admin
import { AdminProtection } from "@/admin/auth/components/AdminProtection";
import { AdminLogin } from "@/admin/auth/components/AdminLogin";

// Imports directs pour les pages plus légères
import Prochainement from "@/pages/Prochainement"; 
import Portal from "@/pages/guides/portals/Portals";
import Ombres from "@/pages/guides/ombres/Ombres";
import Simulations from "@/pages/guides/simulation/Simulation"; 
import Boss from "@/pages/guides/boss/Boss";
import Creators from "@/pages/Creators";
import PromoCodes from "@/pages/PromoCodes";
import MentionsLegales from "@/pages/legal/MentionsLegales";
import ConditionsUtilisation from "@/pages/legal/ConditionsUtilisation";
import PolitiqueConfidentialite from "@/pages/legal/PolitiqueConfidentialite";
import NotFound from "@/pages/NotFound";

// Composant de chargement pour le Suspense
const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center space-y-4">
      <div className="w-8 h-8 border-4 border-solo-purple border-t-transparent rounded-full animate-spin"></div>
      <p className="text-white text-sm">Chargement...</p>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      {/* <Sonner /> */}
      <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Pages avec lazy loading */}
          <Route path="/guides" element={
            <Suspense fallback={<LoadingFallback />}>
              <Guides />
            </Suspense>
          } />
          
          <Route path="/tier-list" element={
            <Suspense fallback={<LoadingFallback />}>
              <TierList />
            </Suspense>
          } />
          
          <Route path="/builds" element={
            <Suspense fallback={<LoadingFallback />}>
              <Builds />
            </Suspense>
          } />

          {/* Pages d'administration avec authentification */}
          <Route path="/admin" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <AdminDashboard />
              </Suspense>
            </AdminProtection>
          } />
          
          <Route path="/admin/builds" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <BuildsAdmin />
              </Suspense>
            </AdminProtection>
          } />
          
          <Route path="/admin/promo-codes" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <PromoCodesAdmin />
              </Suspense>
            </AdminProtection>
          } />
          
          <Route path="/admin/tier-list" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <TierListAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/chasseurs" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <ChasseursAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/artefacts" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <ArtefactsAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/noyaux" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <NoyauxAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/armes" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <ArmesAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/youtube" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <YoutubeAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/sets-bonus" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <SetsBonusAdmin />
              </Suspense>
            </AdminProtection>
          } />

          <Route path="/admin/profil" element={
            <AdminProtection>
              <Suspense fallback={<LoadingFallback />}>
                <ProfilAdmin />
              </Suspense>
            </AdminProtection>
          } />

          
          {/* Route de connexion admin pour test */}
          <Route path="/admin/login" element={
            <Suspense fallback={<LoadingFallback />}>
              <AdminLogin />
            </Suspense>
          } />
          
          <Route path="/ennio" element={
            <Suspense fallback={<LoadingFallback />}>
              <Ennio />
            </Suspense>
          } />
          
          <Route path="/bdg" element={
            <Suspense fallback={<LoadingFallback />}>
              <BossDeGuilde />
            </Suspense>
          } />

          {/* Pages légères sans lazy loading */}
          <Route path="/guides/portals" element={<Portal />} /> 
          <Route path="/guides/ombres" element={<Ombres />} /> 
          <Route path="/guides/simulation" element={<Simulations />} /> 
          <Route path="/guides/boss" element={<Boss />} />
          <Route path="/guides/boss/ennio" element={
            <Suspense fallback={<LoadingFallback />}>
              <Ennio />
            </Suspense>
          } />

          <Route path="/atelier" element={<Prochainement />} />
          <Route path="/atelier/Vulcan" element={<Prochainement />} />
          <Route path="/atelier/Baran" element={<Prochainement />} />
          <Route path="/atelier/Deimos" element={<Prochainement />} />

          <Route path="/promo-codes" element={<PromoCodes />} />
          <Route path="/creators" element={<Creators />} />

          <Route path="/mentions-legales" element={<MentionsLegales />} />
          <Route path="/cgu" element={<ConditionsUtilisation />} />
          <Route path="/confidentialite" element={<PolitiqueConfidentialite />} />

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
