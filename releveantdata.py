import pandas as pd
import requests

# Function to fetch API data
def fetch_api_data(api_url):
    response = requests.get(api_url)
    if response.status_code == 200:
        return response.json()
    else:
        print(f"Error fetching data from API. Status code: {response.status_code}")
        return None

# Function to save data to Excel
def save_to_excel(data, excel_path):
    df = pd.DataFrame(data)
    df.to_excel(excel_path, index=False)
    print(f"Data saved to {excel_path}")

# API URL
api_url = "https://example.com/api/data"

# Fetch data from API
api_data = fetch_api_data(api_url)

if api_data:
    # Check if 'partnumber' is present in the data
    if 'partnumber' in api_data[0]:
        # Extract 'partnumber' and other relevant data
        relevant_data = [{'partnumber': item['partnumber'], 'other_column_1': item['other_column_1'], 'other_column_2': item['other_column_2']} for item in api_data]

        # Save to Excel
        save_to_excel(relevant_data, "output_data.xlsx")
    else:
        print("No 'partnumber' field found in API data.")
else:
    print("No data fetched from API.")
