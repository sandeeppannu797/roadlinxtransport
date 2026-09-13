import Link from 'next/link';
import { staticPages } from '@/content/pages';
import { pageMetadata } from '@/lib/meta';
import { JsonLd } from '@/components/JsonLd';
import { TruckFinder } from './TruckFinder';

/* The truck finder tool. Head values live with the other pages in content/pages.ts. */
const page = staticPages['truck-finder'];

export const metadata = pageMetadata(page.head);

export default function TruckFinderPage() {
  return (
    <>
      <JsonLd blocks={page.head.jsonLd} />
      <main id="main">
        <section className="page-hero">
          <div className="container">
            <nav className="breadcrumbs" aria-label="Breadcrumb">
              <Link href="/">Home</Link><span className="sep">/</span>
              <Link href="/fleet">Fleet</Link><span className="sep">/</span>
              <span>Truck finder</span>
            </nav>
            <span className="overline">Truck finder</span>
            <h1>Which truck do I need?</h1>
            <p className="ph-lead">Answer a few quick questions about your freight and we&apos;ll suggest the right vehicle, from a one-tonne ute to a 24-pallet semi. Then get a quote in one click.</p>
          </div>
        </section>

        <section className="section">
          <div className="container">
            <TruckFinder />
          </div>
        </section>

        <section className="section section--sunken">
          <div className="container">
            <div className="prose">
              <h2>How we match the truck to your load</h2>
              <p>Three things decide the vehicle: how much you&apos;re sending, how it&apos;s loaded and unloaded, and the access at each end. Get those right and the job runs smoothly and costs less.</p>
              <h3>Utes and vans</h3>
              <p>For a couple of pallets, a few cartons or small gear around the metro, a one-tonne ute or van is the quick, economical choice.</p>
              <h3>Rigid trucks, 4 to 12 tonnes</h3>
              <p>Rigid trucks carry the bulk of metro freight, from several pallets up to heavier loads.</p>
              <h3>Tail-lift trucks, 3 to 12 tonnes</h3>
              <p>A powered platform lowers freight to the ground, so we can deliver to shopfronts, homes and sites with no forklift or dock.</p>
              <h3>22 and 24-pallet semi-trailers</h3>
              <p>For full loads. A 24-pallet trailer takes 24 standard pallets in a single layer. For heavy, dense freight a 22-pallet trailer can suit better, because the weight limit is reached before the floor runs out.</p>
              <h3>Flat-tops and drop-decks</h3>
              <p>Flat-tops are loaded by crane or forklift from the top or sides, for steel, timber, machinery and oversize items. Drop-decks sit lower over the rear axles to carry taller loads within legal height.</p>
              <p>Still not sure? Tell us what you&apos;re moving and the access at both ends, and we&apos;ll recommend the vehicle. See the <Link href="/fleet">full fleet</Link> or <Link href="/quote">request a quote</Link>.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
