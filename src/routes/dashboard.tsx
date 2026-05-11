import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { LogOut, ShieldCheck, Calendar, User as UserIcon } from "lucide-react";
import logo from "@/assets/logo.png";

export const Route = createFileRoute("/dashboard")({
  head: () => ({ meta: [{ title: "My Membership · AVS GYM" }] }),
  component: Dashboard,
});

type Plan = "monthly" | "quarterly" | "annual";
type Membership = {
  id: string;
  plan: Plan;
  status: "active" | "expired" | "cancelled" | "pending";
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

const PLAN_LABEL: Record<Plan, string> = { monthly: "Monthly", quarterly: "Quarterly", annual: "Annual" };

function Dashboard() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<{ full_name: string | null; phone: string | null } | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (!loading && !user) navigate({ to: "/auth" });
  }, [loading, user, navigate]);

  const load = async () => {
    if (!user) return;
    const [{ data: p }, { data: m }] = await Promise.all([
      supabase.from("profiles").select("full_name, phone").eq("id", user.id).maybeSingle(),
      supabase.from("memberships").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
    ]);
    setProfile(p);
    setMemberships((m as Membership[]) ?? []);
  };

  useEffect(() => { load(); }, [user?.id]);

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;
    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name") ?? "").trim().slice(0, 100);
    const phone = String(fd.get("phone") ?? "").trim().slice(0, 30);
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name, phone })
      .eq("id", user.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Profile updated"); load(); }
  };

  const requestPlan = async (plan: Plan) => {
    if (!user) return;
    setBusy(true);
    const { error } = await supabase.from("memberships").insert({ user_id: user.id, plan, status: "pending" });
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Membership requested — we'll activate it shortly."); load(); }
  };

  const cancelMembership = async (id: string) => {
    setBusy(true);
    const { error } = await supabase.from("memberships").update({ status: "cancelled" }).eq("id", id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Membership cancelled"); load(); }
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    navigate({ to: "/" });
  };

  if (loading || !user) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  const active = memberships.find((m) => m.status === "active" || m.status === "pending");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border bg-card/60 backdrop-blur">
        <div className="max-w-5xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="AVS Gym" className="h-10 w-10 rounded" />
            <div className="leading-tight">
              <div className="font-display text-xl tracking-wider" style={{ fontFamily: "var(--font-display)" }}>AVS GYM</div>
              <div className="text-[10px] tracking-[0.3em] text-primary">MEMBER AREA</div>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Button asChild variant="outline" size="sm"><Link to="/admin"><ShieldCheck className="h-4 w-4" /> Admin</Link></Button>
            )}
            <Button onClick={signOut} variant="ghost" size="sm"><LogOut className="h-4 w-4" /> Sign out</Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
        <div>
          <h1 className="text-4xl font-display" style={{ fontFamily: "var(--font-display)" }}>
            WELCOME{profile?.full_name ? `, ${profile.full_name.split(" ")[0].toUpperCase()}` : ""}
          </h1>
          <p className="text-muted-foreground mt-1">Manage your profile and AVS membership.</p>
        </div>

        {/* CURRENT MEMBERSHIP */}
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-2 text-primary text-xs tracking-[0.3em] font-semibold mb-3">
            <Calendar className="h-4 w-4" /> CURRENT MEMBERSHIP
          </div>
          {active ? (
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-3xl font-display" style={{ fontFamily: "var(--font-display)" }}>{PLAN_LABEL[active.plan]}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  Status: <Badge variant={active.status === "active" ? "default" : "secondary"} className="ml-1">{active.status}</Badge>
                </div>
                {active.end_date && <div className="text-sm text-muted-foreground mt-1">Renews / ends: {active.end_date}</div>}
              </div>
              <Button variant="outline" onClick={() => cancelMembership(active.id)} disabled={busy}>Cancel</Button>
            </div>
          ) : (
            <p className="text-muted-foreground">No active membership. Choose a plan below to get started.</p>
          )}
        </Card>

        {/* PLAN SELECTION */}
        <div>
          <h2 className="text-2xl font-display mb-4" style={{ fontFamily: "var(--font-display)" }}>CHOOSE A PLAN</h2>
          <div className="grid md:grid-cols-3 gap-4">
            {(["monthly", "quarterly", "annual"] as Plan[]).map((p) => (
              <Card key={p} className="p-6 bg-card border-border">
                <div className="text-sm tracking-[0.2em] uppercase text-muted-foreground mb-2">{PLAN_LABEL[p]}</div>
                <div className="text-4xl font-display text-primary mb-4" style={{ fontFamily: "var(--font-display)" }}>00 DT</div>
                <Button onClick={() => requestPlan(p)} disabled={busy} className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                  Request {PLAN_LABEL[p]}
                </Button>
              </Card>
            ))}
          </div>
        </div>

        {/* PROFILE */}
        <Card className="p-8 bg-card border-border">
          <div className="flex items-center gap-2 text-primary text-xs tracking-[0.3em] font-semibold mb-4">
            <UserIcon className="h-4 w-4" /> PROFILE
          </div>
          <form onSubmit={saveProfile} className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={profile?.full_name ?? ""} maxLength={100} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" type="tel" defaultValue={profile?.phone ?? ""} maxLength={30} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label>Email</Label>
              <Input value={user.email ?? ""} disabled />
            </div>
            <div className="md:col-span-2">
              <Button type="submit" disabled={busy} className="bg-primary text-primary-foreground hover:bg-primary/90">Save changes</Button>
            </div>
          </form>
        </Card>

        {/* HISTORY */}
        {memberships.length > 0 && (
          <Card className="p-8 bg-card border-border">
            <div className="text-primary text-xs tracking-[0.3em] font-semibold mb-4">HISTORY</div>
            <div className="space-y-2">
              {memberships.map((m) => (
                <div key={m.id} className="flex items-center justify-between border-b border-border pb-2 last:border-0">
                  <div>
                    <div className="font-semibold">{PLAN_LABEL[m.plan]}</div>
                    <div className="text-xs text-muted-foreground">{new Date(m.created_at).toLocaleDateString()}</div>
                  </div>
                  <Badge variant="outline">{m.status}</Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </main>
    </div>
  );
}