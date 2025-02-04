"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Github,
  Linkedin,
  Mail,
  Briefcase,
  Code2,
  Globe,
  BookOpen,
  ChevronLeft,
  Users,
  ExternalLink,
  Medal,
  Brain,
  HeartPulse,
  Microscope,
  School,
  GraduationCap as Education,
} from "lucide-react";
import dynamic from "next/dynamic";
import Image from "next/image";
import Link from "next/link";

const Badge = dynamic(
  () => import("@/components/ui/badge").then((mod) => mod.Badge),
  { ssr: true }
);

export function MainContent() {
  const socialLinks = {
    email: "reza.shahnazar@gmail.com",
    github: "https://github.com/rezashahnazar",
    linkedin: "https://www.linkedin.com/in/reza-shahnazar/",
  };

  const experiences = [
    {
      title: "مدیر Product Marketing",
      company: "دیجی‌کالا",
      period: "خرداد ۱۴۰۳ - اکنون",
      location: "تهران، ایران",
      description: "مدیریت تجربه مشتری و همسوسازی بخش‌های مارکتینگ و محصول",
      skills: ["Product Management", "Marketing", "Technical Leadership"],
    },
    {
      title: "سرپرست Product Marketing",
      company: "دیجی‌کالا",
      period: "مهر ۱۴۰۲ - خرداد ۱۴۰۳",
      location: "تهران، ایران",
      description: "نظارت بر تیم Product Marketing و توسعه استراتژی‌های محصول",
      skills: ["Product Strategy", "Team Leadership", "Marketing"],
    },
    {
      title: "سرپرست تیم داده",
      company: "دیجی‌کالا",
      period: "دی ۱۴۰۱ - مهر ۱۴۰۲",
      location: "تهران، ایران",
      description: "مدیریت تیم داده و توسعه راهکارهای تحلیلی",
      skills: ["Data Science", "Analytics", "Team Management"],
    },
    {
      title: "رزیدنت قلب و عروق",
      company: "مرکز قلب تهران",
      period: "شهریور ۱۳۹۷ - دی ۱۴۰۱",
      location: "تهران، ایران",
      description: "تخصص در تشخیص و درمان بیماری‌های قلبی و عروقی",
      skills: ["Cardiology", "Medical Research", "Patient Care"],
    },
    {
      title: "مدیر فنی و هم‌بنیانگذار",
      company: "زی‌دکتر",
      period: "شهریور ۱۴۰۰ - اردیبهشت ۱۴۰۱",
      location: "تهران، ایران",
      description: "توسعه پلتفرم پزشکی آنلاین و مدیریت تیم فنی",
      skills: ["Technical Leadership", "Healthcare Tech", "Startup"],
    },
    {
      title: "مدیر و موسس",
      company: "sClass College",
      period: "اردیبهشت ۱۳۹۸ - اردیبهشت ۱۴۰۰",
      location: "تهران، ایران",
      description: "توسعه و مدیریت پلتفرم آموزش آنلاین المپیاد زیست‌شناسی",
      skills: ["Education Tech", "Business Development", "Online Learning"],
    },
  ];

  const publications = [
    {
      title:
        "Association between Nontraditional Risk Factors and Calculated 10-Year Risk of Atherosclerotic Cardiovascular Disease in a Large General Population",
      type: "مقاله علمی",
      publisher: "مطالعه کوهورت پارس",
    },
    {
      title:
        "Cranial nerve palsy prevalence and associated factors in patients with malignant otitis externa",
      type: "مقاله علمی",
      publisher: "Journal of Medical Research",
    },
    {
      title:
        "MaxSplZer: A Tool To Predict Effects Of LDLR Splice Variants Based On The Maximum Entropy Model",
      type: "مقاله علمی",
      publisher: "Scientific Journal",
    },
  ];

  return (
    <div className="h-[calc(100vh-48px)] md:h-[calc(100vh-64px)] w-full overflow-y-hidden">
      {/* Sophisticated backdrop */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(var(--primary-5)),transparent_80%)] opacity-[0.05] animate-subtle-pulse" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,hsl(var(--background)),hsl(var(--primary-5))_15%,hsl(var(--background))_30%)] opacity-[0.02] mix-blend-overlay" />
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 bg-[url('/grid.svg')] 
            [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] 
            opacity-[0.04] bg-repeat mix-blend-plus-lighter"
          />
        </div>
        <div className="absolute inset-0 backdrop-blur-[150px]" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/40 to-background/95" />
      </div>

      <main className="h-full overflow-auto scrollbar-none scroll-smooth">
        <div className="w-full p-4 sm:p-6 lg:p-8 xl:p-12">
          <div className="mx-auto max-w-5xl space-y-10 md:space-y-12 pb-12">
            {/* Elevated Hero Section */}
            <Card className="group/card relative overflow-hidden border-none !bg-transparent shadow-none hover:shadow-none">
              <div className="relative flex flex-col lg:flex-row items-center gap-6 lg:gap-12 p-6 sm:p-8 lg:p-10">
                {/* Refined profile image */}

                {/* Refined content section */}
                <div className="flex-1 space-y-8">
                  <div className="space-y-6">
                    <div className="space-y-3 flex justify-start items-center gap-8">
                      <div className="flex flex-col items-center gap-4">
                        <div className="relative w-24 h-24 md:w-28 md:h-28 xl:w-32 xl:h-32 shrink-0 group/image">
                          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover/image:opacity-100 transition-all duration-1000" />
                          <Image
                            src={"/profile-image.png"}
                            alt="رضا شاه‌نظر"
                            width={180}
                            height={180}
                            className="relative rounded-xl object-cover shadow-md transition-all duration-1000 group-hover/image:shadow-primary/5 group-hover/image:scale-[1.01]"
                            priority
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <CardTitle className="text-4xl md:text-4xl font-medium text-foreground/90">
                          <span className="relative inline-block group-hover/title:translate-x-0.5 transition-transform duration-700">
                            رضا شاه‌نظر
                            <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-primary/0 via-primary/50 to-primary/0 transform scale-x-0 group-hover/title:scale-x-100 transition-transform duration-1500 ease-out" />
                          </span>
                        </CardTitle>
                        <CardDescription className="text-md md:text-lg font-medium animate-in fade-in slide-in-from-left-12 duration-1000 text-muted-foreground/80">
                          مدیر Product Marketing دیجی‌کالا | مهندس نرم‌افزار |
                          متخصص قلب و عروق
                        </CardDescription>
                      </div>
                    </div>

                    {/* Enhanced skill badges with sophisticated hover effects */}
                    <div className="flex flex-wrap gap-3 animate-in fade-in slide-in-from-left-16 duration-1000">
                      {[
                        { text: "Product Marketing", icon: Globe },
                        { text: "Software Engineering", icon: Code2 },
                        { text: "Data Science", icon: Brain },
                        { text: "Cardiology", icon: HeartPulse },
                        { text: "Biology", icon: Microscope },
                        { text: "Education", icon: School },
                      ].map((item, i) => (
                        <Badge
                          key={item.text}
                          variant="secondary"
                          className="text-xs transition-all hover:bg-primary/10 px-3 py-1 relative overflow-hidden group/badge flex items-center gap-1 hover:shadow-sm hover:shadow-primary/5 hover:scale-[1.02]"
                          style={{
                            animationDelay: `${i * 100}ms`,
                            transform: `translateY(${Math.sin(i * 0.3) * 1}px)`,
                          }}
                        >
                          <item.icon className="h-3 w-3 text-primary/50 group-hover/badge:scale-105 transition-transform duration-500" />
                          <span className="relative bg-gradient-to-r from-foreground/90 to-foreground/80 bg-clip-text text-transparent transition-colors group-hover:from-primary/90 group-hover:to-primary/80">
                            {item.text}
                          </span>
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-8">
                    <p className="text-base md:text-md text-muted-foreground/90 leading-relaxed animate-in fade-in slide-in-from-left-20 duration-1000">
                      با بیش از ۱۵ سال تجربه کاری جامع، شامل تمرکز ویژه بر تحلیل
                      کسب‌وکار و توسعه محصول. در حال حاضر، نقش من در دیجی‌کالا
                      شامل مدیریت تجربه مشتری با پل زدن میان نیازهای کسب‌وکار و
                      راهکارهای فنی است. این شامل همسوسازی بخش‌های مارکتینگ و
                      محصول و نظارت بر مدیریت محصول فنی در یک تیم توسعه
                      نرم‌افزار چابک است.
                    </p>

                    {/* Enhanced social links with sophisticated hover states */}
                    <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-left-24 duration-1000">
                      <Link
                        href={`mailto:${socialLinks.email}`}
                        className="contents"
                      >
                        <Button className="group relative transition-all hover:shadow-lg hover:shadow-primary/20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground overflow-hidden hover:scale-105">
                          <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-5),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                          <span className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-0 group-hover:opacity-100 animate-gradient-shift" />
                          <Mail className="ml-2 h-4 w-4 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
                          <span className="relative">تماس با من</span>
                          <ChevronLeft className="mr-1 h-4 w-4 transition-all duration-500 group-hover:translate-x-1" />
                        </Button>
                      </Link>

                      {[
                        {
                          href: socialLinks.github,
                          icon: Github,
                          text: "گیت‌هاب",
                        },
                        {
                          href: socialLinks.linkedin,
                          icon: Linkedin,
                          text: "لینکدین",
                        },
                      ].map((link, i) => (
                        <Link
                          key={link.text}
                          href={link.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="contents"
                        >
                          <Button
                            variant="outline"
                            className="group relative transition-all hover:shadow-md hover:bg-primary/5 border-primary/20 overflow-hidden hover:scale-105"
                            style={{
                              animationDelay: `${(i + 2) * 150}ms`,
                            }}
                          >
                            <span className="absolute inset-0 bg-[radial-gradient(circle_at_center,var(--primary-5),transparent)] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <span className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent opacity-0 group-hover:opacity-100 animate-gradient-shift" />
                            <link.icon className="ml-2 h-4 w-4 transition-all duration-500 group-hover:-translate-y-0.5 group-hover:scale-110" />
                            <span className="relative bg-gradient-to-r from-foreground to-foreground/90 bg-clip-text text-transparent transition-colors group-hover:from-primary group-hover:to-primary/90">
                              {link.text}
                            </span>
                            <ExternalLink className="mr-1 h-3 w-3 opacity-50 transition-all duration-500 group-hover:translate-x-1 group-hover:opacity-70" />
                          </Button>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Enhanced Stats Section with sophisticated hover effects */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
              {[
                {
                  icon: Briefcase,
                  label: "سال‌های تجربه",
                  value: "۱۵+",
                  description: "تجربه در حوزه‌های مختلف",
                },
                {
                  icon: Medal,
                  label: "مدال المپیاد",
                  value: "طلا",
                  description: "المپیاد زیست‌شناسی",
                },
                {
                  icon: BookOpen,
                  label: "کتب منتشر شده",
                  value: "۵+",
                  description: "در حوزه‌های تخصصی",
                },
                {
                  icon: Users,
                  label: "دانش‌آموزان",
                  value: "۱۰۰۰+",
                  description: "در مراکز مختلف آموزشی",
                },
              ].map((stat, i) => (
                <Card
                  key={stat.label}
                  className="bg-gradient-to-br from-background/90 to-background/70 backdrop-blur-sm transition-all hover:shadow-lg group relative overflow-hidden border-primary/10 hover:border-primary/20"
                  style={{
                    animationDelay: `${i * 100}ms`,
                  }}
                >
                  <CardHeader className="space-y-4 p-6">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                      <stat.icon className="w-6 h-6 text-primary/70" />
                    </div>
                    <div className="space-y-1.5">
                      <CardTitle className="text-3xl font-bold bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-transparent">
                        {stat.value}
                      </CardTitle>
                      <CardDescription className="text-sm font-medium">
                        {stat.label}
                      </CardDescription>
                    </div>
                    <p className="text-sm text-muted-foreground/70">
                      {stat.description}
                    </p>
                  </CardHeader>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Card>
              ))}
            </div>

            {/* Experience Timeline Section */}
            <Card className="group transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-soft-light" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                  <CardTitle>تجربیات حرفه‌ای</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {experiences.map((experience, index) => (
                    <Card
                      key={index}
                      className="group relative overflow-hidden hover:shadow-lg transition-all duration-500"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500" />
                      <CardHeader className="relative z-10">
                        <div className="flex items-center gap-3">
                          <Briefcase className="h-5 w-5 text-primary/70" />
                          <CardTitle className="text-lg font-medium">
                            {experience.title}
                          </CardTitle>
                        </div>
                      </CardHeader>
                      <CardContent className="relative z-10">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-lg font-semibold flex items-center gap-2">
                              {experience.title}
                              <span className="text-sm font-normal text-muted-foreground">
                                · {experience.company}
                              </span>
                            </h3>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <span>{experience.period}</span>
                              <span>·</span>
                              <span>{experience.location}</span>
                            </div>
                          </div>
                          <p className="text-muted-foreground/90">
                            {experience.description}
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {experience.skills.map((skill) => (
                              <Badge
                                key={skill}
                                variant="outline"
                                className="transition-colors hover:bg-primary/5"
                              >
                                {skill}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Publications & Achievements Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="group transition-all hover:shadow-lg relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-soft-light" />
                <CardHeader className="relative z-10">
                  <div className="flex items-center gap-2">
                    <BookOpen className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                    <CardTitle>انتشارات علمی</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="relative z-10 space-y-6">
                  {publications.map((publication, index) => (
                    <div
                      key={index}
                      className="border-r-2 border-primary/20 pr-4 relative group/item transition-all hover:border-primary"
                    >
                      <div className="absolute right-[-9px] top-0 h-4 w-4 rounded-full bg-primary/20 group-hover/item:bg-primary transition-colors" />
                      <div className="space-y-2">
                        <h3 className="text-base font-medium">
                          {publication.title}
                        </h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{publication.type}</span>
                          <span>·</span>
                          <span>{publication.publisher}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>

            {/* Education Section */}
            <Card className="group transition-all hover:shadow-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 bg-noise opacity-[0.015] mix-blend-soft-light" />
              <CardHeader className="relative z-10">
                <div className="flex items-center gap-2">
                  <Education className="h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                  <CardTitle>تحصیلات</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="relative z-10">
                <div className="space-y-8">
                  {[
                    {
                      degree: "دکترای تخصصی قلب و عروق",
                      university: "دانشگاه علوم پزشکی تهران",
                      period: "۱۳۹۷ - ۱۴۰۱",
                      skills: ["قلب و عروق", "پژوهش پزشکی", "مراقبت‌های ویژه"],
                    },
                    {
                      degree: "دکترای پزشکی عمومی",
                      university: "دانشگاه علوم پزشکی تهران",
                      period: "۱۳۸۸ - ۱۳۹۵",
                      skills: ["پزشکی عمومی", "تحقیقات بالینی", "بهداشت عمومی"],
                    },
                  ].map((education, index) => (
                    <div
                      key={index}
                      className="border-r-2 border-primary/20 pr-4 relative group/item transition-all hover:border-primary"
                    >
                      <div className="absolute right-[-9px] top-0 h-4 w-4 rounded-full bg-primary/20 group-hover/item:bg-primary transition-colors" />
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <h3 className="text-lg font-semibold">
                            {education.degree}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{education.university}</span>
                            <span>·</span>
                            <span>{education.period}</span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {education.skills.map((skill) => (
                            <Badge
                              key={skill}
                              variant="outline"
                              className="transition-colors hover:bg-primary/5"
                            >
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
