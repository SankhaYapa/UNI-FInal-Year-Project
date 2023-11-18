import sys
import pandas as pd
import json

def recommend_jobs(user_career_path, all_jobs):
    # Convert the JSON string to a Python list of dictionaries
    jobs_data = json.loads(all_jobs)

    # Convert the list of dictionaries to a DataFrame
    jobs_df = pd.DataFrame(jobs_data)

    # Filter jobs based on the user's career path
    relevant_jobs = jobs_df[jobs_df['Career Path'] == user_career_path]

    # Extract relevant information (you can customize this based on your schema)
    recommended_jobs = relevant_jobs[['Job Title', 'Company', 'Description']].to_dict(orient='records')

    return recommended_jobs

# Example usage
if __name__ == "__main__":
    # Read user career path from command-line arguments
    user_career_path = sys.argv[1]

    # Read all jobs data from standard input (pipe the JSON string)
    all_jobs_data = sys.stdin.read()

    # Call the function to recommend jobs
    recommended_jobs = recommend_jobs(user_career_path, all_jobs_data)

    # Convert recommendations to JSON and print it
    print(json.dumps(recommended_jobs))
