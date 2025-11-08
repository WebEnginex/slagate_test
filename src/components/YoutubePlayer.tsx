/**
 * Composant pour afficher la vidéo YouTube active sur la page d'accueil
 */

import React, { useEffect, useState } from 'react';
import { YoutubeService } from '@/admin/pages/youtube/services/youtubeService';
import type { YoutubeLink } from '@/admin/pages/youtube/types';

export const YoutubePlayer: React.FC = () => {
  const [activeLink, setActiveLink] = useState<YoutubeLink | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadActiveVideo = async () => {
      try {
        setLoading(true);
        setError(null);
        const link = await YoutubeService.getActiveLink();
        setActiveLink(link);
      } catch (err) {
        console.error('Erreur lors du chargement de la vidéo YouTube:', err);
        setError('Impossible de charger la vidéo');
      } finally {
        setLoading(false);
      }
    };

    loadActiveVideo();
  }, []);

  // Ne rien afficher si pas de vidéo active
  if (loading || error || !activeLink) {
    return null;
  }

  const embedUrl = YoutubeService.getEmbedUrl(activeLink.url);
  if (!embedUrl) {
    return null;
  }

  return (
    <div className="mb-16">
      <h2 className="text-3xl font-bold text-center text-violet-400 mb-8">
        Dernière vidéo sortie
      </h2>
      <div className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto aspect-video">
        <iframe
          src={embedUrl}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
          title="Dernière vidéo YouTube"
        ></iframe>
      </div>
    </div>
  );
};
