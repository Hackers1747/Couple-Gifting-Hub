interface AnniversaryProps {
  senderName?: string;
  partnerName?: string;
  years?: number;
  message?: string;
}

export default function Anniversary({ senderName, partnerName, years, message }: AnniversaryProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      <h2 className="font-serif text-2xl text-rose-gold mb-4">
        {years ? `${years} Years Together` : "Happy Anniversary"}
      </h2>
      {partnerName && <p className="text-foreground mb-2">For {partnerName}</p>}
      {senderName && <p className="text-sm text-muted-foreground mb-2">From {senderName}</p>}
      {message && <p className="text-foreground">{message}</p>}
    </div>
  );
}
