import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Eye, EyeOff, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { signIn, loading, error, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Rediriger automatiquement si déjà connecté
  React.useEffect(() => {
    if (isAuthenticated && !loading) {
      navigate('/admin');
    }
  }, [isAuthenticated, loading, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    
    const success = await signIn(email, password);
    if (success) {
      navigate('/admin'); // Rediriger vers le dashboard après connexion réussie
    }
  };

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-96 p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Informations pour les visiteurs */}
        <Card className="bg-blue-500/10 border-blue-500/20">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="p-2 bg-blue-500/20 rounded-full">
                <Shield className="h-6 w-6 text-blue-400" />
              </div>
              <div>
                <h3 className="font-semibold text-blue-100 mb-2">Information pour les visiteurs</h3>
                <p className="text-blue-200 text-sm leading-relaxed">
                  Cette page est réservée aux <strong>administrateurs du site</strong> uniquement. 
                  En tant que visiteur, <strong>aucune connexion n'est nécessaire</strong> pour naviguer 
                  et consulter tout le contenu du site. Vous pouvez librement accéder aux guides, 
                  builds, tier lists et autres ressources sans créer de compte.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Formulaire de connexion admin */}
        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-1 text-center">
            {/* Bouton retour */}
            <div className="flex justify-start mb-4">
              <Button asChild variant="ghost" size="sm">
                <Link to="/" className="flex items-center gap-2 text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="h-4 w-4" />
                  Retour au site
                </Link>
              </Button>
            </div>
            
            <div className="flex justify-center mb-4">
              <Shield className="h-12 w-12 text-solo-purple" />
            </div>
            <CardTitle className="text-2xl font-bold">Administration</CardTitle>
            <p className="text-sm text-muted-foreground">
              Accès réservé aux administrateurs pour la gestion du contenu
            </p>
          </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  autoComplete="new-password"
                  autoCapitalize="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button 
              type="submit" 
              className="w-full" 
              disabled={loading || !email || !password}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                'Se connecter'
              )}
            </Button>
          </form>
        </CardContent>
        </Card>
      </div>
      </div>
    </Layout>
  );
}