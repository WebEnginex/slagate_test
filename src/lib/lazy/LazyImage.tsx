import * as React from "react";
import { useInView } from 'react-intersection-observer';
import { fetchAndCacheImage } from '../idb/imageCache';

// 📋 Types pour les props du composant
interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  fallbackClassName?: string;
  showSpinner?: boolean;
  threshold?: number;
  rootMargin?: string;
  lazyLoad?: boolean;
}

// 🎨 Spinner simple (optionnel)
const Spinner: React.FC<{ className?: string }> = ({ className = "" }) => (
  <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-blue-600 ${className}`}>
    <span className="sr-only">Chargement...</span>
  </div>
);

/**
 * 🖼️ Composant LazyImage avec cache IDB et intersection observer
 * 
 * @param src - URL de l'image à charger
 * @param alt - Texte alternatif
 * @param className - Classes CSS pour l'image
 * @param fallbackClassName - Classes CSS pour le fallback/placeholder
 * @param showSpinner - Afficher un spinner pendant le chargement
 * @param threshold - Seuil de visibilité pour déclencher le chargement (0-1)
 * @param rootMargin - Marge pour déclencher le chargement avant que l'élément soit visible
 */
export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className = "",
  fallbackClassName = "", // Pas de fond par défaut
  showSpinner = true, // Spinner activé par défaut
  threshold = 0.1,
  rootMargin = "50px",
  lazyLoad = true, // Lazy load activé par défaut
}) => {
  // 🔍 Observer pour savoir si l'image est visible
  const { ref, inView } = useInView({
    threshold,
    rootMargin,
    triggerOnce: true, // Se déclenche une seule fois
  });

  // 📸 États du composant
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);

  // 🚀 Effet pour charger l'image quand elle devient visible
  React.useEffect(() => {
    if (!lazyLoad || !inView || imageSrc || hasError) return;

    const loadImage = async () => {
      setIsLoading(true);
      setHasError(false);

      try {
        const cachedImageUrl = await fetchAndCacheImage(src);
        if (process.env.NODE_ENV === 'development') {
          const fileName = src.split('/').pop() || 'image';
          console.log(`🖼️ LazyImage: ${cachedImageUrl.startsWith('blob:') ? '💾 CACHE HIT' : '📥 TÉLÉCHARGÉ'} - ${fileName}`);
          console.log(`🖼️ LazyImage DEBUG: URL source: ${src.substring(0, 60)}...`);
          console.log(`🖼️ LazyImage DEBUG: URL retournée: ${cachedImageUrl.substring(0, 60)}...`);
        }
        setImageSrc(cachedImageUrl);
      } catch (error) {
        setHasError(true);
        setImageSrc(src);
      } finally {
        setIsLoading(false);
      }
    };

    loadImage();
  }, [lazyLoad, inView, src, imageSrc, hasError]);

  // 🧹 Cleanup des URL blob lors du démontage
  React.useEffect(() => {
    return () => {
      if (imageSrc && imageSrc.startsWith('blob:')) {
        URL.revokeObjectURL(imageSrc);
      }
    };
  }, [imageSrc]);

  // 🎨 Rendu du composant avec spinner centré et corrections
  return (
    <div ref={ref} className={`relative ${fallbackClassName} ${className}`} style={{ position: 'relative', overflow: 'hidden' }}>
      {/* Image chargée */}
      {imageSrc && !isLoading && (
        <img
          src={imageSrc}
          alt={alt}
          className={`w-full h-full ${className}`}
          onError={() => {
            setHasError(true);
          }}
        />
      )}

      {/* Spinner pendant le chargement */}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
          <Spinner className="w-8 h-8" />
        </div>
      )}

      {/* Fallback en cas d'erreur */}
      {hasError && !imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-500">
          <svg
            className="w-8 h-8"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      )}

      {/* Placeholder quand l'image n'est pas encore visible */}
      {!inView && !imageSrc && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          {/* Optionnel : icône de placeholder */}
        </div>
      )}
    </div>
  );
};

export default LazyImage;
