"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { TripDetails, Interest } from "@/types";
import { INTEREST_OPTIONS } from "@/types";
import { MapPin, Calendar, DollarSign, ChevronRight } from "lucide-react";

interface Props {
    initialDetails: TripDetails | null;
    onNext: (details: TripDetails) => void;
}

function toIso(date: string, time: string): string {
    return new Date(`${date}T${time}:00`).toISOString();
}

export function StepTripDetails({ initialDetails, onNext }: Props) {
    const [city, setCity] = useState(initialDetails?.city ?? "");

    // Split arrival into date + time
    const initArrival = initialDetails?.arrivalDatetime
        ? new Date(initialDetails.arrivalDatetime)
        : null;
    const [arrivalDate, setArrivalDate] = useState(
        initArrival ? initArrival.toISOString().slice(0, 10) : ""
    );
    const [arrivalTime, setArrivalTime] = useState(
        initArrival ? initArrival.toISOString().slice(11, 16) : "10:00"
    );

    // Split departure into date + time
    const initDepart = initialDetails?.departureDatetime
        ? new Date(initialDetails.departureDatetime)
        : null;
    const [departureDate, setDepartureDate] = useState(
        initDepart ? initDepart.toISOString().slice(0, 10) : ""
    );
    const [departureTime, setDepartureTime] = useState(
        initDepart ? initDepart.toISOString().slice(11, 16) : "18:00"
    );

    const [budget, setBudget] = useState(initialDetails?.budget?.toString() ?? "");
    const [interests, setInterests] = useState<Interest[]>(initialDetails?.interests ?? []);
    const [error, setError] = useState<string | null>(null);

    function toggleInterest(value: Interest) {
        setInterests((prev) =>
            prev.includes(value) ? prev.filter((i) => i !== value) : [...prev, value]
        );
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (!city.trim()) return setError("Please enter a city.");
        if (!arrivalDate) return setError("Please enter an arrival date.");
        if (!departureDate) return setError("Please enter a departure date.");

        const arrivalIso = toIso(arrivalDate, arrivalTime);
        const departureIso = toIso(departureDate, departureTime);

        if (new Date(arrivalIso) >= new Date(departureIso))
            return setError("Departure must be after arrival.");
        if (!budget || Number(budget) <= 0)
            return setError("Please enter a valid budget.");
        if (interests.length === 0)
            return setError("Please select at least one interest.");

        onNext({
            city: city.trim(),
            arrivalDatetime: arrivalIso,
            departureDatetime: departureIso,
            budget: Number(budget),
            interests,
        });
    }

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <MapPin className="h-6 w-6 text-violet-400" />
                    Plan Your Journey
                </CardTitle>
                <CardDescription className="text-white/40">
                    Enter your destination, travel window, and preferences
                </CardDescription>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* City */}
                    <div className="space-y-2">
                        <Label htmlFor="city" className="text-white/80 flex items-center gap-1">
                            <MapPin className="h-3.5 w-3.5" /> Destination City
                        </Label>
                        <Input
                            id="city"
                            placeholder="e.g. Paris, Tokyo, Istanbul"
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                    </div>

                    {/* Arrival */}
                    <div className="space-y-2">
                        <Label className="text-white/80 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> Arrival
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                id="arrival-date"
                                type="date"
                                value={arrivalDate}
                                onChange={(e) => setArrivalDate(e.target.value)}
                                className="bg-white/10 border-white/20 text-white [color-scheme:dark]"
                            />
                            <Input
                                id="arrival-time"
                                type="time"
                                value={arrivalTime}
                                onChange={(e) => setArrivalTime(e.target.value)}
                                className="bg-white/10 border-white/20 text-white [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Departure */}
                    <div className="space-y-2">
                        <Label className="text-white/80 flex items-center gap-1">
                            <Calendar className="h-3.5 w-3.5" /> Departure
                        </Label>
                        <div className="grid grid-cols-2 gap-3">
                            <Input
                                id="departure-date"
                                type="date"
                                value={departureDate}
                                onChange={(e) => setDepartureDate(e.target.value)}
                                className="bg-white/10 border-white/20 text-white [color-scheme:dark]"
                            />
                            <Input
                                id="departure-time"
                                type="time"
                                value={departureTime}
                                onChange={(e) => setDepartureTime(e.target.value)}
                                className="bg-white/10 border-white/20 text-white [color-scheme:dark]"
                            />
                        </div>
                    </div>

                    {/* Budget */}
                    <div className="space-y-2">
                        <Label htmlFor="budget" className="text-white/80 flex items-center gap-1">
                            <DollarSign className="h-3.5 w-3.5" /> Total Budget (USD)
                        </Label>
                        <Input
                            id="budget"
                            type="number"
                            placeholder="e.g. 1500"
                            min={1}
                            value={budget}
                            onChange={(e) => setBudget(e.target.value)}
                            className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                        />
                    </div>

                    {/* Interests */}
                    <div className="space-y-3">
                        <Label className="text-white/80">Interests</Label>
                        <div className="flex flex-wrap gap-2">
                            {INTEREST_OPTIONS.map((opt) => {
                                const selected = interests.includes(opt.value);
                                return (
                                    <button
                                        key={opt.value}
                                        type="button"
                                        id={`interest-${opt.value}`}
                                        onClick={() => toggleInterest(opt.value)}
                                        className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all border ${selected
                                            ? "bg-violet-600 border-violet-500 text-white shadow-lg shadow-violet-600/30"
                                            : "bg-white/5 border-white/20 text-white/70 hover:border-violet-400 hover:text-white"
                                            }`}
                                    >
                                        {opt.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {error && (
                        <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                            {error}
                        </div>
                    )}

                    <Button
                        id="generate-questions-btn"
                        type="submit"
                        className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold"
                    >
                        Generate Questions
                        <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
}
