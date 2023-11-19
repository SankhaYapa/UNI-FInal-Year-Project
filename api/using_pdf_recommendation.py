import sys
import spacy
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import fitz  # PyMuPDF
import json

# Load NLP models
nlp = spacy.load("en_core_web_sm")

# Function to extract skills from a text
def extract_skills(text):
    doc = nlp(text)
    return [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]

# Function to extract text from a PDF file
def extract_text_from_pdf(pdf_file_path):
    text = ""
    with fitz.open(pdf_file_path) as pdf_document:
        for page_num in range(pdf_document.page_count):
            page = pdf_document[page_num]
            text += page.get_text()
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

# Function to recommend courses based on skills
def recommend_courses(user_skills, courses_df, course_descriptions_vector):
    # Vectorize user skills
    user_skills_vector = tfidf_vectorizer.transform([user_skills])

    # Calculate cosine similarities between user skills and course descriptions
    similarities = cosine_similarity(
        user_skills_vector, course_descriptions_vector)

    # Find the indices of the top N recommended courses (customize N)
    num_recommendations = 10  # You can change this number
    recommended_course_indices = similarities.argsort()[
        0][-num_recommendations:][::-1]

    # Access the recommended courses from the DataFrame
    recommended_courses = courses_df.iloc[recommended_course_indices]

    return recommended_courses

if __name__ == "__main__":
    # Sample user input (PDF file path as command-line argument)
    pdf_file_path = sys.argv[1]

    # Read skills from an external CSV file
    skills_df = pd.read_csv('skills.csv')

    # Sample list of career paths and their required skills
    career_paths_df = pd.read_csv('career_paths.csv')

    # Extract user skills from PDF
    user_skills_pdf = extract_skills(extract_text_from_pdf(pdf_file_path))

    # Join the combined skills into a single string with spaces
    combined_skills_str = " ".join(user_skills_pdf)

    # Recommend a career path based on combined skills
    recommended_path = recommend_career_path(combined_skills_str, career_paths_df)

    # Load the course dataset
    courses_df = pd.read_csv('Coursera.csv')

    # Preprocess course descriptions (you can customize this)
    courses_df['Course Description'] = courses_df['Course Description'].fillna(
        '')  # Fill NaN values with an empty string
    courses_df['Course Description'] = courses_df['Course Description'].apply(
        lambda x: x.lower())  # Convert to lowercase

    # Create a TF-IDF vectorizer for course descriptions
    tfidf_vectorizer = TfidfVectorizer(
        stop_words='english')  # You can customize stop words
    course_descriptions_vector = tfidf_vectorizer.fit_transform(
        courses_df['Course Description'])

    # Recommend courses based on user skills
    recommended_courses = recommend_courses(
        combined_skills_str, courses_df, course_descriptions_vector)

    # Create a dictionary with the recommendations
    recommendations = {
        "career_path": recommended_path,
        # Convert DataFrame to a list of dictionaries
        "courses": recommended_courses.to_dict(orient="records")
    }

    # Convert recommendations to JSON and print it
    print(json.dumps(recommendations))
