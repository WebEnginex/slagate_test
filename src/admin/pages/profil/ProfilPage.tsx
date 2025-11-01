import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { User, Mail, Lock, Save, AlertCircle, CheckCircle2 } from "lucide-react";
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

  // Charger les données du profil
  useEffect(() => {
    async function loadProfile() {
      const profile = await getUserProfile();
      if (profile) {
        setDisplayName(profile.displayName);
        // Ne pas pré-remplir l'email, seulement le display name
      }
    }
    loadProfile();
  }, []);

  // Mettre à jour le display name
  const handleUpdateDisplayName = async (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayNameLoading(true);
    setDisplayNameMessage(null);

    const result = await updateDisplayName({ displayName });
    
    setDisplayNameLoading(false);
    if (result.success) {
      setDisplayNameMessage({ type: 'success', text: 'Nom d\'affichage mis à jour avec succès' });
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
    } else {
      setPasswordMessage({ type: 'error', text: result.error || 'Erreur lors de la mise à jour' });
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-solo-purple via-purple-700 to-solo-dark-purple rounded-2xl shadow-2xl p-8">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/30 rounded-full blur-3xl"></div>
        
        <div className="relative">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-400 to-purple-600 flex items-center justify-center">
              <User className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Mon Profil</h1>
              <p className="text-gray-200">Gérez vos informations personnelles</p>
            </div>
          </div>
        </div>
      </div>

      {/* Informations de base */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <User className="h-5 w-5" />
            Informations générales
          </CardTitle>
          <CardDescription className="text-gray-400">
            Modifiez votre nom d'affichage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateDisplayName} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="displayName" className="text-white">Nom d'affichage</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Votre nom d'affichage"
                className="bg-background border-sidebar-border text-white"
              />
            </div>
            
            {displayNameMessage && (
              <Alert variant={displayNameMessage.type === 'error' ? 'destructive' : 'default'}>
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
              className="bg-solo-purple hover:bg-solo-purple/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {displayNameLoading ? 'Enregistrement...' : 'Enregistrer'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-sidebar-border" />

      {/* Email */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="h-5 w-5" />
            Adresse email
          </CardTitle>
          <CardDescription className="text-gray-400">
            Modifiez votre adresse email (nécessite une confirmation)
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdateEmail} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="votre.email@exemple.com"
                className="bg-background border-sidebar-border text-white"
              />
              <p className="text-xs text-gray-400">
                Un email de confirmation sera envoyé à la nouvelle adresse
              </p>
            </div>
            
            {emailMessage && (
              <Alert variant={emailMessage.type === 'error' ? 'destructive' : 'default'}>
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
              className="bg-solo-purple hover:bg-solo-purple/90"
            >
              <Save className="h-4 w-4 mr-2" />
              {emailLoading ? 'Enregistrement...' : 'Mettre à jour l\'email'}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Separator className="bg-sidebar-border" />

      {/* Mot de passe */}
      <Card className="bg-sidebar border-sidebar-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Lock className="h-5 w-5" />
            Mot de passe
          </CardTitle>
          <CardDescription className="text-gray-400">
            Changez votre mot de passe
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword" className="text-white">Mot de passe actuel</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-sidebar-border text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword" className="text-white">Nouveau mot de passe</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-sidebar-border text-white"
              />
              <p className="text-xs text-gray-400">Minimum 6 caractères</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-white">Confirmer le nouveau mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="bg-background border-sidebar-border text-white"
              />
            </div>
            
            {passwordMessage && (
              <Alert variant={passwordMessage.type === 'error' ? 'destructive' : 'default'}>
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
              disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
              className="bg-solo-purple hover:bg-solo-purple/90"
            >
              <Lock className="h-4 w-4 mr-2" />
              {passwordLoading ? 'Modification...' : 'Changer le mot de passe'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

export default ProfilPage;
