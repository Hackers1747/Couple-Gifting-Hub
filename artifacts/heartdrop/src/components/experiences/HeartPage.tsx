interface HeartPageProps {
  title?: string;
  message?: string;
  photoUrl?: string;
}

export default function HeartPage({ title, message, photoUrl }: HeartPageProps) {
  return (
    <div className="card-rose bg-card border border-border p-6 flex flex-col items-center text-center">
      {photoUrl && (
        <img
          src={photoUrl}
          alt="Gift photo"
          className="w-full object-cover mb-4"
          style={{ borderRadius: 12, maxHeight: 240 }}
        />
      )}
      {title && <h2 className="font-serif text-2xl text-rose-gold mb-3">{title}</h2>}
      {message && <p className="text-foreground text-sm leading-relaxed">{message}</p>}
    </div>
  );
}
