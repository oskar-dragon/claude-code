# Research Categories

## Overview

The plan-trip skill dispatches 8 parallel research subagents, one per category. Each subagent:
- Receives: destination, dates, trip type, traveller interests, dietary restrictions, preferred sources
- Checks `preferred_sources` from user preferences first, then does broader web search
- Returns a structured text summary: category name, key findings as bullet points, source URLs (minimum 3)

---

## Base Categories (all trip types)

### 1. Visa & Entry Requirements
Research: visa requirement for UK, EU, and US passport holders; visa types (tourist/e-visa/on-arrival/visa-free); application process and timeline; visa cost; duration of stay allowed; passport validity requirements; travel insurance requirements; vaccination requirements.

### 2. Weather & Best Time to Visit
Research: temperature ranges by month; rainfall/precipitation patterns; seasonal variation (dry/wet/monsoon seasons); whether the travel dates fall in peak, shoulder, or off-peak season; what to expect during those dates (crowds, prices, weather); suggested packing based on weather.

### 3. Transport
**Getting there:** flights (main airports, typical flight duration from UK/Europe), trains, ferries if relevant.
**Getting around:** public transport (metro, buses, trains), car rental (recommended or not, driving rules), taxis/rideshare apps available, cycling, walking. Include rough costs.

### 4. Attractions & Activities
Research: top 5-10 sights and attractions; hidden gems and off-the-beaten-path spots; day trip options; guided tour recommendations; outdoor activities; cultural experiences; must-do experiences. Note any that require advance booking or permits.

### 5. Food Scene & Restaurants
Research: local cuisine overview; must-try dishes; restaurant recommendations across budget levels; street food scene; markets; vegetarian/vegan options (informed by dietary restrictions); coffee culture; local drinks. Include specific restaurant names where possible.

### 6. Neighbourhoods & Areas to Stay
Research: best areas for tourists to stay; neighbourhood character and vibe; proximity to main sights; safety; price range; specific hotel/accommodation recommendations across budget levels.

### 7. Events During Travel Dates
Research: festivals, public holidays, exhibitions, sporting events, concerts, markets happening during the specific travel dates. Note if any events will cause crowds, road closures, or accommodation price spikes.

### 8. Practical Tips
Research: local currency and best way to exchange; tipping norms; best SIM card/eSIM options; power adapter type; basic language phrases; cultural etiquette (dress codes, behaviour at religious sites, photography rules); emergency numbers; healthcare/pharmacy access; water safety (tap water drinkable?); common tourist scams.

---

## Trip Type Adaptations

When the trip type is one of the following, the relevant research categories should include extra focus areas:

### Campervan Trip
**Transport** category adds: campsite availability and booking sites, service stations (dump stations, water fill), gas/diesel prices, wild camping legality, overnight parking rules, driving rules for campervans.
**Practical Tips** adds: shower and laundry facility locations, propane/gas canister availability.

### Through-Hike
**Attractions & Activities** becomes: trail research — trail name and route, distance and elevation, difficulty, conditions during travel dates, trail access (permits required?), shelter/hut availability and booking, resupply points (towns, distances apart), water sources (reliability, purification needed).
**Practical Tips** adds: gear requirements, emergency contacts for mountain rescue, nearest hospital to trailhead.

### City Break
**Transport** adds: public transport day/week pass options, best apps for navigation, bike rental.
**Attractions & Activities** adds: museum and gallery pass options (city passes that bundle entry), walking tour recommendations.

### Wild Camping
**Attractions & Activities** becomes: camping spot research — legality by region, ideal locations, access routes.
**Practical Tips** adds: water purification methods, leave-no-trace guidelines, bear/wildlife safety if applicable, weather exposure risks, emergency shelter options.

### Road Trip
**Transport** becomes: driving route research — road conditions, scenic routes vs fastest routes, distance between stops, fuel costs and station frequency, toll roads, driving rules (speed limits, alcohol limits).
**Practical Tips** adds: car rental tips (insurance, one-way fees), breakdown cover, border crossing requirements if multi-country.

---

## Output Format for Each Subagent

Each research subagent returns results in this format:

```
## [Category Name]

[2-3 sentence summary]

### Key Findings
- [Bullet point with specific info]
- [Bullet point with specific info]
- ...

### Sources
- [URL 1]
- [URL 2]
- [URL 3]
```
