import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StatusBadge } from "./StatusBadge";
import { type Goal, type GoalStatus, statusLabels } from "@/types/goal";
import { format } from "date-fns";
import { Trash2 } from "lucide-react";

interface GoalDetailSheetProps {
  goal: Goal | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdate: (id: string, updates: Partial<Goal>) => void;
  onDelete: (id: string) => void;
}

const statusOptions: GoalStatus[] = ["not-started", "in-progress", "complete", "cancelled"];

export function GoalDetailSheet({
  goal,
  open,
  onOpenChange,
  onUpdate,
  onDelete,
}: GoalDetailSheetProps) {
  const [draft, setDraft] = useState<Partial<Goal>>({});

  // Reset draft when a new goal is opened
  useEffect(() => {
    if (goal && open) {
      setDraft({
        title: goal.title,
        description: goal.description || "",
        status: goal.status,
        percentComplete: goal.percentComplete,
        comments: goal.comments || "",
      });
    }
  }, [goal, open]);

  if (!goal) return null;

  const hasChanges =
    draft.title !== goal.title ||
    draft.description !== (goal.description || "") ||
    draft.status !== goal.status ||
    draft.percentComplete !== goal.percentComplete ||
    draft.comments !== (goal.comments || "");

  const handleSave = () => {
    onUpdate(goal.id, {
      title: draft.title,
      description: draft.description || undefined,
      status: draft.status as GoalStatus,
      percentComplete: draft.percentComplete,
      comments: draft.comments || undefined,
    });
    onOpenChange(false);
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDelete = () => {
    onDelete(goal.id);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={(isOpen) => {
      if (!isOpen && hasChanges) {
        // Could prompt, but for now just close without saving
      }
      onOpenChange(isOpen);
    }}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto flex flex-col">
        <SheetHeader className="mb-6">
          <div className="flex items-center gap-2 mb-2">
            <StatusBadge status={goal.status} />
            <span className="text-xs text-muted-foreground">{goal.quarter}</span>
          </div>
          <SheetTitle className="text-xl">{goal.title}</SheetTitle>
          <SheetDescription>
            Last updated {format(goal.updatedAt, "MMM d, yyyy")}
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 flex-1">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={draft.title || ""}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
              className="bg-input"
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={draft.description || ""}
              onChange={(e) => setDraft((d) => ({ ...d, description: e.target.value }))}
              placeholder="Add a detailed description..."
              rows={4}
              className="bg-input resize-none"
            />
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={draft.status}
              onValueChange={(value: GoalStatus) =>
                setDraft((d) => ({ ...d, status: value }))
              }
            >
              <SelectTrigger id="status" className="bg-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map((status) => (
                  <SelectItem key={status} value={status}>
                    {statusLabels[status]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Percent Complete */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="progress">Progress</Label>
              <span className="text-sm font-semibold text-primary">
                {draft.percentComplete}%
              </span>
            </div>
            <Slider
              id="progress"
              value={[draft.percentComplete ?? 0]}
              onValueChange={([value]) =>
                setDraft((d) => ({ ...d, percentComplete: value }))
              }
              max={100}
              step={5}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Comments */}
          <div className="space-y-2">
            <Label htmlFor="comments">Comments (optional)</Label>
            <Textarea
              id="comments"
              value={draft.comments || ""}
              onChange={(e) => setDraft((d) => ({ ...d, comments: e.target.value }))}
              placeholder="Add notes or updates..."
              rows={4}
              className="bg-input resize-none"
            />
          </div>

          {/* Metadata */}
          <div className="pt-4 border-t border-border">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Created: {format(goal.createdAt, "MMM d, yyyy")}</span>
              <span>Updated: {format(goal.updatedAt, "MMM d, yyyy")}</span>
            </div>
          </div>
        </div>

        {/* Footer with Save/Cancel/Delete */}
        <SheetFooter className="mt-6 flex flex-row items-center gap-2 sm:justify-between">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm" className="gap-1.5">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this goal?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently remove "{goal.title}". This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!hasChanges || !draft.title?.trim()}>
              Save Changes
            </Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
