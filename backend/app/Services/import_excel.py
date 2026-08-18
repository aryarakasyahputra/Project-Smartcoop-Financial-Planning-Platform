import sys
import json
import re
import openpyxl

# Row mapping for standard template sheet "02_Assumptions"
STANDARD_ROW_MAP = {
    5: "beginning_cooperatives",
    6: "new_coops_acquired",
    7: "monthly_churn_rate",
    8: "avg_members_per_coop",
    10: "subscription_paying_frac",
    11: "setup_fee",
    12: "paid_implementation_coops",
    13: "monthly_subscription_fee",
    14: "ios_addon_monthly_fee",
    15: "ios_adoption_frac",
    16: "white_label_projects",
    17: "white_label_fee_per_project",
    18: "ppob_active_coops_frac",
    19: "ppob_tx_per_coop_month",
    20: "avg_ppob_fee_per_tx",
    21: "academy_participants_frac",
    22: "academy_avg_price_per_participant",
    23: "offline_trainings_per_month",
    24: "offline_training_fee_per_coop",
    25: "enterprise_api_revenue",
    27: "cloud_cost_per_coop_month",
    28: "implementation_cost_per_coop",
    29: "support_cost_per_coop_month",
    30: "payment_api_var_cost_frac",
    31: "other_cost_of_revenue_frac",
    33: "hr_engineering_fte",
    34: "hr_sales_fte",
    35: "hr_marketing_fte",
    36: "hr_support_fte",
    37: "hr_finance_admin_fte",
    38: "hr_management_fte",
    39: "hr_avg_salary_monthly",
    41: "payroll_cost",
    42: "sales_marketing_spend",
    43: "office_utilities_internet",
    44: "software_tools_subscriptions",
    45: "legal_accounting_compliance",
    46: "travel_events",
    47: "recruitment_training",
    48: "other_ga",
    50: "seed_investment",
    51: "initial_opening_cash",
    52: "pre_money_valuation",
    53: "exit_revenue_multiple_conservative",
    54: "exit_revenue_multiple_base",
    55: "exit_revenue_multiple_optimistic",
}

# Key alias mapping for generic text detection in Column A
KEY_ALIASES = {
    "beginning_cooperatives": ["beginning_cooperatives", "koperasi awal", "beginning coops"],
    "new_coops_acquired": ["new_coops_acquired", "koperasi baru", "new coops"],
    "monthly_churn_rate": ["monthly_churn_rate", "churn rate", "tingkat churn"],
    "avg_members_per_coop": ["avg_members_per_coop", "anggota per koperasi", "avg members"],
    "setup_fee": ["setup_fee", "biaya setup", "setup fee"],
    "monthly_subscription_fee": ["monthly_subscription_fee", "biaya langganan", "subscription fee"],
    "payroll_cost": ["payroll_cost", "payroll", "gaji", "biaya gaji"],
    "sales_marketing_spend": ["sales_marketing_spend", "sales & marketing", "biaya pemasaran"],
    "seed_investment": ["seed_investment", "investasi seed", "seed investment"],
    "initial_opening_cash": ["initial_opening_cash", "kas awal", "opening cash"],
    "pre_money_valuation": ["pre_money_valuation", "valuasi pre-money", "pre-money"],
}

def clean_num(val):
    if val is None:
        return 0.0
    if isinstance(val, (int, float)):
        return float(val)
    if isinstance(val, str):
        # strip currency symbols, commas, percent
        cleaned = re.sub(r'[Rp$€,%\s]', '', val)
        try:
            return float(cleaned)
        except ValueError:
            return 0.0
    return 0.0

def parse_excel(excel_path):
    wb = openpyxl.load_workbook(excel_path, data_only=True)
    
    # 1. Select sheet: prefer '02_Assumptions', then 'Assumptions', else active sheet
    sheet = None
    target_sheet_names = ['02_Assumptions', 'Assumptions', 'asumsi']
    for name in wb.sheetnames:
        if any(t in name.lower() for t in target_sheet_names):
            sheet = wb[name]
            break
    if not sheet:
        sheet = wb.active

    # 2. Dynamically scan year columns
    # Look across rows 1 to 10 for year headers (e.g. 2025, 2026, 2027...)
    year_cols = {} # year -> col_idx
    for row in range(1, 15):
        for col in range(1, 30):
            val = sheet.cell(row=row, column=col).value
            if val is not None:
                val_str = str(val).strip()
                match = re.match(r'^(20\d{2})$', val_str)
                if match:
                    y = int(match.group(1))
                    if y not in year_cols:
                        year_cols[y] = col

    # Fallback to standard columns B..F (cols 2..6) if no explicit header found
    if not year_cols:
        default_years = [2025, 2026, 2027, 2028, 2029]
        for idx, y in enumerate(default_years, start=2):
            year_cols[y] = idx

    sorted_years = sorted(year_cols.keys())
    result_by_year = {y: {} for y in sorted_years}

    # 3. Mode A: Standard Template Sheet parsing (by row number)
    is_standard = '02_Assumptions' in sheet.title or sheet.cell(row=5, column=1).value is not None
    if is_standard:
        for row_idx, key in STANDARD_ROW_MAP.items():
            for y, col_idx in year_cols.items():
                raw_val = sheet.cell(row=row_idx, column=col_idx).value
                result_by_year[y][key] = clean_num(raw_val)

    # 4. Mode B: Generic Row Scanning for missing keys
    for row_idx in range(1, sheet.max_row + 1):
        label = str(sheet.cell(row=row_idx, column=1).value or '').strip().lower()
        if not label:
            continue
        for key, aliases in KEY_ALIASES.items():
            if any(alias in label for alias in aliases):
                for y, col_idx in year_cols.items():
                    if key not in result_by_year[y] or result_by_year[y][key] == 0:
                        raw_val = sheet.cell(row=row_idx, column=col_idx).value
                        result_by_year[y][key] = clean_num(raw_val)

    return {
        "success": True,
        "sheet_name": sheet.title,
        "years": sorted_years,
        "assumptions": result_by_year
    }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No file path provided"}))
        sys.exit(1)

    file_path = sys.argv[1]
    try:
        data = parse_excel(file_path)
        print(json.dumps(data))
    except Exception as e:
        print(json.dumps({"success": False, "error": str(e)}))
        sys.exit(1)
