import nltk
import spacy
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import PyPDF2  # for PDF parsing

# Load NLP models
nlp = spacy.load("en_core_web_sm")
# Function to extract skills from a text


def extract_skills(text):
    # Use NLP to process the text
    doc = nlp(text)

    # Define a list of skills to extract (customize this as needed)
    # skills_list = [
    #     "java", "python", "spring boot", "data analysis", "machine learning", "database management", "problem solving",
    #     "html", "css", "javascript", "networking", "cisco", "tcp/ip", "docker", "kubernetes", "ci/cd",
    #     "user experience design", "ui prototyping", "cloud computing", "aws", "azure", "react", "vue.js",
    #     "node.js", "ruby on rails", "android", "ios", "swift", "kotlin", "excel", "sql", "business analysis",
    #     "requirements gathering", "cybersecurity", "firewall management", "project management", "agile", "scrum",
    #     "system administration", "testing", "test automation", "documentation", "technical writing", "adobe photoshop",
    #     "illustrator", "financial analysis", "marketing strategy", "digital marketing", "product management",
    #     "content creation", "copywriting", "sales strategy", "crm", "hr management", "recruitment", "customer service",
    #     "communication", "artificial intelligence", "deep learning", "game development", "unity", "unreal engine",
    #     "architectural design", "autoCAD", "civil engineering", "structural analysis", "electrical engineering",
    #     "circuit design", "mechanical engineering", "cad", "chemical engineering", "process design", "environmental science",
    #     "ecology", "pharmacy", "medication dispensing", "nursing", "patient care", "medicine", "patient diagnosis",
    #     "dentistry", "oral health care", "veterinary medicine", "animal care", "physical therapy", "rehabilitation",
    #     "occupational therapy", "psychology", "counseling", "law", "legal research", "courtroom proceedings",
    #     "law enforcement", "crime prevention", "firefighting", "emergency response", "paramedicine", "emergency medical care",
    #     "culinary arts", "cooking techniques", "baking", "pastry making", "customer service", "food service", "mixology",
    #     "cocktail preparation", "hotel management", "hospitality", "event planning", "coordination", "travel planning",
    #     "reservations", "guided tours", "historical knowledge", "library science", "cataloging", "museum curation",
    #     "artifact preservation", "art history", "high school education", "college education", "elementary education",
    #     "pedagogy", "counseling", "educational leadership", "special education", "individualized instruction",
    #     "speech therapy", "language disorders", "music education", "instrument instruction", "translation", "language proficiency",
    #     "interpretation", "language fluency", "airline safety", "aviation", "flight operations", "astronomy",
    #     "celestial observation", "meteorology", "weather forecasting", "geology", "earth sciences", "biology",
    #     "laboratory research", "ecology", "environmental conservation", "marine biology", "oceanography", "zoology",
    #     "animal research", "botany", "plant biology", "mathematics", "mathematical modeling", "statistics",
    #     "data analysis", "economics", "economic analysis", "political science", "policy analysis", "sociology",
    #     "social research", "history", "historical research", "psychiatry", "mental health treatment", "neurosurgery",
    #     "surgical procedures", "cardiology", "heart health", "oncology", "cancer treatment", "radiology", "medical imaging",
    #     "dermatology", "skin care", "pathology", "disease diagnosis", "anesthesiology", "anesthesia administration",
    #     "phlebotomy", "blood drawing", "mri technology", "imaging", "veterinary technology", "animal care",
    #     "dental hygiene", "oral health", "physical therapy assistance", "medical lab technology", "testing",
    #     "radiation therapy", "cancer treatment", "pharmacy assistance", "medication dispensing", "paramedicine",
    #     "emergency medical care"
    # ]
    skills_list = pd.read_csv('skills.csv')['Skill'].tolist()
    # Extract skills
    skills = []
    for token in doc:
        if token.text.lower() in skills_list:
            skills.append(token.text.lower())

    return skills
# Function to extract text from a PDF file


def extract_text_from_pdf(pdf_file_path):
    text = ""
    with open(pdf_file_path, "rb") as pdf_file:
        pdf_reader = PyPDF2.PdfReader(pdf_file)
        for page_num in range(len(pdf_reader.pages)):
            page = pdf_reader.pages[page_num]
            text += page.extract_text()
    return text
