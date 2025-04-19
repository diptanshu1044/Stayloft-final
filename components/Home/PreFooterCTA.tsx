import Link from "next/link";
import { Button } from "../ui/button";

export default function PreFooterCTA() {
  return (
    <section className="py-16 bg-primary text-white">
      <div className="container text-center">
        <h2 className="text-3xl font-bold mb-4">
          Ready to Find Your Perfect Stay?
        </h2>
        <p className="max-w-2xl mx-auto mb-8">
          Join thousands of satisfied users who found their ideal accommodation
          with StayLoft
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" variant="secondary" asChild>
            <Link href="/flats">Browse Flats</Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="bg-transparent text-white hover:bg-primary/90"
            asChild
          >
            <Link href="/pgs">Explore PGs</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
