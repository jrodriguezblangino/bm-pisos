export const publicUrl = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

const photo = (file: string) => publicUrl(`media/${file}`);

export const imageCredit =
  "Imagen de referencia. No es una obra documentada de BMP y se reemplaza con fotos de proyecto.";

export const brand = {
  name: "BMP Pisos Alisados",
  legalName: "BMP Pisos Alisados",
  phone: "",
  phoneHref: "",
  email: "",
  slogan: "PISOS PARA OBRA EXIGENTE.",
  description:
    "Pisos de hormigón alisado para industria, comercio, estaciones de servicio, depósitos y hotelería. Treinta años de oficio, desde Villa Carlos Paz.",
  offices: [
    {
      label: "Base",
      lines: ["Villa Carlos Paz", "Córdoba, Argentina"],
      map: "https://maps.google.com/?q=Villa+Carlos+Paz+Cordoba+Argentina",
    },
  ],
  socials: [
    { label: "Instagram", href: "https://www.instagram.com/bmpisosalisados/" },
    { label: "WhatsApp", href: "https://wa.me/WHATSAPP_PLACEHOLDER" },
  ],
  credit: { label: "", href: "" },
};

export const logos = {
  mark: publicUrl("logo-mark.png"),
};

export const assets = {
  hero: photo("hero-work.webp"),
  heroVideo: photo("hero-preview.mp4"),
  floor: photo("pour.jpg"),
  pour: photo("pour.jpg"),
  yearsNear: photo("vertido-cerca.jpg"),
  yearsWide: photo("cuadrilla-nave.jpg"),
  hall: photo("hero.jpg"),
  station: photo("pour.jpg"),
  yard: photo("hero.jpg"),
};

export type YearsPlate = {
  src: string;
  alt: string;
  label: string;
  kind: string;
  width: number;
  height: number;
};

export const yearsPlates: YearsPlate[] = [
  {
    src: photo("descarga-chute.webp"),
    alt: "Dos personas reciben la descarga de hormigón desde el chute, de noche.",
    label: "Descarga",
    kind: "Mixer",
    width: 1440,
    height: 1440,
  },
  {
    src: photo("vertido-cerca.jpg"),
    alt: "Vertido de hormigón con manguera, de cerca, en obra.",
    label: "Vertido",
    kind: "Obra",
    width: 1215,
    height: 2160,
  },
  {
    src: photo("allanadora.webp"),
    alt: "Allanadora sobre el hormigón fresco.",
    label: "Allanadora",
    kind: "Oficio",
    width: 1080,
    height: 1440,
  },
  {
    src: photo("oficio-exterior.webp"),
    alt: "Allanado de un piso exterior junto a un muro de ladrillo.",
    label: "Oficio",
    kind: "Exterior",
    width: 1440,
    height: 1440,
  },
  {
    src: photo("nivel-obra.jpg"),
    alt: "Nivel óptico sobre trípode, al frente de una playa de hormigón.",
    label: "Nivelación",
    kind: "Obra",
    width: 1215,
    height: 2160,
  },
  {
    src: photo("cuadrilla-nave.jpg"),
    alt: "Cuadrilla alisando el hormigón frente al mixer, dentro de una nave.",
    label: "Cuadrilla",
    kind: "Nave",
    width: 640,
    height: 360,
  },
  {
    src: photo("nave-terminada.jpg"),
    alt: "Piso de hormigón terminado dentro de una nave.",
    label: "Terminación",
    kind: "Nave",
    width: 1215,
    height: 2160,
  },
  {
    src: photo("planta-losas.jpg"),
    alt: "Planta industrial con losas de hormigón, vista desde arriba.",
    label: "Planta",
    kind: "Industria",
    width: 1600,
    height: 900,
  },
  {
    src: photo("estacion-aerea.jpg"),
    alt: "Estación de servicio con playa de hormigón, vista desde arriba.",
    label: "Estación",
    kind: "Servicio",
    width: 1265,
    height: 2250,
  },
];

