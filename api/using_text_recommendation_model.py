
# import sys
# import spacy
# import pandas as pd
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import json  # for JSON output

# # Load NLP models
# nlp = spacy.load("en_core_web_sm")

# def extract_skills(text):
#     doc = nlp(text)
#     skills_list = pd.read_csv('skills.csv')['Skill'].tolist()
#     skills = []
#     for token in doc:
#         if token.text.lower() in skills_list:
#             skills.append(token.text.lower())
#     return skills

# def recommend_career_path(user_skills, career_paths_df):
#     tfidf_vectorizer = TfidfVectorizer()
#     user_skills_vector = tfidf_vectorizer.fit_transform([user_skills])
#     career_paths_vector = tfidf_vectorizer.transform(career_paths_df['Skills'])
#     similarities = cosine_similarity(user_skills_vector, career_paths_vector)
#     recommended_path_index = similarities.argmax()
#     recommended_path = career_paths_df['Career Path'][recommended_path_index]
#     return recommended_path

# def recommend_courses(user_skills, courses_df, course_descriptions_vector):
#     user_skills_vector = tfidf_vectorizer.transform([user_skills])
#     similarities = cosine_similarity(user_skills_vector, course_descriptions_vector)
#     num_recommendations = 10
#     recommended_course_indices = similarities.argsort()[0][-num_recommendations:][::-1]
#     recommended_courses = courses_df.iloc[recommended_course_indices]
#     return recommended_courses

# # Function to read text from a file
# def read_text_from_file(file_path):
#     with open(file_path, 'r', encoding='utf-8') as file:
#         return file.read()

# # Get the input file path from the command-line argument
# text_file_path = sys.argv[1]

# # Read the text content from the input file
# user_input_text = read_text_from_file(text_file_path)

# # Process user input
# user_skills_text = extract_skills(user_input_text)

# # Combine skills from text input
# combined_skills_str = " ".join(user_skills_text)

# # Sample list of career paths and their required skills
# career_paths_df = pd.read_csv('career_paths.csv')

# # Recommend a career path based on combined skills
# recommended_path = recommend_career_path(combined_skills_str, career_paths_df)

# # Load the course dataset
# courses_df = pd.read_csv('Coursera.csv')
# courses_df['Course Description'] = courses_df['Course Description'].fillna('')
# courses_df['Course Description'] = courses_df['Course Description'].apply(lambda x: x.lower())

# # Create a TF-IDF vectorizer for course descriptions
# tfidf_vectorizer = TfidfVectorizer(stop_words='english')
# course_descriptions_vector = tfidf_vectorizer.fit_transform(courses_df['Course Description'])

# # Recommend courses based on user skills
# recommended_courses = recommend_courses(combined_skills_str, courses_df, course_descriptions_vector)

# # Create a dictionary with the recommendations
# recommendations = {
#     "career_path": recommended_path,
#     "courses": recommended_courses.to_dict(orient="records")
# }

# # Convert recommendations to JSON and print it
# print(json.dumps(recommendations))
###########################################################################
# import sys
# import json
# import pandas as pd
# import spacy
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity

# # Load NLP model
# nlp = spacy.load("en_core_web_sm")

# def extract_skills(text):
#     doc = nlp(text)
#     return [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]

# def preprocess_text(text):
#     # Tokenize, remove stopwords, and perform stemming
#     doc = nlp(text)
#     words = [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]
#     return ' '.join(words)

# def read_json_from_file(file_path):
#     with open(file_path, 'r', encoding='utf-8') as file:
#         return json.load(file)

# def recommend_career_path(job_description_json, career_paths_df):
#     # Extract job description from JSON input
#     job_description = job_description_json.get('description', '')

#     # Preprocess job description
#     preprocessed_job_description = preprocess_text(job_description)

#     # Preprocess career path descriptions
#     preprocessed_career_paths = [preprocess_text(desc) for desc in career_paths_df['Description']]

#     # Create TF-IDF vectors
#     vectorizer = TfidfVectorizer()
#     vectors = vectorizer.fit_transform([preprocessed_job_description] + preprocessed_career_paths)

