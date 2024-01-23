import requests
import pandas as pd

# API endpoint
api_url = "https://api.example.com/data"

# Make a GET request to the API
response = requests.get(api_url)

# Check if the request was successful (status code 200)
if response.status_code == 200:
    # Parse the JSON response
    data = response.json()

    # Convert the data to a DataFrame using pandas
    df = pd.DataFrame(data)

    # Save the DataFrame to an Excel file
    df.to_excel("output.xlsx", index=False)
else:
    print(f"Error: {response.status_code} - {response.text}")
