"use client";

import { useReducer } from "react";
import { Navbar } from "@/components/shared/Navbar";
import { StepTripDetails } from "@/components/planner/StepTripDetails";
import { StepQuestions } from "@/components/planner/StepQuestions";
import { StepPlanView } from "@/components/planner/StepPlanView";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import type { TripDetails, YesNoQuestion, TripPlan } from "@/types";

type PlannerStep = 1 | 2 | 3;

interface PlannerState {
    step: PlannerStep;
    tripDetails: TripDetails | null;
    questions: YesNoQuestion[];
    plan: TripPlan | null;
    isLoading: boolean;
    error: string | null;
}

type PlannerAction =
    | { type: "SET_LOADING"; payload: boolean }
    | { type: "SET_ERROR"; payload: string | null }
    | { type: "GOTO_STEP2"; tripDetails: TripDetails; questions: YesNoQuestion[] }
    | { type: "GOTO_STEP3"; plan: TripPlan }
    | { type: "SET_QUESTIONS"; questions: YesNoQuestion[] }
    | { type: "RESET" };

const initialState: PlannerState = {
    step: 1,
    tripDetails: null,
    questions: [],
    plan: null,
    isLoading: false,
    error: null,
};

function reducer(state: PlannerState, action: PlannerAction): PlannerState {
    switch (action.type) {
        case "SET_LOADING":
            return { ...state, isLoading: action.payload };
        case "SET_ERROR":
            return { ...state, error: action.payload, isLoading: false };
        case "GOTO_STEP2":
            return { ...state, step: 2, tripDetails: action.tripDetails, questions: action.questions, isLoading: false, error: null };
        case "GOTO_STEP3":
            return { ...state, step: 3, plan: action.plan, isLoading: false, error: null };
        case "SET_QUESTIONS":
            return { ...state, questions: action.questions };
        case "RESET":
            return { ...initialState, step: 1, tripDetails: state.tripDetails };
        default:
            return state;
    }
}

const STEP_LABELS = ["Trip Details", "Questions", "Your Plan"];

export default function PlannerPage() {
    const [state, dispatch] = useReducer(reducer, initialState);

    async function handleTripDetailsNext(tripDetails: TripDetails) {
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        try {
            const res = await fetch("/api/questions", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(tripDetails),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error ?? "Failed to generate questions");
            const questions: YesNoQuestion[] = data.questions.map(
                (q: { id: string; question: string }) => ({ ...q, answer: null })
            );
            dispatch({ type: "GOTO_STEP2", tripDetails, questions });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Something went wrong" });
        }
    }

    async function handleQuestionsNext(answered: YesNoQuestion[]) {
        if (!state.tripDetails) return;
        dispatch({ type: "SET_LOADING", payload: true });
        dispatch({ type: "SET_ERROR", payload: null });
        try {
            const res = await fetch("/api/plan/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tripDetails: state.tripDetails,
                    answers: answered.map((q) => ({ id: q.id, question: q.question, answer: q.answer as boolean })),
                }),
            });
            const data = await res.json();
            if (!res.ok || data.error) throw new Error(data.error ?? "Failed to generate plan");
            dispatch({ type: "GOTO_STEP3", plan: data.plan });
        } catch (err: unknown) {
            dispatch({ type: "SET_ERROR", payload: err instanceof Error ? err.message : "Something went wrong" });
        }
    }

    return (
        <div className="min-h-screen bg-[#080912] text-white">
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[400px] rounded-full bg-violet-700/10 blur-[120px]" />
                <div className="absolute bottom-0 left-0 w-[400px] h-[300px] rounded-full bg-cyan-700/10 blur-[100px]" />
            </div>
            <Navbar />
            <main className="relative z-10 max-w-2xl mx-auto px-4 py-10">
                {/* Step indicator */}
                <div className="flex items-center justify-center gap-2 mb-8">
                    {STEP_LABELS.map((label, idx) => {
                        const stepNum = (idx + 1) as PlannerStep;
                        const isActive = state.step === stepNum;
                        const isDone = state.step > stepNum;
                        return (
                            <div key={label} className="flex items-center gap-2">
                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${isActive ? "bg-violet-600 text-white" : isDone ? "bg-emerald-600/30 text-emerald-300" : "bg-white/10 text-white/40"
                                    }`}>
                                    <span className={`h-4 w-4 rounded-full flex items-center justify-center text-[10px] font-bold ${isActive ? "bg-white text-violet-600" : isDone ? "bg-emerald-500 text-white" : "bg-white/20"
                                        }`}>{isDone ? "✓" : stepNum}</span>
                                    {label}
                                </div>
                                {idx < 2 && <div className={`h-px w-6 ${state.step > stepNum ? "bg-emerald-500" : "bg-white/10"}`} />}
                            </div>
                        );
                    })}
                </div>

                {/* Error */}
                {state.error && !state.isLoading && (
                    <div className="mb-6 rounded-lg bg-red-500/10 border border-red-500/30 px-4 py-3 text-red-400 text-sm">
                        {state.error}
                    </div>
                )}

                {/* Loading */}
                {state.isLoading && (
                    <LoadingSpinner
                        message={
                            state.step === 1
                                ? "Generating personalized questions..."
                                : "Crafting your perfect itinerary..."
                        }
                    />
                )}

                {/* Steps */}
                {!state.isLoading && state.step === 1 && (
                    <StepTripDetails initialDetails={state.tripDetails} onNext={handleTripDetailsNext} />
                )}
                {!state.isLoading && state.step === 2 && (
                    <StepQuestions
                        questions={state.questions}
                        onAnswer={(q) => dispatch({ type: "SET_QUESTIONS", questions: q })}
                        onNext={handleQuestionsNext}
                    />
                )}
                {!state.isLoading && state.step === 3 && state.plan && state.tripDetails && (
                    <StepPlanView
                        plan={state.plan}
                        tripDetails={state.tripDetails}
                        questions={state.questions}
                        onRegenerate={() => dispatch({ type: "RESET" })}
                    />
                )}
            </main>
        </div>
    );
}