export const nav = [
  { label: "Oficio", href: "/about" },
  { label: "Servicios", href: "/services" },
  { label: "Obras", href: "/projects" },
  { label: "Contacto", href: "/contact" },
];

export const footerColumns = [
  {
    index: "01",
    title: "Empresa",
    links: [
      { label: "El oficio", href: "/about" },
      { label: "Cómo trabajamos", href: "/about#our-values" },
      { label: "Tercera generación", href: "/about" },
      { label: "Zona de trabajo", href: "/cobertura" },
    ],
  },
  {
    index: "02",
    title: "Servicios",
    links: [
      { label: "Pisos industriales", href: "/services?tab=industrial" },
      { label: "Pisos comerciales", href: "/services?tab=comercial" },
      { label: "Estaciones de servicio", href: "/services?tab=estaciones" },
      { label: "Depósitos y naves", href: "/services?tab=depositos" },
    ],
  },
  {
    index: "03",
    title: "Sitio",
    links: [
      { label: "Tipos de obra", href: "/projects" },
      { label: "Trabajar con BMP", href: "/careers" },
      { label: "Contacto", href: "/contact" },
    ],
  },
];

export type Service = {
  slug: string;
  index: string;
  title: string;
  summary: string;
  image: string;
  imageAlt: string;
};

export const services: Service[] = [
  {
    slug: "industrial",
    index: "01",
    title: "Pisos industriales",
    summary:
      "Hormigón alisado para plantas, playas de maniobra y pisos que tienen que quedar parejos bajo uso intenso.",
    image: assets.floor,
    imageAlt: imageCredit,
  },
  {
    slug: "comercial",
    index: "02",
    title: "Pisos comerciales",
    summary:
      "Superficies de hormigón para locales, hoteles y espacios donde el piso se ve y además tiene que durar.",
    image: assets.hall,
    imageAlt: imageCredit,
  },
  {
    slug: "estaciones",
    index: "03",
    title: "Estaciones de servicio",
    summary:
      "Pisos para playas de carga y zonas de alto tránsito, donde la nivelación y el alisado no pueden quedar a medias.",
    image: assets.station,
    imageAlt: imageCredit,
  },
  {
    slug: "depositos",
    index: "04",
    title: "Depósitos y naves",
    summary:
      "Grandes superficies para logística e industria: continuidad, juntas y un piso listo para el trabajo de todos los días.",
    image: photo("hall.jpg"),
    imageAlt: imageCredit,
  },
];

export const additionalServices = [
  "Hormigón alisado",
  "Pisos de alto tránsito",
  "Hotelería",
  "Naves y galpones",
  "Playas comerciales",
  "Obra en Córdoba y la región",
];

export const capabilities = [
  {
    title: "Oficio",
    body: "Tercera generación en el rubro. El criterio sale de la obra, no de un catálogo.",
  },
  {
    title: "Obra",
    body: "Trabajamos en pisos que tienen que convivir con máquinas, camiones, público o mercadería.",
  },
  {
    title: "Zona",
    body: "Base en Villa Carlos Paz. Obra en Córdoba, Santa Fe y provincias vecinas.",
  },
  {
    title: "Criterio",
    body: "Un piso alisado se juzga de cerca y con el uso. Por eso el trabajo se cuida en el detalle.",
  },
];

export const values = [
  {
    index: "01",
    title: "El piso se piensa antes",
    body: "Uso, tránsito y plazos se hablan al principio, para no corregir el hormigón cuando ya está puesto.",
  },
  {
    index: "02",
    title: "La obra manda",
    body: "Nos acoplamos al ritmo del proyecto y al resto de los gremios, sin perder el estándar del piso.",
  },
  {
    index: "03",
    title: "Treinta años pesan",
    body: "Tres décadas en el oficio alcanzan para saber qué problema aparece antes de que se vea.",
  },
  {
    index: "04",
    title: "El detalle se nota",
    body: "Nivel, junta y terminación son lo que el cliente va a mirar todos los días.",
  },
  {
    index: "05",
    title: "Sin adornos",
    body: "No prometemos lo que no está confirmado. Si falta un dato de la obra, se pregunta.",
  },
];

