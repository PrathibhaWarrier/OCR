import pandas as pd

# Your API response data
api_response = {
    "gettable": [
        {"_type": "something", "PartNumber": "4234", "InnerDiameter": 50, "OuterDiameter": 50, "TubeType": 34},
        {"_type": "something", "PartNumber": "4235", "InnerDiameter": 50, "OuterDiameter": 50, "TubeType": 34},
        {"_type": "something", "PartNumber": "4236", "InnerDiameter": 50, "OuterDiameter": 50, "TubeType": 34},
        {"_type": "something", "PartNumber": "4237", "InnerDiameter": 50, "OuterDiameter": 50, "TubeType": 34},
        {"_type": "something", "PartNumber": "4238", "InnerDiameter": 50, "OuterDiameter": 50, "TubeType": 34},
    ]
}

# Specify the PartNumber you're interested in
target_part_number = "4236"

# Filter the data based on the specified PartNumber
filtered_data = [item for item in api_response["gettable"] if item["PartNumber"] == target_part_number]

# Create a DataFrame from the filtered data
df = pd.DataFrame(filtered_data, columns=["TubeType", "TubeDesign", "InnerDiameter", "OuterDiameter"])

# Save the DataFrame to an Excel file
df.to_excel(f"output_{target_part_number}.xlsx", index=False)
