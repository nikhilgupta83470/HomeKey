import React from "react";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  BriefcaseBusiness,
  House,
  KeyRound,
  Handshake,
  CheckCircle2,
  CalendarCheck,
  FileText,
  Languages,
  ArrowUpRight,
  MessageCircle,
  Linkedin,
  Building2,
  UserRound,
} from "lucide-react";

const broker = {
  name: "Ankur Gupta ",
  phone: " 9999514787",
  email: "ascendprorealty@gmail.com",
  whatsapp: "9999514787",
  experience: "5+ Years",
  speciality: "Rent, Buy & Sell",
  areas: "Lucknow, Gomti Nagar, Indira Nagar, Aliganj and more",
  languages: ["Hindi", "English"],
  availability: "Full-time",
  propertyTypes: ["Residential", "Commercial"],
  budget: "All budgets",
  office: "Gomti Nagar, Lucknow",
  workingHours: "9 AM – 9 PM",
  verification: "Pending",
  linkedin: "https://www.linkedin.com/in/nikhil-gupta-35b729317/",
};

const services = [
  {
    icon: KeyRound,
    title: "Rental Properties",
    description:
      "Find rental options based on your location, preferences and budget.",
  },
  {
    icon: House,
    title: "Buy a Property",
    description:
      "Explore residential properties and get assistance during your search.",
  },
  {
    icon: Handshake,
    title: "Sell a Property",
    description:
      "Get assistance connecting with potential buyers for your property.",
  },
  {
    icon: Building2,
    title: "Commercial Properties",
    description:
      "Explore property options for offices, shops and other business needs.",
  },
  {
    icon: CalendarCheck,
    title: "Property Visits",
    description:
      "Coordinate property visits to help you assess suitable options.",
  },
  {
    icon: FileText,
    title: "Documentation Guidance",
    description: "Get general guidance about property-related documentation.",
  },
];

const benefits = [
  "Personalized property assistance",
  "Support for tenants and property owners",
  "Residential and commercial property options",
  "Assistance throughout your property search",
];

