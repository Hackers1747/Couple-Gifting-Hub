interface SorryCardProps {
  senderName?: string;
  message?: string;
}

export default function SorryCard({ senderName, message }: SorryCardProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      <h2 className="font-serif text-2xl text-rose-gold mb-4">I'm Sorry</h2>
      {senderName && <p className="text-sm text-muted-foreground mb-2">From {senderName}</p>}
      {message && <p className="text-foreground">{message}</p>}
    </div>
  );
}
