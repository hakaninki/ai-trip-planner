"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { YesNoQuestion } from "@/types";
import { ChevronRight, HelpCircle, Check, X } from "lucide-react";

interface Props {
    questions: YesNoQuestion[];
    onAnswer: (questions: YesNoQuestion[]) => void;
    onNext: (answered: YesNoQuestion[]) => void;
}

export function StepQuestions({ questions, onAnswer, onNext }: Props) {
    const [localQuestions, setLocalQuestions] = useState<YesNoQuestion[]>(questions);
    const [error, setError] = useState<string | null>(null);

    function handleAnswer(id: string, answer: boolean) {
        setLocalQuestions((prev) =>
            prev.map((q) => (q.id === id ? { ...q, answer } : q))
        );
    }

    function handleSubmit() {
        const unanswered = localQuestions.filter((q) => q.answer === null);
        if (unanswered.length > 0) {
            setError(`Please answer all ${unanswered.length} remaining question(s).`);
            return;
        }
        setError(null);
        onAnswer(localQuestions);
        onNext(localQuestions);
    }

    const answeredCount = localQuestions.filter((q) => q.answer !== null).length;

    return (
        <Card className="bg-white/5 border-white/10 text-white shadow-2xl">
            <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                    <HelpCircle className="h-6 w-6 text-cyan-400" />
                    Personalization Questions
                </CardTitle>
                <CardDescription className="text-white/60">
                    Answer these to help us tailor your perfect itinerary ({answeredCount}/{localQuestions.length} answered)
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Progress bar */}
                <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-gradient-to-r from-violet-500 to-cyan-500 rounded-full transition-all duration-500"
                        style={{ width: `${(answeredCount / localQuestions.length) * 100}%` }}
                    />
                </div>

                <div className="space-y-3 mt-4">
                    {localQuestions.map((q, idx) => (
                        <div
                            key={q.id}
                            className={`rounded-xl border p-4 transition-all ${q.answer !== null
                                    ? "border-violet-500/40 bg-violet-500/5"
                                    : "border-white/10 bg-white/3"
                                }`}
                        >
                            <p className="text-sm text-white/90 mb-3">
                                <span className="text-white/40 mr-2 font-mono">{idx + 1}.</span>
                                {q.question}
                            </p>
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleAnswer(q.id, true)}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${q.answer === true
                                            ? "bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30"
                                            : "bg-white/5 border-white/20 text-white/70 hover:border-emerald-400 hover:text-emerald-300"
                                        }`}
                                >
                                    <Check className="h-3.5 w-3.5" /> Yes
                                </button>
                                <button
                                    onClick={() => handleAnswer(q.id, false)}
                                    className={`flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm font-medium transition-all border ${q.answer === false
                                            ? "bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-600/30"
                                            : "bg-white/5 border-white/20 text-white/70 hover:border-rose-400 hover:text-rose-300"
                                        }`}
                                >
                                    <X className="h-3.5 w-3.5" /> No
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {error && (
                    <div className="rounded-lg bg-red-500/10 border border-red-500/30 px-3 py-2 text-sm text-red-400">
                        {error}
                    </div>
                )}

                <Button
                    onClick={handleSubmit}
                    className="w-full bg-gradient-to-r from-violet-600 to-cyan-600 hover:from-violet-500 hover:to-cyan-500 text-white font-semibold mt-2"
                >
                    Generate My Itinerary
                    <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
            </CardContent>
        </Card>
    );
}
