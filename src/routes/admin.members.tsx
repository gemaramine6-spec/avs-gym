import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Search, Pencil } from "lucide-react";

export const Route = createFileRoute("/admin/members")({
  head: () => ({ meta: [{ title: "Members · AVS GYM Admin" }] }),
  component: MembersPage,
});

type Plan = "monthly" | "quarterly" | "annual";
type Status = "active" | "expired" | "cancelled" | "pending";

type Membership = {
  id: string;
  user_id: string;
  plan: Plan;
  status: Status;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
};

type Member = {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  current?: Membership | null;
};

const STATUS_VARIANT: Record<Status, "default" | "secondary" | "outline" | "destructive"> = {
  active: "default",
  pending: "secondary",
  expired: "outline",
  cancelled: "destructive",
};

function MembersPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | Status | "none">("all");
  const [editing, setEditing] = useState<Member | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/dashboard" });
  }, [loading, user, isAdmin, navigate]);

  const load = async () => {
    const [{ data: profs }, { data: ms }] = await Promise.all([
      supabase.from("profiles").select("id, full_name, phone, created_at").order("created_at", { ascending: false }),
      supabase.from("memberships").select("*").order("created_at", { ascending: false }),
    ]);
    const latest = new Map<string, Membership>();
    (ms ?? []).forEach((m) => {
      if (!latest.has(m.user_id)) latest.set(m.user_id, m as Membership);
    });
    setMembers(
      (profs ?? []).map((p) => ({
        id: p.id,
        full_name: p.full_name,
        phone: p.phone,
        created_at: p.created_at,
        current: latest.get(p.id) ?? null,
      })),
    );
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return members.filter((m) => {
      const matchesQ =
        !q ||
        (m.full_name ?? "").toLowerCase().includes(q) ||
        (m.phone ?? "").toLowerCase().includes(q);
      const matchesS =
        statusFilter === "all" ||
        (statusFilter === "none" ? !m.current : m.current?.status === statusFilter);
      return matchesQ && matchesS;
    });
  }, [members, query, statusFilter]);

  const updateStatus = async (membershipId: string, status: Status) => {
    const patch: { status: Status; start_date?: string } = { status };
    if (status === "active") patch.start_date = new Date().toISOString().slice(0, 10);
    const { error } = await supabase.from("memberships").update(patch).eq("id", membershipId);
    if (error) toast.error(error.message);
    else { toast.success("Status updated"); load(); }
  };

  const saveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!editing) return;
    const fd = new FormData(e.currentTarget);
    const full_name = String(fd.get("full_name") ?? "").trim().slice(0, 100);
    const phone = String(fd.get("phone") ?? "").trim().slice(0, 30);
    setBusy(true);
    const { error } = await supabase.from("profiles").update({ full_name, phone }).eq("id", editing.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else { toast.success("Member updated"); setEditing(null); load(); }
  };

  const assignPlan = async (memberId: string, plan: Plan) => {
    const { error } = await supabase.from("memberships").insert({
      user_id: memberId,
      plan,
      status: "active",
      start_date: new Date().toISOString().slice(0, 10),
    });
    if (error) toast.error(error.message);
    else { toast.success(`${plan} plan activated`); load(); }
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/admin" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to admin
          </Link>
          <div className="font-display tracking-wider" style={{ fontFamily: "var(--font-display)" }}>MEMBERS</div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-display" style={{ fontFamily: "var(--font-display)" }}>ALL MEMBERS</h1>
            <p className="text-muted-foreground mt-1">{filtered.length} of {members.length} shown</p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
            <div className="relative flex-1 md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search name or phone…"
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="none">No membership</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <Card className="p-0 bg-card border-border overflow-hidden">
          <div className="divide-y divide-border">
            {filtered.length === 0 && (
              <div className="p-8 text-muted-foreground text-center">No members match your filters.</div>
            )}
            {filtered.map((m) => (
              <div key={m.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{m.full_name || "Unnamed member"}</div>
                  <div className="text-xs text-muted-foreground">{m.phone || "—"} · joined {new Date(m.created_at).toLocaleDateString()}</div>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  {m.current ? (
                    <>
                      <Badge variant="outline" className="capitalize">{m.current.plan}</Badge>
                      <Badge variant={STATUS_VARIANT[m.current.status]} className="capitalize">{m.current.status}</Badge>
                      <Select value={m.current.status} onValueChange={(v) => updateStatus(m.current!.id, v as Status)}>
                        <SelectTrigger className="w-32"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="active">Active</SelectItem>
                          <SelectItem value="expired">Expired</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  ) : (
                    <Select onValueChange={(v) => assignPlan(m.id, v as Plan)}>
                      <SelectTrigger className="w-40"><SelectValue placeholder="Assign plan" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="annual">Annual</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setEditing(m)} aria-label="Edit member">
                    <Pencil className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit member</DialogTitle>
          </DialogHeader>
          {editing && (
            <form onSubmit={saveProfile} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="full_name">Full name</Label>
                <Input id="full_name" name="full_name" defaultValue={editing.full_name ?? ""} maxLength={100} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" type="tel" defaultValue={editing.phone ?? ""} maxLength={30} />
              </div>
              <DialogFooter>
                <Button type="button" variant="ghost" onClick={() => setEditing(null)}>Cancel</Button>
                <Button type="submit" disabled={busy}>Save changes</Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}