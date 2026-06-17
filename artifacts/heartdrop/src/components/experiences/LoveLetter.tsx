interface LoveLetterProps {
  senderName?: string;
  recipientName?: string;
  body?: string;
}

export default function LoveLetter({ senderName, recipientName, body }: LoveLetterProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      {recipientName && (
        <p className="font-serif text-lg text-foreground mb-4">My dearest {recipientName},</p>
      )}
      {body && (
        <p className="text-foreground leading-relaxed whitespace-pre-wrap mb-6">{body}</p>
      )}
      {senderName && (
        <p className="font-serif italic text-rose-gold text-right">— {senderName}</p>
      )}
    </div>
  );
}