#     # Calculate cosine similarity between job description and career paths
#     similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

#     if not similarity_scores.any():
#         return {"recommended_career_path": "No matching career paths found."}

#     # Find the index of the most similar career path
#     max_similarity_index = similarity_scores.argmax()

#     # Access the recommended career path from the DataFrame
#     recommended_path = career_paths_df['Career Path'][max_similarity_index]

#     return {"recommended_career_path": recommended_path}

# if __name__ == "__main__":
#     # Extract file path from command-line argument
#     text_file_path = sys.argv[1]

#     # Read the JSON content from the input file
#     job_description_json = read_json_from_file(text_file_path)

#     # Sample list of career paths and their descriptions
#     career_paths_df = pd.read_csv('career_paths.csv')

#     # Get recommended career path for the job description
#     recommended_career_path = recommend_career_path(job_description_json, career_paths_df)

#     # Print the recommended career path
#     print(json.dumps(recommended_career_path))
import sys
import json
import pandas as pd
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Load NLP model
nlp = spacy.load("en_core_web_sm")

def extract_skills(text):
    doc = nlp(text)
    return [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]

def preprocess_text(text):
    # Tokenize, remove stopwords, and perform stemming
    doc = nlp(text)
    words = [token.lemma_.lower() for token in doc if token.is_alpha and not token.is_stop]
    return ' '.join(words)

def read_json_from_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as file:
        return json.load(file)

def recommend_career_path(job_description_json, career_paths_df):
    # Extract job description from JSON input
    job_description = job_description_json.get('description', '')

    # Preprocess job description
    preprocessed_job_description = preprocess_text(job_description)

    # Preprocess career path descriptions
    preprocessed_career_paths = [preprocess_text(desc) for desc in career_paths_df['Description']]

    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([preprocessed_job_description] + preprocessed_career_paths)

    # Calculate cosine similarity between job description and career paths
    similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    if not similarity_scores.any():
        return {"recommended_career_path": "No matching career paths found."}

    # Find the index of the most similar career path
    max_similarity_index = similarity_scores.argmax()

    # Access the recommended career path from the DataFrame
    recommended_path = career_paths_df['Career Path'][max_similarity_index]

    return {"recommended_career_path": recommended_path}

def recommend_courses(user_skills, courses_df, course_descriptions_vector):
    user_skills_vector = tfidf_vectorizer.transform([user_skills])
    similarities = cosine_similarity(user_skills_vector, course_descriptions_vector)
    num_recommendations = 5  # Adjust as needed
    recommended_course_indices = similarities.argsort()[0][-num_recommendations:][::-1]
    recommended_courses = courses_df.iloc[recommended_course_indices]
    return recommended_courses

if __name__ == "__main__":
    # Extract file path from command-line argument
    text_file_path = sys.argv[1]

    # Read the JSON content from the input file
    job_description_json = read_json_from_file(text_file_path)

    # Sample list of career paths and their descriptions
    career_paths_df = pd.read_csv('career_paths.csv')

    # Get recommended career path for the job description
    recommended_career_path = recommend_career_path(job_description_json, career_paths_df)

    # Sample list of courses and their descriptions
    courses_df = pd.read_csv('Coursera.csv')
    courses_df['Course Description'] = courses_df['Course Description'].fillna('')
    courses_df['Course Description'] = courses_df['Course Description'].apply(lambda x: x.lower())

    # Create a TF-IDF vectorizer for course descriptions
    tfidf_vectorizer = TfidfVectorizer(stop_words='english')
    course_descriptions_vector = tfidf_vectorizer.fit_transform(courses_df['Course Description'])

    # Recommend courses based on user skills
    recommended_courses = recommend_courses(recommended_career_path["recommended_career_path"], courses_df, course_descriptions_vector)

    # Print the recommended career path and courses
    recommendations = {
        "recommended_career_path": recommended_career_path["recommended_career_path"],
        "recommended_courses": recommended_courses.to_dict(orient="records")
    }

    print(json.dumps(recommendations))
