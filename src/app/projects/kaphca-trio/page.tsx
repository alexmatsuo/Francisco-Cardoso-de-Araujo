import Image from "next/image";

export default function KaphcaTrioPage() {
  return (
    <>
      <main className="works-container">
        {/* Header */}
        <h1 className="text-4xl font-bold mb-16">Kaphca Trio</h1>
        
        {/* Content section */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-16">
            {/* Group Photo - on top */}
            <div className="w-10/12 h-96 relative overflow-hidden shadow-lg mx-auto">
              <Image
                src="/Kaphca Trio grupo.jpg"
                alt="Kaphca Trio Group Photo"
                fill
                sizes=""
                className="object-cover"
              />
            </div>
            
            {/* Description below image */}
            <div>
              <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap text-justify">
                <a href="https://kaphcatrio.bandcamp.com/album/kaphca-trio" className="underline">Kaphca Trio</a> is an experimental musical collective from Athens, GA. Founded in 2024 by Dan Phipps, Francisco Cardoso, and Daniel Karcher, the group improvises with an assortment of acoustic instruments and experimental electronics to create harsh and discordant soundscapes.
              </p>
            </div>

            {/* Album Information with aligned album cover */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-4">About the Album</h2>
                <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-wrap text-justify">
                  The eponymous album of the Kaphca Trio was recorded at the Dancz Center for New Music and features two guided improvisations composed by Karcher and Cardoso (Transformation and through medium, respectively). The majority of the album combines the sound of no-input mixing boards along with Dan Phipps on saxophone, resulting in hosts of eerie textures and chaotic feedback loops. The name for the Kaphca trio comes from an amalgamation of the first letters of each of the member's last names (Karcher, Phipps, Cardoso) which coincidentally, is similar to the name of a certain writer.
                </p>
              </div>
              {/* Album Cover with caption */}
              <div className="flex flex-col items-center">
                <div className="w-96 h-96 relative overflow-hidden shadow-lg flex-shrink-0">
                  <a href="https://kaphcatrio.bandcamp.com/album/kaphca-trio" target="_blank" rel="noopener noreferrer">
                    <Image
                      src="/Kaphca Trio capa.jpg"
                      alt="Kaphca Trio Album Cover"
                      fill
                      sizes=""
                      className="object-cover"
                      priority
                    />
                  </a>
                </div>
                {/* Caption below album */}
                <p className="text-sm text-gray-300 mt-3">
                  <a href="https://kaphcatrio.bandcamp.com/album/kaphca-trio" className="underline">
                    Listen on Bandcamp
                  </a>
                </p>
              </div>
            </div>

            {/* Credits */}
            <div>
              <h2 className="text-2xl font-semibold mb-4">Credits</h2>
              <p className="text-lg leading-relaxed text-gray-300 whitespace-pre-line">
                Released October 31, 2024 <br />
                Performers: Dan Phipps, Francisco Cardoso, Daniel Karcher <br />
                Recording Engineer: Jared Bradley Tubbs <br />
                Mixer and Producer: Daniel Karcher <br />
                Info and Program Notes: Daniel Karcher <br />
                © All rights reserved
              </p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
