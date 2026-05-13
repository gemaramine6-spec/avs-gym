import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin · AVS GYM" }] }),
  component: AdminPage,
});

type Status = "active" | "expired" | "cancelled" | "pending";
type Row = {
  id: string;
  user_id: string;
  plan: "monthly" | "quarterly" | "annual";
  status: Status;
  start_date: string | null;
  end_date: string | null;
  created_at: string;
  profile?: { full_name: string | null; phone: string | null } | null;
  email?: string | null;
};

function AdminPage() {
  const { user, loading, isAdmin } = useAuth();
  const navigate = useNavigate();
  const [rows, setRows] = useState<Row[]>([]);

  useEffect(() => {
    if (loading) return;
    if (!user) navigate({ to: "/auth" });
    else if (!isAdmin) navigate({ to: "/dashboard" });
  }, [loading, user, isAdmin, navigate]);

  const load = async () => {
    const { data: ms } = await supabase
      .from("memberships")
      .select("*")
      .order("created_at", { ascending: false });
    if (!ms) return setRows([]);
    const userIds = Array.from(new Set(ms.map((m) => m.user_id)));
    const { data: profs } = await supabase
      .from("profiles")
      .select("id, full_name, phone")
      .in("id", userIds);
    const profMap = new Map((profs ?? []).map((p) => [p.id, p]));
    setRows(
      ms.map((m) => ({
        ...m,
        profile: profMap.get(m.user_id) ?? null,
      })),
    );
  };

  useEffect(() => { if (isAdmin) load(); }, [isAdmin]);

  const updateStatus = async (id: string, status: Status) => {
    const patch: { status: Status; start_date?: string } = { status };
    if (status === "active") {
      const today = new Date();
      patch.start_date = today.toISOString().slice(0, 10);
    }
    const { error } = await supabase.from("memberships").update(patch).eq("id", id);
    if (error) toast.error(error.message);
    else { toast.success("Updated"); load(); }
  };

  if (loading || !isAdmin) {
    return <div className="min-h-screen flex items-center justify-center text-muted-foreground">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link to="/dashboard" className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary">
            <ArrowLeft className="h-4 w-4" /> Back to dashboard
          </Link>
          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm">
              <Link to="/admin/members"><Users className="h-4 w-4" /> Members</Link>
            </Button>
            <div className="font-display tracking-wider" style={{ fontFamily: "var(--font-display)" }}>ADMIN</div>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-display mb-2" style={{ fontFamily: "var(--font-display)" }}>MEMBERSHIPS</h1>
        <p className="text-muted-foreground mb-8">{rows.length} total · review and update statuses.</p>

        <Card className="p-0 bg-card border-border overflow-hidden">
          <div className="divide-y divide-border">
            {rows.length === 0 && <div className="p-8 text-muted-foreground">No memberships yet.</div>}
            {rows.map((r) => (
              <div key={r.id} className="p-5 flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
                <div className="flex-1 min-w-0">
                  <div className="font-semibold truncate">{r.profile?.full_name || "Unnamed member"}</div>
                  <div className="text-xs text-muted-foreground">{r.profile?.phone || "—"}</div>
                </div>
                <div className="text-sm">
                  <Badge variant="outline" className="capitalize">{r.plan}</Badge>
                </div>
                <div className="text-xs text-muted-foreground w-28">
                  {new Date(r.created_at).toLocaleDateString()}
                </div>
                <Select value={r.status} onValueChange={(v) => updateStatus(r.id, v as Status)}>
                  <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="expired">Expired</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}