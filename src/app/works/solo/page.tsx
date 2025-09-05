export default function SoloWorks() {
  const songs = [
    "Ao Adeus-à-deus A (2025) - soprano sax (in progress)",
    "Adeus-à-deus A (2024) - oboe",
    "Lucarne-res-recess (2022) - clarinet and live electronics",
    "Brin (2020) - double bass",
    "…E o Lirismo dos Bêbados (2020) - violin",
    "Flamboiã (2018) - clarinet",
  ];

  return (
    <main className="p-12 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">Compositions</h1>
      
      <div className="space-y-3">
        {songs.map((song, index) => (
          <div key={index} className="text-lg text-gray-300 hover:text-white transition-colors">
            {song}
          </div>
        ))}
      </div>
      
      <div className="mt-12 text-sm text-gray-400">
        Total compositions: {songs.length}
      </div>
    </main>
  );
}