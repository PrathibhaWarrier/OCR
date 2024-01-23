import requests
from requests_ntlm import HttpNtlmAuth
import pandas as pd

def get_tube_info(part_number, auth):
    # Replace 'your_api_endpoint' with the actual endpoint of your API
    api_url = f'https://your_api_endpoint/{part_number}'
    
    try:
        response = requests.get(api_url, auth=auth)
        data = response.json()  # Assuming the API returns JSON data
        return data
    except Exception as e:
        print(f"Error fetching data from API: {e}")
        return None

def extract_tube_info_to_excel(part_numbers, auth):
    headers = ['PartNumber', 'TubeType', 'TubeDesign', 'InnerDiameter', 'OuterDiameter']
    data_rows = []

    for part_number in part_numbers:
        tube_info = get_tube_info(part_number, auth)

        if tube_info:
            data_row = [part_number, tube_info.get('TubeType', ''),
                        tube_info.get('TubeDesign', ''),
                        tube_info.get('InnerDiameter', ''),
                        tube_info.get('OuterDiameter', '')]
            data_rows.append(data_row)

    df = pd.DataFrame(data_rows, columns=headers)
    df.to_excel('tube_info.xlsx', index=False)

if __name__ == "__main__":
    # Replace 'your_part_numbers' with the actual part numbers you want to query
    part_numbers = ['part_number_1', 'part_number_2', 'part_number_3']

    # Replace 'your_api_username' and 'your_api_password' with your Windows credentials
    api_username = 'your_api_username'
    api_password = 'your_api_password'
    auth = HttpNtlmAuth(api_username, api_password)
    
    extract_tube_info_to_excel(part_numbers, auth)
