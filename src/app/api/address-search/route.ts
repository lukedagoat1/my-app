import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  if (!q || q.length < 4) return NextResponse.json([]);

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&limit=6&countrycodes=us&q=${encodeURIComponent(q)}`;
    const res = await fetch(url, {
      headers: {
        "User-Agent": "SarasTradingPost/1.0 (sarastradingpost@gmail.com)",
        "Accept-Language": "en-US",
      },
      next: { revalidate: 60 },
    });
    if (!res.ok) return NextResponse.json([]);
    const raw = await res.json();

    // Map of US state names → abbreviations
    const stateAbbr: Record<string, string> = {
      "Alabama":"AL","Alaska":"AK","Arizona":"AZ","Arkansas":"AR","California":"CA",
      "Colorado":"CO","Connecticut":"CT","Delaware":"DE","Florida":"FL","Georgia":"GA",
      "Hawaii":"HI","Idaho":"ID","Illinois":"IL","Indiana":"IN","Iowa":"IA",
      "Kansas":"KS","Kentucky":"KY","Louisiana":"LA","Maine":"ME","Maryland":"MD",
      "Massachusetts":"MA","Michigan":"MI","Minnesota":"MN","Mississippi":"MS",
      "Missouri":"MO","Montana":"MT","Nebraska":"NE","Nevada":"NV","New Hampshire":"NH",
      "New Jersey":"NJ","New Mexico":"NM","New York":"NY","North Carolina":"NC",
      "North Dakota":"ND","Ohio":"OH","Oklahoma":"OK","Oregon":"OR","Pennsylvania":"PA",
      "Rhode Island":"RI","South Carolina":"SC","South Dakota":"SD","Tennessee":"TN",
      "Texas":"TX","Utah":"UT","Vermont":"VT","Virginia":"VA","Washington":"WA",
      "West Virginia":"WV","Wisconsin":"WI","Wyoming":"WY","District of Columbia":"DC",
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const results = raw.map((r: any) => {
      const a = r.address ?? {};
      const house  = a.house_number ?? "";
      const road   = a.road ?? a.pedestrian ?? a.path ?? "";
      const line1  = house ? `${house} ${road}` : road;
      const city   = a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? "";
      const stateRaw = a.state ?? "";
      const state  = stateAbbr[stateRaw] ?? stateRaw;
      const zip    = (a.postcode ?? "").split("-")[0];
      const label  = `${line1}${city ? ", " + city : ""}${state ? ", " + state : ""}${zip ? " " + zip : ""}`;
      return { label, line1, city, state, zip };
    }).filter((r: { line1: string }) => r.line1.length > 0);

    return NextResponse.json(results);
  } catch {
    return NextResponse.json([]);
  }
}
