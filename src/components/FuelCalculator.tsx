import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Calculator, Fuel, Navigation } from "lucide-react";

interface FuelCalculatorProps {
  selectedCar: any;
}

export const FuelCalculator = ({ selectedCar }: FuelCalculatorProps) => {
  const [distance, setDistance] = useState("");
  const [fuelPrice, setFuelPrice] = useState("");
  const [fuelEfficiency, setFuelEfficiency] = useState("");
  const [results, setResults] = useState<{
    fuelNeeded: number;
    totalCost: number;
  } | null>(null);

  const calculateFuel = () => {
    const dist = parseFloat(distance);
    const price = parseFloat(fuelPrice);
    const efficiency = parseFloat(fuelEfficiency) || selectedCar?.car_model?.fuel_efficiency_highway || 30;

    if (!dist || !price) {
      return;
    }

    const fuelNeeded = dist / efficiency;
    const totalCost = fuelNeeded * price;

    setResults({
      fuelNeeded: parseFloat(fuelNeeded.toFixed(2)),
      totalCost: parseFloat(totalCost.toFixed(2)),
    });
  };

  return (
    <div className="space-y-6">
      {selectedCar && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Fuel className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Selected Car</p>
                <p className="font-semibold">
                  {selectedCar.car_model.year} {selectedCar.car_model.make} {selectedCar.car_model.model}
                </p>
                <p className="text-sm text-muted-foreground">
                  {selectedCar.car_model.fuel_efficiency_highway} MPG (Highway)
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="distance">Distance (miles)</Label>
            <div className="relative">
              <Navigation className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="distance"
                type="number"
                placeholder="100"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className="pl-10"
                step="0.1"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="fuel-price">Fuel Price (per gallon)</Label>
            <div className="relative">
              <span className="absolute left-3 top-3 text-muted-foreground">$</span>
              <Input
                id="fuel-price"
                type="number"
                placeholder="3.50"
                value={fuelPrice}
                onChange={(e) => setFuelPrice(e.target.value)}
                className="pl-8"
                step="0.01"
              />
            </div>
          </div>

          {!selectedCar && (
            <div className="space-y-2">
              <Label htmlFor="fuel-efficiency">Fuel Efficiency (MPG)</Label>
              <div className="relative">
                <Fuel className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="fuel-efficiency"
                  type="number"
                  placeholder="30"
                  value={fuelEfficiency}
                  onChange={(e) => setFuelEfficiency(e.target.value)}
                  className="pl-10"
                  step="0.1"
                />
              </div>
            </div>
          )}

          <Button onClick={calculateFuel} className="w-full">
            <Calculator className="h-4 w-4 mr-2" />
            Calculate
          </Button>
        </div>

        {results && (
          <Card className="bg-accent/10 border-accent">
            <CardContent className="pt-6">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Calculator className="h-5 w-5 text-accent" />
                Results
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Fuel Needed</p>
                  <p className="text-3xl font-bold text-accent">
                    {results.fuelNeeded} <span className="text-lg">gal</span>
                  </p>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-3xl font-bold text-success">
                    ${results.totalCost}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
