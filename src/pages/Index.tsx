import React from "react";
import { Link } from "react-router-dom";
import { useSupabaseFetch } from "@/lib";
import { Card, CardContent } from "@/components/ui/card";
import Layout from "@/components/Layout";
import SEO from "@/components/SEO";
import { supabase } from "@/integrations/supabase/client";
import LazyImage from "@/lib/lazy";

// =========================
// Composant Memo pour la carte d'un chasseur
// =========================
const HunterCard = ({
  hunter,
  imageUrl,
}: {
  hunter: { id: number; nom: string };
  imageUrl: string;
}) => (
  <Link to={`/builds#chasseur-${hunter.id}`} className="block h-full">
    <Card className="bg-gray-800 border border-gray-700 shadow-lg hover:shadow-xl transition-shadow duration-300 rounded-lg overflow-hidden h-full flex flex-col">
      <div
        className="relative flex-1 flex justify-center items-end h-64 p-0"
        style={{
          backgroundImage: `url('https://todwuewxymmybbunbclz.supabase.co/storage/v1/object/public/background//Bg_AchievePage_1.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "16rem",
          width: "100%",
        }}
      >
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <LazyImage
            src={imageUrl}
            alt={hunter.nom}
            className="max-h-56 w-auto object-contain mx-auto drop-shadow-xl"
            fallbackClassName="bg-transparent"
            showSpinner={true}
          />
        </div>
        <div className="absolute bottom-0 w-full bg-gradient-to-t from-black/70 to-transparent text-center p-2 z-20">
          <h3 className="text-lg font-bold text-white drop-shadow-md">
            {hunter.nom}
          </h3>
        </div>
      </div>
    </Card>
  </Link>
);

// =========================
// Composant principal
// =========================
const Index = () => {
  // Récupérer les 3 derniers chasseurs ajoutés (triés par id décroissant)
  const { data: hunters, loading, error, mutate } = useSupabaseFetch<
    { id: number; nom: string; image: string }[]
  >(
    "supabase:chasseurs:latest",
    async () => {
      const result = await supabase
        .from("chasseurs")
        .select("id, nom, image")
        .order("id", { ascending: false })
        .limit(3);
      return result.data || [];
    },
    { 
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 1000,
    }
  );

  // Force la revalidation quand la page se monte
  React.useEffect(() => {
    mutate();
  }, [mutate]);

  if (process.env.NODE_ENV === "development") {
    if (loading) {
      console.log("🏠 Index: ⏳ Chargement en cours...");
    } else if (error) {
      console.error("🏠 Index: ❌ Erreur:", error);
    } else if (hunters) {
      console.log(
        `🏠 Index: 🎯 Page prête avec ${hunters.length} chasseurs (images gérées par LazyImage + IndexedDB)`
      );
    }
  }

  // Si pas de données ET en chargement, afficher message
  if (!hunters || hunters.length === 0) {
    if (loading) {
      return <div>Chargement des chasseurs...</div>;
    }
    if (error) {
      return <div>Erreur lors du chargement des chasseurs.</div>;
    }
  }

  // Ordre d'affichage strict : 1 à gauche, 2 au centre, 3 à droite (desktop)
  const orderedHunters = hunters || [];

  return (
    <Layout>
      <SEO
        title="Accueil - SLAGATE | Solo Leveling: ARISE"
        description="Bienvenue sur SLAGATE..."
      />
      <div className="w-full px-6 py-12 text-gray-100">
        <h1 className="text-4xl font-extrabold text-center text-violet-400 mb-10">
          Derniers chasseurs sortis
        </h1>
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Chasseur 1 à gauche (desktop), en haut (mobile) */}
          <div className="flex-1 order-1">
            {orderedHunters[0] && (
              <HunterCard
                key={orderedHunters[0].id}
                hunter={orderedHunters[0]}
                imageUrl={orderedHunters[0].image}
              />
            )}
          </div>
          {/* Chasseur 2 au milieu (desktop), au milieu (mobile) */}
          <div className="flex-1 order-2">
            {orderedHunters[1] && (
              <HunterCard
                key={orderedHunters[1].id}
                hunter={orderedHunters[1]}
                imageUrl={orderedHunters[1].image}
              />
            )}
          </div>
          {/* Chasseur 3 à droite (desktop), en bas (mobile) */}
          <div className="flex-1 order-3">
            {orderedHunters[2] && (
              <HunterCard
                key={orderedHunters[2].id}
                hunter={orderedHunters[2]}
                imageUrl={orderedHunters[2].image}
              />
            )}
          </div>
        </div>
        {/* Section de bienvenue */}
        <div className="my-16 text-center">
          <h2 className="text-3xl font-bold mb-4 text-violet-400">
            Bienvenue sur SLAGATE, votre portail Solo Leveling: ARISE
          </h2>
          <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">
            Explorez des guides stratégiques, des builds optimisés et les
            différentes informations autour du jeu. SLAGATE est conçu pour vous
            accompagner dans vos progrès, que vous soyez nouveau joueur ou
            vétéran du terrain. N'hésitez pas à consulter nos tier lists, nos
            compositions de teams ou encore les codes promotionnels à ne pas
            manquer !
          </p>
        </div>
        {/* Section Twitch */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-violet-400 mb-8">
            Stream en direct
          </h2>
          <div className="relative w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl mx-auto aspect-video">
            <iframe
              src="https://player.twitch.tv/?channel=sohoven&parent=slagate.fr"
              frameBorder="0"
              allowFullScreen={true}
              scrolling="no"
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
            ></iframe>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
