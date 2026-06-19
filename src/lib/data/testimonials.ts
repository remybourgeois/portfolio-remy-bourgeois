// src/lib/data/testimonials.ts
export interface Testimonial {
  id: number;
  name: string;
  role: string;
  company: string;
  logo: string;
  image: string;
  text: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: 1,
    name: 'Mélanie Breton',
    role: 'Design System Manager',
    company: 'Crédit Agricole',
    logo: '/assets/ca.png',
    image: '/assets/melanie.webp',
    text: "Rémy est dans le chapitre UX/UI depuis presque 3 ans et c'est un plaisir. Rémy est un collègue agréable au quotidien. En tant que designer, il a toujours de bonnes idées, il est pertinent et précis. Il challenge toujours en bonne intelligence et c'est agréable d'échanger sur toutes sortes de sujet UI 🙂"
  },
  {
    id: 2,
    name: 'Aure Pellefigue',
    role: 'Head of Product',
    company: 'Ofelia',
    logo: '/assets/ofelia.svg',
    image: '/assets/aure.webp',
    text: "Collab en cours… et on ne lâche pas une équipe qui gagne ! 💥 Depuis plusieurs mois, Remy nous accompagne dans un projet produit stratégique et exigeant (IA, conversationnel, refonte UX complète). Vrai copilote de l'équipe produit, il nous aide à structurer ce qu'il y a à faire, à créer les bons artefacts pour tester rapidement et faire avancer nos idées."
  },
  {
    id: 3,
    name: 'Vincent Rabaud',
    role: 'Senior Software Engineer',
    company: 'Google',
    logo: '/assets/google.webp',
    image: '/assets/vincent.webp',
    text: "I co-managed Rémy on sound design projects. His job was hard, as he had to come up with ideas, implement them and even advertise them. Apart from his technical expertise, Rémy is also creative and able to translate clients' will into a successful product. Working with him was also a pleasure."
  },
  {
    id: 4,
    name: 'Ali Ben Taieb',
    role: 'Product Owner',
    company: 'Hoomano',
    logo: '/assets/hoomano.png',
    image: '/assets/ali.webp',
    text: "J'ai eu la chance de travailler avec Rémy dans un contexte particulièrement agile et innovant. Rémy a toujours étonné par sa capacité à retranscrire de manière très efficace et pragmatique les besoins clients en fonctionnalités applicatives. Sa capacité à convaincre et faire adhérer à ces idées font de lui un excellent Designer."
  },
  {
    id: 5,
    name: 'Gustavo Moreno',
    role: 'Co-Founder',
    company: 'Book My Music',
    logo: '/assets/bookmymusic.png',
    image: '/assets/gustavo.webp',
    text: "J'ai travaillé avec Rémy lors de la refonte de l'interface client de Book My Music. Nous cherchions quelqu'un qui puisse nous proposer une interface simple et intuitive, et Rémy a su répondre à nos attentes. Ses propositions nous ont permis de solutionner des problèmes d'utilisation de notre logiciel."
  },
  {
    id: 6,
    name: 'Daniil Novikov',
    role: 'VP Product',
    company: 'iPify',
    logo: '/assets/ipify.png',
    image: '/assets/daniil.webp',
    text: "Rémy quickly grasped our complex business domain and delivered visually compelling prototypes for new features. He also led client-facing UX workshops and managed to gather an invaluable feedback. Self-directed and hardworking, he consistently produces outstanding results."
  }
];
