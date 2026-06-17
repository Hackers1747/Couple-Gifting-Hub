interface BirthdayBashProps {
  recipientName?: string;
  senderName?: string;
  message?: string;
}

export default function BirthdayBash({ recipientName, senderName, message }: BirthdayBashProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      <h2 className="font-serif text-2xl text-rose-gold mb-4">Happy Birthday!</h2>
      {recipientName && <p className="text-foreground mb-2">To {recipientName}</p>}
      {senderName && <p className="text-sm text-muted-foreground mb-2">From {senderName}</p>}
      {message && <p className="text-foreground">{message}</p>}
    </div>
  );
}
