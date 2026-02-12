export type TechLogo = {
  id: string;
  label: string;
  file: string;
  href?: string;
};

export const techLogos: TechLogo[] = [
  {
    id: 'nextjs',
    label: 'Next.js',
    file: '/logos/Next.js.png',
    href: 'https://nextjs.org/'
  },
  {
    id: 'react',
    label: 'React',
    file: '/logos/React.png',
    href: 'https://react.dev/'
  },
  {
    id: 'typescript',
    label: 'TypeScript',
    file: '/logos/TypeScript.png',
    href: 'https://www.typescriptlang.org/'
  },
  {
    id: 'tailwindcss',
    label: 'Tailwind CSS',
    file: '/logos/Tailwindcss.png',
    href: 'https://tailwindcss.com/'
  },
  {
    id: 'github',
    label: 'GitHub',
    file: '/logos/GitHub.png',
    href: 'https://github.com/'
  },
  {
    id: 'not-found',
    label: '404 NotFound',
    file: '/logos/404%20NotFound.png'
  }
];
