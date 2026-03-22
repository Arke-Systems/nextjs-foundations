import Image, { getImageProps } from "next/image";

// Simple gray blur placeholder (base64 encoded 1x1 SVG)
const blurDataURL =
  "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxIDEiPjxyZWN0IGZpbGw9IiM5Y2EzYWYiIHdpZHRoPSIxIiBoZWlnaHQ9IjEiLz48L3N2Zz4=";

const galleryImages = [
  { src: "https://picsum.photos/800/600?random=1", alt: "Mountain landscape" },
  { src: "https://picsum.photos/800/600?random=2", alt: "Ocean sunset" },
  { src: "https://picsum.photos/800/600?random=3", alt: "Forest path" },
  { src: "https://picsum.photos/800/600?random=4", alt: "City skyline" },
];

function HeroWithArtDirection() {
  const common = { alt: "Featured landscape", sizes: "100vw" };

  // Desktop: wide landscape
  const {
    props: { srcSet: desktop },
  } = getImageProps({
    ...common,
    width: 1440,
    height: 600,
    quality: 85,
    src: "https://picsum.photos/1440/600?random=hero-desktop",
  });

  // Mobile: taller aspect ratio
  const {
    props: { srcSet: mobile, ...rest },
  } = getImageProps({
    ...common,
    width: 750,
    height: 900,
    quality: 75,
    src: "https://picsum.photos/750/900?random=hero-mobile",
  });

  return (
    <picture>
      <source media="(min-width: 1024px)" srcSet={desktop} />
      <source media="(min-width: 640px)" srcSet={mobile} />
      <img
        {...rest}
        fetchPriority="high"
        style={{ width: "100%", height: "auto" }}
        className="rounded-lg"
      />
    </picture>
  );
}

export default function GalleryPage() {
  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 font-bold text-3xl">Photo Gallery</h1>

      {/* Hero with art direction */}
      <section className="mb-8">
        <HeroWithArtDirection />
      </section>

      {/* Gallery grid with blur placeholders */}
      <div className="grid grid-cols-2 gap-4">
        {galleryImages.map((image, i) => (
          <div key={i} className="relative aspect-[4/3]">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              quality={75}
              placeholder="blur"
              blurDataURL={blurDataURL}
              sizes="(max-width: 768px) 100vw, 50vw"
              className="rounded-lg object-cover"
            />
          </div>
        ))}
      </div>

      <section className="mt-8 rounded bg-blue-50 p-4">
        <h2 className="mb-2 font-semibold text-blue-800">
          Advanced Optimizations Applied
        </h2>
        <ul className="list-inside list-disc text-blue-700 text-sm">
          <li>Blur placeholders for perceived performance</li>
          <li>Art direction: different hero images for mobile/desktop</li>
          <li>Custom deviceSizes matching Tailwind breakpoints</li>
          <li>Quality values restricted to 75, 85</li>
          <li>AVIF/WebP format optimization</li>
        </ul>
      </section>
    </main>
  );
}