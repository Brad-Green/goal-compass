import { useState } from "react";
import { useGoals } from "@/hooks/useGoals";
import { GoalsSection } from "@/components/goals/GoalsSection";
import { GoalDetailSheet } from "@/components/goals/GoalDetailSheet";
import { AddGoalDialog } from "@/components/goals/AddGoalDialog";
import type { Goal } from "@/types/goal";
import { Target } from "lucide-react";

const Index = () => {
  const { currentGoals, pastGoals, currentQuarter, updateGoal, addGoal } = useGoals();
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const handleSelectGoal = (goal: Goal) => {
    setSelectedGoal(goal);
    setSheetOpen(true);
  };

  const handleUpdateGoal = (id: string, updates: Partial<Goal>) => {
    updateGoal(id, updates);
    // Update the selected goal in state to reflect changes immediately
    setSelectedGoal((prev) =>
      prev && prev.id === id ? { ...prev, ...updates } : prev
    );
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
            <AddGoalDialog quarter={currentQuarter} onAdd={addGoal} />
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

        {pastGoals.length > 0 && (
          <GoalsSection
            title="Past Goals"
            goals={pastGoals}
            onSelectGoal={handleSelectGoal}
          />
        )}
      </main>

      {/* Goal Detail Sheet */}
      <GoalDetailSheet
        goal={selectedGoal}
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        onUpdate={handleUpdateGoal}
      />
    </div>
  );
};

export default Index;
