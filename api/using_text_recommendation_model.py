# import sys
# import spacy
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import PyPDF2  # for PDF parsing
# import json  # for JSON output

# # Load NLP models
# nlp = spacy.load("en_core_web_sm")

# # Function to extract skills from a text
# def extract_skills(text):
#     # Use NLP to process the text
#     doc = nlp(text)

#     # Define a list of skills to extract (customize this as needed)
#     skills_list = pd.read_csv('skills.csv')['Skill'].tolist()

#     # Extract skills
#     skills = []
#     for token in doc:
#         if token.text.lower() in skills_list:
#             skills.append(token.text.lower())

#     return skills

# # Function to recommend career paths based on skills
# def recommend_career_path(user_skills, career_paths_df):
#     # Create a TF-IDF vectorizer
#     tfidf_vectorizer = TfidfVectorizer()

#     # Vectorize user skills and career path skills
#     user_skills_vector = tfidf_vectorizer.fit_transform([user_skills])
#     career_paths_vector = tfidf_vectorizer.transform(career_paths_df['Skills'])

#     # Calculate cosine similarities between user skills and career paths
#     similarities = cosine_similarity(user_skills_vector, career_paths_vector)

#     # Find the index of the most similar career path
#     recommended_path_index = similarities.argmax()

#     # Access the recommended career path from the DataFrame
#     recommended_path = career_paths_df['Career Path'][recommended_path_index]

#     return recommended_path

# # Function to recommend courses based on skills
# def recommend_courses(user_skills, courses_df, course_descriptions_vector):
#     # Vectorize user skills
#     user_skills_vector = tfidf_vectorizer.transform([user_skills])

#     # Calculate cosine similarities between user skills and course descriptions
#     similarities = cosine_similarity(
#         user_skills_vector, course_descriptions_vector)

#     # Find the indices of the top N recommended courses (customize N)
#     num_recommendations = 10  # You can change this number
#     recommended_course_indices = similarities.argsort()[
#         0][-num_recommendations:][::-1]

#     # Access the recommended courses from the DataFrame
#     recommended_courses = courses_df.iloc[recommended_course_indices]

#     return recommended_courses

# # Sample user input (text description)
# user_input_text = "Your Full Name\nYour Address\nYour City, State, ZIP Code\nYour Email Address\nYour Phone Number\nLinkedIn Profile - optional\nGitHub Profile - optional\n\nSummary Dedicated and detail-oriented software engineer with [X years] of experience in full-stack development. Proficient in designing, implementing, testing, and maintaining software applications. Adept at collaborating with cross-functional teams to deliver high-quality solutions on time. Excels in problem-solving and continuously seeks to stay updated with the latest technologies and best practices."

# # Sample list of career paths and their required skills
# career_paths_df = pd.read_csv('career_paths.csv')

# # Sample list of courses and their descriptions
# courses_df = pd.read_csv('Coursera.csv')

# # Extract user skills from text description
# user_skills_text = extract_skills(user_input_text)

# # Combine the list of skills into a single string
# combined_skills_str = " ".join(user_skills_text)

# # Recommend a career path based on combined skills
# recommended_path = recommend_career_path(combined_skills_str, career_paths_df)

# # Print the recommended career path
# print(f"Recommended Career Path: {recommended_path}")

# # Create a TF-IDF vectorizer for course descriptions
# tfidf_vectorizer = TfidfVectorizer(
#     stop_words='english')  # You can customize stop words
# course_descriptions_vector = tfidf_vectorizer.fit_transform(
#     courses_df['Course Description'])

# # Recommend courses based on user skills
# recommended_courses = recommend_courses(
#     combined_skills_str, courses_df, course_descriptions_vector)

# # Print the recommended courses
# print("\nRecommended Courses:")
# # Print the recommended courses with error handling for Unicode characters
# for index, row in recommended_courses.iterrows():
#     print(f"Course Name: {row['Course Name']}")
#     print(f"University: {row['University']}")
#     print(f"Difficulty Level: {row['Difficulty Level']}")
#     print(f"Course Rating: {row['Course Rating']}")
#     print(f"Course URL: {row['Course URL']}")
#     try:
#         print(f"Course Description: {row['Course Description']}")
#     except UnicodeEncodeError:
#         print("Course Description: [UnicodeEncodeError - Cannot Display]")
#     print()
# process_file.py
# process_file.py
import sys
import spacy
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import json  # for JSON output

# Load NLP models
nlp = spacy.load("en_core_web_sm")

def extract_skills(text):
    doc = nlp(text)
    skills_list = pd.read_csv('skills.csv')['Skill'].tolist()
    skills = []
    for token in doc:
        if token.text.lower() in skills_list:
            skills.append(token.text.lower())
    return skills

def recommend_career_path(user_skills, career_paths_df):
    tfidf_vectorizer = TfidfVectorizer()
    user_skills_vector = tfidf_vectorizer.fit_transform([user_skills])
    career_paths_vector = tfidf_vectorizer.transform(career_paths_df['Skills'])
    similarities = cosine_similarity(user_skills_vector, career_paths_vector)
    recommended_path_index = similarities.argmax()
    recommended_path = career_paths_df['Career Path'][recommended_path_index]
    return recommended_path

def recommend_courses(user_skills, courses_df, course_descriptions_vector):
    user_skills_vector = tfidf_vectorizer.transform([user_skills])
    similarities = cosine_similarity(user_skills_vector, course_descriptions_vector)
    num_recommendations = 10
    recommended_course_indices = similarities.argsort()[0][-num_recommendations:][::-1]
    recommended_courses = courses_df.iloc[recommended_course_indices]
    return recommended_courses

# Function to read text from a file
def read_text_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return file.read()

# Get the input file path from the command-line argument
text_file_path = sys.argv[1]

# Read the text content from the input file
user_input_text = read_text_from_file(text_file_path)

# Process user input
user_skills_text = extract_skills(user_input_text)

# Combine skills from text input
combined_skills_str = " ".join(user_skills_text)

# Sample list of career paths and their required skills
career_paths_df = pd.read_csv('career_paths.csv')

# Recommend a career path based on combined skills
recommended_path = recommend_career_path(combined_skills_str, career_paths_df)

# Load the course dataset
courses_df = pd.read_csv('Coursera.csv')
courses_df['Course Description'] = courses_df['Course Description'].fillna('')
courses_df['Course Description'] = courses_df['Course Description'].apply(lambda x: x.lower())

# Create a TF-IDF vectorizer for course descriptions
tfidf_vectorizer = TfidfVectorizer(stop_words='english')
course_descriptions_vector = tfidf_vectorizer.fit_transform(courses_df['Course Description'])

# Recommend courses based on user skills
recommended_courses = recommend_courses(combined_skills_str, courses_df, course_descriptions_vector)

# Create a dictionary with the recommendations
recommendations = {
    "career_path": recommended_path,
    "courses": recommended_courses.to_dict(orient="records")
}

# Convert recommendations to JSON and print it
print(json.dumps(recommendations))
