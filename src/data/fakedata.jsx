// src/data/fakeData.js
export const programmes = [
  {
    id: "math-3e",
    titre: "Mathématiques 3ᵉ",
    description: "Nombres, calculs, géométrie, fonctions...",
    color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    modules: [
      {
        id: "m1",
        titre: "Nombres et calculs",
        color: "bg-indigo-500",
        lecons: [
          {
            id: "l1",
            titre: "Les fractions",
            videoUrl: "https://www.youtube.com/embed/6Zg2cXfWJk4",
            quiz: {
              question: "Quelle est la fraction équivalente à 1/2 ?",
              options: ["2/4", "1/3", "3/4"],
              answer: "2/4",
            },
            exercice: "Calcule la somme de 1/3 + 2/3",
          },
          {
            id: "l2",
            titre: "Les décimaux",
            videoUrl: "https://www.youtube.com/embed/4aZf9vGJ6qw",
            quiz: {
              question: "Quel est le résultat de 0.5 + 0.25 ?",
              options: ["0.75", "0.52", "0.25"],
              answer: "0.75",
            },
            exercice: "Convertis 0.75 en fraction",
          },
        ],
      },
      {
        id: "m2",
        titre: "Géométrie plane",
        color: "bg-green-500",
        lecons: [
          { id: "l3", titre: "Angles", videoUrl: "", quiz: null, exercice: "Mesure des angles." },
          { id: "l4", titre: "Triangles", videoUrl: "", quiz: null, exercice: "Identifier les triangles." },
        ],
      },
    ],
  },
  {
    id: "fr-3e",
    titre: "Français 3ᵉ",
    description: "Grammaire, conjugaison, rédaction, lecture...",
    color: "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
    modules: [
      {
        id: "f1",
        titre: "Grammaire avancée",
        color: "bg-yellow-500",
        lecons: [
          { id: "l5", titre: "Les temps verbaux", videoUrl: "", quiz: null, exercice: "Exercice sur les temps verbaux." },
          { id: "l6", titre: "Les accords", videoUrl: "", quiz: null, exercice: "Exercice sur les accords." },
        ],
      },
    ],
  },
];
