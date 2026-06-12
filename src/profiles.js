export const problems = [
  { id: "npd",       label: "New product development", icon: "⚗️" },
  { id: "ops",       label: "Production / Operation",  icon: "⚙️" },
  { id: "supply",    label: "Supply Chain",             icon: "🔗" },
  { id: "finance",   label: "Finance",                  icon: "📊" },
  { id: "sales",     label: "Sales",                    icon: "🎯" },
  { id: "marketing", label: "Marketing",                icon: "📡" },
  { id: "cx",        label: "Customer Services",        icon: "🤝" },
  { id: "hr",        label: "Human Resources",          icon: "👥" },
];

export const impacts = [
  { id: "revenue", label: "New revenue" },
  { id: "cost",    label: "Cost saving" },
  { id: "time",    label: "Time saving" },
];

export const profiles = {
  // ── Revenue track ────────────────────────────────────────────────────────
  "npd-revenue":     { id: "01", icon: "🔬", name: "The Inventor",           tagline: "You turn ideas into revenue engines",          description: "You live at the frontier. Where others see raw research, you see market opportunities. You champion AI to compress the R&D cycle — from beaker to launch at warp speed — and you measure success in new SKUs shipped, not experiments run." },
  "ops-revenue":     { id: "02", icon: "🏭", name: "The Forge Master",       tagline: "You make factories print money",               description: "You see the production floor as a revenue machine waiting to be unlocked. AI in your hands means smart scheduling, zero-defect yields, and capacity that translates directly into topline growth. You don't just run lines — you grow them." },
  "supply-revenue":  { id: "03", icon: "🌐", name: "The Flow Trader",        tagline: "You monetize movement",                        description: "Supply chains are invisible until they fail — unless you're involved. You use AI to turn logistics data into competitive advantage: faster fulfillment, smarter sourcing, new service offerings that your competitors can't replicate." },
  "finance-revenue": { id: "04", icon: "⛏️", name: "The Gold Miner",         tagline: "You find value nobody else sees",              description: "Numbers tell you stories others miss. You deploy AI to surface hidden revenue pockets — pricing gaps, untapped segments, M&A signals — and convert financial intelligence into growth plays that land in the boardroom." },
  "sales-revenue":   { id: "05", icon: "🤝", name: "The Deal Maker",         tagline: "You use AI to close bigger, faster",           description: "Your pipeline is a living organism. You use AI to qualify harder, personalize sharper, and forecast with conviction. You don't chase leads — you engineer deal velocity, and your quota reflects it." },
  "marketing-revenue":{ id: "06", icon: "🚀", name: "The Trendsetter",       tagline: "You make the market move toward you",          description: "You read culture like a signal feed. AI gives you the precision to launch campaigns that set trends rather than follow them — turning brand spend into measurable revenue, not just awareness impressions." },
  "cx-revenue":      { id: "07", icon: "🌟", name: "The Crowd Pleaser",      tagline: "You turn happy customers into growth",         description: "You know that retention is the new acquisition. AI lets you anticipate needs, personalize at scale, and turn every service moment into an upsell or referral. Your NPS is not a score — it's a revenue forecast." },
  "hr-revenue":      { id: "08", icon: "🌱", name: "The Talent Multiplier",  tagline: "You turn people into your biggest asset",      description: "You know that the right person in the right role is worth more than any machine. You use AI to identify high-potential talent, personalize development paths, and build a workforce capability that directly drives business growth. People aren't a cost centre for you — they're a revenue multiplier." },

  // ── Cost saving track ─────────────────────────────────────────────────────
  "npd-cost":        { id: "09", icon: "⚡", name: "The Optimizer",          tagline: "You engineer elegance into every formula",     description: "Waste is your enemy and AI is your weapon. You redesign products from the inside out — fewer raw materials, tighter formulations, smarter prototyping cycles — until every gram and every baht earns its place." },
  "ops-cost":        { id: "10", icon: "🔩", name: "The Lean Machine",       tagline: "You cut waste before it forms",                description: "You see inefficiency that others walk past. AI gives you the visibility to predict downtime, eliminate scrap, and run operations so tight that cost savings compound month on month. Lean isn't a methodology for you — it's a mindset." },
  "supply-cost":     { id: "11", icon: "⚖️", name: "The Arbitrageur",        tagline: "You find margin in every mile",                description: "Between every supplier, port, and warehouse sits trapped value. You use AI to surface it — optimal reorder points, smarter vendor selection, demand-driven inventory — converting logistics complexity into cost advantage." },
  "finance-cost":    { id: "12", icon: "🔍", name: "The Accountant",         tagline: "You find the leak before it floods",           description: "You have a gift for financial forensics. AI amplifies your ability to detect anomalies, automate reconciliation, and model scenarios with surgical accuracy. You don't just report on costs — you engineer their reduction." },
  "sales-cost":      { id: "13", icon: "🏹", name: "The Hunter",             tagline: "You spend less to win more",                   description: "You know that the most expensive customer is the wrong one. AI helps you target with precision, shorten sales cycles, and eliminate the overhead that comes from chasing deals that were never going to close." },
  "marketing-cost":  { id: "14", icon: "🎛️", name: "The Budget Whisperer",  tagline: "You squeeze ROI from every baht",              description: "You treat every marketing dollar like a hypothesis to be tested. AI gives you the attribution clarity and creative efficiency to kill underperformers fast and double down on what works. Your budget is always smaller than your results." },
  "cx-cost":         { id: "15", icon: "🏛️", name: "The Loyalty Architect", tagline: "You reduce churn before it costs you",         description: "Keeping a customer costs less than winning one. You use AI to detect churn signals early, resolve issues proactively, and design service experiences that are both excellent and efficient. Loyalty, for you, is a cost strategy." },
  "hr-cost":         { id: "16", icon: "💼", name: "The People Economist",   tagline: "You make every headcount count",               description: "You know that hiring wrong is expensive, and losing talent is more so. AI gives you the data to hire smarter, retain longer, and deploy people where they create the most value. You don't manage headcount — you optimise human capital ROI." },

  // ── Time saving track ─────────────────────────────────────────────────────
  "npd-time":        { id: "17", icon: "⚡", name: "The Sprint Maker",       tagline: "You compress years into weeks",                description: "Speed is your competitive moat. You use AI to run parallel experiments, auto-synthesize literature, and cut the dead time between hypothesis and result. Where others iterate in quarters, you iterate in sprints." },
  "ops-time":        { id: "18", icon: "🏎️", name: "The Line Mover",        tagline: "You make throughput your superpower",          description: "Every second of downtime is a cost you feel personally. AI gives you predictive maintenance, real-time scheduling, and anomaly detection that keeps lines running and delivery promises intact. You don't manage time — you reclaim it." },
  "supply-time":     { id: "19", icon: "💨", name: "The Fast Lane",          tagline: "You get there before others leave",            description: "Your supply chain moves at the speed of signal, not spreadsheet. AI compresses the lag between market shifts and operational response — demand spikes, supplier disruptions, customs delays — turning reaction time into a competitive edge." },
  "finance-time":    { id: "20", icon: "⚡", name: "The Flash Analyst",      tagline: "You close the books before others open them",  description: "Financial decisions should be made on today's data, not last month's. You use AI to automate reporting, accelerate close cycles, and deliver real-time insight that gives leadership the confidence to move fast." },
  "sales-time":      { id: "21", icon: "🎯", name: "The Closer",             tagline: "You shorten every deal by half",               description: "Time kills deals — and you know it. AI gives you instant research, auto-drafted proposals, and objection-handling intelligence that collapses the distance between first contact and signed contract." },
  "marketing-time":  { id: "22", icon: "📡", name: "The Signal Finder",      tagline: "You act on trends before they trend",          description: "You operate on market intelligence, not hindsight. AI scans signals across channels, surfaces emerging topics, and lets you brief, create, and launch content in the time others spend in planning meetings." },
  "cx-time":         { id: "23", icon: "🚨", name: "The First Responder",    tagline: "You solve problems before they escalate",      description: "A customer with a problem is a clock ticking. You use AI to detect issues early, route queries instantly, and resolve at first contact. Your response time is your brand promise — and you never break it." },
  "hr-time":         { id: "24", icon: "🔥", name: "The Culture Catalyst",   tagline: "You make great people decisions in real time", description: "You believe that slow HR is broken HR. AI gives you real-time pulse on engagement, instant matching of people to opportunities, and automated workflows that clear the admin so you can focus on what matters — building the kind of culture people refuse to leave." },
};

export function getProfile(problemId, impactId) {
  return profiles[`${problemId}-${impactId}`];
}
