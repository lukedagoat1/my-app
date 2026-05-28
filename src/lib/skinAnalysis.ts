import type { SkinMetrics, SkinType } from './store'

function isSkinPixel(r: number, g: number, b: number): boolean {
  return (
    r > 60 && g > 40 && b > 20 &&
    r > b &&
    r > 95 &&
    Math.abs(r - g) < 80
  )
}

export function analyzeImageData(
  imageData: ImageData,
  oval: { cx: number; cy: number; rx: number; ry: number }
): SkinMetrics {
  const { data, width } = imageData
  const { cx, cy, rx, ry } = oval

  let rednessSum = 0
  let brightnessSum = 0
  let count = 0
  const lightnessValues: number[] = []
  const hueValues: number[] = []

  for (let y = Math.floor(cy - ry); y < Math.floor(cy + ry); y += 2) {
    for (let x = Math.floor(cx - rx); x < Math.floor(cx + rx); x += 2) {
      const dx = (x - cx) / rx
      const dy = (y - cy) / ry
      if (dx * dx + dy * dy > 1) continue

      const i = (y * width + x) * 4
      const r = data[i]
      const g = data[i + 1]
      const b = data[i + 2]

      if (!isSkinPixel(r, g, b)) continue

      const brightness = (r + g + b) / 3
      const redness = r / (g + b + 1)
      const max = Math.max(r, g, b) / 255
      const min = Math.min(r, g, b) / 255
      const l = (max + min) / 2

      rednessSum += redness
      brightnessSum += brightness
      lightnessValues.push(l * 100)

      const d = max - min
      if (d > 0) {
        let h = 0
        switch (Math.max(r, g, b)) {
          case r: h = ((g - b) / 255 / d) % 6; break
          case g: h = (b - r) / 255 / d + 2; break
          case b: h = (r - g) / 255 / d + 4; break
        }
        hueValues.push(h * 60)
      }

      count++
    }
  }

  if (count < 20) {
    return { oiliness: 50, hydration: 50, redness: 30, texture: 70, uniformity: 70 }
  }

  const avgRedness = rednessSum / count
  const avgBrightness = brightnessSum / count
  const avgL = lightnessValues.reduce((a, b) => a + b, 0) / lightnessValues.length
  const brightnessVar = lightnessValues.reduce((a, v) => a + (v - avgL) ** 2, 0) / lightnessValues.length

  const avgHue = hueValues.length > 0 ? hueValues.reduce((a, b) => a + b, 0) / hueValues.length : 20
  const hueVar = hueValues.length > 0
    ? hueValues.reduce((a, v) => a + (v - avgHue) ** 2, 0) / hueValues.length
    : 100

  const oiliness = Math.min(100, Math.max(0, (avgBrightness / 255) * 130 - 20))
  const redness = Math.min(100, Math.max(0, (avgRedness - 1.2) * 90))
  const hydration = Math.min(100, Math.max(0, 100 - Math.abs(avgBrightness - 145) * 0.7))
  const texture = Math.min(100, Math.max(0, 100 - Math.sqrt(brightnessVar) * 2.5))
  const uniformity = Math.min(100, Math.max(0, 100 - Math.sqrt(hueVar) * 1.8))

  return {
    oiliness: Math.round(oiliness),
    hydration: Math.round(hydration),
    redness: Math.round(redness),
    texture: Math.round(texture),
    uniformity: Math.round(uniformity),
  }
}

export function averageMetrics(history: SkinMetrics[]): SkinMetrics {
  if (history.length === 0) return { oiliness: 50, hydration: 50, redness: 30, texture: 70, uniformity: 70 }
  const keys: (keyof SkinMetrics)[] = ['oiliness', 'hydration', 'redness', 'texture', 'uniformity']
  const avg = {} as SkinMetrics
  for (const k of keys) {
    avg[k] = Math.round(history.reduce((s, m) => s + m[k], 0) / history.length)
  }
  return avg
}

