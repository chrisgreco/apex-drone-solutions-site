"""
Build comprehensive South Jersey Ag Drone target list from:
1. Original spreadsheet targets
2. Apify Google Maps scrape results
3. Perplexity research findings
"""
import json
import os
import sys

# We'll output a TSV that can be converted to Excel
targets = []

def add(company, type_, location, email, phone, website, source, priority, notes):
    targets.append({
        "Company": company,
        "Type": type_,
        "Location": location,
        "Email": email,
        "Phone": phone,
        "Website": website,
        "Source": source,
        "Priority": priority,
        "Notes": notes,
    })

# ── TIER 1: Direct Competitors / Acquisition Targets ──
add("Influential Drones", "Ag drone spraying (Part 137)", "Marlton, NJ (Burlington Co)", "info@influentialdrones.com", "(856) 281-7545", "influentialdrones.com", "Apify + original", "HIGH", "Only confirmed NJ Part 137 drone sprayer. Top acquisition target.")
add("Alpha Drones USA", "Ag/commercial drone services", "Multi-state (NJ office)", "", "1-800-270-4987", "alphadronesusa.com", "Perplexity + original", "HIGH", "Active NJ ag drone provider. Competitor or acquisition conversation.")
add("Wings Aerial Applicators", "Traditional aerial applicator", "New Jersey", "wingsaerial@gmail.com", "(609) 760-5653", "wingsaerialapplicators.com", "Perplexity + original", "HIGH", "Incumbent manned aerial sprayer. 18+ years. Partnership or competitive intel.")
add("Downstown Aero", "Traditional aerial applicator (fixed wing)", "Bridgeton, NJ (Cumberland Co)", "FireCats1@aol.com", "(856) 697-3300", "", "Perplexity", "HIGH", "Founded 1945. Fleet of 13 Ag-Cats. NJ prime contractor since 1969. Major incumbent.")
add("AcuSpray", "Drone spraying technology", "National", "", "", "acuspray.com", "Perplexity", "MEDIUM", "Precision drone spraying company. Potential competitor or equipment partner.")

# ── TIER 2: Local Drone Services (potential hires, partners, acquisitions) ──
add("South Jersey Drone Services", "General drone services", "Sewell, NJ", "info@southjerseydroneservices.com", "(856) 807-1300", "southjerseydroneservices.com", "Original", "MEDIUM", "Local drone ops. Not ag-specialized but could be platform/talent source.")
add("National Drone Works", "Drone service", "Burlington County, NJ", "info@nationaldroneworks.com", "(856) 685-4188", "nationaldroneworks.com", "Apify", "MEDIUM", "Burlington County drone service. Potential pilot hire or partner.")
add("The Drone Life, LLC", "Aerial photography/drone", "Medford Lakes, NJ (Burlington Co)", "info@thedronelifenj.com", "(609) 500-5774", "thedronelifenj.com", "Apify", "MEDIUM", "Local drone operator. Potential pilot hire.")
add("Saturn Skylens LLC", "Drone service", "Moorestown, NJ (Burlington Co)", "", "(267) 209-6044", "saturnskylens.com", "Apify", "LOW", "Drone service in Burlington County.")
add("Adams Drone Service", "Drone service", "Burlington, NJ", "", "(609) 556-9420", "adamsdroneservices.weebly.com", "Apify", "LOW", "Burlington city drone service.")
add("Kyles Drone Service", "Aerial photography", "Medford, NJ (Burlington Co)", "", "(609) 760-0739", "", "Apify", "LOW", "Part 107 pilot in target area. Potential hire.")
add("Precision Sky RE & Drone Services", "Drone services", "Burlington County, NJ", "precisionskydroneservicesllc@gmail.com", "(609) 713-6316", "precisionskyrealestateanddroneservices.com", "Apify", "LOW", "Local drone operator. Potential pilot hire.")
add("Airspire Aerials", "Drone service", "Cumberland County, NJ", "", "(856) 484-6467", "", "Apify", "LOW", "Cumberland County drone service.")
add("Blue Harbor Drones, LLC", "Drone service", "Cumberland County, NJ", "contact@blueharbordrones.com", "(856) 554-2319", "blueharbordrones.com", "Apify", "LOW", "Cumberland County drone operator.")
add("Iris Drones", "Aerial photography", "Burlington County, NJ", "", "(215) 595-8696", "", "Apify", "LOW", "Drone operator. Potential pilot hire.")
add("A'drone'aline", "Drone services", "Burlington County, NJ", "", "(267) 805-2611", "", "Apify", "LOW", "Local drone operator.")
add("Drone Force", "Drone-based services", "Burlington County, NJ", "info@dronforcetech.com", "(856) 773-6723", "droneforcetech.com", "Apify", "LOW", "Drone services company.")

