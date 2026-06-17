interface PuzzleProps {
  clues?: string[];
  finalMessage?: string;
}

export default function Puzzle({ clues = [], finalMessage }: PuzzleProps) {
  return (
    <div className="card-rose bg-card border border-border p-6">
      <h2 className="font-serif text-2xl text-rose-gold mb-4">A Little Puzzle for You</h2>
      {clues.length > 0 && (
        <ol className="list-decimal list-inside space-y-2 mb-4">
          {clues.map((clue, i) => (
            <li key={i} className="text-foreground text-sm">{clue}</li>
          ))}
        </ol>
      )}
      {finalMessage && (
        <p className="text-rose-gold font-serif italic">{finalMessage}</p>
      )}
    </div>
  );
}