export function determineSkinType(
  answers: Record<string, string>,
  metrics: SkinMetrics | null
): { type: SkinType; label: string; description: string; concerns: string[] } {
  const score: Record<SkinType, number> = { oily: 0, dry: 0, combination: 0, sensitive: 0, normal: 0 }

  // q1: age
  if (answers.q1 === 'a') score.oily += 1                      // under 20 — tends oilier
  if (answers.q1 === 'c') score.normal += 1                    // 30s — often stabilises
  if (answers.q1 === 'd') { score.dry += 1; score.sensitive += 1 } // 40+ — drier, more reactive

  // q2: skin feel hours after cleansing
  if (answers.q2 === 'a') score.oily += 3
  if (answers.q2 === 'b') score.dry += 3
  if (answers.q2 === 'c') score.combination += 3
  if (answers.q2 === 'd') score.normal += 2

  // q3: biggest concern
  if (answers.q3 === 'a') { score.oily += 2; score.sensitive += 1 }
  if (answers.q3 === 'b') score.dry += 2
  if (answers.q3 === 'c') score.sensitive += 3
  if (answers.q3 === 'd') { score.combination += 1; score.normal += 1 }

  // q4: skip moisturiser
  if (answers.q4 === 'a') score.oily += 2
  if (answers.q4 === 'b') score.dry += 2
  if (answers.q4 === 'c') score.combination += 2
  if (answers.q4 === 'd') score.normal += 2

  // q5: reaction to new products
  if (answers.q5 === 'a') score.sensitive += 4
  if (answers.q5 === 'b') score.sensitive += 1
  if (answers.q5 === 'c') score.normal += 1
  if (answers.q5 === 'd') { score.oily += 1; score.normal += 1 }

  // q6: end of day look
  if (answers.q6 === 'a') score.oily += 3
  if (answers.q6 === 'b') score.dry += 2
  if (answers.q6 === 'c') score.combination += 2
  if (answers.q6 === 'd') score.normal += 2

  // q7: cold/windy weather
  if (answers.q7 === 'a') score.sensitive += 2
  if (answers.q7 === 'b') score.dry += 2
  if (answers.q7 === 'c') score.normal += 1
  if (answers.q7 === 'd') score.oily += 1

  // Camera metrics boost
  if (metrics) {
    if (metrics.oiliness > 68) score.oily += 2
    else if (metrics.oiliness < 32) score.dry += 1
    if (metrics.hydration < 38) score.dry += 2
    if (metrics.redness > 55) score.sensitive += 2
    if (metrics.texture > 75 && metrics.uniformity > 72) score.normal += 1
  }

  const type = (Object.entries(score).sort((a, b) => b[1] - a[1])[0][0]) as SkinType

  const concerns: string[] = []
  if (answers.q3 === 'a' || score.oily > 5) concerns.push('Acne & Breakouts')
  if (answers.q3 === 'b' || score.dry > 4) concerns.push('Dryness & Dehydration')
  if (answers.q3 === 'c' || answers.q5 === 'a') concerns.push('Sensitivity & Redness')
  if (score.oily > 5) concerns.push('Excess Oil & Shine')
  if (answers.q3 === 'd') concerns.push('Uneven Texture & Tone')
  if (answers.q1 === 'd') concerns.push('Anti-Aging & Firmness')
  if (metrics && metrics.redness > 52) concerns.push('Visible Redness')

  const descriptions: Record<SkinType, string> = {
    oily: 'Your skin produces excess sebum, creating shine and enlarged pores. Balance — not stripping — is key.',
    dry: 'Your skin lacks moisture and lipids, feeling tight and sometimes flaky. Barrier repair is the priority.',
    combination: 'Oily T-zone meets drier cheeks. A targeted, zone-specific approach works best for you.',
    sensitive: 'Your skin reacts easily to products and environment. Simplicity and gentle formulas are essential.',
    normal: 'Your skin is beautifully balanced. Focus on maintenance and prevention to keep it that way.',
  }

  const labels: Record<SkinType, string> = {
    oily: 'Oily', dry: 'Dry', combination: 'Combination', sensitive: 'Sensitive', normal: 'Normal',
  }

  return { type, label: labels[type], description: descriptions[type], concerns: concerns.slice(0, 4) }
}

export function getRoutine(type: SkinType) {
  const routines = {
    oily: {
      morning: ['Gel Cleanser', 'Niacinamide Toner', 'Salicylic Acid Serum', 'Oil-Free Moisturizer', 'SPF 50'],
      evening: ['Micellar/Oil Cleanse', 'Gel Cleanser', 'BHA Exfoliant (3×/wk)', 'Niacinamide Serum', 'Light Gel Moisturizer'],
      ingredients: ['Niacinamide', 'Salicylic Acid', 'Zinc PCA', 'Tea Tree', 'Green Tea'],
      avoid: ['Heavy Mineral Oils', 'Comedogenic Butters', 'Thick Occlusive Creams'],
    },
    dry: {
      morning: ['Creamy Cleanser', 'Hydrating Toner', 'Hyaluronic Acid Serum', 'Rich Moisturizer', 'SPF 50'],
      evening: ['Oil Cleanser', 'Gentle Cleanser', 'Ceramide Serum', 'Rich Moisturizer', 'Facial Oil'],
      ingredients: ['Hyaluronic Acid', 'Ceramides', 'Glycerin', 'Squalane', 'Shea Butter'],
      avoid: ['Alcohol', 'Harsh Sulfates', 'Strong Exfoliants', 'Fragrance'],
    },
    combination: {
      morning: ['Gentle Gel Cleanser', 'Balancing Toner', 'Niacinamide Serum', 'Gel-Cream Moisturizer', 'SPF 50'],
      evening: ['Double Cleanse', 'Balancing Toner', 'Lightweight Serum', 'Light Moisturizer'],
      ingredients: ['Niacinamide', 'Lightweight HA', 'Lactic Acid', 'Green Tea Extract'],
      avoid: ['Heavy Creams (T-zone)', 'Stripping Cleansers', 'Heavy Oils on T-zone'],
    },
    sensitive: {
      morning: ['Micellar Water', 'Soothing Toner', 'Centella Serum', 'Gentle Moisturizer', 'Mineral SPF'],
      evening: ['Gentle Cleanser', 'Calming Essence', 'Barrier Repair Serum', 'Rich Soothing Moisturizer'],
      ingredients: ['Centella Asiatica', 'Aloe Vera', 'Oat Extract', 'Panthenol', 'Allantoin'],
      avoid: ['Fragrance', 'Alcohol', 'Chemical Exfoliants', 'Essential Oils'],
    },
    normal: {
      morning: ['Gentle Cleanser', 'Vitamin C Serum', 'Antioxidant Moisturizer', 'SPF 50'],
      evening: ['Double Cleanse', 'Retinol (3×/wk)', 'Peptide Serum', 'Moisturizer'],
      ingredients: ['Vitamin C', 'Retinol', 'Peptides', 'AHA', 'Antioxidants'],
      avoid: ['Over-treating', 'Skipping SPF', 'Harsh Actives Combined'],
    },
  }
  return routines[type]
}