# ── TIER 3: Directories & Networks ──
add("U.S.A.R. Drone Team (Agra Spray)", "Dealer / ag spray demos", "NJ/Northeast", "", "(732) 245-4234", "usardroneteam.org", "Original", "LOW", "Regional lead source for active ag spray operators.")
add("NuWay Ag - NJ Pilot Network", "Dealer/pilot locator", "New Jersey", "", "", "nuwayag.com", "Original", "LOW", "NJ pilot map under construction. Sourcing channel.")
add("Agri Spray Drones - Applicator Locator", "Directory", "National", "", "", "agrispraydrones.com/custom-applicator-locator", "Original", "LOW", "Find certified local applicators.")
add("NAAA Applicator Database", "Directory", "National", "", "", "agaviation.org", "Original", "LOW", "Map incumbent aerial competition.")

# ── TIER 4: Farm Supply / Chemical Partners (referral sources) ──
add("GROWMARK FS", "Agricultural service/supply", "Bridgeton, NJ (Cumberland Co)", "", "(856) 455-7688", "growmarkfs.com/midatlantic", "Apify", "MEDIUM", "Ag supply. Strong referral partner — they sell chemicals farmers need sprayed.")
add("Sussex Irrigation & Farm Supply", "Farm equipment supplier", "Bridgeton, NJ (Cumberland Co)", "info@sussexirrigation.com", "(856) 451-1368", "sussexirrigation.com", "Apify", "MEDIUM", "Farm supply dealer. Referral partner.")
add("Wayne Rockhill Agriculture", "Farm equipment supplier", "Southampton, NJ (Burlington Co)", "", "(609) 654-6336", "", "Apify", "MEDIUM", "Farm equipment in Burlington Co. Referral partner.")
add("Burlington Agway", "Farm/feed supply", "Burlington, NJ", "burlingtonagway@live.com", "(609) 386-0500", "burlingtonagway.com", "Apify", "MEDIUM", "Feed/farm supply. Good referral channel.")
add("Ware's Farm Supply", "Farm supply", "Tabernacle, NJ (Burlington Co)", "waresfarmsupply@gmail.com", "(609) 268-1191", "waresfarmsupply.com", "Apify", "MEDIUM", "Farm supply in heart of target area.")
add("Fox Chase Feed & Supply", "Farm supply", "Southampton, NJ (Burlington Co)", "info@foxchasefeedandsupply.com", "", "foxchasefeedandsupply.com", "Apify", "LOW", "Farm supply in Burlington Co.")
add("Leslie G. Fogg, Inc.", "Farm equipment supplier", "Bridgeton, NJ (Cumberland Co)", "", "(856) 451-2727", "lesliegfogg.com", "Apify", "LOW", "Farm equipment in Cumberland Co.")
add("Turkey Creek Farm Supply", "Farm equipment supplier", "Elmer, NJ (Salem Co)", "", "(856) 498-9583", "", "Apify", "LOW", "Farm supply in Salem County.")
add("Cherry Valley Tractor Sales", "Tractor dealer", "Marlton, NJ (Burlington Co)", "Keith@cherryvalleytractor.com", "(856) 983-0111", "cherryvalleytractor.com", "Apify", "LOW", "Tractor dealer — knows every farmer in area.")
add("Noble Turf", "Fertilizer supplier", "Mt Laurel, NJ (Burlington Co)", "noble@nobleturf.com", "(856) 273-5939", "nobleturf.com", "Apify", "LOW", "Fertilizer supplier. Referral partner.")
add("Stokes Seeds", "Seed supplier", "Vineland, NJ (Cumberland Co)", "custservice@stokeseeds.com", "(856) 692-6218", "stokeseeds.com", "Apify", "LOW", "Seed supplier serving area growers.")
add("Peters Chemical Company", "Agricultural chemicals", "Hawthorne, NJ", "", "(973) 427-8844", "peterschemical.com", "Perplexity", "LOW", "NJ-based ag chemical distributor.")
add("Delaware Valley Spray Services", "Lawn/ag spray service", "Hainesport, NJ (Burlington Co)", "", "(609) 261-9400", "delawarevalleysprayservice.com", "Apify", "MEDIUM", "Spray services in Burlington Co. Potential competitor or partner.")

