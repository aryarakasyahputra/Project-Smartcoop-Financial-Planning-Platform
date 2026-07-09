import re

def update_empty_states():
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "r") as f:
        content = f.read()

    state_pattern = r"const \[assumptionsByYear, setAssumptionsByYear\] = useState\(\{[\s\S]*?^\s*\}\);"

    empty_state = """const emptyYearState = {
    new_coops_acquired: "", monthly_churn_rate: "", avg_members_per_coop: "", 
    subscription_paying_frac: "", setup_fee: "", paid_implementation_coops: "", 
    monthly_subscription_fee: "", ios_addon_monthly_fee: "", ios_adoption_frac: "", 
    white_label_projects: "", white_label_fee_per_project: "", ppob_active_coops_frac: "", 
    ppob_tx_per_coop_month: "", avg_ppob_fee_per_tx: "", academy_participants_frac: "", 
    academy_avg_price_per_participant: "", offline_trainings_per_month: "", 
    offline_training_fee_per_coop: "", enterprise_api_revenue: "", cloud_cost_per_coop_month: "", 
    implementation_cost_per_coop: "", support_cost_per_coop_month: "", payment_api_var_cost_frac: "", 
    other_cost_of_revenue_frac: "", payroll_cost: "", sales_marketing_spend: "", 
    office_utilities_internet: "", software_tools_subscriptions: "", legal_accounting_compliance: "", 
    travel_events: "", recruitment_training: "", other_ga: "", seed_investment: "", 
    pre_money_valuation: "", exit_revenue_multiple_conservative: "", exit_revenue_multiple_base: "", 
    exit_revenue_multiple_optimistic: ""
  };

  const [assumptionsByYear, setAssumptionsByYear] = useState({
    2025: { ...emptyYearState },
    2026: { ...emptyYearState },
    2027: { ...emptyYearState },
    2028: { ...emptyYearState },
    2029: { ...emptyYearState }
  });"""

    content = re.sub(state_pattern, empty_state, content, flags=re.MULTILINE)

    def replace_fallback(match):
        var_name = match.group(1)
        prop_name = match.group(2)
        return f"const {var_name} = Number(a.{prop_name}) || 0;"

    content = re.sub(r"const\s+(\w+)\s*=\s*a\.(\w+)\s*\?\?\s*[\d\.]+;", replace_fallback, content)
    content = re.sub(r"const\s+(\w+)\s*=\s*\(\s*a\.(\w+)\s*\?\?\s*[\d\.]+\s*\)\s*/\s*100;", r"const \1 = (Number(a.\2) || 0) / 100;", content)
    content = re.sub(r"const\s+(\w+)\s*=\s*a2029\.(\w+)\s*\?\?\s*[\d\.]+;", r"const \1 = Number(a2029.\2) || 0;", content)

    content = re.sub(r"\(a\.seed_investment\s*\?\?\s*8250000000\)", "(Number(a.seed_investment) || 0)", content)
    content = re.sub(r"\(assumptionsByYear\[row\.year\]\?\.\s*monthly_churn_rate\s*\?\?\s*2\.0\)", "(Number(assumptionsByYear[row.year]?.monthly_churn_rate) || 0)", content)

    content = re.sub(r"parseInt\(e\.target\.value\)\s*\|\|\s*0", 'e.target.value === "" ? "" : Number(e.target.value)', content)
    content = re.sub(r"parseFloat\(e\.target\.value\)\s*\|\|\s*0", 'e.target.value === "" ? "" : Number(e.target.value)', content)

    content = re.sub(r"value=\{activeAssumptions\.(\w+)\s*\?\?\s*0\}", r'value={activeAssumptions.\1 ?? ""}', content)
    
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "w") as f:
        f.write(content)

update_empty_states()