# Function to recommend career paths based on skills


def recommend_career_path(user_skills, career_paths_df):
    # Create a TF-IDF vectorizer
    tfidf_vectorizer = TfidfVectorizer()

    # Vectorize user skills and career path skills
    user_skills_vector = tfidf_vectorizer.fit_transform([user_skills])
    career_paths_vector = tfidf_vectorizer.transform(career_paths_df['Skills'])

    # Calculate cosine similarities between user skills and career paths
    similarities = cosine_similarity(user_skills_vector, career_paths_vector)

    # Find the index of the most similar career path
    recommended_path_index = similarities.argmax()

    # Access the recommended career path from the DataFrame
    recommended_path = career_paths_df['Career Path'][recommended_path_index]

    return recommended_path


# Sample user input (text description)
user_input_text = ""


# Sample user input (PDF file)
pdf_file_path = "content/Civil.pdf"
# Read skills from an external CSV file
skills_df = pd.read_csv('skills.csv')
# Sample list of career paths and their required skills
career_paths_df = pd.read_csv('career_paths.csv')
# career_paths = [
#     "Software Engineer: backend development skills: Java, Spring Boot",
#     "Data Scientist: skills: Python, data analysis",
#     "Web Developer: skills: HTML, CSS, JavaScript",
#     "Network Engineer: skills: Networking, Cisco, TCP/IP",
#     "Machine Learning Engineer: skills: Python, machine learning, deep learning",
#     "Database Administrator: skills: SQL, database management",
#     "DevOps Engineer: skills: Docker, Kubernetes, CI/CD",
#     "UX/UI Designer: skills: User experience design, UI prototyping",
#     "Cloud Solutions Architect: skills: Cloud computing, AWS, Azure",
#     "Front-end Developer: skills: JavaScript, React, Vue.js",
#     "Back-end Developer: skills: Node.js, Python, Ruby on Rails",
#     "Mobile App Developer: skills: Android, iOS, Swift, Kotlin",
#     "Data Analyst: skills: Data analysis, Excel, SQL",
#     "Business Analyst: skills: Business analysis, requirements gathering",
#     "Network Security Analyst: skills: Cybersecurity, firewall management",
#     "IT Project Manager: skills: Project management, Agile, Scrum",
#     "Systems Administrator: skills: Windows, Linux, system administration",
#     "Quality Assurance Engineer: skills: Testing, test automation",
#     "Technical Writer: skills: Documentation, technical writing",
#     "Graphic Designer: skills: Adobe Photoshop, Illustrator",
#     "Financial Analyst: skills: Financial analysis, Excel",
#     "Marketing Manager: skills: Marketing strategy, digital marketing",
#     "Product Manager: skills: Product management, product development",
#     "Content Writer: skills: Content creation, copywriting",
#     "Sales Manager: skills: Sales strategy, CRM",
#     "Human Resources Manager: skills: HR management, recruitment",
#     "Customer Support Specialist: skills: Customer service, communication",
#     "AI Engineer: skills: Artificial intelligence, machine learning",
#     "Game Developer: skills: Game development, Unity, Unreal Engine",
#     "Architect: skills: Architectural design, AutoCAD",
#     "Civil Engineer: skills: Civil engineering, structural analysis",
#     "Electrical Engineer: skills: Electrical engineering, circuit design",
#     "Mechanical Engineer: skills: Mechanical engineering, CAD",
#     "Chemical Engineer: skills: Chemical engineering, process design",
#     "Environmental Scientist: skills: Environmental science, ecology",
#     "Pharmacist: skills: Pharmacy, medication dispensing",
#     "Nurse Practitioner: skills: Nursing, patient care",
#     "Physician: skills: Medicine, patient diagnosis",
#     "Dentist: skills: Dentistry, oral health care",
#     "Veterinarian: skills: Veterinary medicine, animal care",
#     "Physical Therapist: skills: Physical therapy, rehabilitation",
#     "Occupational Therapist: skills: Occupational therapy, patient treatment",
#     "Psychologist: skills: Psychology, counseling",
#     "Lawyer: skills: Law, legal research",
#     "Judge: skills: Legal judgment, courtroom proceedings",
#     "Police Officer: skills: Law enforcement, crime prevention",
#     "Firefighter: skills: Firefighting, emergency response",
#     "Paramedic: skills: Paramedicine, emergency medical care",
#     "Chef: skills: Culinary arts, cooking techniques",
#     "Sous Chef: skills: Culinary skills, kitchen management",
#     "Baker: skills: Baking, pastry making",
#     "Waiter/Waitress: skills: Customer service, food service",
#     "Bartender: skills: Mixology, cocktail preparation",
#     "Hotel Manager: skills: Hotel management, hospitality",
#     "Event Planner: skills: Event planning, coordination",
#     "Travel Agent: skills: Travel planning, reservations",
#     "Tour Guide: skills: Guided tours, historical knowledge",
#     "Librarian: skills: Library science, cataloging",
#     "Museum Curator: skills: Museum curation, artifact preservation",
#     "Art Historian: skills: Art history, art analysis",
#     "High School Teacher: skills: Teaching, subject expertise",
#     "College Professor: skills: Higher education, research",
#     "Elementary School Teacher: skills: Elementary education, pedagogy",
#     "School Counselor: skills: Counseling, student support",
#     "Principal: skills: Educational leadership, administration",
#     "Special Education Teacher: skills: Special education, individualized instruction",
#     "Speech Therapist: skills: Speech therapy, language disorders",
#     "Music Teacher: skills: Music education, instrument instruction",
#     "Translator: skills: Translation, language proficiency",
#     "Interpreter: skills: Interpretation, language fluency",
#     "Flight Attendant: skills: Airline safety, customer service",
#     "Pilot: skills: Aviation, flight operations",
#     "Astronomer: skills: Astronomy, celestial observation",
#     "Meteorologist: skills: Meteorology, weather forecasting",
#     "Geologist: skills: Geology, earth sciences",
#     "Biologist: skills: Biology, laboratory research",
#     "Ecologist: skills: Ecology, environmental conservation",
#     "Marine Biologist: skills: Marine biology, oceanography",
#     "Zoologist: skills: Zoology, animal research",
#     "Botanist: skills: Botany, plant biology",
#     "Mathematician: skills: Mathematics, mathematical modeling",
#     "Statistician: skills: Statistics, data analysis",
#     "Economist: skills: Economics, economic analysis",
#     "Political Scientist: skills: Political science, policy analysis",
#     "Sociologist: skills: Sociology, social research",
#     "Historian: skills: History, historical research",
#     "Psychiatrist: skills: Psychiatry, mental health treatment",
#     "Neurosurgeon: skills: Neurosurgery, surgical procedures",
#     "Cardiologist: skills: Cardiology, heart health",
#     "Oncologist: skills: Oncology, cancer treatment",
#     "Radiologist: skills: Radiology, medical imaging",
#     "Dermatologist: skills: Dermatology, skin care",
#     "Pathologist: skills: Pathology, disease diagnosis",
#     "Anesthesiologist: skills: Anesthesiology, anesthesia administration",
#     "Phlebotomist: skills: Phlebotomy, blood drawing",
#     "MRI Technician: skills: MRI technology, imaging",
#     "Veterinary Technician: skills: Veterinary technology, animal care",
#     "Dental Hygienist: skills: Dental hygiene, oral health",
#     "Physical Therapy Assistant: skills: Physical therapy assistance",
#     "Medical Laboratory Technician: skills: Medical lab technology, testing",
#     "Radiation Therapist: skills: Radiation therapy, cancer treatment",
#     "Pharmacy Technician: skills: Pharmacy assistance, medication dispensing",
#     "Paramedic: skills: Paramedicine, emergency medical care",
#     "Emergency Medical Technician: skills: Emergency medical care",
# ]
# Extract user skills from text description
user_skills_text = extract_skills(user_input_text)

# Extract user skills from PDF
user_skills_pdf = extract_skills(extract_text_from_pdf(pdf_file_path))

# Combine skills from both inputs
combined_skills = user_skills_text + user_skills_pdf  # Combine lists

# Join the combined skills into a single string with spaces
combined_skills_str = " ".join(combined_skills)

# Recommend a career path based on combined skills
recommended_path = recommend_career_path(combined_skills_str, career_paths_df)

print(f"Recommended Career Path: {recommended_path}")