# ── TIER 5: Key Farms (potential customers) ──
add("Oakland Farms Crop Services", "Farm / crop services", "Bridgeton, NJ (Cumberland Co)", "", "(856) 451-8224", "", "Apify", "MEDIUM", "Farm with crop services — potential customer AND competitor.")
add("Vineland AG LLC", "Agricultural service", "Vineland, NJ (Cumberland Co)", "", "(856) 765-5001", "", "Apify", "MEDIUM", "Ag service company in Vineland.")
add("J G Akerboom Nurseries Inc", "Agricultural service", "Cedarville, NJ (Cumberland Co)", "AKERBOOMSALES@HOTMAIL.COM", "(856) 447-3346", "akerboom.com", "Apify", "LOW", "Nursery/ag service.")
add("Ag-Mart Produce Inc", "Produce wholesaler", "Cedarville, NJ (Cumberland Co)", "", "(856) 447-0040", "", "Apify", "LOW", "Produce operation. Potential customer.")
add("Eastern Fresh Growers", "Vegetable wholesaler", "Cedarville, NJ (Cumberland Co)", "sales@easternfreshgrowers.com", "(856) 447-3563", "easternfreshgrowers.com", "Apify", "LOW", "Major vegetable operation. Potential customer.")
add("Nardelli Bros / Lake View Farms", "Farm", "Cedarville, NJ (Cumberland Co)", "", "(856) 447-5050", "nardellibrosinc.com", "Apify", "LOW", "Established farm operation.")
add("Burlington County Agricultural Center", "Farmers market / ag center", "Moorestown, NJ (Burlington Co)", "farmmarket@co.burlington.nj.us", "(856) 642-3850", "burlcoagcenter.com", "Apify", "MEDIUM", "County ag center. Perfect venue for demos/networking.")

# ── TIER 6: Extension / Government Contacts ──
add("Rutgers Extension - Burlington County", "University extension", "Westampton, NJ", "bamka@njaes.rutgers.edu", "(609) 265-5050", "burlington.njaes.rutgers.edu", "Perplexity", "HIGH", "Top referral source. Gateway to Burlington Co farmers.")
add("Rutgers Extension - Cape May County", "University extension", "Cape May Court House, NJ", "", "(609) 465-5115 x3607", "capemay.njaes.rutgers.edu", "Perplexity", "MEDIUM", "Extension office for coastal ag.")
add("USDA Service Center - Vineland", "Federal ag office", "Vineland, NJ (Cumberland Co)", "feedback@usda.gov", "(856) 205-1225", "usda.gov", "Apify", "MEDIUM", "USDA office. FSA loans, veteran programs, farmer directory.")
add("NJ Dept of Environmental Protection", "State regulator", "Trenton, NJ", "", "(609) 777-3373", "", "Perplexity", "MEDIUM", "Pesticide spraying regulations. Compliance contact.")

# ── Helicopter Services ──
add("FairLifts Helicopter Services", "Helicopter ag services", "National (NJ service)", "", "1-800-318-8940", "fairlifts.com", "Perplexity", "LOW", "Helicopter ag spraying in NJ. Incumbent competitor.")

# ── Output ──
print(f"Total targets: {len(targets)}")
print()

# Write as TSV
with open("c:/Users/greco/.cursor/projects/apex-drone-solutions/target_list_compiled.tsv", "w", encoding="utf-8") as f:
    headers = list(targets[0].keys())
    f.write("\t".join(headers) + "\n")
    for t in targets:
        f.write("\t".join(str(t[h]) for h in headers) + "\n")

print("Written to target_list_compiled.tsv")

# Summary by priority
from collections import Counter
priorities = Counter(t["Priority"] for t in targets)
for p in ["HIGH", "MEDIUM", "LOW"]:
    print(f"  {p}: {priorities.get(p, 0)}")
