// Mock data for Ai Sathi - Amravati businesses, events, and services

export const businesses = [
  { id: 1, name: "Shree Krishna Hospital", nameMarathi: "श्री कृष्णा हॉस्पिटल", category: "hospital", rating: 4.5, reviews: 342, distance: "0.8 km", address: "Rajapeth, Amravati", phone: "+91 9876543210", hours: "24/7", lat: 20.9320, lng: 77.7523, tags: ["Emergency", "ICU", "Multi-specialty"], image: "🏥", isOpen: true },
  { id: 2, name: "Hotel Natraj", nameMarathi: "हॉटेल नटराज", category: "restaurant", rating: 4.2, reviews: 891, distance: "1.2 km", address: "Camp Area, Amravati", phone: "+91 9823456789", hours: "11:00 AM - 11:00 PM", lat: 20.9350, lng: 77.7580, tags: ["Veg", "Thali", "Family"], image: "🍽️", isOpen: true },
  { id: 3, name: "Medipoint Pharmacy", nameMarathi: "मेडिपॉइंट फार्मसी", category: "pharmacy", rating: 4.0, reviews: 156, distance: "0.3 km", address: "Station Road, Amravati", phone: "+91 9812345678", hours: "8:00 AM - 10:00 PM", lat: 20.9290, lng: 77.7500, tags: ["24hr Delivery", "Online Order"], image: "💊", isOpen: true },
  { id: 4, name: "Bansal Coaching Centre", nameMarathi: "बंसल कोचिंग सेंटर", category: "coaching", rating: 4.7, reviews: 234, distance: "2.1 km", address: "Morshi Road, Amravati", phone: "+91 9834567890", hours: "7:00 AM - 9:00 PM", lat: 20.9400, lng: 77.7650, tags: ["JEE", "NEET", "MHT-CET"], image: "📚", isOpen: true },
  { id: 5, name: "Hotel Kamat", nameMarathi: "हॉटेल कामत", category: "restaurant", rating: 4.3, reviews: 567, distance: "1.5 km", address: "Badnera Road, Amravati", phone: "+91 9845678901", hours: "7:00 AM - 10:30 PM", lat: 20.9280, lng: 77.7450, tags: ["South Indian", "Breakfast", "Pure Veg"], image: "🍛", isOpen: true },
  { id: 6, name: "IRSHA Hospital", nameMarathi: "ईर्षा हॉस्पिटल", category: "hospital", rating: 4.6, reviews: 478, distance: "3.2 km", address: "Gadge Nagar, Amravati", phone: "+91 9856789012", hours: "24/7", lat: 20.9380, lng: 77.7700, tags: ["Surgery", "Maternity", "Pediatrics"], image: "🏥", isOpen: true },
  { id: 7, name: "SBI ATM - Main Branch", nameMarathi: "SBI ATM - मुख्य शाखा", category: "atm", rating: 3.8, reviews: 89, distance: "0.5 km", address: "Cotton Market, Amravati", phone: "", hours: "24/7", lat: 20.9310, lng: 77.7530, tags: ["Cash Withdrawal", "Mini Statement"], image: "🏧", isOpen: true },
  { id: 8, name: "Hotel Samrat", nameMarathi: "हॉटेल सम्राट", category: "hotel", rating: 4.1, reviews: 312, distance: "1.8 km", address: "Camp Area, Amravati", phone: "+91 9867890123", hours: "Check-in: 12 PM", lat: 20.9360, lng: 77.7600, tags: ["AC Rooms", "WiFi", "Parking"], image: "🏨", isOpen: true },
  { id: 9, name: "Fitness First Gym", nameMarathi: "फिटनेस फर्स्ट जिम", category: "gym", rating: 4.4, reviews: 198, distance: "1.0 km", address: "VMV Road, Amravati", phone: "+91 9878901234", hours: "5:00 AM - 10:00 PM", lat: 20.9340, lng: 77.7560, tags: ["Cardio", "Weight Training", "Yoga"], image: "🏋️", isOpen: true },
  { id: 10, name: "Deshpande Eye Clinic", nameMarathi: "देशपांडे नेत्र चिकित्सालय", category: "hospital", rating: 4.8, reviews: 567, distance: "2.5 km", address: "Rajkamal Chowk, Amravati", phone: "+91 9889012345", hours: "9:00 AM - 8:00 PM", lat: 20.9370, lng: 77.7620, tags: ["Eye Care", "Laser Surgery", "Optical"], image: "👁️", isOpen: false },
  { id: 11, name: "Café Coffee Day", nameMarathi: "कॅफे कॉफी डे", category: "restaurant", rating: 3.9, reviews: 445, distance: "0.7 km", address: "Rajapeth Square, Amravati", phone: "+91 9890123456", hours: "10:00 AM - 10:00 PM", lat: 20.9325, lng: 77.7540, tags: ["Coffee", "Snacks", "WiFi"], image: "☕", isOpen: true },
  { id: 12, name: "Axis Bank ATM", nameMarathi: "अॅक्सिस बँक ATM", category: "atm", rating: 4.0, reviews: 67, distance: "1.1 km", address: "Gandhi Gate, Amravati", phone: "", hours: "24/7", lat: 20.9300, lng: 77.7510, tags: ["Cash", "UPI"], image: "🏧", isOpen: true },
  { id: 13, name: "Gurudev Vidyalaya", nameMarathi: "गुरुदेव विद्यालय", category: "coaching", rating: 4.3, reviews: 189, distance: "3.5 km", address: "Nandgaon Peth, Amravati", phone: "+91 9801234567", hours: "8:00 AM - 5:00 PM", lat: 20.9420, lng: 77.7750, tags: ["CBSE", "SSC", "Tuitions"], image: "🎓", isOpen: false },
  { id: 14, name: "Amravati Gym Zone", nameMarathi: "अमरावती जिम झोन", category: "gym", rating: 4.2, reviews: 156, distance: "2.8 km", address: "Shegaon Naka, Amravati", phone: "+91 9812345670", hours: "6:00 AM - 9:00 PM", lat: 20.9260, lng: 77.7420, tags: ["CrossFit", "Zumba", "Personal Training"], image: "💪", isOpen: true },
  { id: 15, name: "Sukh Sagar Restaurant", nameMarathi: "सुख सागर रेस्टॉरंट", category: "restaurant", rating: 4.5, reviews: 723, distance: "0.9 km", address: "Ambapeth, Amravati", phone: "+91 9823456700", hours: "8:00 AM - 10:00 PM", lat: 20.9330, lng: 77.7550, tags: ["Gujarati Thali", "Sweets", "Pure Veg"], image: "🍱", isOpen: true },
  { id: 16, name: "Apollo Pharmacy", nameMarathi: "अपोलो फार्मसी", category: "pharmacy", rating: 4.1, reviews: 234, distance: "1.3 km", address: "Morshi Road, Amravati", phone: "+91 9834567800", hours: "8:00 AM - 11:00 PM", lat: 20.9395, lng: 77.7640, tags: ["Medicines", "Health Products", "Home Delivery"], image: "💊", isOpen: true },
  { id: 17, name: "Hotel Presidency", nameMarathi: "हॉटेल प्रेसिडेन्सी", category: "hotel", rating: 4.4, reviews: 456, distance: "2.0 km", address: "Old Cotton Market, Amravati", phone: "+91 9845678900", hours: "Check-in: 11 AM", lat: 20.9355, lng: 77.7590, tags: ["Suite", "Restaurant", "Conference Hall"], image: "🏨", isOpen: true },
  { id: 18, name: "Biryani House", nameMarathi: "बिर्याणी हाउस", category: "restaurant", rating: 4.6, reviews: 934, distance: "1.7 km", address: "Near Railway Station, Amravati", phone: "+91 9856789000", hours: "11:00 AM - 11:30 PM", lat: 20.9275, lng: 77.7490, tags: ["Non-Veg", "Biryani", "Mughlai"], image: "🍗", isOpen: true },
];

