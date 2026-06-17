interface ProposalCardProps {
  senderName?: string;
  partnerName?: string;
  message?: string;
}

export default function ProposalCard({ senderName, partnerName, message }: ProposalCardProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      <h2 className="font-serif text-2xl text-rose-gold mb-4">Will You Marry Me?</h2>
      {partnerName && <p className="text-foreground mb-2">For {partnerName}</p>}
      {senderName && <p className="text-sm text-muted-foreground mb-2">From {senderName}</p>}
      {message && <p className="text-foreground">{message}</p>}
    </div>
  );
}
