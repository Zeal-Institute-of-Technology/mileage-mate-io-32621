import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, TrendingUp } from "lucide-react";
import { format } from "date-fns";

interface ExpenseTrackerProps {
  userId: string;
  selectedCar: any;
}

export const ExpenseTracker = ({ userId, selectedCar }: ExpenseTrackerProps) => {
  const [expenses, setExpenses] = useState<any[]>([]);
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [isAdding, setIsAdding] = useState(false);
  const [newExpense, setNewExpense] = useState({
    distance: "",
    fuelAmount: "",
    fuelPrice: "",
    notes: "",
  });

  useEffect(() => {
    if (userId) {
      fetchExpenses();
    }
  }, [userId]);

  const fetchExpenses = async () => {
    const { data, error } = await supabase
      .from("fuel_expenses")
      .select(`
        *,
        user_car:user_cars(
          *,
          car_model:car_models(*)
        )
      `)
      .eq("user_id", userId)
      .order("expense_date", { ascending: false });

    if (error) {
      toast.error("Failed to load expenses");
      return;
    }

    setExpenses(data || []);
    calculateMonthlyTotal(data || []);
  };

  const calculateMonthlyTotal = (expenseData: any[]) => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const monthlyExpenses = expenseData.filter((expense) => {
      const expenseDate = new Date(expense.expense_date);
      return (
        expenseDate.getMonth() === currentMonth &&
        expenseDate.getFullYear() === currentYear
      );
    });

    const total = monthlyExpenses.reduce((sum, expense) => sum + parseFloat(expense.total_cost), 0);
    setMonthlyTotal(total);
  };

  const handleAddExpense = async () => {
    if (!selectedCar) {
      toast.error("Please select a car first");
      return;
    }

    const totalCost = parseFloat(newExpense.fuelAmount) * parseFloat(newExpense.fuelPrice);

    const { error } = await supabase.from("fuel_expenses").insert({
      user_id: userId,
      user_car_id: selectedCar.id,
      distance: parseFloat(newExpense.distance),
      fuel_amount: parseFloat(newExpense.fuelAmount),
      fuel_price_per_unit: parseFloat(newExpense.fuelPrice),
      total_cost: totalCost,
      notes: newExpense.notes,
    });

    if (error) {
      toast.error("Failed to add expense");
      return;
    }

    toast.success("Expense added successfully");
    setIsAdding(false);
    setNewExpense({ distance: "", fuelAmount: "", fuelPrice: "", notes: "" });
    fetchExpenses();
  };

  const handleDeleteExpense = async (id: string) => {
    const { error } = await supabase.from("fuel_expenses").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete expense");
      return;
    }

    toast.success("Expense deleted");
    fetchExpenses();
  };

  return (
    <div className="space-y-6">
      <Card className="bg-success/5 border-success/20">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Monthly Total</p>
              <p className="text-4xl font-bold text-success">${monthlyTotal.toFixed(2)}</p>
            </div>
            <TrendingUp className="h-12 w-12 text-success/50" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Add Expense</CardTitle>
              <CardDescription>Track your fuel purchases</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? "Cancel" : "Add"}
            </Button>
          </div>
        </CardHeader>
        {isAdding && (
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Distance (miles)</Label>
                <Input
                  type="number"
                  value={newExpense.distance}
                  onChange={(e) => setNewExpense({ ...newExpense, distance: e.target.value })}
                  placeholder="100"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Fuel Amount (gallons)</Label>
                <Input
                  type="number"
                  value={newExpense.fuelAmount}
                  onChange={(e) => setNewExpense({ ...newExpense, fuelAmount: e.target.value })}
                  placeholder="10"
                  step="0.1"
                />
              </div>
              <div className="space-y-2">
                <Label>Price per Gallon</Label>
                <Input
                  type="number"
                  value={newExpense.fuelPrice}
                  onChange={(e) => setNewExpense({ ...newExpense, fuelPrice: e.target.value })}
                  placeholder="3.50"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label>Notes (optional)</Label>
                <Input
                  value={newExpense.notes}
                  onChange={(e) => setNewExpense({ ...newExpense, notes: e.target.value })}
                  placeholder="Road trip"
                />
              </div>
            </div>
            <Button onClick={handleAddExpense} className="w-full">
              Save Expense
            </Button>
          </CardContent>
        )}
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {expenses.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No expenses yet</p>
            ) : (
              expenses.map((expense) => (
                <div
                  key={expense.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-secondary/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold">
                      {expense.user_car?.car_model?.make} {expense.user_car?.car_model?.model}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(expense.expense_date), "MMM dd, yyyy")} • {expense.distance} mi • {expense.fuel_amount} gal
                    </p>
                    {expense.notes && <p className="text-sm text-muted-foreground italic">{expense.notes}</p>}
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="text-xl font-bold text-success">${expense.total_cost}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeleteExpense(expense.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
