import pandas as pd

# Assuming you have read the Excel file into a DataFrame
excel_file_path = 'path/to/your/excel/file.xlsx'
df = pd.read_excel(excel_file_path)

# Assuming your DataFrame looks something like this:
# | Product Category | Plant Name | Plant Country | Value |
# |------------------|------------|---------------|-------|
# | Category1        | PlantA      | CountryA      | 10    |
# | Category2        | PlantB      | CountryB      | 15    |
# | Category1        | PlantC      | CountryA      | 20    |

# Pivot the DataFrame
pivot_df = df.pivot_table(index=['Product Category', 'Plant Name'], columns='Plant Country', values='Value', aggfunc='sum', fill_value=0)

# Reset the index to make it a regular DataFrame
pivot_df.reset_index(inplace=True)

# Save the pivoted DataFrame to a new Excel file
output_excel_path = 'path/to/your/output/file.xlsx'
pivot_df.to_excel(output_excel_path, index=False)

///////////////////////////////////////////////////////////////////////////////////////

import pandas as pd

# Load the Excel file into a DataFrame
df = pd.read_excel('your_excel_file.xlsx')

# Create a new DataFrame with columns 'PlantName', 'ProductCategory', 'PlantCountry'
result_df = pd.DataFrame(columns=['PlantName', 'ProductCategory', 'PlantCountry'])

# Populate the new DataFrame with values from the original DataFrame
result_df['PlantName'] = df['PlantName']
result_df['ProductCategory'] = df['ProductCategory']
result_df['PlantCountry'] = df['PlantCountry']

# Save the result DataFrame to a new Excel file
result_df.to_excel('result_excel_file.xlsx', index=False)