export const principles = [
  {
    title: "Claridad",
    body: "Qué piso se necesita, para qué uso y en qué zona. Eso se define antes de entrar a la obra.",
  },
  {
    title: "Oficio",
    body: "Tercera generación de trabajadores del rubro, con base en Villa Carlos Paz.",
  },
  {
    title: "Región",
    body: "Córdoba, Santa Fe y provincias vecinas. El radio se confirma obra por obra.",
  },
];

export type Project = {
  slug: string;
  title: string;
  location: string;
  client: string;
  category: string;
  tags: string[];
  summary: string;
  image: string;
  imageAlt: string;
};

export const projects: Project[] = [
  {
    slug: "estaciones-de-servicio",
    title: "Estaciones de servicio",
    location: "Córdoba y la región",
    client: "Tipo de obra",
    category: "Comercial",
    tags: ["Alto tránsito", "Hormigón"],
    summary:
      "Playas y zonas de carga donde el piso recibe vehículos todo el día. Es un tipo de trabajo habitual de BMP, no una obra con cliente publicado.",
    image: assets.station,
    imageAlt: imageCredit,
  },
  {
    slug: "depositos",
    title: "Depósitos",
    location: "Córdoba y la región",
    client: "Tipo de obra",
    category: "Logística",
    tags: ["Grandes superficies"],
    summary:
      "Pisos continuos para depósito y movimiento de mercadería. La foto es de referencia hasta contar con imágenes de obra de BMP.",
    image: photo("hall.jpg"),
    imageAlt: imageCredit,
  },
  {
    slug: "naves-industriales",
    title: "Naves industriales",
    location: "Córdoba y la región",
    client: "Tipo de obra",
    category: "Industrial",
    tags: ["Hormigón alisado"],
    summary:
      "Pisos de hormigón para plantas y naves, pensados para el uso de máquinas y el tránsito interno.",
    image: assets.floor,
    imageAlt: imageCredit,
  },
  {
    slug: "hoteleria",
    title: "Hotelería",
    location: "Córdoba y la región",
    client: "Tipo de obra",
    category: "Comercial",
    tags: ["Terminación"],
    summary:
      "Superficies de hormigón en espacios comerciales y hoteleros, donde la terminación también se ve.",
    image: assets.hall,
    imageAlt: imageCredit,
  },
  {
    slug: "comercio",
    title: "Espacios comerciales",
    location: "Córdoba y la región",
    client: "Tipo de obra",
    category: "Comercial",
    tags: ["Piso visto"],
    summary:
      "Locales y áreas comerciales que necesitan un piso alisado, parejo y preparado para el uso diario.",
    image: assets.yard,
    imageAlt: imageCredit,
  },
];

export const stats = [
  { value: 375, suffix: "+", label: "Proyectos completados" },
  { value: 30, suffix: "", label: "Años en el oficio" },
  { value: 5, suffix: "m+", label: "m³ de tierra movida" },
  { value: 80, suffix: "%", label: "Clientes que vuelven" },
];

export const team: { name: string; role: string; image: string }[] = [];

export const jobs: {
  slug: string;
  title: string;
  location: string;
  timing: string;
  summary: string;
  image: string;
}[] = [];

export const careerStories: { quote: string; name: string; role: string }[] = [];

export const coverage = [
  "Villa Carlos Paz",
  "Córdoba",
  "Santa Fe",
  "Provincias vecinas",
];

export const testimonials: { quote: string; name: string; company: string }[] = [];

export function projectBySlug(slug: string) {
  return projects.find((project) => project.slug === slug);
}

export function jobBySlug(slug: string) {
  return jobs.find((job) => job.slug === slug);
}