export const events = [
  { id: 1, title: "Amravati Tech Hackathon 2026", titleMarathi: "अमरावती टेक हॅकेथॉन 2026", category: "tech", date: "2026-04-12", time: "9:00 AM", location: "SGBAU Campus", price: "Free", image: "💻", attendees: 250, description: "48-hour hackathon for college students. Build innovative solutions for Amravati's problems." },
  { id: 2, title: "Navratri Garba Night", titleMarathi: "नवरात्री गरबा नाइट", category: "culture", date: "2026-04-15", time: "7:00 PM", location: "Hanuman Vyayam Prasarak Mandal Ground", price: "₹200", image: "💃", attendees: 5000, description: "Grand Navratri celebration with live music, dance, and food stalls." },
  { id: 3, title: "PM-KISAN Registration Camp", titleMarathi: "PM-KISAN नोंदणी शिबिर", category: "government", date: "2026-04-10", time: "10:00 AM", location: "Collectorate Office", price: "Free", image: "🏛️", attendees: 500, description: "Free registration camp for PM-KISAN Samman Nidhi. Bring Aadhaar and land documents." },
  { id: 4, title: "Inter-College Cricket Tournament", titleMarathi: "आंतर-महाविद्यालय क्रिकेट स्पर्धा", category: "sports", date: "2026-04-20", time: "8:00 AM", location: "Vidarbha Cricket Association Ground", price: "Free", image: "🏏", attendees: 1000, description: "Annual cricket tournament featuring 16 colleges from Amravati district." },
  { id: 5, title: "Career Fair 2026", titleMarathi: "करिअर मेळावा 2026", category: "education", date: "2026-04-18", time: "10:00 AM", location: "Government Polytechnic", price: "Free", image: "🎓", attendees: 3000, description: "100+ companies recruiting freshers. Bring your resume and certificates." },
  { id: 6, title: "Marathi Literature Festival", titleMarathi: "मराठी साहित्य महोत्सव", category: "culture", date: "2026-04-25", time: "11:00 AM", location: "Shivaji Mandir", price: "₹100", image: "📖", attendees: 800, description: "Meet famous Marathi authors, poetry readings, book launches." },
  { id: 7, title: "Blood Donation Camp", titleMarathi: "रक्तदान शिबिर", category: "health", date: "2026-04-08", time: "9:00 AM", location: "Red Cross Society, Camp Area", price: "Free", image: "🩸", attendees: 300, description: "Organized by Amravati Medical Club. All blood types needed." },
  { id: 8, title: "Yoga & Wellness Workshop", titleMarathi: "योगा आणि वेलनेस कार्यशाळा", category: "health", date: "2026-04-14", time: "6:00 AM", location: "Ambapeth Garden", price: "Free", image: "🧘", attendees: 150, description: "Morning yoga session followed by health awareness talk." },
];