export default function AboutBrokerPage() {
  const phoneLink = `tel:${broker.phone}`;
  const emailLink = `mailto:${broker.email}`;
  const whatsappLink = `https://wa.me/91${broker.whatsapp}`;

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-amber-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-5 py-16 sm:px-8 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-amber-300/30 bg-amber-300/10 px-4 py-2 text-sm font-medium text-amber-300">
              <BriefcaseBusiness size={16} />
              Your Property Assistance Partner
            </span>

            <h1 className="mt-6 text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Meet Your Local
              <span className="block text-amber-400">Property Broker</span>
            </h1>

            <p className="mt-5 max-w-xl text-base leading-8 text-slate-300 sm:text-lg">
              Looking to rent, buy or sell a property? Get personalized
              assistance for your property needs in Lucknow and nearby areas.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-amber-300"
              >
                <MessageCircle size={19} />
                Contact on WhatsApp
              </a>

              <a
                href={phoneLink}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/10"
              >
                <Phone size={18} />
                Call Now
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-2">
                <Clock size={17} className="text-amber-400" />
                {broker.workingHours}
              </span>
              <span className="flex items-center gap-2">
                <MapPin size={17} className="text-amber-400" />
                {broker.office}
              </span>
            </div>
          </div>

          {/* Broker Profile */}
          <div className="mx-auto w-full max-w-md">
            <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-6 shadow-2xl backdrop-blur sm:p-8">
              <div className="flex flex-col items-center text-center">
                {/* Uses an existing project image if one is available */}
                <div className="flex h-32 w-32 items-center justify-center overflow-hidden rounded-full border-4 border-amber-400 bg-slate-800">
                  <UserRound
                    size={64}
                    strokeWidth={1.3}
                    className="text-amber-300"
                  />
                </div>

                <h2 className="mt-5 text-2xl font-bold">{broker.name}</h2>

                <p className="mt-1 text-amber-300">Property Broker</p>

                <span className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm text-slate-200">
                  <BriefcaseBusiness size={16} />
                  {broker.experience} Experience
                </span>

                <div className="mt-7 grid w-full grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-white/5 p-4 text-left">
                    <House className="mb-3 text-amber-400" size={22} />
                    <p className="text-sm text-slate-400">Speciality</p>
                    <p className="mt-1 font-semibold">{broker.speciality}</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4 text-left">
                    <MapPin className="mb-3 text-amber-400" size={22} />
                    <p className="text-sm text-slate-400">Base Location</p>
                    <p className="mt-1 font-semibold">Gomti Nagar</p>
                  </div>
                </div>

               

                <p className="mt-4 text-xs text-slate-400">
                  Profile verification: {broker.verification}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience */}
      <section className="mx-auto max-w-7xl px-5 py-14 sm:px-8">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BriefcaseBusiness,
              title: broker.experience,
              subtitle: "Property Experience",
            },
            {
              icon: House,
              title: "Rent, Buy & Sell",
              subtitle: "Property Assistance",
            },
            {
              icon: MapPin,
              title: "Lucknow",
              subtitle: "Local Service Area",
            },
            {
              icon: Clock,
              title: broker.workingHours,
              subtitle: "Working Hours",
            },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.subtitle}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
                  <Icon size={24} />
                </div>
                <h3 className="mt-4 text-lg font-bold">{item.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{item.subtitle}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* About */}
      <section className="mx-auto grid max-w-7xl gap-12 px-5 py-12 sm:px-8 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">
            About Your Broker
          </p>

          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
            Property decisions deserve the right guidance.
          </h2>

          <p className="mt-5 leading-8 text-slate-600">
            I’m {broker.name}, a property broker with{" "}
            {broker.experience.toLowerCase()}
            of experience. I assist clients looking to rent, buy or sell
            residential and commercial properties in Lucknow.
          </p>

          <p className="mt-4 leading-8 text-slate-600">
            My aim is to understand your requirements, help you explore suitable
            property options and guide you through the next steps of your
            property search.
          </p>

          <div className="mt-7 flex flex-wrap gap-2">
            {broker.languages.map((language) => (
              <span
                key={language}
                className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700"
              >
                {language}
              </span>
            ))}
          </div>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
          <h3 className="text-xl font-bold">Why Connect With Me?</h3>

          <div className="mt-6 space-y-5">
            {benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3">
                <CheckCircle2
                  size={21}
                  className="mt-0.5 shrink-0 text-emerald-600"
                />
                <p className="text-slate-600">{benefit}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-2xl bg-amber-50 p-5">
            <div className="flex items-start gap-3">
              <Languages size={22} className="mt-1 shrink-0 text-amber-700" />
              <div>
                <p className="font-semibold text-slate-900">
                  Communication made easier
                </p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Assistance available in Hindi and English.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="bg-white py-16">
        <div className="mx-auto max-w-7xl px-5 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">
              My Services
            </p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
              How I Can Help You
            </h2>
            <p className="mt-4 leading-7 text-slate-600">
              Property assistance for tenants, buyers, sellers and commercial
              property seekers.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="group rounded-2xl border border-slate-200 p-6 transition hover:-translate-y-1 hover:border-amber-300 hover:shadow-xl"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-600 transition group-hover:bg-amber-400 group-hover:text-slate-950">
                    <Icon size={24} />
                  </div>

                  <h3 className="mt-5 text-lg font-bold">{service.title}</h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Location and Contact */}
      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-8 lg:grid-cols-2">
        <div className="rounded-3xl bg-slate-950 p-7 text-white sm:p-9">
          <p className="font-semibold uppercase tracking-[0.2em] text-amber-300">
            Where I Work
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Serving Lucknow and nearby areas
          </h2>

          <p className="mt-4 leading-7 text-slate-300">
            Explore residential and commercial property options in your
            preferred location and budget.
          </p>

          <div className="mt-7 flex items-start gap-3">
            <MapPin className="mt-1 shrink-0 text-amber-300" size={22} />
            <div>
              <p className="font-semibold">Service Areas</p>
              <p className="mt-2 leading-7 text-slate-300">{broker.areas}</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <Building2 className="mt-1 shrink-0 text-amber-300" size={22} />
            <div>
              <p className="font-semibold">Office Location</p>
              <p className="mt-1 text-slate-300">{broker.office}</p>
            </div>
          </div>

          <div className="mt-6 flex items-start gap-3">
            <House className="mt-1 shrink-0 text-amber-300" size={22} />
            <div>
              <p className="font-semibold">Property Types</p>
              <p className="mt-1 text-slate-300">
                {broker.propertyTypes.join(" & ")}
              </p>
            </div>
          </div>

          <p className="mt-6 text-sm text-slate-400">Budget: {broker.budget}</p>
        </div>

        <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200 sm:p-9">
          <p className="font-semibold uppercase tracking-[0.2em] text-amber-600">
            Get In Touch
          </p>
          <h2 className="mt-3 text-3xl font-bold">
            Let’s discuss your property needs.
          </h2>
          <p className="mt-4 leading-7 text-slate-600">
            Contact me to discuss your requirements, arrange a property visit or
            ask about available options.
          </p>

          <div className="mt-8 space-y-5">
            <a
              href={phoneLink}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-amber-400"
            >
              <Phone className="shrink-0 text-amber-600" size={22} />
              <div>
                <p className="text-sm text-slate-500">Phone</p>
                <p className="font-semibold">{broker.phone}</p>
              </div>
            </a>

            <a
              href={emailLink}
              className="flex items-center gap-4 rounded-xl border border-slate-200 p-4 transition hover:border-amber-400"
            >
              <Mail className="shrink-0 text-amber-600" size={22} />
              <div className="min-w-0">
                <p className="text-sm text-slate-500">Email</p>
                <p className="break-all font-semibold">{broker.email}</p>
              </div>
            </a>

            <div className="flex items-center gap-4 rounded-xl border border-slate-200 p-4">
              <Clock className="shrink-0 text-amber-600" size={22} />
              <div>
                <p className="text-sm text-slate-500">Availability</p>
                <p className="font-semibold">
                  {broker.availability} · {broker.workingHours}
                </p>
              </div>
            </div>
          </div>

          <a
            href={whatsappLink}
            target="_blank"
            rel="noreferrer"
            className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 px-6 py-4 font-semibold text-white transition hover:bg-emerald-700"
          >
            <MessageCircle size={20} />
            Chat on WhatsApp
            <ArrowUpRight size={18} />
          </a>

         
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-16 sm:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-amber-400 px-6 py-12 text-center sm:px-12 sm:py-16">
          <h2 className="text-3xl font-bold text-slate-950 sm:text-4xl">
            Ready to Find Your Next Property?
          </h2>
          <p className="mx-auto mt-4 max-w-2xl leading-7 text-slate-800">
            Tell me what you are looking for, and let’s discuss the next steps
            together.
          </p>

          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-slate-950 px-6 py-3 font-semibold text-white transition hover:bg-slate-800"
            >
              <MessageCircle size={19} />
              Get in Touch
            </a>
            <a
              href="/properties"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-950/20 px-6 py-3 font-semibold text-slate-950 transition hover:bg-white/40"
            >
              Explore Properties
              <ArrowUpRight size={18} />
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
