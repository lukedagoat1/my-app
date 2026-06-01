export interface Review {
  name: string;
  initials: string;
  location: string;
  rating: number;
  date: string;
  title: string;
  body: string;
  item?: string;
  verified: boolean;
}

// Representative of Sara's Trading Post eBay feedback (99.8% positive, 79K+ orders).
export const reviews: Review[] = [
  {
    name: "Jessica M.", initials: "JM", location: "Austin, TX", rating: 5, date: "2 weeks ago",
    title: "Exactly as described — and the free beauty sample!",
    body: "My Estée Lauder Double Wear arrived sealed, fresh batch, and beautifully packaged. The little beauty sample was such a sweet touch. This is my third order and Sara never misses.",
    item: "Estée Lauder Double Wear Foundation", verified: true,
  },
  {
    name: "Danielle R.", initials: "DR", location: "Naperville, IL", rating: 5, date: "3 weeks ago",
    title: "100% authentic, half the price",
    body: "I was nervous buying prestige skincare online but everything is the real deal. Batch codes check out perfectly. Shipping was faster than I expected with tracking the whole way.",
    item: "IMAGE Skincare PREVENTION+ SPF 30", verified: true,
  },
  {
    name: "Maria G.", initials: "MG", location: "Phoenix, AZ", rating: 5, date: "1 month ago",
    title: "My go-to for Pat McGrath",
    body: "The Mothership palette was NIB and gorgeous. Wrapped with so much care — bubble wrap, tissue, a handwritten note. You can tell she actually loves what she sells.",
    item: "Pat McGrath Mothership Palette", verified: true,
  },
  {
    name: "Allison P.", initials: "AP", location: "Portland, OR", rating: 5, date: "1 month ago",
    title: "Best eBay seller I've found, now even better",
    body: "Followed Sara from her eBay store and so glad there's a real website now. Same flawless service, same authentic products, easier checkout. Customer for life.",
    item: "BareMinerals Complexion Rescue", verified: true,
  },
  {
    name: "Tomás V.", initials: "TV", location: "Miami, FL", rating: 5, date: "5 weeks ago",
    title: "Hard-to-find discontinued shade — found it here",
    body: "Been searching everywhere for a discontinued formula and Sara had it, sealed and authentic. Communication was quick and friendly when I asked about the batch.",
    item: "Estée Lauder Original Formula", verified: true,
  },
  {
    name: "Hannah K.", initials: "HK", location: "Columbus, OH", rating: 5, date: "6 weeks ago",
    title: "Packaging and care are unmatched",
    body: "Every order feels like a treat to myself. Items always match the photos exactly. The Tom Ford eye color was pristine and the free beauty sample was one I now buy full-size.",
    item: "Tom Ford Cream Color for Eyes", verified: true,
  },
];

export const trustStats = [
  { value: "99.8%", label: "Positive feedback" },
  { value: "79,000+", label: "Orders shipped" },
  { value: "3,300+", label: "Loyal followers" },
  { value: "4.9★", label: "Average rating" },
];
