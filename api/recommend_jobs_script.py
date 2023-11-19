# import sys
# import json
# import pandas as pd
# from nltk.tokenize import word_tokenize
# from nltk.corpus import stopwords
# from nltk.stem import PorterStemmer
# from sklearn.feature_extraction.text import TfidfVectorizer
# from sklearn.metrics.pairwise import cosine_similarity
# import nltk

# # Download the "stopwords" and "punkt" resources
# nltk.download('stopwords')
# nltk.download('punkt')

# def preprocess_text(text):
#     # Tokenize, remove stopwords, and perform stemming
#     ps = PorterStemmer()
#     stop_words = set(stopwords.words('english'))
#     words = [ps.stem(word.lower()) for word in word_tokenize(text) if word.isalnum() and word.lower() not in stop_words]
#     return ' '.join(words)

# def recommend_career_path(job_description_json):
#     # Load career path data from CSV
#     career_data = pd.read_csv('career_paths.csv')

#     # Extract job description from JSON input
#     job_description = json.loads(job_description_json)['jobdescription']

#     # Preprocess job description
#     preprocessed_job_description = preprocess_text(job_description)

#     # Preprocess career path descriptions
#     preprocessed_career_paths = [preprocess_text(desc) for desc in career_data['Description']]

#     # Create TF-IDF vectors
#     vectorizer = TfidfVectorizer()
#     vectors = vectorizer.fit_transform([preprocessed_job_description] + preprocessed_career_paths)

#     # Calculate cosine similarity between job description and career paths
#     similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

#     if not similarity_scores.any():
#         return {"message": "No matching career paths found."}

#     # Find the index of the most similar career path
#     max_similarity_index = similarity_scores.argmax()

#     # Access the recommended career path from the DataFrame
#     recommended_path = career_data['Career Path'][max_similarity_index]

#     return {"recommended_career_path": recommended_path}

# if __name__ == "__main__":
#     # Extract job description from command-line argument
#     job_description_json = sys.argv[1]

#     # Get recommended career path for the job description
#     recommended_career_path = recommend_career_path(job_description_json)

#     # Print the recommended career path
#     print(json.dumps(recommended_career_path))
import sys
import json
import pandas as pd
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import nltk

# Download the "stopwords" and "punkt" resources
nltk.download('stopwords')
nltk.download('punkt')

def preprocess_text(text):
    # Tokenize, remove stopwords, and perform stemming
    ps = PorterStemmer()
    stop_words = set(stopwords.words('english'))
    words = [ps.stem(word.lower()) for word in word_tokenize(text) if word.isalnum() and word.lower() not in stop_words]
    return ' '.join(words)

def recommend_career_path(job_description_json):
    # Load career path data from CSV
    career_data = pd.read_csv('career_paths.csv')

    # Extract job description and job ID from JSON input
    json_data = json.loads(job_description_json)
    job_description = json_data['jobDescription']
    job_id = json_data['jobId']

    # Preprocess job description
    preprocessed_job_description = preprocess_text(job_description)

    # Preprocess career path descriptions
    preprocessed_career_paths = [preprocess_text(desc) for desc in career_data['Description']]

    # Create TF-IDF vectors
    vectorizer = TfidfVectorizer()
    vectors = vectorizer.fit_transform([preprocessed_job_description] + preprocessed_career_paths)

    # Calculate cosine similarity between job description and career paths
    similarity_scores = cosine_similarity(vectors[0:1], vectors[1:]).flatten()

    if not similarity_scores.any():
        return {"jobId": job_id, "recommended_career_path": "No matching career paths found."}

    # Find the index of the most similar career path
    max_similarity_index = similarity_scores.argmax()

    # Access the recommended career path from the DataFrame
    recommended_path = career_data['Career Path'][max_similarity_index]

    return {"jobId": job_id, "recommended_career_path": recommended_path}

if __name__ == "__main__":
    # Extract job description and job ID from command-line argument
    job_description_json = sys.argv[1]

    # Get recommended career path for the job description
    recommended_career_path = recommend_career_path(job_description_json)

    # Print the recommended career path with the job ID
    print(json.dumps(recommended_career_path))
