
import React from "react";
import {
  Home,
  Target,
  Eye,
  ShieldCheck,
  MapPin,
  Heart,
  Users,
  ArrowRight,
  KeyRound,
} from "lucide-react";

export default function AboutUsPage() {
  const features = [
    {
      icon: <Home size={25} />,
      title: "Find Your Perfect Home",
      description:
        "Explore available properties and discover a place that matches your lifestyle and budget.",
    },
    {
      icon: <ShieldCheck size={25} />,
      title: "A Simpler Search",
      description:
        "Browse property details in one place and make your home search easier to manage.",
    },
    {
      icon: <MapPin size={25} />,
      title: "Explore Locations",
      description:
        "Discover properties in locations that work for your everyday needs and preferences.",
    },
    {
      icon: <Heart size={25} />,
      title: "Your Needs Come First",
      description:
        "Compare your options and focus on the features that matter most to you.",
    },
  ];

  return (
    <main className="bg-slate-50 text-slate-800">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-32 left-10 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 md:grid-cols-2 md:px-10 md:py-28">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-amber-300">
              <KeyRound size={16} />
              Welcome to ASCEND PRO REALTY
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
              More than a house.
              <span className="mt-2 block text-amber-400">
                A place to call home.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Finding a home should feel exciting, not overwhelming. HomeKey
              helps you explore properties, compare your options, and take the
              next step toward a place that feels right for you.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="/properties"
                className="inline-flex items-center gap-2 rounded-xl bg-amber-400 px-6 py-3.5 font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                Explore Properties
                <ArrowRight size={18} />
              </a>

              <a
                href="#our-story"
                className="rounded-xl border border-white/20 px-6 py-3.5 font-semibold text-white transition hover:bg-white/10"
              >
                Discover Our Story
              </a>
            </div>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-3xl bg-amber-400/10 blur-2xl" />
            <div className="relative rounded-3xl border border-white/10 bg-white/5 p-3 shadow-2xl backdrop-blur">
              <img
                src="https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=85"
                alt="Modern residential home"
                className="h-72 w-full rounded-2xl object-cover sm:h-96"
              />

              <div className="absolute bottom-7 left-7 right-7 rounded-2xl border border-white/20 bg-slate-950/85 p-5 backdrop-blur-md">
                <p className="text-sm text-slate-300">
                  Every great journey starts somewhere
                </p>
                <p className="mt-1 text-xl font-semibold">
                  Let your next chapter begin here.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section
        id="our-story"
        className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24"
      >
        <div className="grid items-start gap-10 md:grid-cols-2 md:gap-16">
          <div>
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Who We Are
            </span>
            <h2 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl">
              Helping you find a place that feels like yours.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              ASCEND PRO REALTY is a property platform designed to make
              discovering your next home more convenient. We bring property
              information and housing options together to help you make a more
              informed choice.
            </p>
            <p>
              Whether you are searching for a rental home or exploring a
              property to buy, our goal is to make the journey clearer, simpler,
              and more focused on your needs and budget.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="bg-white py-20 md:py-24">
        <div className="mx-auto max-w-7xl px-6 md:px-10">
          <div className="mb-12 max-w-2xl">
            <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
              Our Purpose
            </span>
            <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
              Built around your home journey
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              We believe that finding the right property should be easier to
              understand and more convenient to navigate.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <article className="rounded-3xl border border-slate-100 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 text-amber-700">
                <Target size={27} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Our Mission
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                To help people discover suitable housing options by making
                property details easier to explore and compare according to
                their preferences and budget.
              </p>
            </article>

            <article className="rounded-3xl border border-slate-100 bg-slate-50 p-8 transition hover:-translate-y-1 hover:shadow-lg">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                <Eye size={27} />
              </div>
              <h3 className="mt-6 text-2xl font-bold text-slate-900">
                Our Vision
              </h3>
              <p className="mt-4 leading-7 text-slate-600">
                To create a convenient property discovery experience where
                people can explore their options with greater clarity and
                confidence.
              </p>
            </article>
          </div>
        </div>
      </section>

      {/* Why HomeKey */}
      <section className="mx-auto max-w-7xl px-6 py-20 md:px-10 md:py-24">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-amber-600">
            The ASCEND PRO REALTY Difference
          </span>
          <h2 className="mt-4 text-3xl font-bold text-slate-900 sm:text-4xl">
            A better way to explore properties
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Useful tools and a straightforward experience to support your
            property search.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => (
            <article
              key={feature.title}
              className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                {feature.icon}
              </div>
              <h3 className="mt-5 text-lg font-bold text-slate-900">
                {feature.title}
              </h3>
              <p className="mt-3 text-sm leading-7 text-slate-600">
                {feature.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Closing CTA */}
      <section className="px-6 pb-20 md:px-10 md:pb-24">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-amber-400 px-7 py-12 sm:px-12 md:py-16">
          <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-slate-800/70">
                <Users size={17} />
                Your next chapter starts here
              </div>
              <h2 className="mt-4 text-3xl font-bold text-slate-950 sm:text-4xl">
                Ready to find your place?
              </h2>
              <p className="mt-4 max-w-xl leading-7 text-slate-800/80">
                Explore available properties and take the next step toward
                finding a home that fits your needs.
              </p>
            </div>

            <a
              href="/properties"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-slate-950 px-6 py-4 font-semibold text-white transition hover:bg-slate-800"
            >
              Find Your Home
              <ArrowRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
