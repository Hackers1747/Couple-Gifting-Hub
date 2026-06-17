import { useParams } from "wouter";

export default function Payment() {
  const { id } = useParams<{ id: string }>();
  return (
    <div className="min-h-screen px-4 py-8">
      <h1 className="font-serif text-3xl text-rose-gold mb-4">Payment</h1>
      <p className="text-muted-foreground text-sm">Completing payment for card: {id}</p>
    </div>
  );
}
