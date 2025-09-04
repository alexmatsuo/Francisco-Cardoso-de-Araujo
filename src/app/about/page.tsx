import Image from "next/image";
import FranciscoImg from "@/assets/images/francisco.avif";

export default function AboutPage() {
  return (
    <>
      <main className="flex flex-col md:flex-row items-center md:items-start p-8 gap-8">
        {/* Image section */}
        <div className="w-48 h-48 relative rounded-full overflow-hidden shadow-lg">
          <Image
            src={FranciscoImg}
            alt="Francisco"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Text section */}
        <div className="max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">About Me</h1>
          <p className="text-lg leading-relaxed text-gray-300">
          Born in Curitiba, Francisco Cardoso de Araujo is a composer, researcher, clarinetist, and musical improviser. He holds a Doctorate in Music Composition from the University of Georgia (D.M.A.), a Master’s degree in Music Composition from the Federal University of Rio Grande do Sul (UFRGS), and a Bachelor’s degree in Composition and Conducting from the State University of Paraná (UNESPAR). As a composer, his works have been premiered in Brazil, Bulgaria, Spain, Italy, and the United States, featured at festivals and institutions such as the Valencia International Performing Arts Summer Festival, Alba Music Festival, the Society for Electro-Acoustic Music in the United States, the Bienal Música Hoje, and the Simpósio Internacional de Música Nova. He is a founding member of the Círculo de Invenção Musical, and is currently a member of the Atlanta Contemporary Music Collective.
          </p>
        </div>
      </main>
    </>
  );
}
