import type { SkinMetrics, SkinType } from './store'

function isSkinPixel(r: number, g: number, b: number): boolean {
  const rule1 = r > 95 && g > 40 && b > 20 &&
    Math.max(r, g, b) - Math.min(r, g, b) > 15 &&
    Math.abs(r - g) > 15 && r > g && r > b
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const s = max > 0 ? (max - min) / max : 0
  const v = max / 255
  const rule2 = v > 0.35 && s > 0.1 && s < 0.68 && r > b
  return rule1 || rule2
}

function isSpecularHighlight(r: number, g: number, b: number): boolean {
  const brightness = (r + g + b) / 3
  const spread = Math.max(Math.abs(r - brightness), Math.abs(g - brightness), Math.abs(b - brightness))
  return brightness > 195 && spread < 28
}

function rgbToLuminance(r: number, g: number, b: number): number {
  const rl = r / 255, gl = g / 255, bl = b / 255
  const Y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  return Y > 0.008856 ? 116 * Math.pow(Y, 1 / 3) - 16 : 903.3 * Y
}

function rgbToLabA(r: number, g: number, b: number): number {
  const rl = r / 255, gl = g / 255, bl = b / 255
  const X = 0.4124 * rl + 0.3576 * gl + 0.1805 * bl
  const Y = 0.2126 * rl + 0.7152 * gl + 0.0722 * bl
  const xn = X / 0.95047, yn = Y, zn = (0.0193 * rl + 0.1192 * gl + 0.9505 * bl) / 1.08883
  const fx = xn > 0.008856 ? Math.pow(xn, 1 / 3) : 7.787 * xn + 16 / 116
  const fy = yn > 0.008856 ? Math.pow(yn, 1 / 3) : 7.787 * yn + 16 / 116
  void zn
  return 500 * (fx - fy)
}

interface ZoneSample {
  skinPixels: Array<{ r: number; g: number; b: number }>
  speculars: number
  total: number
}

function sampleZone(
  data: Uint8ClampedArray, width: number,
  cx: number, cy: number, rx: number, ry: number,
  xFrac: [number, number], yFrac: [number, number]
): ZoneSample {
  const skinPixels: Array<{ r: number; g: number; b: number }> = []
  let speculars = 0, total = 0
  const xMin = cx + xFrac[0] * rx, xMax = cx + xFrac[1] * rx
  const yMin = cy + yFrac[0] * ry, yMax = cy + yFrac[1] * ry

  for (let y = Math.floor(yMin); y < Math.ceil(yMax); y += 2) {
    for (let x = Math.floor(xMin); x < Math.ceil(xMax); x += 2) {
      const dx = (x - cx) / rx, dy = (y - cy) / ry
      if (dx * dx + dy * dy > 1) continue
      const i = (y * width + x) * 4
      const r = data[i], g = data[i + 1], b = data[i + 2]
      total++
      if (isSpecularHighlight(r, g, b)) speculars++
      if (isSkinPixel(r, g, b)) skinPixels.push({ r, g, b })
    }
  }
  return { skinPixels, speculars, total }
}

function textureScore(pixels: Array<{ r: number; g: number; b: number }>): number {
  if (pixels.length < 10) return 70
  const lums = pixels.map(p => rgbToLuminance(p.r, p.g, p.b))
  const mean = lums.reduce((a, b) => a + b, 0) / lums.length
  const variance = lums.reduce((a, v) => a + (v - mean) ** 2, 0) / lums.length
  return Math.min(100, Math.max(0, 100 - Math.sqrt(variance) * 1.9))
}

