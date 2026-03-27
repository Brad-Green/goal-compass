import { useState, useMemo } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalsSection } from "@/components/goals/GoalsSection";
import { GoalDetailSheet } from "@/components/goals/GoalDetailSheet";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import type { Goal } from "@/types/goal";
import { Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const Index = () => {
  const { currentGoals, pastGoals, currentQuarter, updateGoal, addGoal, deleteGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);
  const { toast } = useToast();

  // Group past goals by quarter
  const pastGoalsByQuarter = useMemo(() => {
    const grouped: Record<string, Goal[]> = {};
    pastGoals.forEach((goal) => {
      if (!grouped[goal.quarter]) {
        grouped[goal.quarter] = [];
      }
      grouped[goal.quarter].push(goal);
    });
    const sortedQuarters = Object.keys(grouped).sort((a, b) => {
      const [qA, yearA] = a.split(" ");
      const [qB, yearB] = b.split(" ");
      if (yearA !== yearB) return parseInt(yearB) - parseInt(yearA);
      return parseInt(qB.slice(1)) - parseInt(qA.slice(1));
    });
    return sortedQuarters.map((quarter) => ({ quarter, goals: grouped[quarter] }));
  }, [pastGoals]);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setSheetOpen(true);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    updateGoal(id, updates);
    setSelectedGoal((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
    toast({
      title: "Goal updated",
      description: "Your changes have been saved.",
    });
  };

  const handleDeleteGoal = (id: string) => {
    deleteGoal(id);
    setSelectedGoal(null);
    toast({
      title: "Goal deleted",
      description: "The goal has been permanently removed.",
      variant: "destructive",
    });
  };

  const handleAddGoal = (goal: Parameters<typeof addGoal>[0]) => {
    addGoal(goal);
    toast({
      title: "Goal created",
      description: `"${goal.title}" has been added to ${currentQuarter}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-10">
        <div className="container max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">Career Goals</h1>
                <p className="text-sm text-muted-foreground">{currentQuarter}</p>
              </div>
            </div>
            <AddGoalDialog quarter={currentQuarter} onAdd={handleAddGoal} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container max-w-3xl mx-auto px-4 py-8 space-y-10">
        <GoalsSection
          title={`Current Quarter (${currentQuarter})`}
          goals={currentGoals}
          onSelectGoal={handleSelectGoal}
          emptyMessage="No goals for this quarter yet. Click 'Add Goal' to create one."
        />

        {pastGoalsByQuarter.map(({ quarter, goals }) => (
          <GoalsSection
            key={quarter}
            title={quarter}
            goals={goals}
            onSelectGoal={handleSelectGoal}
          />
        ))}
      </main>

      {/* Goal Detail Sheet */}
      <GoalDetailSheet
        goal={selectedGoal}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdateGoal}
        onDelete={handleDeleteGoal}
      />
    </div>
  );
};

export default Index;
