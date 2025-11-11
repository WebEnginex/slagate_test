export type TeamBaranJinwoo = {
  id: number;
  nom: string;
  chasseurs: {
    id: number;
    stats: Record<string, string>;
    artefacts: {
      [slot: string]: {
        id: number;
        statPrincipale: string;
        statsSecondaires: string[];
      };
    };
    noyaux: {
      [slot: number]: {
        id: number;
        statPrincipale: string;
        statSecondaire?: string;
      }[];
    };
    sets_bonus: { id: number }[];
  }[];
  ombres: {
    id: number;
    description?: string;
  }[];
  arme1: number;
  arme2: number;
  competence1: number;
  competence2: number;
  qte1: number;
  qte2: number;
  pierre_benediction_booster1: number;
  pierre_benediction_booster2: number;
  pierre_benediction_booster3: number;
  pierre_benediction_booster4: number;
  pierre_benediction_survie1: number;
  pierre_benediction_survie2: number;
  pierre_benediction_survie3: number;
  pierre_benediction_survie4: number;
  };
  
  
  
  export const teamBaranJinwoo: TeamBaranJinwoo[] = [
    // {
    //   id: 1,
    //   nom: "Team Jinwtergr",
    //   chasseurs: [
    //     {
    //       id: 40,
    //       stats: {
    //         "Force": "25000",
    //         "Vitalité": "30000",
    //         "Agilité": "1000",
    //         "Intelligence": "15",
    //         "Perception": "8000",
    //         "PV": "25000",
    //         "Attaque": "30000",
    //         "PM": "1000",
    //         "Précision": "15",
    //         "Défense": "8000",
    //       },
    //       artefacts: {
    //         casque: {
    //           id: 1,
    //           statPrincipale: "PV",
    //           statsSecondaires: [""],
    //         },
    //         armure: {
    //           id: 2,
    //           statPrincipale: "Défense",
    //           statsSecondaires: [""],
    //         },
    //         gants: {
    //           id: 3,
    //           statPrincipale: "Taux de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         bottes: {
    //           id: 4,
    //           statPrincipale: "PM",
    //           statsSecondaires: [""]
    //         },
    //         collier: {
    //           id: 5,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bracelet: {
    //           id: 6,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bague: {
    //           id: 7,
    //           statPrincipale: "Dégâts de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         boucles: {
    //           id: 8,
    //           statPrincipale: "Précision",
    //           statsSecondaires: [""]
    //         }
    //       },
    //       noyaux: {
    //         1: [
    //           { id: 4, statPrincipale: "Attaque" },
    //           { id: 9, statPrincipale: "Attaque" },
    //         ],
    //         2: [{ id: 12, statPrincipale: "Défense" }],
    //         3: [
    //           { id: 2, statPrincipale: "PV" },
    //           { id: 7, statPrincipale: "PV" },
    //         ],
    //       },
    //       sets_bonus: [
    //         { id: 29 },
    //         { id: 30 },
    //         { id: 31 },
    //       ],
          
    //     },
    //     {
    //       id: 2,
    //       stats: {
    //         "PV": "24000",
    //         "Attaque": "27000",
    //         "PM": "900",
    //       },
    //       artefacts: {
    //         casque: {
    //           id: 1,
    //           statPrincipale: "PV",
    //           statsSecondaires: [""],
    //         },
    //         armure: {
    //           id: 2,
    //           statPrincipale: "Défense",
    //           statsSecondaires: [""],
    //         },
    //         gants: {
    //           id: 3,
    //           statPrincipale: "Taux de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         bottes: {
    //           id: 4,
    //           statPrincipale: "PM",
    //           statsSecondaires: [""]
    //         },
    //         collier: {
    //           id: 5,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bracelet: {
    //           id: 6,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bague: {
    //           id: 7,
    //           statPrincipale: "Dégâts de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         boucles: {
    //           id: 8,
    //           statPrincipale: "Précision",
    //           statsSecondaires: [""]
    //         }
    //       },
    //       noyaux: {
    //         1: [
    //           { id: 4, statPrincipale: "Attaque" },
    //           { id: 9, statPrincipale: "Attaque" },
    //         ],
    //         2: [{ id: 12, statPrincipale: "Défense" }],
    //         3: [
    //           { id: 2, statPrincipale: "PV" },
    //           { id: 7, statPrincipale: "PV" },
    //         ],
    //       },
    //       sets_bonus: [
    //         { id: 29 },
    //         { id: 30 },
    //         { id: 31 },
    //       ],
    //     },
    //     {
    //       id: 3,
    //       stats: {
    //         "PV": "22000",
    //         "Attaque": "25000",
    //         "PM": "850"
    //       },
    //       artefacts: {
    //         casque: {
    //           id: 1,
    //           statPrincipale: "PV",
    //           statsSecondaires: [""],
    //         },
    //         armure: {
    //           id: 2,
    //           statPrincipale: "Défense",
    //           statsSecondaires: [""],
    //         },
    //         gants: {
    //           id: 3,
    //           statPrincipale: "Taux de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         bottes: {
    //           id: 4,
    //           statPrincipale: "PM",
    //           statsSecondaires: [""]
    //         },
    //         collier: {
    //           id: 5,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bracelet: {
    //           id: 6,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bague: {
    //           id: 7,
    //           statPrincipale: "Dégâts de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         boucles: {
    //           id: 8,
    //           statPrincipale: "Précision",
    //           statsSecondaires: [""]
    //         }
    //       },
    //       noyaux: {
    //         1: [
    //           { id: 4, statPrincipale: "Attaque" },
    //           { id: 9, statPrincipale: "Attaque" },
    //         ],
    //         2: [{ id: 12, statPrincipale: "Défense" }],
    //         3: [
    //           { id: 2, statPrincipale: "PV" },
    //           { id: 7, statPrincipale: "PV" },
    //         ],
    //       },
    //       sets_bonus: [
    //         { id: 29 },
    //         { id: 30 },
    //         { id: 31 },
    //       ],
    //     },
    //     {
    //       id: 4,
    //       stats: {
    //         "PV": "26000",
    //         "Attaque": "28000",
    //         "PM": "950"
    //       },
    //       artefacts: {
    //         casque: {
    //           id: 1,
    //           statPrincipale: "PV",
    //           statsSecondaires: [""],
    //         },
    //         armure: {
    //           id: 2,
    //           statPrincipale: "Défense",
    //           statsSecondaires: [""],
    //         },
    //         gants: {
    //           id: 3,
    //           statPrincipale: "Taux de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         bottes: {
    //           id: 4,
    //           statPrincipale: "PM",
    //           statsSecondaires: [""]
    //         },
    //         collier: {
    //           id: 5,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bracelet: {
    //           id: 6,
    //           statPrincipale: "Attaque",
    //           statsSecondaires: [""]
    //         },
    //         bague: {
    //           id: 7,
    //           statPrincipale: "Dégâts de coup critique",
    //           statsSecondaires: [""]
    //         },
    //         boucles: {
    //           id: 8,
    //           statPrincipale: "Précision",
    //           statsSecondaires: [""]
    //         }
    //       },
    //       noyaux: {
    //         1: [
    //           { id: 4, statPrincipale: "Attaque" },
    //           { id: 9, statPrincipale: "Attaque" },
    //         ],
    //         2: [{ id: 12, statPrincipale: "Défense" }],
    //         3: [
    //           { id: 2, statPrincipale: "PV" },
    //           { id: 7, statPrincipale: "PV" },
    //         ],
    //       },
    //       sets_bonus: [
    //         { id: 29 },
    //         { id: 30 },
    //         { id: 31 },
    //       ],
    //     }
    //   ],
    //   ombres: [
    //     { id: 1, description: "" },
    //     { id: 2 },
    //     { id: 3 },
    //   ],
    //   arme1: 1,
    //   arme2: 2,
    //   competence1: 1,
    //   competence2: 1,
    //   qte1: 4,
    //   qte2: 1,
    //   pierre_benediction_booster1: 1,
    //   pierre_benediction_booster2: 2,
    //   pierre_benediction_booster3: 3,
    //   pierre_benediction_booster4: 4,
    //   pierre_benediction_survie1: 5,
    //   pierre_benediction_survie2: 6,
    //   pierre_benediction_survie3: 7,
    //   pierre_benediction_survie4: 8
    // },




   
  ];
  