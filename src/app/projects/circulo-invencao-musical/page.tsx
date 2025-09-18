import Image from "next/image";

export default function CIMAboutPage() {
  return (
    <main className="works-container">
      <h1 className="text-4xl font-bold mb-16">
        Círculo de Invenção Musical
      </h1>
      
      <section className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12">
          {/* Logo section centered at the top */}
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-96 lg:h-96 relative">
              <Image
                src="/LOGO-CIM-P.png"
                alt="Círculo de Invenção Musical logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* Text content below the logo */}
          <div className="text-gray-300">
            <p className="text-base sm:text-lg md:text-xl">
              Founded in 2015, the <strong>Círculo de Invenção Musical</strong> (Circle of Musical Invention) is a collective
              of composers, performers, conductors, and music educators that has continuously organized concerts,
              masterclasses, and public events, freely contributing to cultural life — particularly in Curitiba.
            </p>

            <p className="mt-4 text-base sm:text-lg">
              Over its ten years of uninterrupted activity, CIM has collaborated with numerous Brazilian and international
              musicians, embracing diverse artistic paths and aesthetic pluralities within experimental contemporary
              concert music. In addition to its independent productions, the group has taken part in two editions of the Bienal Música Hoje and three editions of the International Symposium of New Music.
            </p>
          </div>
        </div>

        {/* Founders section with improved mobile layout */}
        <div id="founders" className="p-4 sm:p-6 md:p-8 lg:p-12">
          <h2 className="text-xl sm:text-2xl font-semibold">Founding members & direction</h2>
          <p className="mt-3 sm:mt-4 text-gray-300 text-base sm:text-lg">
            Francisco, together with Willian Lentz and Paul Wegmann, is a founding member and co-artistic director of the collective.
          </p>

          <div className="mt-4 sm:mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-300">
            <div className="p-4 rounded-lg border border-white/20 bg-black">
              <div className="font-semibold underline text-base sm:text-lg">
                <a href="https://francisco-cardoso-de-araujo-n9hs.vercel.app/">Francisco Cardoso de Araujo</a>
              </div>
              <div className="text-xs sm:text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-4 rounded-lg border border-white/20 bg-black">
              <div className="font-semibold underline text-base sm:text-lg">
                <a href="https://www.willianlentz.com/">Willian Lentz</a>
              </div>
              <div className="text-xs sm:text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-4 rounded-lg border border-white/20 bg-black">
              <div className="font-semibold text-base sm:text-lg underline">
                <a href="https://soundcloud.com/paul-wegmann">Paul Wegmann</a>
              </div>
              <div className="text-xs sm:text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>
          </div>
        </div>

        <footer className="p-4 sm:p-6 text-center text-xs sm:text-sm text-gray-300">
          © Círculo de Invenção Musical — founded 2015
        </footer>
      </section>
    </main>
  );
}