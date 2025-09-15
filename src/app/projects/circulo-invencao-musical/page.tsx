import Image from "next/image";

export default function CIMAboutPage() {
  return (
    <main className="min-h-screen p-4 sm:p-6 md:p-8 lg:p-12">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold leading-tight mb-4 sm:mb-6">
        Círculo de Invenção Musical
      </h1>
      
      <section className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 lg:p-12 grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center">
          {/* Logo section with improved mobile sizing */}
          <div className="md:col-span-1 flex justify-center md:justify-start">
            <div className="w-48 h-48 sm:w-56 sm:h-56 md:w-64 md:h-64 lg:w-72 lg:h-72 relative">
              <Image
                src="/LOGO-CIM-P.png"
                alt="Círculo de Invenção Musical logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          {/* Text content with improved mobile typography */}
          <div className="md:col-span-2 text-gray-300">
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

          <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 text-gray-300">
            <div className="p-3 sm:p-4 rounded-lg border">
              <div className="font-semibold underline text-base sm:text-lg">
                <a href="https://francisco-cardoso-de-araujo-n9hs.vercel.app/">Francisco Cardoso de Araujo</a>
              </div>
              <div className="text-xs sm:text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border">
              <div className="font-semibold underline text-base sm:text-lg">
                <a href="https://www.willianlentz.com/">Willian Lentz</a>
              </div>
              <div className="text-xs sm:text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-3 sm:p-4 rounded-lg border">
              <div className="font-semibold text-base sm:text-lg">Paul Wegmann</div>
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