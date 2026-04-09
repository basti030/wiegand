interface TechSpecs {
  consumption: string;
  co2: string;
  co2Class: string;
  range?: string;
  isElectric: boolean;
}

export function formatTechSpecs(rawData: any): TechSpecs {
  const wltp = rawData?.wltp || {};
  const consumptions = rawData?.consumptions || {};
  const emissions = rawData?.emissions?.combined || {};

  const isElectric = rawData?.fuel === 'ELECTRICITY';
  const isHybrid = rawData?.fuel === 'HYBRID';

  let consumption = 'k.A.';
  if (isElectric) {
    const p = wltp.consumptionPowerCombined || consumptions.power?.combined;
    consumption = p ? `${p} kWh/100km` : 'k.A.';
  } else {
    const f = wltp.consumptionFuelCombined || consumptions.fuel?.combined;
    consumption = f ? `${f} l/100km` : 'k.A.';
  }

  const co2 = wltp.co2EmissionCombined || emissions.co2 ? `${wltp.co2EmissionCombined || emissions.co2} g/km` : 'k.A.';
  const co2Class = emissions.co2Class || 'k.A.';
  const range = wltp.electricRange ? `${wltp.electricRange} km` : undefined;

  return { consumption, co2, co2Class, range, isElectric };
}

export function getCO2Color(className: string): string {
  const colors: Record<string, string> = {
    'A+++': 'bg-green-600',
    'A++': 'bg-green-500',
    'A+': 'bg-green-400',
    'A': 'bg-green-400',
    'B': 'bg-lime-400',
    'C': 'bg-yellow-400',
    'D': 'bg-orange-400',
    'E': 'bg-orange-500',
    'F': 'bg-red-500',
    'G': 'bg-red-600',
  };
  return colors[className] || 'bg-gray-400';
}
