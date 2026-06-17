export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
      <h1 className="font-serif text-4xl text-rose-gold mb-2">HeartDrop</h1>
      <p className="text-muted-foreground text-sm text-center mb-8">
        Personalized digital gifting for Indian couples
      </p>
      <a
        href="/create"
        className="btn-pill bg-primary text-primary-foreground px-8 py-3 font-medium text-sm"
      >
        Create a Gift
      </a>
    </div>
  );
}