export const governmentServices = [
  { id: 1, name: "PM-KISAN Samman Nidhi", nameMarathi: "PM-KISAN सन्मान निधी", category: "agriculture", description: "₹6,000 per year direct income support for farmer families", documents: ["Aadhaar Card", "Land Records (7/12 Extract)", "Bank Passbook"], office: "Tahsildar Office, Amravati", timeline: "30-45 days", eligibility: "All farmer families with cultivable land", steps: ["Visit Tahsildar Office or CSC center", "Submit application with required documents", "Verification by local Patwari", "Amount credited to bank account"], icon: "🌾" },
  { id: 2, name: "PMFBY - Crop Insurance", nameMarathi: "PMFBY - पीक विमा योजना", category: "agriculture", description: "Crop insurance scheme covering natural calamities and crop loss", documents: ["Aadhaar Card", "Land Records", "Sowing Certificate", "Bank Account Details"], office: "Agriculture Office, Collectorate", timeline: "Before sowing season", eligibility: "All farmers (loanee and non-loanee)", steps: ["Visit nearest bank branch or CSC", "Fill application form", "Pay nominal premium", "Get insurance certificate"], icon: "🛡️" },
  { id: 3, name: "Ladki Bahin Yojana", nameMarathi: "लाडकी बहीण योजना", category: "women", description: "Monthly ₹1,500 financial assistance for women", documents: ["Aadhaar Card", "Ration Card", "Income Certificate", "Bank Account", "Domicile Certificate"], office: "Women & Child Development Office, Collectorate", timeline: "45-60 days", eligibility: "Women aged 21-60 years, annual income below ₹2.5 lakh", steps: ["Apply online through Nari Shakti portal", "Upload required documents", "Visit office for verification", "Monthly amount credited to account"], icon: "👩" },
  { id: 4, name: "Ration Card Application", nameMarathi: "रेशन कार्ड अर्ज", category: "food", description: "Apply for new ration card or update existing one", documents: ["Aadhaar Card of all family members", "Address Proof", "Income Certificate", "Passport size photos"], office: "Tahsildar Office or CSC Center", timeline: "30 days", eligibility: "All residents of Maharashtra", steps: ["Visit CSC center or apply online", "Submit required documents", "Inspection by supply officer", "Card delivered to address"], icon: "📋" },
  { id: 5, name: "Mahatma Jyotirao Phule Jan Arogya Yojana", nameMarathi: "महात्मा ज्योतिराव फुले जन आरोग्य योजना", category: "health", description: "Free medical treatment up to ₹1.5 lakh per year", documents: ["Aadhaar Card", "Yellow/Orange Ration Card", "Income Certificate"], office: "District Civil Hospital, Amravati", timeline: "Immediate (for emergencies)", eligibility: "Families with yellow/orange ration card", steps: ["Visit empaneled hospital", "Show ration card at help desk", "Get Ayushman card generated", "Treatment covered under scheme"], icon: "🏥" },
  { id: 6, name: "Caste Certificate", nameMarathi: "जात प्रमाणपत्र", category: "documents", description: "Official certificate for SC/ST/OBC/EWS categories", documents: ["Aadhaar Card", "School Leaving Certificate", "Father's Caste Certificate", "Residence Proof"], office: "Tahsildar Office, Amravati", timeline: "15-30 days", eligibility: "Citizens belonging to reserved categories", steps: ["Apply at Aaple Sarkar portal", "Submit documents at Tahsildar office", "Field inquiry by Mandal Officer", "Collect certificate from office"], icon: "📜" },
  { id: 7, name: "Driving License Application", nameMarathi: "वाहन चालक परवाना अर्ज", category: "transport", description: "Apply for new driving license or renewal", documents: ["Aadhaar Card", "Address Proof", "Age Proof", "Passport size photos", "Learner's License"], office: "RTO Office, Amravati", timeline: "7-15 days", eligibility: "Age 18+ (16+ for geared vehicles without gear)", steps: ["Apply online at Parivahan portal", "Book slot for driving test", "Visit RTO for test", "License dispatched by post"], icon: "🚗" },
  { id: 8, name: "PM Awas Yojana (Urban)", nameMarathi: "PM आवास योजना (शहरी)", category: "housing", description: "Financial assistance for housing for economically weaker sections", documents: ["Aadhaar Card", "Income Certificate", "No-property Certificate", "Bank Account"], office: "Municipal Corporation, Amravati", timeline: "3-6 months", eligibility: "EWS/LIG families without pucca house", steps: ["Apply through PMAY portal", "Document verification", "Beneficiary selection by committee", "Subsidy credited to loan account"], icon: "🏠" },
  { id: 9, name: "Voter ID Registration", nameMarathi: "मतदार ओळखपत्र नोंदणी", category: "documents", description: "Register as voter and get EPIC card", documents: ["Aadhaar Card", "Address Proof", "Age Proof", "Passport size photo"], office: "Tahsildar Office / BLO Office", timeline: "15-30 days", eligibility: "Indian citizens aged 18+", steps: ["Fill Form 6 online or offline", "Submit at BLO office with documents", "Verification by BLO", "EPIC card delivered"], icon: "🗳️" },
  { id: 10, name: "Property Tax Payment", nameMarathi: "मालमत्ता कर भरणा", category: "municipal", description: "Pay property tax to Amravati Municipal Corporation", documents: ["Property details", "Previous receipt"], office: "AMC Office or Online", timeline: "Immediate", eligibility: "All property owners", steps: ["Visit AMC website", "Enter property ID", "Pay via online banking/UPI", "Download receipt"], icon: "🏢" },
];

