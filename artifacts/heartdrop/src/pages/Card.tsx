import { useParams } from "wouter";

export default function Card() {
  const { slug } = useParams<{ slug: string }>();
  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="font-serif text-3xl text-rose-gold mb-4">Your Gift</h1>
      <p className="text-muted-foreground text-sm">Viewing card: {slug}</p>
    </div>
  );
}
