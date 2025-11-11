export type ChasseurBuild = {
  chasseurId: number;
  element: "feu" | "eau" | "vent" | "lumiere" | "tenebres" | "jinwoo";
  builds: {
    id: number;
    nom: string;
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
      }[];
    };
    ombre?: number; // Ajouté comme optionnel
    sets_bonus: { id: number }[];
    stats: Record<string, string>;
  }[];
};

// Eléments possibles : "feu", "eau", "vent", "lumiere", "tenebres"

export const buildsChasseurs: ChasseurBuild[] = [
  // Sung Jinwoo
  {
    chasseurId: 40,
    element: "jinwoo",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "Force": "695 Points",
          "Vitalité": "-",
          "Agilité": "-",
          "Intelligence": "-",
          "Perception": "-",
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de l’élément adapté à l’événement",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 8, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
    ],
  },
  //  Soyeon
  {
  "chasseurId": 50,
  "element": "vent",
  "builds": [
    {
      "id": 6325,
      "nom": "Général",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "Le plus possible",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 57,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 1,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 78,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 22,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 68,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 47,
          "statPrincipale": "Vent (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 12,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 36,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 34
        }
      ]
    },
    {
      "id": 5703,
      "nom": "Général 2",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "Le plus possible",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 105,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 106,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 107,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 108,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 109,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 110,
          "statPrincipale": "Vent (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 111,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 112,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 57
        }
      ]
    },
    {
      "id": 6161,
      "nom": "BDG",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "Le plus possible",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "20% - 25%",
        "Pénétration de défense": "37% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 105,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 106,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 107,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 108,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 109,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 110,
          "statPrincipale": "Vent (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 111,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 112,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 57
        }
      ]
    },
    {
      "id": 9434,
      "nom": "POD",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "Le plus possible",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30%",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 57,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 1,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 78,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 22,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 68,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 47,
          "statPrincipale": "Vent (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 12,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 36,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 34
        }
      ]
    }
  ]
},
  // Yuqi
  {
  "chasseurId": 49,
  "element": "feu",
  "builds": [
    {
      "id": 7325,
      "nom": "Général",
      "stats": {
        "PV supplémentaire": "Le plus possible",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 105,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 106,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 107,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 108,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 109,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 110,
          "statPrincipale": "Feu %",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 111,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 112,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 57
        }
      ]
    },
    {
      "id": 9381,
      "nom": "Général 2",
      "stats": {
        "PV supplémentaire": "Le plus possible",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 57,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 1,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 78,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 22,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 68,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 47,
          "statPrincipale": "Feu %",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 12,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 36,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 34
        }
      ]
    },
    {
      "id": 6382,
      "nom": "BDG",
      "stats": {
        "PV supplémentaire": "Le plus possible",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "20% - 25%",
        "Pénétration de défense": "37% ",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 64,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 94,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 84,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 28,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 109,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 110,
          "statPrincipale": "Feu %",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 111,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 112,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 12
        },
        {
          "id": 56
        }
      ]
    },
    {
      "id": 2425,
      "nom": "POD",
      "stats": {
        "PV supplémentaire": "Le plus possible",
        "Défense supplémentaire": "-",
        "PM ": "-",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "10000",
        "Dégâts de coup critique": "200%",
        "Hausse des dégâts": "30%",
        "Pénétration de défense": "30% ",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "-"
      },
      "artefacts": {
        "casque": {
          "id": 105,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 106,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 107,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 108,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 109,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 110,
          "statPrincipale": "Feu %",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 111,
          "statPrincipale": "HP supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 112,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 2,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 57
        }
      ]
    }
  ]
},

  // Minnie
  {
  "chasseurId": 48,
  "element": "tenebres",
  "builds": [
    {
      "id": 5135,
      "nom": "Général",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "Le plus possible",
        "PM ": "3000",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "8000",
        "Dégâts de coup critique": "185% - 190%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "3500"
      },
      "artefacts": {
        "casque": {
          "id": 113,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 114,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 115,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 116,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 117,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 118,
          "statPrincipale": "Ténèbres (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 119,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 120,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 6,
            "statPrincipale": "Défense supplémentaire"
          },
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 3,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 60
        }
      ]
    },
    {
      "id": 1231,
      "nom": "BDG",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "Le plus possible",
        "PM ": "3000-3200",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "8000-10000",
        "Dégâts de coup critique": "185% - 190%",
        "Hausse des dégâts": "20% - 25%",
        "Pénétration de défense": "37%",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "3500"
      },
      "artefacts": {
        "casque": {
          "id": 113,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 114,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 115,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 116,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 117,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 118,
          "statPrincipale": "Ténèbres (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 119,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 120,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 6,
            "statPrincipale": "Défense supplémentaire"
          },
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 3,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 60
        }
      ]
    },
    {
      "id": 4826,
      "nom": "POD",
      "stats": {
        "PV supplémentaire": "-",
        "Défense supplémentaire": "Le plus possible",
        "PM ": "3000-3200",
        "Attaque supplémentaire": "-",
        "Précision": "-",
        "Taux de coup critique ": "8000-10000",
        "Dégâts de coup critique": "185% - 190%",
        "Hausse des dégâts": "30% +",
        "Pénétration de défense": "30% +",
        "Réduction des dégâts": "-",
        "Hausse des soins donnés": "-",
        "Hausse des soins reçus": "-",
        "Hausse du taux de récupération des PM": "-",
        "Baisse du coût de PM": "3500"
      },
      "artefacts": {
        "casque": {
          "id": 113,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "armure": {
          "id": 114,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "gants": {
          "id": 115,
          "statPrincipale": "Attaque supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bottes": {
          "id": 116,
          "statPrincipale": "Dégâts de coup critique",
          "statsSecondaires": [
            "-"
          ]
        },
        "collier": {
          "id": 117,
          "statPrincipale": "PV supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "bracelet": {
          "id": 118,
          "statPrincipale": "Ténèbres (%)",
          "statsSecondaires": [
            "-"
          ]
        },
        "bague": {
          "id": 119,
          "statPrincipale": "Défense supplémentaire",
          "statsSecondaires": [
            "-"
          ]
        },
        "boucles": {
          "id": 120,
          "statPrincipale": "PM",
          "statsSecondaires": [
            "-"
          ]
        }
      },
      "noyaux": {
        "1": [
          {
            "id": 9,
            "statPrincipale": "Attaque supplémentaire"
          }
        ],
        "2": [
          {
            "id": 6,
            "statPrincipale": "Défense supplémentaire"
          },
          {
            "id": 12,
            "statPrincipale": "Défense supplémentaire"
          }
        ],
        "3": [
          {
            "id": 3,
            "statPrincipale": "PV supplémentaire"
          },
          {
            "id": 7,
            "statPrincipale": "PV supplémentaire"
          }
        ]
      },
      "sets_bonus": [
        {
          "id": 60
        }
      ]
    }
  ]
},

  // Sung Jinah
  {
    chasseurId: 47,
    element: "vent",
    builds: [
      {
        id: 2001,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Défense supplémentaire" },
            { id: 4, statPrincipale: "Défense supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 2001,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 97,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 98,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 99,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 100,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 101,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 102,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 103,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 104,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Défense supplémentaire" },
            { id: 4, statPrincipale: "Défense supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 52 }, { id: 53 }, { id: 54 }],
      },
      {
        id: 2001,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Défense supplémentaire" },
            { id: 4, statPrincipale: "Défense supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      
      
    ],
  },

  // Miyeon
  {
    chasseurId: 46,
    element: "lumiere",
    builds: [
      {
        id: 958,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 58 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 959,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 959,
        nom: "Général 3",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      
      {
        id: 351,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
      {
        id: 352,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
    ],
  },

  // Shuhua
  {
    chasseurId: 45,
    element: "eau",
    builds: [
      {
        id: 947,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 3,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 4,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 4, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Lennart Niermann
  {
    chasseurId: 44,
    element: "vent",
    builds: [
      {
        id: 2000,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [
            { id: 12, statPrincipale: "Défense supplémentaire" },
            { id: 6, statPrincipale: "Défense supplémentaire" },
          ],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 2001,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [
            { id: 12, statPrincipale: "Défense supplémentaire" },
            { id: 6, statPrincipale: "Défense supplémentaire" },
          ],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
      {
        id: 2002,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [
            { id: 12, statPrincipale: "Défense supplémentaire" },
            { id: 6, statPrincipale: "Défense supplémentaire" },
          ],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
    ],
  },

  // Cha Hae-Valkyrie
  {
    chasseurId: 43,
    element: "eau",
    builds: [
      {
        id: 400,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 58 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 401,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 403,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
      {
        id: 404,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 115,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 116,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 117,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 118,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 119,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 120,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 59 }, { id: 60 }],
      },
    ],
  },

  // Seo Lin 
  {
    chasseurId: 41,
    element: "eau",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 391,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 392,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 393,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 394,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 395,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
    ],
  },

  // Goto Ryuji
  {
    chasseurId: 13,
    element: "vent",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 10,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 122,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 123,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Tawata Kanae (FAIT)
  {
    chasseurId: 35,
    element: "feu",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 341,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "~ 2000",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 342,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "~ 2000",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Esil Radir
  {
    chasseurId: 10,
    element: "feu",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 91,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 32 }, { id: 33 }],
      },
      {
        id: 92,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 93,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Shimizu Akari (FAIT)
  {
    chasseurId: 33,
    element: "lumiere",
    builds: [
      {
        id: 320,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 84,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 28,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 10 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 321,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 322,
        nom: "Général 3",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 323,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 84,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 28,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 10 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 324,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 325,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 84,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 28,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 10 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 326,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Thomas André
  {
    chasseurId: 36,
    element: "lumiere",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 351,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 352,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Defense Supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Isla Wright
  {
    chasseurId: 19,
    element: "tenebres",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "Le plus possible",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 181,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "Le plus possible",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 182,
        nom: "POD (Dark)",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "Le plus possible",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 183,
        nom: "POD (Fire)",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "Le plus possible",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 184,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "Le plus possible",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Gina
  {
    chasseurId: 11,
    element: "feu",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 101,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 102,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Charlotte
  {
    chasseurId: 7,
    element: "tenebres",
    builds: [
      {
        id: 8,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 61,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 62,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 121,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 122,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 123,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 124,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 48 }, { id: 49 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Harper
  {
    chasseurId: 16,
    element: "tenebres",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 151,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 152,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Go Gunhee
  {
    chasseurId: 12,
    element: "lumiere",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 111,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 112,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 113,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 114,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Han Se-Mi
  {
    chasseurId: 14,
    element: "vent",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "PV (%) | Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 10,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "PV (%) | Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 131,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "PV (%) | Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 132,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "PV (%) | Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Amamiya Mirei
  {
    chasseurId: 2,
    element: "vent",
    builds: [
      {
        id: 500,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "1500+",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "100% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 500,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "1500+",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "100% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 501,
        nom: "Général 3",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "1500+",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "100% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 502,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "1500+",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "100% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "~ 2000",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 503,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "1500+",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "100% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "~ 2000",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 58 }, { id: 29 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Yoo Soohyun
  {
    chasseurId: 39,
    element: "feu",
    builds: [
      {
        id: 380,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 381,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "10% - 20%",
          "Pénétration de défense ": "30% +",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 60,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 7,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 85,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 29,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 382,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 383,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Meilin Fisher
  {
    chasseurId: 27,
    element: "eau",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 261,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 262,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 263,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Alicia Blanche
  {
    chasseurId: 1,
    element: "eau",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 2,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 3,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 4,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Cha Hae-In
  {
    chasseurId: 6,
    element: "lumiere",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10 - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 4, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 58 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 10,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10 - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 4, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 51,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10 - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 4, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 58 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 52,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10 - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 113,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 114,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 4, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 58 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Baek Yunho à crinière argentée
  {
    chasseurId: 5,
    element: "tenebres",
    builds: [
      {
        id: 40,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 74,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 52,
            statPrincipale: "Dégâts de tenebre",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 17,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 41,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 21 }, { id: 22 }],
      },
      {
        id: 41,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 74,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 52,
            statPrincipale: "Dégâts de tenebre",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 17,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 41,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 21 }, { id: 22 }],
      },
      {
        id: 42,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 74,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 52,
            statPrincipale: "Dégâts de tenebre",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 17,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 41,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 21 }, { id: 22 }],
      },
    ],
  },

  // Seo Jiwoo (FAIT)
  {
    chasseurId: 32,
    element: "eau",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 391,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 392,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 393,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 394,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 57 }],
      },
      {
        id: 395,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 4, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Emma Laurent
  {
    chasseurId: 9,
    element: "feu",
    builds: [
      {
        id: 8,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 81,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 32 }, { id: 33 }],
      },
      {
        id: 82,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 83,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 105,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 106,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 107,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 108,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 55 }, { id: 56 }, { id: 32 }, { id: 33 }],
      },
      {
        id: 84,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Lee Bora
  {
    chasseurId: 24,
    element: "tenebres",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 23 }, { id: 24 }],
      },
      {
        id: 231,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 232,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 65,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 95,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 88,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 32,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 71,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 50,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 15,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 39,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 35 }, { id: 36 }, { id: 23 }, { id: 24 }],
      },
    ],
  },

  // Hwang Dongsoo
  {
    chasseurId: 17,
    element: "vent",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 161,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 162,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 163,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 164,
        nom: "BDG 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Min Byeonggu
  {
    chasseurId: 28,
    element: "lumiere",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "Le plus possible",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 271,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "Le plus possible",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 272,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "Le plus possible",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 273,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "Le plus possible",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Woo Jincheol
  {
    chasseurId: 37,
    element: "vent",
    builds: [
      {
        id: 1,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 109,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 110,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 111,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 112,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 55 }, { id: 56 }],
      },
      {
        id: 1,
        nom: "Général 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 361,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 362,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Choi Jongin
  {
    chasseurId: 8,
    element: "feu",
    builds: [
      {
        id: 70,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 71,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 72,
        nom: "POD 2",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 70,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 49,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 14,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 38,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 45 }],
      },
      {
        id: 73,
        nom: "POD 3",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 59,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 6,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 83,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 27,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 101,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 102,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 103,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 104,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 5 }, { id: 6 }, { id: 52 }, { id: 53 }],
      },
      {
        id: 74,
        nom: "POD 4",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 97,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 98,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 99,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 100,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 101,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 102,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 103,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 104,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 52 }, { id: 53 }, { id: 54 }],
      },
      {
        id: 75,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "-",
          "Dégâts de coup critique ": "-",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Pénétration de défense",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Lim Taegyu
  {
    chasseurId: 26,
    element: "tenebres",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 251,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 252,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 8, statPrincipale: "Attaque supplémentaire" },
            { id: 9, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 2, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Baek Yunho
  {
    chasseurId: 4,
    element: "lumiere",
    builds: [
      {
        id: 530,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
      {
        id: 531,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 532,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 7, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 39 }, { id: 40 }],
      },
    ],
  },

  // Anna Ruiz
  {
    chasseurId: 3,
    element: "eau",
    builds: [
      {
        id: 510,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 511,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 512,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [
            { id: 9, statPrincipale: "Attaque supplémentaire" },
            { id: 8, statPrincipale: "Attaque supplémentaire" },
          ],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 2, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Han Songyi
  {
    chasseurId: 15,
    element: "eau",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 7, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 141,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 142,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
    ],
  },

  // Hwang Dongsuk A Finir
  {
    chasseurId: 18,
    element: "tenebres",
    builds: [
      {
        id: 170,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 171,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 172,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Jo Kyuhwan A finir
  {
    chasseurId: 20,
    element: "lumiere",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 191,
        nom: "POD",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 192,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
    ],
  },

  // Kang Taeshik A finir
  {
    chasseurId: 21,
    element: "tenebres",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 201,
        nom: "POD",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 202,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de ténèbres",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
    ],
  },

  // Kim Chul A finir
  {
    chasseurId: 22,
    element: "lumiere",
    builds: [
      {
        id: 210,
        nom: "Général",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 211,
        nom: "POD",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 212,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Kim Sangshik A finir
  {
    chasseurId: 23,
    element: "vent",
    builds: [
      {
        id: 220,
        nom: "Général",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 221,
        nom: "POD",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 222,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Lee Juhee A finir
  {
    chasseurId: 25,
    element: "eau",
    builds: [
      {
        id: 240,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 241,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 41 }, { id: 42 }],
      },
      {
        id: 242,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 58,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 2,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 79,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 23,
            statPrincipale: "Dégâts de coup critique | PV (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 73,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 55,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 20,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 44,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 43 }, { id: 44 }, { id: 41 }, { id: 42 }],
      },
    ],
  },

  // Nam Chae-Young
  {
    chasseurId: 29,
    element: "eau",
    builds: [
      {
        id: 10,
        nom: "Général",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV supplémentaire",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 281,
        nom: "POD",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV supplémentaire",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 282,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "Le plus possible",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | PV supplémentaire",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts d'eau",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },

  // Park Beom-Shik
  {
    chasseurId: 30,
    element: "vent",
    builds: [
      {
        id: 290,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 291,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 292,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [{ id: 2, statPrincipale: "PV supplémentaire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
    ],
  },

  // Park Heejin
  {
    chasseurId: 31,
    element: "vent",
    builds: [
      {
        id: 300,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 64,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 94,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 77,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 56,
            statPrincipale: "Dégâts de vent",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 21,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 45,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "Attaque supplémentaire" }],
          2: [{ id: 12, statPrincipale: "Défense supplémentaire" }],
          3: [
            { id: 7, statPrincipale: "PV supplémentaire" },
            { id: 3, statPrincipale: "PV supplémentaire" },
          ],
        },
        sets_bonus: [{ id: 9 }, { id: 10 }, { id: 27 }, { id: 28 }],
      },
    ],
  },

  // Song Chiyul
  {
    chasseurId: 34,
    element: "feu",
    builds: [
      {
        id: 330,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 331,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
      {
        id: 332,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "-",
          "PM ": "-",
          "Attaque supplémentaire": "Le plus possible",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 61,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 8,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 86,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 30,
            statPrincipale: "Dégâts de coup critique",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 76,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 54,
            statPrincipale: "Dégâts de feu",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 19,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 43,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 29 }, { id: 30 }, { id: 25 }, { id: 26 }],
      },
    ],
  },

  // Yoo Jinho
  {
    chasseurId: 38,
    element: "lumiere",
    builds: [
      {
        id: 370,
        nom: "Général",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 371,
        nom: "POD",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
      {
        id: 372,
        nom: "BDG",
        stats: {
          "PV supplémentaire": "-",
          "Défense supplémentaire": "Le plus possible",
          "PM ": "-",
          "Attaque supplémentaire": "-",
          "Précision": "-",
          "Taux de coup critique ": "50%",
          "Dégâts de coup critique ": "200% - 210%",
          "Hausse des dégâts ": "30% +",
          "Pénétration de défense ": "10% - 20%",
          "Réduction des dégâts ": "-",
          "Réduction du temps de rechargement ": "-",
          "Hausse des soins donnés ": "-",
          "Hausse des soins reçus ": "-",
          "Hausse du taux de récupération des PM ": "-",
          "Baisse du coût de PM ": "-",
        },
        artefacts: {
          casque: {
            id: 57,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          armure: {
            id: 1,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          gants: {
            id: 78,
            statPrincipale: "Attaque supplémentaire",
            statsSecondaires: ["-"],
          },
          bottes: {
            id: 22,
            statPrincipale: "Dégâts de coup critique | Défense (%)",
            statsSecondaires: ["-"],
          },
          collier: {
            id: 68,
            statPrincipale: "PV supplémentaire",
            statsSecondaires: ["-"],
          },
          bracelet: {
            id: 47,
            statPrincipale: "Dégâts de lumière",
            statsSecondaires: ["-"],
          },
          bague: {
            id: 12,
            statPrincipale: "Défense supplémentaire",
            statsSecondaires: ["-"],
          },
          boucles: {
            id: 36,
            statPrincipale: "PM",
            statsSecondaires: ["-"],
          },
        },
        noyaux: {
          1: [{ id: 9, statPrincipale: "a faire" }],
          2: [{ id: 12, statPrincipale: "a faire" }],
          3: [{ id: 2, statPrincipale: "a faire" }],
        },
        sets_bonus: [{ id: 32 }, { id: 33 }, { id: 34 }],
      },
    ],
  },
];
