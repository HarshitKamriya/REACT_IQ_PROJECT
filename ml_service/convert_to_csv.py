import pandas as pd
import os

BASE_DIR = os.path.dirname(__file__)
DATA_DIR = os.path.join(BASE_DIR, "data")
XLSX_PATH = os.path.join(DATA_DIR, "oleochemical_arrhenius_20000_dataset.xlsx")

def convert_xlsx_to_csvs():
    print(f"Reading {XLSX_PATH}...")
    xl = pd.ExcelFile(XLSX_PATH)
    
    for sheet_name in xl.sheet_names:
        print(f"Converting sheet: {sheet_name}")
        df = pd.read_excel(xl, sheet_name=sheet_name)
        # Create a safe filename from the sheet name
        safe_name = sheet_name.replace(" ", "_").replace("+", "plus").replace("(", "").replace(")", "").lower()
        csv_path = os.path.join(DATA_DIR, f"{safe_name}.csv")
        df.to_csv(csv_path, index=False)
        print(f"Saved {csv_path}")

if __name__ == "__main__":
    convert_xlsx_to_csvs()
    print("All sheets converted to CSV successfully.")
