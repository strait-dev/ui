import { AspectRatio } from "@strait/ui/components/aspect-ratio";

export default function AspectRatioVideoEmbed() {
  return (
    <div className="w-full max-w-xl">
      <AspectRatio ratio={16 / 9}>
        <iframe
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="size-full rounded-xl"
          src="https://www.youtube.com/embed/dQw4w9WgXcQ"
          title="Demo video"
        />
      </AspectRatio>
    </div>
  );
}
