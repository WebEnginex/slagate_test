import * as React from "react";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { X, ChevronDown, ChevronUp } from "lucide-react";
import LastModified from "@/components/LastModified";
import { lastModifiedDates } from "@/config/last-modification-date/lastModifiedDates";
import SEO from "@/components/SEO";
import LazyImage from "@/lib/lazy";
import { PublicPromoCodesService } from "@/services/public-promo-codes-service";
import { formatPromoCodesForPublic, type PublicPromoCode } from "@/utils/promo-codes-formatter";

type SocialLink = {
  type: "youtube" | "twitch" | "twitter" | "instagram" | "website" | "tiktok";
  url: string;
  label: string;
};

// Déclaration globale de socialLinks
const socialLinks: SocialLink[] = [
  {
    type: "youtube",
    url: "https://www.youtube.com/@Sohoven",
    label: "Sohoven",
  },
  { type: "twitch", url: "https://www.twitch.tv/sohoven", label: "sohoven" },
  {
    type: "tiktok",
    url: "https://www.tiktok.com/@sohovenn",
    label: "@sohoven",
  },
  { type: "twitter", url: "https://x.com/Soho_ven", label: "@Soho_ven" },
  {
    type: "instagram",
    url: "https://www.instagram.com/sohoven",
    label: "sohoven",
  },
  {
    type: "website",
    url: "https://creator.netmarble.com/en/sololv/ranking/sohoven",
    label: "Page créateur",
  },
];

const copyToClipboard = (code: string) => {
  navigator.clipboard.writeText(code);
  alert(`Code promo "${code}" copié dans le presse-papiers !`);
};

// Mise à jour de la fonction getSocialIcon pour utiliser LazyImage
const getSocialIcon = (type: SocialLink["type"]) => {
  const iconMap: Record<SocialLink["type"], string> = {
    youtube: "/icons/youtube.svg",
    twitch: "/icons/twitch.svg",
    tiktok: "/icons/tiktok.svg",
    twitter: "/icons/twitter.svg",
    instagram: "/icons/instagram.svg",
    website: "/icons/external-link.svg",
  };

  return (
    <LazyImage
      src={iconMap[type]}
      alt={type}
      className="h-5 w-5"
      showSpinner={false}
      fallbackClassName="h-5 w-5"
    />
  );
};

// Fonction pour formatter le texte avec mise en évidence des mots entre guillemets
const formatDescription = (text: React.ReactNode) => {
  if (typeof text !== "string") return text;

  // Diviser le texte en segments (texte normal et texte entre guillemets)
  const segments = text.split(/(".*?")/g);

  return segments.map((segment, i) => {
    // Si le segment commence et finit par des guillemets, c'est un texte à mettre en évidence
    if (segment.startsWith('"') && segment.endsWith('"')) {
      // Enlever les guillemets et mettre en évidence
      const content = segment.slice(1, -1);
      return (
        <span key={i} style={{ color: "rgb(155 135 245)" }}>
          {content}
        </span>
      );
    }
    // Sinon, retourner le texte tel quel
    return segment;
  });
};

// Fonction pour mettre en évidence les chiffres dans les récompenses
const highlightNumbers = (text: string) => {
  return text.split(/(\d+)/g).map((segment, i) => {
    if (!isNaN(Number(segment)) && segment.trim() !== "") {
      return (
        <span key={i} style={{ color: "rgb(167,139,250)" }}>
          {segment}
        </span>
      );
    }
    return segment;
  });
};

// =========================
// Utilisation conforme au guide d'implémentation
// =========================

// Constante pour identifier cette page dans le système de logs
const PAGE_ID = "PromoCodes";

// =========================
// Composant Memo pour les cartes de codes promo
// =========================
const PromoCard = React.memo(({ promo, onCopy, copiedCode }: {
  promo: PublicPromoCode;
  onCopy: (code: string) => void;
  copiedCode: string | null;
}) => (
  <Card className="p-4 border border-card-border relative">
    <div className="flex flex-col gap-2">
      <p className="text-lg font-semibold text-white">{promo.code}</p>
      <ul className="list-disc list-inside text-sm text-muted-foreground">
        {promo.rewards.map((reward, i) => (
          <li key={i}>{highlightNumbers(reward)}</li>
        ))}
      </ul>
      <p className="text-md font-semibold text-white">
        Le code expire le : <span className="text-yellow-400">{promo.date}</span>
      </p>
    </div>
    <Button
      variant="secondary"
      size="sm"
      className="absolute top-4 right-4 bg-solo-purple text-white hover:bg-solo-purple hover:scale-105 hover:shadow-lg transition-transform duration-300"
      onClick={() => onCopy(promo.code)}
    >
      {copiedCode === promo.code ? "Copié" : "Copier"}
    </Button>
  </Card>
));
PromoCard.displayName = "PromoCard";

