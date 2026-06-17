export default function ExpiredCard() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 text-center">
      <h1 className="font-serif text-3xl text-rose-gold mb-4">This gift has expired</h1>
      <p className="text-muted-foreground text-sm">
        This HeartDrop card is no longer active.
      </p>
    </div>
  );
}
