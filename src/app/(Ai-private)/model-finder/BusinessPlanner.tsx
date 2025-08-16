"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useToast } from "@/components/ui/use-toast";
import Navbar from "@/components/aiChatbot/ChatComp/Navbar";

interface BusinessPlan {
  name: string;
  description: string;
  successProbability: number;
  marketTrends: { month: string; revenue: number; users: number }[];
  weeklyTasks: string[][];
}

const BusinessPlanner: React.FC = () => {
  const [budget, setBudget] = useState("");
  const [skills, setSkills] = useState("");
  const [preferences, setPreferences] = useState("");
  const [businessPlan, setBusinessPlan] = useState<BusinessPlan | null>(null);
  const { toast } = useToast();

  const generateBusinessPlan = (
    budget: number,
    skills: string,
    preferences: string
  ): BusinessPlan => {
    // This is a mock function. In a real application, this would be an AI service.
    const businessTypes = [
      "AI-Powered Personal Finance App",
      "Sustainable E-commerce Platform",
      "Remote Work Collaboration Tool",
      "Health and Wellness Tracking System",
    ];
    const businessType =
      businessTypes[Math.floor(Math.random() * businessTypes.length)];

    const descriptions = {
      "AI-Powered Personal Finance App": `An innovative mobile application that leverages artificial intelligence to provide personalized financial advice, budget tracking, and investment recommendations. The app analyzes user spending patterns, financial goals, and market trends to offer tailored strategies for saving money and growing wealth.`,
      "Sustainable E-commerce Platform": `An online marketplace dedicated to eco-friendly and sustainably sourced products. The platform connects environmentally conscious consumers with ethical brands, offering a wide range of products from organic clothing to zero-waste household items. It includes features like carbon footprint tracking for each purchase and a reward system for sustainable choices.`,
      "Remote Work Collaboration Tool": `A comprehensive software solution designed to enhance productivity and communication for distributed teams. The platform integrates project management, real-time document collaboration, video conferencing, and team analytics in one seamless interface. It also includes features like AI-powered task prioritization and virtual team-building activities.`,
      "Health and Wellness Tracking System": `A holistic health management platform that combines wearable technology with a user-friendly mobile and web application. The system tracks various health metrics including physical activity, sleep patterns, nutrition, and stress levels. It provides personalized recommendations and connects users with health professionals for virtual consultations.`,
    };

    const generateMarketTrends = () => {
      let baseRevenue = Math.floor(Math.random() * 5000) + 1000;
      let baseUsers = Math.floor(Math.random() * 500) + 100;
      return Array.from({ length: 12 }, (_, i) => ({
        month: [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec",
        ][i],
        revenue: Math.floor(
          baseRevenue * (1 + i * 0.1 + (Math.random() * 0.2 - 0.1))
        ),
        users: Math.floor(
          baseUsers * (1 + i * 0.15 + (Math.random() * 0.2 - 0.1))
        ),
      }));
    };

    return {
      name: businessType,
      description: descriptions[businessType as keyof typeof descriptions],
      successProbability: Math.floor(Math.random() * 30) + 60, // 60-90%
      marketTrends: generateMarketTrends(),
      weeklyTasks: Array.from({ length: 12 }, (_, weekIndex) =>
        Array.from({ length: 3 }, (_, taskIndex) => {
          const taskTypes = [
            "Research",
            "Development",
            "Marketing",
            "User Acquisition",
            "Product Improvement",
          ];
          return `Week ${weekIndex + 1}, Task ${taskIndex + 1}: ${
            taskTypes[Math.floor(Math.random() * taskTypes.length)]
          } task for ${businessType}`;
        })
      ),
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!budget || !skills || !preferences) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      });
      return;
    }
    const plan = generateBusinessPlan(Number(budget), skills, preferences);
    setBusinessPlan(plan);
    toast({
      title: "Business Plan Generated",
      description: "Your personalized business plan is ready!",
    });
  };

  return (
    <div className="max-w-[768px] mx-auto p-4">
      <Navbar />

      <h1 className="text-3xl font-bold mb-6 text-center text-purple-600">
        AI Business Planner
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Input Your Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="number"
              placeholder="Budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Skills"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
              className="w-full"
            />
            <Input
              placeholder="Preferences"
              value={preferences}
              onChange={(e) => setPreferences(e.target.value)}
              className="w-full"
            />
            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700"
            >
              Generate Business Plan
            </Button>
          </form>
        </CardContent>
      </Card>

      {businessPlan && (
        <>
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>{businessPlan.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-4">{businessPlan.description}</p>
              <p className="mb-4">
                <strong>Success Probability:</strong>{" "}
                {businessPlan.successProbability}%
              </p>
              <h3 className="text-xl font-semibold mb-2">Market Trends</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={businessPlan.marketTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="month"
                    padding={{ left: 30, right: 30 }}
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <YAxis yAxisId="left" tick={{ fill: "#888", fontSize: 12 }} />
                  <YAxis
                    yAxisId="right"
                    orientation="right"
                    tick={{ fill: "#888", fontSize: 12 }}
                  />
                  <Tooltip />
                  <Legend />
                  <Line
                    yAxisId="left"
                    type="monotone"
                    dataKey="revenue"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                  <Line
                    yAxisId="right"
                    type="monotone"
                    dataKey="users"
                    stroke="#82ca9d"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>3-Month Task Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              {businessPlan.weeklyTasks.slice(0, 12).map((week, index) => (
                <div key={index} className="mb-4">
                  <h3 className="font-semibold">Week {index + 1}</h3>
                  <ul className="list-disc pl-5">
                    {week.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default BusinessPlanner;
