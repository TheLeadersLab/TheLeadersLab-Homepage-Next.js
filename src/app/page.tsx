// src/app/page.tsx
'use client'; // Dies ist ein Client Component

import Link from 'next/link';
import { MessageCircle, Users, BookOpen, Target, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import the new components and the Auth context - Paths adjusted
import AddBlogPostForm from '@/components/AddBlogPostForm'; 
import BlogPostList from '@/components/BlogPostList'; 
import { useAuth } from '@/context/AuthContext'; 
import React, { useState } from 'react'; // useState for button state

const sections = [
  {
    name: 'Communication',
    href: '/kommunikation',
    icon: MessageCircle,
    description: 'Effective communication and conversation skills',
    color: 'bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800',
  },
  {
    name: 'Leadership',
    href: '/fuehrung',
    icon: Users,
    description: 'Leadership principles and team management',
    color: 'bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800',
  },
  {
    name: 'Learning',
    href: '/lernen',
    icon: BookOpen,
    description: 'Continuous learning and knowledge development',
    color: 'bg-purple-50 dark:bg-purple-950 border-purple-200 dark:border-purple-800',
  },
  {
    name: 'Agile Work',
    href: '/agiles-arbeiten',
    icon: Target,
    description: 'Agile methods and practices',
    color: 'bg-orange-50 dark:bg-orange-950 border-orange-200 dark:border-orange-800',
  },
];

export default function Home() {
  const { currentUser } = useAuth(); // Get the current user
  const [showAddForm, setShowAddForm] = useState(false); // State for form visibility

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#262b5e] via-background to-[#e0a32f]/20">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#262b5e]/10 via-transparent to-[#e0a32f]/10">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
            TheLeaders_Lab<span className="text-red-500">.</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            My personal knowledge hub for communication, leadership, and agile work methods
          </p>
          
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto mb-16 backdrop-blur-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              placeholder="Search all content..."
              className="pl-10 pr-4 py-3 text-lg w-full bg-white/80 dark:bg-gray-900/80 border-[#e0a32f]/30 focus:border-[#e0a32f] backdrop-blur-sm"
            />
          </div>
        </div>
      </section>

      {/* Section Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent via-[#e0a32f]/5 to-[#262b5e]/10">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.name} href={section.href} className="group">
                  <Card className={`${section.color} transition-all duration-300 hover:scale-105 hover:shadow-xl group-hover:ring-2 group-hover:ring-[#e0a32f] group-hover:ring-offset-2 backdrop-blur-sm border-[#e0a32f]/20 hover:border-[#e0a32f]/40`}>
                    <CardHeader className="pb-4">
                      <div className="flex items-center space-x-3">
                        <div className="p-2 bg-gradient-to-br from-[#262b5e]/20 to-[#e0a32f]/20 rounded-lg border border-[#e0a32f]/30">
                          <Icon className="w-6 h-6 text-[#262b5e] dark:text-[#e0a32f]" />
                        </div>
                        <CardTitle className="text-xl font-semibold">
                          {section.name}
                        </CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base text-muted-foreground">
                        {section.description}
                      </CardDescription>
                      <div className="mt-4 flex items-center text-sm text-[#e0a32f] font-medium">
                        Discover
                        <svg className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* "Themes & Insights" section with blog posts */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-100"> {/* Background color adjusted for contrast */}
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-[#262b5e] mb-8 text-center">
            Themes & Insights
          </h2>
          <p className="text-xl text-gray-700 mb-12 text-center max-w-3xl mx-auto">
            Discover practical methods, current trends, and valuable insights into
            leadership, communication, and agile work.
          </p>

          {/* Button to toggle blog post form, only visible when logged in */}
          {currentUser && (
            <div className="text-center mb-8">
              <button
                onClick={() => setShowAddForm(!showAddForm)}
                className="bg-[#e0a32f] text-white py-3 px-6 rounded-md hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#e0a32f] transition duration-150 ease-in-out font-semibold text-lg"
              >
                {showAddForm ? 'Hide Blog Post Form' : 'Add New Blog Post'}
              </button>
            </div>
          )}

          {/* Blog post form, displayed based on state */}
          {showAddForm && <AddBlogPostForm />}

          {/* Filter & Search (taken from original screenshot) */}
          <div className="bg-white shadow-md rounded-lg p-6 mb-12">
            <h3 className="text-xl font-semibold text-[#262b5e] mb-4">Filter & Search</h3>
            <div className="flex flex-col md:flex-row gap-4">
              <Input
                type="text"
                placeholder="Search articles..."
                className="flex-grow px-4 py-2 border border-gray-300 rounded-md focus:ring-[#e0a32f] focus:border-[#e0a32f]"
              />
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#e0a32f] focus:border-[#e0a32f]">
                <option>All</option>
                <option>Communication</option>
                <option>Leadership</option>
                <option>Learning</option>
                <option>Agile Work</option>
              </select>
              <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-[#e0a32f] focus:border-[#e0a32f]">
                <option>All Tags</option>
                {/* Dynamic tags could be added here later */}
              </select>
            </div>
          </div>

          {/* Blog posts displayed here */}
          <BlogPostList />
        </div>
      </section>

      {/* Call to Action (taken from original code) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-[#262b5e]/20 via-[#e0a32f]/10 to-[#262b5e]/20 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Continuous Learning
          </h2>
          <p className="text-lg text-muted-foreground mb-8">
            This Knowledge Hub continuously grows with new insights, 
            proven practices, and lessons learned from daily work.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="font-medium bg-gradient-to-r from-[#262b5e] to-[#262b5e]/80 hover:from-[#262b5e]/90 hover:to-[#262b5e]/70 border-[#e0a32f]/30">
              Latest Posts
            </Button>
            <Button size="lg" variant="outline" className="font-medium border-[#e0a32f] text-[#262b5e] hover:bg-[#e0a32f]/10 hover:border-[#e0a32f]/80">
              All Categories
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}