export const categories = [
  { id: "all", label: "All", labelMarathi: "सर्व", icon: "🔍" },
  { id: "restaurant", label: "Restaurants", labelMarathi: "रेस्टॉरंट", icon: "🍽️" },
  { id: "hospital", label: "Hospitals", labelMarathi: "हॉस्पिटल", icon: "🏥" },
  { id: "pharmacy", label: "Pharmacies", labelMarathi: "फार्मसी", icon: "💊" },
  { id: "coaching", label: "Coaching", labelMarathi: "कोचिंग", icon: "📚" },
  { id: "hotel", label: "Hotels", labelMarathi: "हॉटेल", icon: "🏨" },
  { id: "gym", label: "Gyms", labelMarathi: "जिम", icon: "🏋️" },
  { id: "atm", label: "ATMs", labelMarathi: "ATM", icon: "🏧" },
];

export const chatResponses = {
  greetings: [
    "नमस्कार! मी Ai Sathi, तुमचा अमरावती डिजिटल सहाय्यक. मी तुम्हाला कसे मदत करू शकतो? 😊",
    "Hello! I'm Ai Sathi, your Amravati digital assistant. How can I help you today? 😊"
  ],
  hospital: {
    response: "अमरावतीमध्ये जवळचे उघडे हॉस्पिटल:\n\n🏥 **श्री कृष्णा हॉस्पिटल** - 0.8 km away\n📍 Rajapeth, Amravati\n⏰ Open 24/7\n⭐ 4.5/5 rating\n📞 +91 9876543210\n\n🏥 **IRSHA Hospital** - 3.2 km away\n📍 Gadge Nagar, Amravati\n⏰ Open 24/7\n⭐ 4.6/5 rating\n📞 +91 9856789012",
    suggestions: ["Get directions to Shree Krishna Hospital", "Show more hospitals", "Emergency numbers"]
  },
  biryani: {
    response: "अमरावती स्टेशनजवळ ₹200 पेक्षा कमी बिर्याणी:\n\n🍗 **Biryani House** - 1.7 km from station\n📍 Near Railway Station, Amravati\n💰 Biryani starts at ₹150\n⭐ 4.6/5 (934 reviews)\n⏰ 11:00 AM - 11:30 PM\n\nBest seller: Chicken Dum Biryani (₹180)",
    suggestions: ["Get directions", "More restaurants near station", "Veg options"]
  },
  events: {
    response: "या आठवड्यातील अमरावतीमधील कार्यक्रम:\n\n💻 **Amravati Tech Hackathon 2026**\n📅 April 12 | SGBAU Campus | Free\n\n🩸 **Blood Donation Camp**\n📅 April 8 | Red Cross Society | Free\n\n🧘 **Yoga & Wellness Workshop**\n📅 April 14 | Ambapeth Garden | Free",
    suggestions: ["Show all events", "Cultural events", "Free events only"]
  },
  pmkisan: {
    response: "**PM-KISAN सन्मान निधी** माहिती:\n\n💰 दरवर्षी ₹6,000 थेट शेतकरी कुटुंबांना\n\n📋 **लागणारे कागदपत्रे:**\n• आधार कार्ड\n• 7/12 उतारा (जमिनीचे कागदपत्र)\n• बँक पासबुक\n\n🏛️ **कुठे अर्ज करावा:**\nTahsildar Office, Amravati किंवा जवळचे CSC Center\n\n⏱️ **कालावधी:** 30-45 दिवस",
    suggestions: ["Tahsildar Office directions", "List of CSC centers", "Check application status"]
  },
  default: {
    response: "मला तुमचा प्रश्न समजला! मी अमरावतीबद्दल माहिती शोधतो आहे... 🔍\n\nकृपया विशिष्ट विषय निवडा:\n• 🏥 हॉस्पिटल/क्लिनिक\n• 🍽️ रेस्टॉरंट/खाणावळ\n• 🏛️ सरकारी सेवा\n• 📅 कार्यक्रम/इव्हेंट्स\n• 📍 दिशा/नकाशा",
    suggestions: ["Nearest hospital", "Best restaurants", "Government schemes", "Events this week"]
  }
};

export const quickActions = [
  { id: 1, label: "Nearest Hospital", labelMarathi: "जवळचे हॉस्पिटल", icon: "🏥", query: "nearest hospital" },
  { id: 2, label: "Best Restaurants", labelMarathi: "सर्वोत्तम रेस्टॉरंट", icon: "🍽️", query: "best restaurants" },
  { id: 3, label: "ATM Near Me", labelMarathi: "जवळचे ATM", icon: "🏧", query: "ATM near me" },
  { id: 4, label: "Gov. Schemes", labelMarathi: "सरकारी योजना", icon: "🏛️", query: "government schemes" },
  { id: 5, label: "Events Today", labelMarathi: "आजचे कार्यक्रम", icon: "📅", query: "events today" },
  { id: 6, label: "Emergency", labelMarathi: "आपत्कालीन", icon: "🚨", query: "emergency numbers" },
];
