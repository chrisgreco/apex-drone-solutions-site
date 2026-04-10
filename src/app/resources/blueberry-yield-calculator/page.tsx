"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { FadeIn } from "@/components/FadeIn";
import { GridBackground } from "@/components/ui/grid-background";
import { BeamDivider } from "@/components/Beam";
import {
  IconCalculator,
  IconDroplet,
  IconSun,
  IconLeaf,
  IconBarChart,
  IconArrowRight,
  IconCheckCircle,
  IconWheat,
  IconTarget,
} from "@/components/Icons";
import Link from "next/link";

/* ------------------------------------------------------------------ */
/*  Slider input component                                            */
/* ------------------------------------------------------------------ */

function SliderInput({
  label,
  icon,
  value,
  min,
  max,
  step,
  unit,
  onChange,
  description,
}: {
  label: string;
  icon: React.ReactNode;
  value: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  onChange: (v: number) => void;
  description?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium text-white/80">
          {icon}
          {label}
        </label>
        <span className="text-accent-400 font-semibold tabular-nums">
          {value}
          {unit && <span className="text-white/40 ml-1 text-xs">{unit}</span>}
        </span>
      </div>
      {description && (
        <p className="text-xs text-white/40">{description}</p>
      )}
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-2 rounded-full appearance-none cursor-pointer bg-primary-950/60
          [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5
          [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-accent-500
          [&::-webkit-slider-thumb]:shadow-[0_0_10px_rgba(34,197,94,0.4)] [&::-webkit-slider-thumb]:cursor-pointer
          [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-accent-400
          [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full
          [&::-moz-range-thumb]:bg-accent-500 [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-accent-400
          [&::-moz-range-thumb]:cursor-pointer"
      />
      <div className="flex justify-between text-[10px] text-white/30">
        <span>{min}{unit}</span>
        <span>{max}{unit}</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Animated number display                                           */
/* ------------------------------------------------------------------ */

function AnimatedNumber({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  return (
    <motion.span
      key={value}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="inline-block"
    >
      {prefix}{value.toLocaleString()}{suffix}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/*  Yield factors info section                                        */
/* ------------------------------------------------------------------ */

const yieldFactors = [
  {
    icon: <IconLeaf className="w-5 h-5" />,
    title: "Pollinator Health",
    tip: "Honeybee and bumble bee density are the strongest predictors of blueberry yield. Avoid spraying during peak pollination hours.",
  },
  {
    icon: <IconDroplet className="w-5 h-5" />,
    title: "Irrigation Timing",
    tip: "Blueberries need 1\u20132 inches of water per week during fruit development. Drone-mounted sensors can map moisture stress in real time.",
  },
  {
    icon: <IconSun className="w-5 h-5" />,
    title: "Temperature Management",
    tip: "Optimal growing temperature is 65\u201375\u00b0F. Extreme heat reduces fruit set. Thermal drone imaging identifies heat-stressed zones early.",
  },
  {
    icon: <IconWheat className="w-5 h-5" />,
    title: "Clone Selection",
    tip: "Larger clone sizes produce more fruit per plant. Aerial NDVI mapping helps identify underperforming clones for replacement.",
  },
  {
    icon: <IconTarget className="w-5 h-5" />,
    title: "Precision Spraying",
    tip: "Targeted drone application reduces chemical use by 30\u201340% while improving coverage uniformity across the canopy.",
  },
  {
    icon: <IconBarChart className="w-5 h-5" />,
    title: "Yield Monitoring",
    tip: "Season-over-season drone data builds yield maps that guide fertilizer placement, pruning decisions, and harvest logistics.",
  },
];

/* ------------------------------------------------------------------ */
/*  Main page                                                         */
/* ------------------------------------------------------------------ */

export default function BlueberryYieldCalculatorPage() {
  // Input state
  const [acreage, setAcreage] = useState(25);
  const [cloneSize, setCloneSize] = useState(25);
  const [honeybee, setHoneybee] = useState(2);
  const [bumblebee, setBumblebee] = useState(0.5);
  const [rain, setRain] = useState(150);
  const [temp, setTemp] = useState(68);
  const [fruitSet, setFruitSet] = useState(50);
  const [fruitMass, setFruitMass] = useState(0.4);
  const [seeds, setSeeds] = useState(3);

  // Yield calculation (simplified regression)
  const yieldPerAcre = useMemo(() => {
    const base = 4000;
    const raw =
      base +
      cloneSize * 50 +
      honeybee * 800 +
      bumblebee * 600 +
      fruitSet * 40 +
      fruitMass * 3000 +
      seeds * 200 -
      Math.abs(temp - 70) * 30 -
      Math.abs(rain - 150) * 5;
    return Math.round(Math.min(12000, Math.max(2000, raw)));
  }, [cloneSize, honeybee, bumblebee, fruitSet, fruitMass, seeds, temp, rain]);

  const totalHarvest = useMemo(() => yieldPerAcre * acreage, [yieldPerAcre, acreage]);
  const revenueFresh = useMemo(() => totalHarvest * 2.5, [totalHarvest]);
  const revenueProcessed = useMemo(() => totalHarvest * 0.8, [totalHarvest]);
  const droneBoostYield = useMemo(() => Math.round(yieldPerAcre * 1.15), [yieldPerAcre]);
  const droneBoostRevenue = useMemo(() => droneBoostYield * acreage * 2.5, [droneBoostYield, acreage]);

  return (
    <main className="relative min-h-screen bg-primary-950 overflow-hidden">
      <GridBackground />

      {/* Hero */}
      <section className="section relative z-10 pt-32 pb-12 md:pt-40 md:pb-16">
        <div className="container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <div className="inline-flex items-center gap-2 rounded-full border border-accent-500/30 bg-accent-500/10 px-4 py-1.5 text-sm text-accent-400 mb-6">
              <IconCalculator className="w-4 h-4" />
              Interactive Tool
            </div>
          </FadeIn>
          <FadeIn delay={0.1}>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 tracking-tight">
              Blueberry Yield{" "}
              <span className="text-accent-400">Calculator</span>
            </h1>
          </FadeIn>
          <FadeIn delay={0.2}>
            <p className="text-lg text-white/50 max-w-2xl mx-auto">
              Estimate your harvest based on growing conditions. Powered by data from
              the Wild Blueberry Yield Prediction dataset &mdash; New Jersey is the #2
              blueberry-producing state in the U.S.
            </p>
          </FadeIn>
        </div>
      </section>

      <BeamDivider className="mb-12" />

      {/* Calculator */}
      <section className="section relative z-10 pb-20">
        <div className="container-narrow mx-auto px-5">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Inputs */}
            <FadeIn delay={0.1} className="lg:col-span-3">
              <div className="glass-card p-6 md:p-8 space-y-6">
                <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                  <IconLeaf className="w-5 h-5 text-accent-400" />
                  Growing Conditions
                </h2>

                <div className="grid sm:grid-cols-2 gap-6">
                  <SliderInput
                    label="Acreage"
                    icon={<IconWheat className="w-4 h-4 text-accent-500" />}
                    value={acreage}
                    min={1}
                    max={500}
                    step={1}
                    unit=" ac"
                    onChange={setAcreage}
                    description="Total planted blueberry acreage"
                  />
                  <SliderInput
                    label="Clone Size"
                    icon={<IconLeaf className="w-4 h-4 text-accent-500" />}
                    value={cloneSize}
                    min={10}
                    max={50}
                    step={1}
                    unit=" cm"
                    onChange={setCloneSize}
                    description="Mean plant diameter"
                  />
                  <SliderInput
                    label="Honeybee Density"
                    icon={<IconTarget className="w-4 h-4 text-accent-500" />}
                    value={honeybee}
                    min={0}
                    max={5}
                    step={0.1}
                    unit=" bees/m\u00b2/min"
                    onChange={setHoneybee}
                    description="Honeybees observed per sq meter per minute"
                  />
                  <SliderInput
                    label="Bumble Bee Density"
                    icon={<IconTarget className="w-4 h-4 text-accent-500" />}
                    value={bumblebee}
                    min={0}
                    max={3}
                    step={0.1}
                    unit=" bees/m\u00b2/min"
                    onChange={setBumblebee}
                    description="Bumble bees observed per sq meter per minute"
                  />
                  <SliderInput
                    label="Avg. Rainfall"
                    icon={<IconDroplet className="w-4 h-4 text-accent-500" />}
                    value={rain}
                    min={50}
                    max={300}
                    step={5}
                    unit=" mm"
                    onChange={setRain}
                    description="Average growing season rainfall"
                  />
                  <SliderInput
                    label="Avg. Temperature"
                    icon={<IconSun className="w-4 h-4 text-accent-500" />}
                    value={temp}
                    min={55}
                    max={85}
                    step={1}
                    unit="\u00b0F"
                    onChange={setTemp}
                    description="Average growing season temperature"
                  />
                  <SliderInput
                    label="Fruit Set"
                    icon={<IconCheckCircle className="w-4 h-4 text-accent-500" />}
                    value={fruitSet}
                    min={20}
                    max={80}
                    step={1}
                    unit="%"
                    onChange={setFruitSet}
                    description="Percentage of flowers that produce fruit"
                  />
                  <SliderInput
                    label="Fruit Mass"
                    icon={<IconBarChart className="w-4 h-4 text-accent-500" />}
                    value={fruitMass}
                    min={0.2}
                    max={0.8}
                    step={0.01}
                    unit=" g"
                    onChange={setFruitMass}
                    description="Average weight per berry"
                  />
                  <SliderInput
                    label="Seeds per Berry"
                    icon={<IconWheat className="w-4 h-4 text-accent-500" />}
                    value={seeds}
                    min={1}
                    max={6}
                    step={1}
                    unit=""
                    onChange={setSeeds}
                    description="Average seed count per berry"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Results */}
            <FadeIn delay={0.25} className="lg:col-span-2">
              <div className="sticky top-28 space-y-6">
                {/* Main results card with gradient border */}
                <div className="rounded-2xl p-px bg-gradient-to-b from-accent-400/60 via-accent-500/20 to-transparent">
                  <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
                    <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                      <IconBarChart className="w-5 h-5 text-accent-400" />
                      Yield Estimate
                    </h2>

                    {/* Per-acre yield */}
                    <div className="text-center py-4">
                      <p className="text-sm text-white/40 mb-1">Estimated Yield</p>
                      <p className="text-5xl font-bold text-accent-400">
                        <AnimatedNumber value={yieldPerAcre} suffix="" />
                      </p>
                      <p className="text-sm text-white/50 mt-1">lbs / acre</p>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Total harvest */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-white/40 mb-1">Total Harvest</p>
                        <p className="text-lg font-semibold text-white">
                          <AnimatedNumber value={totalHarvest} suffix=" lbs" />
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-white/40 mb-1">Acreage</p>
                        <p className="text-lg font-semibold text-white">
                          {acreage.toLocaleString()} acres
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Revenue estimates */}
                    <div>
                      <p className="text-xs text-white/40 mb-3">Revenue Estimates</p>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Fresh market @ $2.50/lb</span>
                          <span className="text-accent-400 font-semibold">
                            <AnimatedNumber value={Math.round(revenueFresh)} prefix="$" />
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-white/60">Processed @ $0.80/lb</span>
                          <span className="text-white font-semibold">
                            <AnimatedNumber value={Math.round(revenueProcessed)} prefix="$" />
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="h-px bg-white/10" />

                    {/* Drone boost */}
                    <div className="rounded-xl bg-accent-500/10 border border-accent-500/20 p-4">
                      <div className="flex items-start gap-3">
                        <IconTarget className="w-5 h-5 text-accent-400 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-accent-400 mb-1">
                            With drone-optimized spraying
                          </p>
                          <p className="text-xs text-white/50 mb-2">
                            +15% yield potential from precision application timing and coverage
                          </p>
                          <div className="flex items-baseline gap-2">
                            <span className="text-lg font-bold text-white">
                              <AnimatedNumber value={droneBoostYield} suffix=" lbs/ac" />
                            </span>
                            <span className="text-xs text-accent-400">
                              (+{(droneBoostYield - yieldPerAcre).toLocaleString()} lbs/ac)
                            </span>
                          </div>
                          <p className="text-xs text-white/40 mt-1">
                            Fresh revenue:{" "}
                            <span className="text-accent-400 font-medium">
                              ${droneBoostRevenue.toLocaleString()}
                            </span>{" "}
                            (+${(droneBoostRevenue - revenueFresh).toLocaleString()})
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <BeamDivider className="mb-16" />

      {/* Factors affecting yield */}
      <section className="section relative z-10 pb-20">
        <div className="container-narrow mx-auto px-5">
          <FadeIn>
            <h2 className="text-3xl font-bold text-white text-center mb-4">
              Factors Affecting <span className="text-accent-400">Yield</span>
            </h2>
            <p className="text-white/50 text-center max-w-xl mx-auto mb-12">
              Understanding what drives blueberry production helps you make smarter
              management decisions &mdash; and shows where drone technology has the
              biggest impact.
            </p>
          </FadeIn>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {yieldFactors.map((factor, i) => (
              <FadeIn key={factor.title} delay={0.05 * i}>
                <div className="glass-card p-5 h-full space-y-3">
                  <div className="flex items-center gap-2 text-accent-400">
                    {factor.icon}
                    <h3 className="font-semibold text-white">{factor.title}</h3>
                  </div>
                  <p className="text-sm text-white/50 leading-relaxed">{factor.tip}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <BeamDivider className="mb-16" />

      {/* CTA */}
      <section className="section relative z-10 pb-32">
        <div className="container-narrow mx-auto px-5 text-center">
          <FadeIn>
            <div className="glass-card p-8 md:p-12 max-w-2xl mx-auto">
              <IconCalculator className="w-10 h-10 text-accent-400 mx-auto mb-4" />
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
                Maximize Your Blueberry Yield
              </h2>
              <p className="text-white/50 mb-6 max-w-md mx-auto">
                Precision drone spraying delivers the right inputs at the right time,
                boosting pollination coverage and reducing waste across every acre.
              </p>
              <Link href="/contact" className="btn-primary inline-flex items-center gap-2">
                Get a Free Assessment
                <IconArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </main>
  );
}
