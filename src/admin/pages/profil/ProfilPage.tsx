import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2, Eye, EyeOff, Shield } from "lucide-react";
import { useAuth } from "@/admin/auth/hooks/useAuth";
import { 
  updateDisplayName, 
  updateEmail, 
  updatePassword, 
  getUserProfile 
} from "@/admin/services/profile-service";

export function ProfilPage() {
  const { user } = useAuth();
  
  // États pour le display name
  const [displayName, setDisplayName] = useState("");
  const [displayNameLoading, setDisplayNameLoading] = useState(false);
  const [displayNameMessage, setDisplayNameMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // États pour l'email
  const [email, setEmail] = useState("");
  const [emailLoading, setEmailLoading] = useState(false);
  const [emailMessage, setEmailMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

  // États pour le mot de passe
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
  
  // États pour la visibilité des mots de passe
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // État pour l'affichage de l'email
  const [showEmail, setShowEmail] = useState(false);

  // Charger les données du profil
  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setDisplayName(profile.displayName);
        setEmail(user?.email || "");
      }
    }
    loadProfile();
  }, [user]);

  // Mettre à jour le display name
  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayNameLoading(true);
    setDisplayNameMessage(null);

    const result = await updateDisplayName({ displayName });
    
    setDisplayNameLoading(false);
    if (result.success) {
      setDisplayNameMessage({ type: 'success', text: 'Nom d\'affichage mis à jour avec succès' });
      setTimeout(() => setDisplayNameMessage(null), 5000);
    } else {
      setDisplayNameMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
    }
  };

  // Mettre à jour l'email
  const handleUpdateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailLoading(true);
    setEmailMessage(null);

    const result = await updateEmail({ email });
    
    setEmailLoading(false);
    if (result.success) {
      setEmailMessage({ 
        type: 'success', 
        text: 'Un email de confirmation a été envoyé à votre nouvelle adresse. Veuillez vérifier votre boîte de réception.' 
      });
      setTimeout(() => setEmailMessage(null), 8000);
    } else {
      setEmailMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
    }
  };

  // Mettre à jour le mot de passe
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordLoading(true);
    setPasswordMessage(null);

    // Validation
    if (newPassword.length < 6) {
      setPasswordMessage({ type: 'error', text: 'Le nouveau mot de passe doit contenir au moins 6 caractères' });
      setPasswordLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Les mots de passe ne correspondent pas' });
      setPasswordLoading(false);
      return;
    }

    const result = await updatePassword({ currentPassword, newPassword });
    
    setPasswordLoading(false);
    if (result.success) {
      setPasswordMessage({ type: 'success', text: 'Mot de passe mis à jour avec succès' });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPasswordMessage(null), 5000);
    } else {
      setPasswordMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-solo-purple via-purple-700 to-solo-dark-purple rounded-2xl shadow-2xl p-6">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center shadow-lg">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">Mon Profil</h1>
                <p className="text-purple-200 text-sm">Gérez vos informations personnelles et sécurité</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-white/10 text-white border-white/20 backdrop-blur-sm">
                <Shield className="h-3 w-3 mr-1" />
                Compte sécurisé
              </Badge>
            </div>
          </div>
          
          {/* User Info Display */}
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center gap-2 text-purple-200 text-xs mb-1">
                <User className="h-3 w-3" />
                Nom d'affichage
              </div>
              <div className="text-white font-semibold text-sm">{displayName || "Non défini"}</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/20">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2 text-purple-200 text-xs">
                  <Mail className="h-3 w-3" />
                  Email
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmail(!showEmail)}
                  className="flex items-center gap-1.5 text-xs text-purple-200 hover:text-white transition-colors bg-white/5 hover:bg-white/10 px-2 py-1 rounded"
                >
                  {showEmail ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Masquer
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Afficher
                    </>
                  )}
                </button>
              </div>
              <div className="text-white font-semibold text-sm">
                {showEmail ? (user?.email || "Non défini") : "••••••••••••••••••••"}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid layout pour les 3 sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

      {/* Informations de base */}
      <Card className="bg-sidebar border-sidebar-border hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <div className="w-9 h-9 rounded-lg bg-solo-purple/20 flex items-center justify-center">
              <User className="h-4 w-4 text-solo-purple" />
            </div>
            Informations générales
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Personnalisez votre nom d'affichage
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleUpdateDisplayName} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white flex items-center gap-2">
                Nom d'affichage
                <Badge variant="secondary" className="text-xs">Requis</Badge>
              </Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder=""
                className="bg-background border-sidebar-border text-white h-11"
              />
              <p className="text-xs text-gray-400">
                Ce nom sera affiché dans l'administration
              </p>
            </div>
            
            {displayNameMessage && (
              <Alert variant={displayNameMessage.type === 'error' ? 'destructive' : 'default'} className="animate-in fade-in-50 duration-300">
                {displayNameMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{displayNameMessage.text}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={displayNameLoading}
              className="bg-solo-purple hover:bg-solo-purple/90 w-full sm:w-auto h-11"
            >
              <Save className="h-4 w-4 mr-2" />
              {displayNameLoading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Email */}
      <Card className="bg-sidebar border-sidebar-border hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <div className="w-9 h-9 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Mail className="h-4 w-4 text-blue-400" />
            </div>
            Adresse email
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Modifiez votre email de connexion
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleUpdateEmail} className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white flex items-center gap-2">
                Nouvelle adresse email
                <Badge variant="secondary" className="text-xs">Vérification requise</Badge>
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@email.com"
                className="bg-background border-sidebar-border text-white h-11"
              />
              <Alert className="bg-blue-500/10 border-blue-500/20">
                <AlertCircle className="h-4 w-4 text-blue-400" />
                <AlertDescription className="text-gray-300">
                  Un email de confirmation sera envoyé à la nouvelle adresse. Vous devrez cliquer sur le lien pour valider le changement.
                </AlertDescription>
              </Alert>
            </div>
            
            {emailMessage && (
              <Alert variant={emailMessage.type === 'error' ? 'destructive' : 'default'} className="animate-in fade-in-50 duration-300">
                {emailMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{emailMessage.text}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={emailLoading}
              className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto h-11"
            >
              <Save className="h-4 w-4 mr-2" />
              {emailLoading ? 'Envoi...' : 'Mettre à jour l\'email'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Mot de passe - Full width */}
      <div className="lg:col-span-2">
      <Card className="bg-sidebar border-sidebar-border hover:shadow-lg transition-shadow duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-white text-lg">
            <div className="w-9 h-9 rounded-lg bg-amber-500/20 flex items-center justify-center">
              <Lock className="h-4 w-4 text-amber-400" />
            </div>
            Sécurité du compte
          </CardTitle>
          <CardDescription className="text-gray-400 text-sm">
            Changez votre mot de passe pour sécuriser votre compte
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <form onSubmit={handleUpdatePassword} className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white text-sm">Mot de passe actuel</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-sidebar-border text-white h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white text-sm">Nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type={showNewPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-sidebar-border text-white h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <p className="text-xs text-gray-400">Minimum 6 caractères recommandés</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white text-sm">Confirmer le nouveau mot de passe</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-background border-sidebar-border text-white h-11 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {confirmPassword && newPassword && (
                <div className="flex items-center gap-2 text-sm">
                  {confirmPassword === newPassword ? (
                    <>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-green-500">Les mots de passe correspondent</span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-500">Les mots de passe ne correspondent pas</span>
                    </>
                  )}
                </div>
              )}
            </div>
            </div>
            
            <Alert className="bg-amber-500/10 border-amber-500/20">
              <Shield className="h-4 w-4 text-amber-400" />
              <AlertDescription className="text-gray-300">
                <span className="font-semibold text-amber-400">Recommandations de sécurité :</span> Utilisez un mot de passe unique, combinez lettres, chiffres et symboles.
              </AlertDescription>
            </Alert>
            
            {passwordMessage && (
              <Alert variant={passwordMessage.type === 'error' ? 'destructive' : 'default'} className="animate-in fade-in-50 duration-300">
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                <AlertDescription>{passwordMessage.text}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="bg-amber-600 hover:bg-amber-700 w-full sm:w-auto h-11"
            >
              <Lock className="h-4 w-4 mr-2" />
              {passwordLoading ? 'Modification en cours...' : 'Changer le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
      </div>
      </div>
    </div>
  );
}

export default ProfilPage;
