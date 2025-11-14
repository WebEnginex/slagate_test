/**
 * Page d'administration des codes promo
 */

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/admin/components/layout/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger 
} from '@/components/ui/dialog';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Edit, Trash2, Gift, Calendar, Users } from 'lucide-react';
import { formatPromoCodeDate, createExpirationDate, isPromoCodeExpired, isPromoCodePermanent, formatDateForInput } from '@/admin/utils/date-utils';
import { PromoCodesService } from '@/admin/services/promo-codes-service';
import type { PromoCodeWithRewards, CreatePromoCodeData, UpdatePromoCodeData } from '@/admin/types/promo-codes';
import { toast } from '@/hooks/use-toast';

const PromoCodesAdminPage: React.FC = () => {
  const [promoCodes, setPromoCodes] = useState<PromoCodeWithRewards[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingPromoCode, setEditingPromoCode] = useState<PromoCodeWithRewards | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    code: string;
    expirationDate: string;
    isPermanent: boolean;
    rewards: Array<{
      id?: string;
      reward_name: string;
      reward_quantity: number;
      _tempId?: string; // ID temporaire pour React key
      _toDelete?: boolean; // Marquer pour suppression
    }>;
  }>({
    code: '',
    expirationDate: '',
    isPermanent: false,
    rewards: [{ reward_name: '', reward_quantity: 1, _tempId: crypto.randomUUID() }]
  });

  useEffect(() => {
    loadPromoCodes();
  }, []);

  const loadPromoCodes = async () => {
    setLoading(true);
    try {
      const codes = await PromoCodesService.getAllPromoCodes();
      setPromoCodes(codes);
    } catch (error) {
      console.error('Erreur lors du chargement des codes promo:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePromoCode = async () => {
    try {
      // Validation
      if (!formData.code.trim() || formData.rewards.length === 0) {
        toast({ 
          title: "Erreur", 
          description: "Veuillez remplir tous les champs obligatoires", 
          variant: "destructive" 
        });
        return;
      }

      // Validation de la date d'expiration
      if (!formData.isPermanent && !formData.expirationDate.trim()) {
        toast({ 
          title: "Erreur", 
          description: "Veuillez définir une date d'expiration ou cocher \"Permanent\"", 
          variant: "destructive" 
        });
        return;
      }

      // Filtrer les récompenses valides (nom non vide et quantité > 0)
      const validRewards = formData.rewards
        .filter(r => r.reward_name.trim() && r.reward_quantity > 0)
        .map(r => ({
          reward_name: r.reward_name.trim(),
          reward_quantity: r.reward_quantity
        }));

      // Vérifier qu'il y a au moins une récompense valide
      if (validRewards.length === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter au moins une récompense valide",
          variant: "destructive"
        });
        return;
      }

      const newPromoCode: CreatePromoCodeData = {
        code: formData.code.trim().toUpperCase(),
        expires_at: formData.isPermanent ? null : createExpirationDate(formData.expirationDate),
        rewards: validRewards
      };

      const createdPromoCode = await PromoCodesService.createPromoCode(newPromoCode);
      console.log('Code promo créé avec succès:', createdPromoCode);
      
      // Reset form
      resetForm();
      setIsCreateDialogOpen(false);
      await loadPromoCodes();
    } catch (error) {
      console.error('Erreur lors de la création du code promo:', error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la création du code promo", 
        variant: "destructive" 
      });
    }
  };

  const handleDeletePromoCode = async (id: string) => {
    try {
      await PromoCodesService.deletePromoCode(id);
      console.log('Code promo supprimé avec succès:', id);
      await loadPromoCodes();
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la suppression du code promo", 
        variant: "destructive" 
      });
    }
  };

  const handleEditPromoCode = (promoCode: PromoCodeWithRewards) => {
    setEditingPromoCode(promoCode);

    // Pré-remplir le formulaire avec les données existantes
    setFormData({
      code: promoCode.code,
      expirationDate: formatDateForInput(promoCode.expires_at),
      isPermanent: !promoCode.expires_at,
      rewards: promoCode.rewards.map(reward => ({
        id: reward.id, // Conserver l'ID pour la mise à jour
        reward_name: reward.reward_name,
        reward_quantity: reward.reward_quantity,
        _tempId: reward.id // Utiliser l'ID comme clé temporaire
      }))
    });

    setIsCreateDialogOpen(true);
  };

  const handleUpdatePromoCode = async () => {
    if (!editingPromoCode) return;
    
    try {
      // Validation
      if (!formData.code.trim() || formData.rewards.length === 0) {
        toast({ 
          title: "Erreur", 
          description: "Veuillez remplir tous les champs obligatoires", 
          variant: "destructive" 
        });
        return;
      }

      // Validation de la date d'expiration
      if (!formData.isPermanent && !formData.expirationDate.trim()) {
        toast({ 
          title: "Erreur", 
          description: "Veuillez définir une date d'expiration ou cocher \"Permanent\"", 
          variant: "destructive" 
        });
        return;
      }

      // Préparer les récompenses pour la mise à jour
      const rewardsForUpdate = formData.rewards.map(r => ({
        id: r.id, // Conserver l'ID si présent
        reward_name: r.reward_name.trim(),
        reward_quantity: r.reward_quantity,
        _toDelete: r._toDelete // Conserver le flag de suppression
      }));

      // Vérifier qu'il y a au moins une récompense valide (non marquée pour suppression)
      const validRewardsCount = rewardsForUpdate.filter(r => !r._toDelete && r.reward_name && r.reward_quantity > 0).length;
      if (validRewardsCount === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter au moins une récompense valide",
          variant: "destructive"
        });
        return;
      }

      const updateData = {
        code: formData.code.trim().toUpperCase(),
        expires_at: formData.isPermanent ? null : createExpirationDate(formData.expirationDate),
        rewards: rewardsForUpdate
      };

      await PromoCodesService.updatePromoCode(editingPromoCode.id, updateData);
      console.log('Code promo modifié avec succès:', updateData);
      
      // Reset form
      resetForm();
      setIsCreateDialogOpen(false);
      await loadPromoCodes();
    } catch (error) {
      console.error('Erreur lors de la modification du code promo:', error);
      toast({ 
        title: "Erreur", 
        description: "Erreur lors de la modification du code promo", 
        variant: "destructive" 
      });
    }
  };

  const resetForm = () => {
    // Date par défaut : dans une semaine à 23h59
    const defaultDate = new Date();
    defaultDate.setDate(defaultDate.getDate() + 7);
    defaultDate.setHours(23, 59, 0, 0);

    setFormData({
      code: '',
      expirationDate: formatDateForInput(defaultDate.toISOString()),
      isPermanent: false,
      rewards: [{ reward_name: '', reward_quantity: 1, _tempId: crypto.randomUUID() }]
    });
    setEditingPromoCode(null);
  };

  const addReward = () => {
    setFormData(prev => ({
      ...prev,
      rewards: [...prev.rewards, { reward_name: '', reward_quantity: 1, _tempId: crypto.randomUUID() }]
    }));
  };

  const removeReward = (index: number) => {
    setFormData(prev => {
      const reward = prev.rewards[index];

      // Si la récompense a un ID (existe en base), on la marque pour suppression
      if (reward.id) {
        return {
          ...prev,
          rewards: prev.rewards.map((r, i) =>
            i === index ? { ...r, _toDelete: true } : r
          )
        };
      } else {
        // Sinon (nouvelle récompense), on la supprime du tableau
        return {
          ...prev,
          rewards: prev.rewards.filter((_, i) => i !== index)
        };
      }
    });
  };

  const updateReward = (index: number, field: 'reward_name' | 'reward_quantity', value: string | number) => {
    setFormData(prev => ({
      ...prev,
      rewards: prev.rewards.map((reward, i) =>
        i === index ? { ...reward, [field]: value } : reward
      )
    }));
  };

  const isExpired = (expiresAt: string | null) => {
    return isPromoCodeExpired(expiresAt);
  };

  const isPermanent = (expiresAt: string | null) => {
    return isPromoCodePermanent(expiresAt);
  };

  return (
    <AdminLayout>
      <div className="space-y-4">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white">Codes Promo</h1>
          <p className="text-gray-400 mt-1">
            Gérez les codes promotionnels et leurs récompenses
          </p>
        </div>
        
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm} size="sm" className="bg-rose-600 hover:bg-rose-700">
              <Plus className="w-4 h-4 sm:mr-2" />
              <span className="hidden sm:inline">Nouveau Code</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>
                {editingPromoCode ? 'Modifier le code promo' : 'Créer un nouveau code promo'}
              </DialogTitle>
              <DialogDescription>
                Ajoutez un nouveau code promotionnel avec ses récompenses
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              {/* Code */}
              <div className="space-y-2">
                <Label htmlFor="code">Code promo *</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="Ex: SLAGATE2024"
                  className="uppercase"
                />
              </div>

              {/* Date d'expiration */}
              <div className="space-y-3">
                <Label>Expiration</Label>
                
                {/* Checkbox permanent */}
                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="permanent"
                    checked={formData.isPermanent}
                    onCheckedChange={(checked) => 
                      setFormData(prev => ({ 
                        ...prev, 
                        isPermanent: !!checked,
                        expirationDate: checked ? '' : prev.expirationDate 
                      }))
                    }
                  />
                  <Label htmlFor="permanent" className="text-sm font-normal">
                    Code permanent (pas d'expiration)
                  </Label>
                </div>

                {/* Champ date (désactivé si permanent) */}
                {!formData.isPermanent && (
                  <div className="space-y-1">
                    <Input
                      id="expiration"
                      type="datetime-local"
                      value={formData.expirationDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, expirationDate: e.target.value }))}
                      className="w-full [color-scheme:dark]"
                    />
                    <p className="text-xs text-gray-500">
                      Sélectionnez une date et heure d'expiration
                    </p>
                  </div>
                )}
              </div>

              {/* Récompenses */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>
                    Récompenses *
                    <span className="text-xs text-muted-foreground ml-2">
                      ({formData.rewards.filter(r => !r._toDelete).length} récompense{formData.rewards.filter(r => !r._toDelete).length > 1 ? 's' : ''})
                    </span>
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addReward}
                  >
                    <Plus className="w-3 h-3 mr-1" />
                    Ajouter
                  </Button>
                </div>

                {/* Conteneur avec scroll pour les récompenses */}
                <div className="max-h-[300px] overflow-y-auto pr-2 space-y-3 border rounded-md p-3 bg-sidebar-accent/30">
                  {formData.rewards.filter(r => !r._toDelete).map((reward, index) => {
                    // Trouver l'index réel dans le tableau complet
                    const realIndex = formData.rewards.findIndex(r =>
                      (r._tempId && r._tempId === reward._tempId) ||
                      (r.id && r.id === reward.id) ||
                      r === reward
                    );

                    return (
                      <div
                        key={reward._tempId || reward.id || realIndex}
                        className="flex gap-2 items-end bg-sidebar p-2 rounded-md border border-sidebar-border"
                      >
                        <div className="flex-1">
                          <Label htmlFor={`reward-name-${realIndex}`} className="text-xs">
                            Nom de la récompense
                          </Label>
                          <Input
                            id={`reward-name-${realIndex}`}
                            value={reward.reward_name}
                            onChange={(e) => updateReward(realIndex, 'reward_name', e.target.value)}
                            placeholder="Ex: Gold, Cristal abyssal"
                          />
                        </div>
                        <div className="w-24">
                          <Label htmlFor={`reward-quantity-${realIndex}`} className="text-xs">
                            Quantité
                          </Label>
                          <Input
                            id={`reward-quantity-${realIndex}`}
                            type="number"
                            min="1"
                            value={reward.reward_quantity}
                            onChange={(e) => updateReward(realIndex, 'reward_quantity', parseInt(e.target.value) || 1)}
                          />
                        </div>
                        {formData.rewards.filter(r => !r._toDelete).length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeReward(realIndex)}
                            className="text-red-500 hover:text-red-700 hover:bg-red-500/10"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsCreateDialogOpen(false);
                }}
              >
                Annuler
              </Button>
              <Button
                onClick={editingPromoCode ? handleUpdatePromoCode : handleCreatePromoCode}
                className="bg-violet-600 hover:bg-violet-700"
              >
                {editingPromoCode ? 'Modifier le code' : 'Créer le code'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Liste des codes */}
      <div className="space-y-4">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">Chargement des codes promo...</p>
            </CardContent>
          </Card>
        ) : promoCodes.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <Gift className="w-12 h-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-2">Aucun code promo trouvé</p>
              <p className="text-sm text-gray-500">
                Créez votre premier code promo en cliquant sur "Nouveau Code"
              </p>
            </CardContent>
          </Card>
        ) : (
          promoCodes.map((promoCode) => (
            <Card key={promoCode.id} className="border border-gray-700">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <CardTitle className="text-xl font-bold text-white">
                      {promoCode.code}
                    </CardTitle>
                    <Badge 
                      variant={isExpired(promoCode.expires_at) ? "destructive" : "default"}
                      className={
                        isPermanent(promoCode.expires_at) ? 
                          "bg-blue-500/20 text-blue-400" :
                          isExpired(promoCode.expires_at) ? 
                            "bg-red-500/20 text-red-400" : 
                            "bg-green-500/20 text-green-400"
                      }
                    >
                      {isPermanent(promoCode.expires_at) ? 
                        'Permanent' : 
                        isExpired(promoCode.expires_at) ? 
                          'Expiré' : 
                          'Actif'
                      }
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleEditPromoCode(promoCode)}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="text-red-400 hover:text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                          <AlertDialogDescription>
                            Êtes-vous sûr de vouloir supprimer le code promo "{promoCode.code}" ? 
                            Cette action est irréversible.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Annuler</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeletePromoCode(promoCode.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Supprimer
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                
                <p className="text-sm text-gray-400">
                  Expire le {formatPromoCodeDate(promoCode.expires_at)}
                </p>
              </CardHeader>
              
              <CardContent>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Récompenses :</h4>
                  <div className="flex flex-wrap gap-2">
                    {promoCode.rewards.map((reward) => (
                      <Badge 
                        key={reward.id} 
                        variant="secondary" 
                        className="bg-violet-500/20 text-violet-300"
                      >
                        {reward.reward_name} x{reward.reward_quantity.toLocaleString('fr-FR')}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
      </div>
    </AdminLayout>
  );
};

export default PromoCodesAdminPage;