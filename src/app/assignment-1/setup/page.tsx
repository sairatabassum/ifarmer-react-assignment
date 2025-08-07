"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Play, Group } from "iconoir-react";
import { playerSetupSchema, type PlayerSetupForm } from "../schemas/playerSetupSchemas";
import type { PlayerField } from "../types/playerField";

const fields: PlayerField[] = [
    {
        id: "player1",
        label: "Player 1",
        icon: "✕",
        color: "text-primary",
        hover: "hover:border-primary/70",
        focus: "focus:border-primary focus:shadow-neon",
    },
    {
        id: "player2",
        label: "Player 2",
        icon: "○",
        color: "text-secondary",
        hover: "hover:border-secondary/70",
        focus: "focus:border-secondary focus:shadow-secondary",
    },
];

export default function PlayerSetupPage() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isValid },
    } = useForm<PlayerSetupForm>({
        resolver: zodResolver(playerSetupSchema),
        mode: "onChange",
    });

    const onSubmit = (data: PlayerSetupForm) => {
        localStorage.setItem("players", JSON.stringify(data));
        router.push("/assignment-1/game");
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-lg animate-fade-in">
                <div className="bg-card/90 border-2 border-primary/30 shadow-neon backdrop-blur-sm rounded-xl overflow-hidden">
                    {/* Header */}
                    <div className="text-center pb-6 pt-6 px-4 bg-gradient-to-b from-primary/10 to-transparent">
                        <div className="flex justify-center mb-4 relative">
                            <Group className="h-16 w-16 text-primary drop-shadow-lg" />
                            <div className="absolute inset-0 h-16 w-16 text-primary animate-pulse opacity-50" />
                        </div>
                        <h1 className="text-4xl font-bold bg-gradient-neon bg-clip-text text-transparent">
                            PLAYER SETUP
                        </h1>
                        <p className="text-muted-foreground mt-2">Enter your battle names</p>
                    </div>

                    {/* Form of both players*/}
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 px-8 pb-8 pt-6">
                        <div className="space-y-6">
                            {fields.map((field) => (
                                <div key={field.id} className="space-y-3">
                                    <label
                                        htmlFor={field.id}
                                        className={`text-lg font-semibold ${field.color} flex items-center gap-2`}
                                    >
                                        <span className="text-2xl">{field.icon}</span> {field.label}
                                    </label>
                                    <input
                                        id={field.id}
                                        {...register(field.id)}
                                        placeholder={`Enter ${field.label.toLowerCase()} name...`}
                                        className={`w-full h-14 text-lg px-4 bg-input border-2 border-border transition-all duration-300 rounded-md ${field.hover} ${field.focus}`}
                                    />
                                    {errors[field.id] && (
                                        <p className="text-sm text-destructive animate-in slide-in-from-left-2">
                                            {errors[field.id]?.message}
                                        </p>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Submit section*/}
                        <button
                            type="submit"
                            disabled={!isValid}
                            className="w-full h-16 text-xl font-bold bg-primary hover:bg-gradient-primary/90 text-primary-foreground shadow-neon hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-105 flex items-center justify-center rounded-md"
                        >
                            <Play className="h-6 w-6 mr-3" />
                            START BATTLE
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
