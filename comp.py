import requests
import pandas as pd

# 1. Make API Requests
api_url = 'https://api.complink.com/data'
response = requests.get(api_url)

# 2. Check if the request was successful
if response.status_code == 200:
    # 3. Parse and Process Data
    api_data = response.json()

    # Assuming 'data' key contains the relevant information
    relevant_data = api_data.get('data', [])

    # 4. Convert data to DataFrame
    df = pd.DataFrame(relevant_data)

    # 5. Export to Excel
    df.to_excel('complink_data.xlsx', index=False)
    print("Data exported to Excel successfully.")
else:
    print(f"Error: {response.status_code}")
    print(response.text)
