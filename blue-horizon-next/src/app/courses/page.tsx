"use client";

import Link from "next/link";
import { ArrowLeft, BookOpen, Award, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

const courses = [
    {
        id: 1,
        title: "Open Water Diver",
        level: "Beginner",
        duration: "4 days",
        description:
            "Your first step into the underwater world. Learn the fundamentals of scuba diving, including equipment use, safety procedures, and basic dive skills.",
        includes: [
            "Pool training sessions",
            "4 open water dives",
            "PADI certification",
        ],
    },
    {
        id: 2,
        title: "Advanced Open Water",
        level: "Intermediate",
        duration: "3 days",
        description:
            "Expand your diving skills with specialty dives including deep diving, navigation, and underwater photography.",
        includes: [
            "5 adventure dives",
            "Deep dive training",
            "Navigation techniques",
        ],
    },
    {
        id: 3,
        title: "Rescue Diver",
        level: "Advanced",
        duration: "5 days",
        description:
            "Learn to prevent and manage emergencies in the water. Build confidence and develop skills that make you a safer, more responsible diver.",
        includes: [
            "Emergency scenarios",
            "Self-rescue techniques",
            "First aid training",
        ],
    },
];

export default function CoursesPage() {
    return (
        <main className="min-h-screen bg-gradient-to-b from-ocean-deep via-ocean-dark to-ocean-deep text-white">
            <div className="container mx-auto px-6 pt-28 pb-16">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-8"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Home
                </Link>

                <h1 className="text-4xl md:text-5xl font-bold mb-4">
                    Dive <span className="text-primary">Courses</span>
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mb-12">
                    From your first breath underwater to advanced certifications,
                    our PADI-certified courses will guide you every step of the
                    way.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {courses.map((course) => (
                        <div
                            key={course.id}
                            className="bg-ocean-dark/50 backdrop-blur border border-ocean-light/20 rounded-xl p-6 hover:border-primary/40 transition-all"
                        >
                            <div className="flex items-center gap-2 mb-3">
                                <BookOpen className="w-5 h-5 text-primary" />
                                <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                                    {course.level}
                                </span>
                            </div>

                            <h2 className="text-xl font-bold mb-2">
                                {course.title}
                            </h2>

                            <div className="flex items-center gap-1 text-sm text-slate-400 mb-4">
                                <Clock className="w-4 h-4" />
                                {course.duration}
                            </div>

                            <p className="text-slate-300 text-sm mb-6">
                                {course.description}
                            </p>

                            <div className="border-t border-ocean-light/10 pt-4">
                                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                                    Includes
                                </h3>
                                <ul className="space-y-1">
                                    {course.includes.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-center gap-2 text-sm text-slate-300"
                                        >
                                            <Award className="w-3 h-3 text-primary" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <Button
                                asChild
                                className="w-full mt-6 bg-primary text-ocean-deep hover:bg-primary/90 font-bold"
                            >
                                <Link href="/booking">Enroll Now</Link>
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
