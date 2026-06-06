import { useState } from "react";
import { useListContacts, useUpdateContact, useDeleteContact } from "@workspace/api-client-react";
import { Mail, MailOpen, Archive, Trash2, Reply } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export default function AdminContacts() {
  const [filter, setFilter] = useState<"unread" | "all" | "archived">("unread");

  const { data: contacts = [], isLoading } = useListContacts({
    read: filter === "unread" ? false : undefined,
    archived: filter === "archived" ? true : undefined,
  });

  const { mutate: update } = useUpdateContact({
    mutation: {
      onSuccess: () => toast.success("Updated"),
      onError: () => toast.error("Failed to update"),
    },
  });
  const { mutate: del } = useDeleteContact({
    mutation: {
      onSuccess: () => toast.success("Deleted"),
      onError: () => toast.error("Failed to delete"),
    },
  });

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Contact Inbox</h1>
          <p className="text-muted-foreground text-sm">{contacts.length} messages</p>
        </div>
        <div className="flex gap-2">
          {(["unread", "all", "archived"] as const).map((f) => (
            <Button key={f} variant={filter === f ? "default" : "outline"} size="sm" onClick={() => setFilter(f)} className="capitalize">{f}</Button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-3">{[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-card animate-pulse rounded-xl border border-border" />)}</div>
      ) : (
        <div className="space-y-3">
          {contacts.map((c) => (
            <div key={c.id} className={`bg-card border rounded-xl overflow-hidden transition-all ${c.read ? "border-border" : "border-primary/30"}`}>
              <div className="p-4 cursor-pointer" onClick={() => {
                setExpanded(expanded === c.id ? null : c.id);
                if (!c.read) update({ id: c.id, data: { read: true } });
              }}>
                <div className="flex items-start gap-4">
                  <div className={`mt-1 ${c.read ? "text-muted-foreground" : "text-primary"}`}>
                    {c.read ? <MailOpen className="h-5 w-5" /> : <Mail className="h-5 w-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground text-sm">&lt;{c.email}&gt;</span>
                      {!c.read && <Badge variant="default" className="text-xs">New</Badge>}
                      {c.archived && <Badge variant="outline" className="text-xs">Archived</Badge>}
                    </div>
                    <p className="font-medium text-sm">{c.subject}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(c.createdAt!).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                    <Button variant="ghost" size="sm" title="Reply" onClick={() => { window.open(`mailto:${c.email}?subject=Re: ${c.subject}`); }}>
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" title={c.archived ? "Unarchive" : "Archive"} onClick={() => update({ id: c.id, data: { archived: !c.archived } })}>
                      <Archive className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => { if (confirm("Delete this message?")) del({ id: c.id }); }}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              {expanded === c.id && (
                <div className="px-4 pb-4 pt-0 border-t border-border">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap text-muted-foreground">{c.message}</p>
                </div>
              )}
            </div>
          ))}
          {contacts.length === 0 && (
            <div className="text-center py-16 text-muted-foreground border border-border border-dashed rounded-xl">
              {filter === "unread" ? "No unread messages." : filter === "archived" ? "No archived messages." : "No messages yet."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
