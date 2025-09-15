import Image from "next/image";

export default function CIMAboutPage() {
  return (
    <main className="min-h-screen p-6 sm:p-12">
      <h1 className="text-3xl sm:text-4xl font-extrabold leading-tight">Círculo de Invenção Musical</h1>
      <section className="max-w-4xl mx-auto rounded-2xl overflow-hidden">
        <div className="p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="md:col-span-1 flex items-center ">
            <div className="w-72 h-72 relative">
              <Image
                src="/LOGO-CIM-P.png"
                alt="Círculo de Invenção Musical logo"
                fill
                style={{ objectFit: "contain" }}
                priority
              />
            </div>
          </div>

          <div className="md:col-span-2 text-gray-300">
            <p className="mt-4 text-lg">
              Founded in 2015, the <strong>Círculo de Invenção Musical</strong> (Circle of Musical Invention) is a collective
              of composers, performers, conductors, and music educators that has continuously organized concerts,
              masterclasses, and public events, freely contributing to cultural life — particularly in Curitiba.
            </p>

            <p className="mt-4">
              Over its ten years of uninterrupted activity, CIM has collaborated with numerous Brazilian and international
              musicians, embracing diverse artistic paths and aesthetic pluralities within experimental contemporary
              concert music.In addition to its independent productions, the group has taken part in two editions of the Bienal Música Hoje and three editions of the International Symposium of New Music. Francisco, together with Willian Lentz and Paul Wegmann, is a founding member and co-artistic director of the collective.
            </p>
          </div>
        </div>


        <div id="founders" className="p-8 sm:p-12">
          <h2 className="text-2xl font-semibold">Founding members & direction</h2>
          <p className="mt-4 text-gray-300">Francisco, together with Willian Lentz and Paul Wegmann, is a founding member and co-artistic director of the collective.</p>

          <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-gray-300">
            <div className="p-4 rounded-lg border">
              <div className="font-semibold underline"><a href="https://francisco-cardoso-de-araujo-n9hs.vercel.app/">Francisco Cardoso de Araujo</a></div>
              <div className="text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="font-semibold underline"><a href="https://www.willianlentz.com/">Willian Lentz</a></div>
              <div className="text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>

            <div className="p-4 rounded-lg border">
              <div className="font-semibold">Paul Wegmann</div>
              <div className="text-sm mt-1">Co-Artistic Director, Composer, Coordinator, and Producer</div>
            </div>
          </div>
        </div>

        <footer className="p-6 text-center text-sm text-gray-300">
          © Círculo de Invenção Musical — founded 2015
        </footer>
      </section>
    </main>
  );
}
