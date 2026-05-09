import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dumbbell, Flame, HeartPulse, Trophy, MapPin, Phone, Clock, Star, ArrowRight } from "lucide-react";
import logo from "@/assets/logo.png";
import hero from "@/assets/hero.jpg";
import gymInterior from "@/assets/gym-interior.png";
import dumbbells from "@/assets/dumbbells.png";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* NAV */}
      <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md bg-background/70 border-b border-border">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <a href="#top" className="flex items-center gap-3">
            <img src={logo} alt="AVS Gym" className="h-12 w-12 rounded-md object-cover" />
            <div className="leading-tight">
              <div className="font-display text-2xl tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AVS GYM</div>
              <div className="text-[10px] tracking-[0.3em] text-primary">HEALTH IS WEALTH</div>
            </div>
          </a>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#about" className="hover:text-primary transition">About</a>
            <a href="#programs" className="hover:text-primary transition">Programs</a>
            <a href="#facility" className="hover:text-primary transition">Facility</a>
            <a href="#pricing" className="hover:text-primary transition">Pricing</a>
            <a href="#contact" className="hover:text-primary transition">Contact</a>
          </nav>
          <Button asChild className="bg-primary text-primary-foreground hover:bg-primary/90 font-semibold">
            <a href="tel:+21623124005">Join Now</a>
          </Button>
        </div>
      </header>

      {/* HERO */}
      <section id="top" className="relative min-h-screen flex items-center pt-20 overflow-hidden">
        <div className="absolute inset-0">
          <img src={hero} alt="" className="w-full h-full object-cover object-right" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(90deg, oklch(0.13 0.01 60) 0%, oklch(0.13 0.01 60 / 0.85) 45%, transparent 100%)" }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center w-full">
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary/40 bg-primary/10 text-primary text-xs tracking-widest font-semibold mb-6">
              <Flame className="h-3.5 w-3.5" /> BENI KHIAR · TUNISIA
            </div>
            <h1 className="text-6xl md:text-8xl font-display leading-[0.9] mb-6" style={{ fontFamily: "var(--font-display)" }}>
              FORGE THE
              <span className="block text-primary">STRONGEST</span>
              VERSION OF YOU.
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mb-10">
              At AVS Gym we don't just train bodies — we build discipline, confidence and a community that pushes you beyond your limits. State-of-the-art equipment. Expert coaches. Real results.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90 h-14 px-8 text-base font-semibold" style={{ boxShadow: "var(--shadow-glow)" }}>
                <a href="#pricing">Start Training <ArrowRight className="ml-2 h-5 w-5" /></a>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-14 px-8 text-base border-foreground/20 hover:bg-foreground/5">
                <a href="#facility">Tour the Gym</a>
              </Button>
            </div>
            <div className="flex items-center gap-6 mt-10">
              <div className="flex items-center gap-1 text-primary">
                {[...Array(5)].map((_, i) => <Star key={i} className="h-5 w-5 fill-current" />)}
              </div>
              <div className="text-sm text-muted-foreground">5.0 rated · loved by our community</div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-border bg-card/40">
        <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            ["500+", "Active Members"],
            ["15+", "Expert Coaches"],
            ["50+", "Weekly Classes"],
            ["7", "Days a Week"],
          ].map(([n, l]) => (
            <div key={l}>
              <div className="text-5xl font-display text-primary" style={{ fontFamily: "var(--font-display)" }}>{n}</div>
              <div className="text-xs tracking-[0.2em] text-muted-foreground mt-2 uppercase">{l}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="py-28">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src={gymInterior} alt="AVS Gym training floor" className="rounded-2xl w-full aspect-[4/5] object-cover" />
            <div className="absolute -bottom-6 -right-6 bg-primary text-primary-foreground p-6 rounded-xl max-w-xs hidden md:block" style={{ boxShadow: "var(--shadow-glow)" }}>
              <div className="text-4xl font-display" style={{ fontFamily: "var(--font-display)" }}>EST. 2024</div>
              <div className="text-xs tracking-widest uppercase mt-1">A new era of training</div>
            </div>
          </div>
          <div>
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">ABOUT AVS GYM</div>
            <h2 className="text-5xl md:text-6xl font-display mb-6 leading-none" style={{ fontFamily: "var(--font-display)" }}>
              MORE THAN A GYM.<br/>
              <span className="text-primary">A LIFESTYLE.</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-6">
              Located in the heart of Beni Khiar, AVS Gym is the destination for serious athletes and beginners alike. Our space combines elite equipment, motivating energy, and coaches who care about your progress.
            </p>
            <p className="text-muted-foreground mb-8">
              Whether you're chasing strength, fat loss, or just a healthier life — we've built the environment to make it happen.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                ["Premium Equipment", "Hammer Strength & more"],
                ["Certified Coaches", "Personalized programs"],
                ["Open Late", "Until 11 PM daily"],
                ["Community", "Train with the best"],
              ].map(([t, d]) => (
                <div key={t} className="border-l-2 border-primary pl-4">
                  <div className="font-semibold">{t}</div>
                  <div className="text-sm text-muted-foreground">{d}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* PROGRAMS */}
      <section id="programs" className="py-28 bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">WHAT WE OFFER</div>
            <h2 className="text-5xl md:text-6xl font-display" style={{ fontFamily: "var(--font-display)" }}>TRAIN YOUR WAY</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Dumbbell, t: "Strength", d: "Build raw power with free weights, racks and Hammer Strength machines." },
              { icon: Flame, t: "HIIT & Cardio", d: "Burn fat and elevate endurance with high-intensity circuits." },
              { icon: HeartPulse, t: "Personal Training", d: "1-on-1 coaching tailored to your goals, level and lifestyle." },
              { icon: Trophy, t: "Bodybuilding", d: "Sculpt and shred with structured hypertrophy programs." },
            ].map(({ icon: Icon, t, d }) => (
              <Card key={t} className="bg-background border-border p-8 hover:border-primary/60 transition group">
                <div className="h-14 w-14 rounded-lg bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="text-2xl font-display mb-3" style={{ fontFamily: "var(--font-display)" }}>{t}</h3>
                <p className="text-sm text-muted-foreground">{d}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FACILITY */}
      <section id="facility" className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-end mb-12">
            <div>
              <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">THE FACILITY</div>
              <h2 className="text-5xl md:text-6xl font-display leading-none" style={{ fontFamily: "var(--font-display)" }}>BUILT FOR <span className="text-primary">RESULTS</span></h2>
            </div>
            <p className="text-muted-foreground text-lg">
              From premium dumbbells to a full functional zone — every square meter is designed to push you further.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <img src={gymInterior} alt="Training floor" className="rounded-xl aspect-square object-cover md:row-span-2 md:aspect-[3/4] w-full h-full" />
            <img src={dumbbells} alt="Hammer Strength dumbbells" className="rounded-xl aspect-square object-cover md:col-span-2 w-full h-full" />
            <img src={hero} alt="Athlete training" className="rounded-xl aspect-square object-cover w-full h-full" />
            <div className="rounded-xl bg-primary text-primary-foreground p-8 flex flex-col justify-between aspect-square">
              <Flame className="h-10 w-10" />
              <div>
                <div className="text-3xl font-display leading-none" style={{ fontFamily: "var(--font-display)" }}>Come see it for yourself.</div>
                <a href="#contact" className="inline-flex items-center gap-2 mt-4 font-semibold underline-offset-4 hover:underline">Visit us <ArrowRight className="h-4 w-4" /></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-28 bg-card/40 border-y border-border">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">MEMBERSHIPS</div>
            <h2 className="text-5xl md:text-6xl font-display" style={{ fontFamily: "var(--font-display)" }}>CHOOSE YOUR PLAN</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
               { name: "Monthly", price: "00", per: "DT / month", features: ["Full gym access", "Locker room", "Free WiFi"], featured: false },
              { name: "Quarterly", price: "210", per: "DT / 3 months", features: ["Full gym access", "1 PT session/month", "Nutrition guide", "Group classes"], featured: true },
              { name: "Annual", price: "699", per: "DT / year", features: ["Full gym access", "4 PT sessions", "Nutrition plan", "All classes", "Priority booking"], featured: false },
            ].map((p) => (
              <Card key={p.name} className={`p-10 relative ${p.featured ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border"}`} style={p.featured ? { boxShadow: "var(--shadow-glow)" } : {}}>
                {p.featured && <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-background text-primary text-xs px-3 py-1 rounded-full font-semibold tracking-widest">MOST POPULAR</div>}
                <div className="text-sm tracking-[0.2em] uppercase mb-4 opacity-80">{p.name}</div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-7xl font-display" style={{ fontFamily: "var(--font-display)" }}>{p.price}</span>
                </div>
                <div className="text-sm opacity-70 mb-8">{p.per}</div>
                <ul className="space-y-3 mb-10">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <div className={`h-1.5 w-1.5 rounded-full ${p.featured ? "bg-primary-foreground" : "bg-primary"}`} />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button asChild className={`w-full h-12 font-semibold ${p.featured ? "bg-background text-primary hover:bg-background/90" : "bg-primary text-primary-foreground hover:bg-primary/90"}`}>
                  <a href="tel:+21623124005">Get Started</a>
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">REVIEWS</div>
            <h2 className="text-5xl md:text-6xl font-display" style={{ fontFamily: "var(--font-display)" }}>RATED 5.0 ★</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { n: "Ahmed Chtioui", t: "Best gym in the region. Equipment is top tier and the vibe pushes you to give your best every session." },
              { n: "Soumaya Zardoum", t: "Friendly coaches, clean space, and real results. AVS Gym truly changed my routine and my confidence." },
              { n: "Eslem Chtioui", t: "I love training here. The energy is unmatched and the team genuinely cares about your progress." },
            ].map((r) => (
              <Card key={r.n} className="p-8 bg-card border-border">
                <div className="flex gap-1 text-primary mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
                </div>
                <p className="text-muted-foreground mb-6">"{r.t}"</p>
                <div className="font-semibold">{r.n}</div>
                <div className="text-xs text-muted-foreground">Verified member</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" className="py-28 bg-card/40 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">VISIT US</div>
            <h2 className="text-5xl md:text-6xl font-display mb-6 leading-none" style={{ fontFamily: "var(--font-display)" }}>
              READY TO <span className="text-primary">START?</span>
            </h2>
            <p className="text-muted-foreground text-lg mb-10">
              Drop by for a tour or call us — your transformation begins the moment you walk in.
            </p>
            <div className="space-y-6">
              <a href="https://maps.google.com/?q=AVS+Gym+Beni+Khiar" target="_blank" rel="noopener noreferrer" className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Avenue Habib Bourguiba</div>
                  <div className="text-muted-foreground text-sm">Beni Khiar 8060, Tunisia</div>
                </div>
              </a>
              <a href="tel:+21623124005" className="flex items-start gap-4 group">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">+216 23 124 005</div>
                  <div className="text-muted-foreground text-sm">Call to book your visit</div>
                </div>
              </a>
              <div className="flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <div className="font-semibold">Open Daily · Closes 11 PM</div>
                  <div className="text-muted-foreground text-sm">7 days a week</div>
                </div>
              </div>
            </div>
          </div>
          <div className="rounded-2xl overflow-hidden border border-border h-[480px]">
            <iframe
              title="AVS Gym Location"
              src="https://www.google.com/maps?q=Avenue+Habib+Bourguiba,+Beni+Khiar+8060&output=embed"
              className="w-full h-full grayscale"
              loading="lazy"
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="py-12 border-t border-border">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row gap-6 items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AVS Gym" className="h-10 w-10 rounded" />
            <div>
              <div className="font-display tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AVS GYM</div>
              <div className="text-[10px] tracking-[0.3em] text-primary">HEALTH IS WEALTH</div>
            </div>
          </div>
          <div className="text-sm text-muted-foreground">© {new Date().getFullYear()} AVS Gym · Beni Khiar, Tunisia</div>
        </div>
      </footer>
    </div>
  );
}