export function analyzeImageData(
  imageData: ImageData,
  oval: { cx: number; cy: number; rx: number; ry: number }
): SkinMetrics {
  const { data, width } = imageData
  const { cx, cy, rx, ry } = oval

  const tzone    = sampleZone(data, width, cx, cy, rx, ry, [-0.28,  0.28],  [-1.0,  0.35])
  const forehead = sampleZone(data, width, cx, cy, rx, ry, [-0.45,  0.45],  [-1.0, -0.30])
  const nose     = sampleZone(data, width, cx, cy, rx, ry, [-0.22,  0.22],  [ 0.05,  0.42])
  const lCheek   = sampleZone(data, width, cx, cy, rx, ry, [-0.95, -0.30],  [-0.1,  0.55])
  const rCheek   = sampleZone(data, width, cx, cy, rx, ry, [ 0.30,  0.95],  [-0.1,  0.55])
  const chin     = sampleZone(data, width, cx, cy, rx, ry, [-0.38,  0.38],  [ 0.45,  1.0])

  const allPixels = [
    ...tzone.skinPixels, ...lCheek.skinPixels,
    ...rCheek.skinPixels, ...chin.skinPixels,
  ]

  if (allPixels.length < 20) {
    return { oiliness: 50, hydration: 50, redness: 30, texture: 70, uniformity: 70 }
  }

  // Oiliness via specular highlight ratio in T-zone + nose
  const tzoneRatio = tzone.total > 0 ? tzone.speculars / tzone.total : 0
  const noseRatio  = nose.total  > 0 ? nose.speculars  / nose.total  : 0
  const oiliness = Math.min(100, Math.max(0, (tzoneRatio * 190 + noseRatio * 130) - 4))

  // Redness via LAB a* channel on cheeks
  const cheekPixels = [...lCheek.skinPixels, ...rCheek.skinPixels]
  const avgLabA = cheekPixels.length > 0
    ? cheekPixels.reduce((s, p) => s + rgbToLabA(p.r, p.g, p.b), 0) / cheekPixels.length
    : 0
  const redness = Math.min(100, Math.max(0, (avgLabA - 5) * 5.8))

  // Hydration via LAB luminance deviation from ideal skin tone
  const avgL = allPixels.reduce((s, p) => s + rgbToLuminance(p.r, p.g, p.b), 0) / allPixels.length
  const hydration = Math.min(100, Math.max(0, 100 - Math.abs(avgL - 61) * 2.3))

  // Texture via luminance variance in forehead
  const texture = textureScore(forehead.skinPixels)

  // Uniformity via hue variance across all zones
  const hues: number[] = []
  for (const p of allPixels) {
    const max = Math.max(p.r, p.g, p.b) / 255
    const min = Math.min(p.r, p.g, p.b) / 255
    const d = max - min
    if (d > 0.05) {
      const maxRaw = Math.max(p.r, p.g, p.b)
      let h = 0
      if (maxRaw === p.r)      h = ((p.g - p.b) / 255 / d) % 6
      else if (maxRaw === p.g) h = (p.b - p.r) / 255 / d + 2
      else                     h = (p.r - p.g) / 255 / d + 4
      hues.push(h * 60)
    }
  }
  const avgHue = hues.length > 0 ? hues.reduce((a, b) => a + b, 0) / hues.length : 20
  const hueVar = hues.length > 0
    ? hues.reduce((a, v) => a + (v - avgHue) ** 2, 0) / hues.length : 100
  const uniformity = Math.min(100, Math.max(0, 100 - Math.sqrt(hueVar) * 1.6))

  return {
    oiliness:   Math.round(oiliness),
    hydration:  Math.round(hydration),
    redness:    Math.round(redness),
    texture:    Math.round(texture),
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
  if (answers.q1 === 'a') score.oily += 1
  if (answers.q1 === 'c') score.normal += 1
  if (answers.q1 === 'd') { score.dry += 1; score.sensitive += 1 }

  // q2: skin feel after cleansing
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
  if (answers.q3 === 'b' || score.dry > 4)  concerns.push('Dryness & Dehydration')
  if (answers.q3 === 'c' || answers.q5 === 'a') concerns.push('Sensitivity & Redness')
  if (score.oily > 5) concerns.push('Excess Oil & Shine')
  if (answers.q3 === 'd') concerns.push('Uneven Texture & Tone')
  if (answers.q1 === 'd') concerns.push('Anti-Aging & Firmness')
  if (metrics && metrics.redness > 52) concerns.push('Visible Redness')

  const descriptions: Record<SkinType, string> = {
    oily:        'Your skin produces excess sebum, creating shine and enlarged pores. Balance — not stripping — is key.',
    dry:         'Your skin lacks moisture and lipids, feeling tight and sometimes flaky. Barrier repair is the priority.',
    combination: 'Oily T-zone meets drier cheeks. A targeted, zone-specific approach works best for you.',
    sensitive:   'Your skin reacts easily to products and environment. Simplicity and gentle formulas are essential.',
    normal:      'Your skin is beautifully balanced. Focus on maintenance and prevention to keep it that way.',
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
