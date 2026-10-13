import React from 'react';
import { Hammer, Flame, Compass, Sparkles } from 'lucide-react';

export const CraftStorySection: React.FC = () => {
  return (
    <section id="craft-story" className="py-20 bg-[#F7F2E7] border-t border-[#E8DFCD]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="text-xs uppercase tracking-widest text-[#9A7730] font-semibold mb-2">
            Moradabad Foundry Traditions
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#1C1B1A]">
            The Art of Sand Casting & Antiqued Patina
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#5C5750] leading-relaxed">
            In an era of mass-produced plastic replicas, Vintage Crafts preserves four generations of hand-forged brass metallurgy. Every spyglass, compass rose, and station clock is cast using centuries-old clay-sand molds, hand-turned on wooden lathes, and polished to a rich heirloom lustre.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* Step 1 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD3BF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6EEDC] text-[#9A7730] flex items-center justify-center mb-4">
              <Flame className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-[#9A7730]">PHASE 01</div>
            <h3 className="font-serif text-base font-bold text-[#1C1B1A] mt-1 mb-2">
              Clay-Sand Crucible Casting
            </h3>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              Molten virgin brass at 950°C is poured into individual hand-packed loam-sand molds, creating dense, acoustically resonant metal with distinctive grain.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD3BF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6EEDC] text-[#9A7730] flex items-center justify-center mb-4">
              <Hammer className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-[#9A7730]">PHASE 02</div>
            <h3 className="font-serif text-base font-bold text-[#1C1B1A] mt-1 mb-2">
              Lathe Turning & Chasing
            </h3>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              Master artisans true the rough castings on precision lathes, cut knurled focus rings, and hand-chase intricate Victorian motifs into the metal.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD3BF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6EEDC] text-[#9A7730] flex items-center justify-center mb-4">
              <Compass className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-[#9A7730]">PHASE 03</div>
            <h3 className="font-serif text-base font-bold text-[#1C1B1A] mt-1 mb-2">
              Optical & Horology Calibration
            </h3>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              Precision ground achromatic lenses and high-torque silent quartz movements are aligned and sealed to protect against dust and atmospheric oxidation.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-6 rounded-2xl bg-white border border-[#DDD3BF] shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-[#F6EEDC] text-[#9A7730] flex items-center justify-center mb-4">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="text-xs font-mono font-bold text-[#9A7730]">PHASE 04</div>
            <h3 className="font-serif text-base font-bold text-[#1C1B1A] mt-1 mb-2">
              Chemical Antiquing & Lacquer
            </h3>
            <p className="text-xs text-[#6B665E] leading-relaxed">
              Natural sulfur-free antiquing patinas impart 19th-century depth to the brass, followed by a baked microscopic lacquer coat to permanently resist finger tarnish.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
