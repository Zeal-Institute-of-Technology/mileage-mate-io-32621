import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Plus, Trash2, Check } from "lucide-react";

interface CarSelectorProps {
  userId: string;
  onCarSelect: (car: any) => void;
  selectedCar: any;
}

export const CarSelector = ({ userId, onCarSelect, selectedCar }: CarSelectorProps) => {
  const [carModels, setCarModels] = useState<any[]>([]);
  const [userCars, setUserCars] = useState<any[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [selectedModelId, setSelectedModelId] = useState("");
  const [customName, setCustomName] = useState("");

  useEffect(() => {
    fetchCarModels();
    fetchUserCars();
  }, []);

  const fetchCarModels = async () => {
    const { data, error } = await supabase
      .from("car_models")
      .select("*")
      .order("make", { ascending: true });

    if (!error && data) {
      setCarModels(data);
    }
  };

  const fetchUserCars = async () => {
    const { data, error } = await supabase
      .from("user_cars")
      .select(`
        *,
        car_model:car_models(*)
      `)
      .eq("user_id", userId);

    if (!error && data) {
      setUserCars(data);
      if (data.length > 0 && !selectedCar) {
        onCarSelect(data[0]);
      }
    }
  };

  const handleAddCar = async () => {
    if (!selectedModelId) {
      toast.error("Please select a car model");
      return;
    }

    const { error } = await supabase.from("user_cars").insert({
      user_id: userId,
      car_model_id: selectedModelId,
      custom_name: customName || null,
    });

    if (error) {
      toast.error("Failed to add car");
      return;
    }

    toast.success("Car added successfully");
    setIsAdding(false);
    setSelectedModelId("");
    setCustomName("");
    fetchUserCars();
  };

  const handleDeleteCar = async (id: string) => {
    const { error } = await supabase.from("user_cars").delete().eq("id", id);

    if (error) {
      toast.error("Failed to delete car");
      return;
    }

    toast.success("Car removed");
    if (selectedCar?.id === id) {
      onCarSelect(null);
    }
    fetchUserCars();
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>My Cars</CardTitle>
              <CardDescription>Manage your vehicles</CardDescription>
            </div>
            <Button onClick={() => setIsAdding(!isAdding)} variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              {isAdding ? "Cancel" : "Add Car"}
            </Button>
          </div>
        </CardHeader>
        {isAdding && (
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Car Model</Label>
              <Select value={selectedModelId} onValueChange={setSelectedModelId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a car model" />
                </SelectTrigger>
                <SelectContent>
                  {carModels.map((model) => (
                    <SelectItem key={model.id} value={model.id}>
                      {model.year} {model.make} {model.model}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Custom Name (optional)</Label>
              <Input
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder="My daily driver"
              />
            </div>
            <Button onClick={handleAddCar} className="w-full">
              Add Car
            </Button>
          </CardContent>
        )}
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {userCars.length === 0 ? (
          <Card className="col-span-full">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">No cars added yet</p>
            </CardContent>
          </Card>
        ) : (
          userCars.map((car) => (
            <Card
              key={car.id}
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedCar?.id === car.id ? "ring-2 ring-primary" : ""
              }`}
              onClick={() => onCarSelect(car)}
            >
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg">
                        {car.car_model.year} {car.car_model.make}
                      </h3>
                      <p className="text-muted-foreground">{car.car_model.model}</p>
                      {car.custom_name && (
                        <p className="text-sm text-primary italic">{car.custom_name}</p>
                      )}
                    </div>
                    {selectedCar?.id === car.id && (
                      <div className="h-6 w-6 rounded-full bg-primary flex items-center justify-center">
                        <Check className="h-4 w-4 text-primary-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="pt-3 border-t space-y-1">
                    <p className="text-sm text-muted-foreground">
                      City: {car.car_model.fuel_efficiency_city} MPG
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Highway: {car.car_model.fuel_efficiency_highway} MPG
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-destructive hover:text-destructive"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteCar(car.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