// =========================
// Composant principal
// =========================
const PromoCodes = () => {
  // État pour les codes promo chargés depuis Supabase
  const [promoCodes, setPromoCodes] = React.useState<PublicPromoCode[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // État simplifié : code copié + modal + étape ouverte
  const [state, setState] = React.useState<{
    copiedCode: string | null;
    modalImage: string | null;
    openStep: number | null;
  }>({
    copiedCode: null,
    modalImage: null,
    openStep: 0,
  });

  const steps = [
    {
      title: "Lancez le jeu Solo Leveling: Arise",
      description:
        "Assurez-vous d'être connecté à votre compte. Pour cela il suffit de rentrer vos identifiants et de vous connecter au jeu.",
      image: "/images/code_promo/tuto_pomo_code_1.webp",
    },
    {
      title: "Ouvrez le menu principal",
      description:
        "Pour ouvrir le menu principal, appuyez sur l'icône avec les quatre carrés dans le coin supérieur droit de l'écran.",
      image: "/images/code_promo/tuto_pomo_code_2.webp",
    },
    {
      title: "Accédez au menu des paramètres",
      description:
        "Ensuite dans le menu principal, cliquez sur l'icône \"d'engrenage\" en bas à droite pour ouvrir le menu des paramètres.",
      image: "/images/code_promo/tuto_pomo_code_3.webp",
    },
    {
      title: "Accédez à la gestion du compte",
      description:
        'Cliquez sur "Comptes" dans le menu latéral à gauche pour accéder au menu de la gestion du compte.',
      image: "/images/code_promo/tuto_pomo_code_4.webp",
    },
    {
      title: "Ouvrez l'interface pour saisir un code",
      description:
        'Cliquez sur le bouton "Saisir un code" en bas à droite pour ouvrir l\'interface qui permet de rentrer et valider un code promotionnel.',
      image: "/images/code_promo/tuto_pomo_code_5.webp",
    },
    {
      title: "Entrez votre code",
      description:
        'Une fenêtre s\'ouvre. Vous pouvez coller avec le code copié avec le raccourci "ctrl+v" ou écrire le code vous-même, puis cliquer sur "Utiliser" pour valider le code.',
      image: "/images/code_promo/tuto_pomo_code_6.webp",
    },
    {
      title: "Récupérez vos récompenses",
      description:
        'Les récompenses seront envoyées directement dans votre "messagerie" en jeu. Ouvrez-la pour les récupérer.',
      image: "/images/code_promo/tuto_pomo_code_7.webp",
    },
  ];

  // =========================
  // Chargement des codes promo depuis Supabase
  // =========================
  React.useEffect(() => {
    const loadPromoCodes = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const promoCodesWithRewards = await PublicPromoCodesService.getAllPromoCodes();
        const formattedCodes = formatPromoCodesForPublic(promoCodesWithRewards);
        
        setPromoCodes(formattedCodes);
        
        // Log de développement
        if (process.env.NODE_ENV === 'development') {
          console.log(`🎫 ${PAGE_ID}: ${formattedCodes.length} codes promo chargés depuis Supabase`);
          console.log(`🎫 ${PAGE_ID}: Codes:`, formattedCodes.map(c => c.code).join(', '));
        }
      } catch (err) {
        console.error('Erreur lors du chargement des codes promo:', err);
        setError('Impossible de charger les codes promo. Veuillez réessayer plus tard.');
      } finally {
        setLoading(false);
      }
    };

    loadPromoCodes();
  }, []);

  // Log de développement pour valider l'implémentation
  if (process.env.NODE_ENV === 'development') {
    console.log(`🎫 ${PAGE_ID}: Page initialisée avec ${promoCodes.length} codes promo et ${steps.length} étapes du guide`);
    console.log(`🎫 ${PAGE_ID}: Toutes les images gérées par LazyImage + IndexedDB (conforme au guide)`);
  }

  // =========================
  // Gestion du copier/coller des codes promo
  // =========================
  const handleCopy = React.useCallback((code: string) => {
    navigator.clipboard.writeText(code);
    setState((prev) => ({ ...prev, copiedCode: code }));
    setTimeout(() => setState((prev) => ({ ...prev, copiedCode: null })), 2000);
    
    // Log de développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎫 ${PAGE_ID}: Code promo copié: ${code}`);
    }
  }, []);

  // =========================
  // Gestion du modal d'image
  // =========================
  const openModal = React.useCallback((image: string) => {
    setState((prev) => ({ ...prev, modalImage: image }));
    
    // Log de développement
    if (process.env.NODE_ENV === 'development') {
      console.log(`🎫 ${PAGE_ID}: Modal ouvert pour l'image: ${image.split('/').pop()}`);
    }
  }, []);
  const closeModal = React.useCallback(() => {
    setState((prev) => ({ ...prev, modalImage: null }));
  }, []);

  // =========================
  // Gestion de l'ouverture des étapes du guide
  // =========================
  const toggleStep = React.useCallback((index: number) => {
    setState((prev) => ({ ...prev, openStep: prev.openStep === index ? null : index }));
  }, []);

  // =========================
  // Render principal
  // =========================
  return (
    <Layout>
      <SEO
        title="Codes Promotionnels - Solo Leveling: ARISE"
        description="Découvrez les derniers codes promotionnels pour Solo Leveling: ARISE. Obtenez des récompenses gratuites en utilisant ces codes avant leur expiration."
        keywords="Solo Leveling, ARISE, codes promo, récompenses, SLAGATE, codes promotionnels, cadeaux gratuits"
      />
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Codes Promotionnels</h1>
        <p className="">
          Utilisez ces codes dans le jeu pour obtenir des récompenses gratuites.
          N'oubliez pas de les utiliser avant leur expiration!
        </p>
      </div>

      {/* Section réseaux sociaux de Sohoven */}
      <Card className="mb-8 overflow-hidden bg-gradient-to-r from-solo-purple to-solo-dark-purple">
        <div className="p-6">
          <div className="flex flex-col sm:flex-row items-center gap-6">
            <div className="aspect-square w-32 h-32 overflow-hidden rounded-full bg-muted border-4 border-white/10">
              <LazyImage
                src="/images/logo/Sohoven_Logo.webp"
                alt="Sohoven"
                className="h-full w-full object-cover"
                showSpinner={true}
                fallbackClassName="h-full w-full bg-gray-600"
              />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold mb-2">Sohoven</h2>
              <p className=" mb-4">
                Créateur de contenu français pour Solo Leveling: Arise
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-3">
                {socialLinks.map((link, idx) => (
                  <Button
                    key={idx}
                    variant="secondary"
                    size="sm"
                    className="gap-2 bg-white/10 hover:bg-white/20 transition-colors"
                    asChild
                  >
                    <a
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {getSocialIcon(link.type)}
                      <span>{link.label}</span>
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Section des codes promo */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold">Codes Promo Disponibles</h2>
        <p>
          {/* Ajout de la date de dernière modification */}
          <LastModified date={lastModifiedDates.promoCodes} />
        </p>
        
        {/* Gestion du loading */}
        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-solo-purple mx-auto mb-4"></div>
              <p className="text-muted-foreground">Chargement des codes promo...</p>
            </div>
          </div>
        )}

        {/* Gestion des erreurs */}
        {error && !loading && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {/* Affichage des codes promo */}
        {!loading && !error && promoCodes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
            {promoCodes.map((promo, index) => (
              <PromoCard
                key={promo.code}
                promo={promo}
                onCopy={handleCopy}
                copiedCode={state.copiedCode}
              />
            ))}
          </div>
        )}

        {/* Message si aucun code */}
        {!loading && !error && promoCodes.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Aucun code promo disponible pour le moment.</p>
          </div>
        )}
      </div>

      {/* Guide étape par étape */}
      <div className="space-y-4 mb-8">
        <h2 className="text-2xl font-bold">Guide étape par étape</h2>

        {steps.map((step, index) => (
          <Card key={index} className="overflow-hidden">
            <Collapsible
              open={state.openStep === index}
              onOpenChange={() => toggleStep(index)}
            >
              <CollapsibleTrigger className="w-full">
                <div className="p-6 cursor-pointer flex flex-row items-center justify-between hover:bg-transparent transition-colors">
                  <div className="flex-1">
                    <CardTitle className="flex items-center">
                      <span className="bg-solo-purple text-white rounded-full w-8 h-8 flex items-center justify-center mr-3">
                        {index + 1}
                      </span>
                      <span className="flex-1">{step.title}</span>
                    </CardTitle>
                  </div>
                  <div className="ml-4">
                    {state.openStep === index ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <CardContent className="pb-6">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div
                      className="w-full md:w-1/3 aspect-video bg-muted rounded-lg overflow-hidden cursor-pointer"
                      onClick={() => openModal(step.image)}
                    >
                      <LazyImage
                        src={step.image}
                        alt={`Étape ${index + 1}`}
                        className="h-full w-full object-cover"
                        showSpinner={true}
                        fallbackClassName="h-full w-full bg-transparent rounded-lg"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-4">
                        {formatDescription(step.description)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      {/* Modal pour afficher l'image en grand */}
      {state.modalImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="relative w-full h-full p-2 flex items-center justify-center">
            <button
              className="absolute top-4 right-4 text-white bg-black bg-opacity-50 rounded-full p-2 z-10"
              onClick={closeModal}
            >
              <X className="h-6 w-6" />
            </button>
            <LazyImage
              src={state.modalImage}
              alt="Agrandissement"
              className="max-w-full max-h-full object-contain rounded-lg"
              showSpinner={true}
              fallbackClassName="max-w-full max-h-full bg-gray-600 rounded-lg"
            />
          </div>
        </div>
      )}

      
    </Layout>
  );
};

export default PromoCodes;