import re

def update_all():
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "r") as f:
        content = f.read()

    # 1. EMPTY STATE FIXES
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

    # 2. LAYOUT FIXES (2 Flex Columns Masonry)
    acc1_start = content.find("{/* Accordion 1: Growth Drivers */}")
    acc2_start = content.find("{/* Accordion 2: Revenue Drivers */}")
    acc3_start = content.find("{/* Accordion 3: COGS */}")
    acc4_start = content.find("{/* Accordion 4: OPEX */}")
    acc5_start = content.find("{/* Accordion 5: Funding & Valuation */}")
    
    # We must also extract the top part (Year Selector + Save Button)
    grid_start_idx = content.find('<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">')
    
    if grid_start_idx == -1:
        print("Couldn't find grid start")
        return
        
    before_grid = content[:grid_start_idx]
    
    year_selector_start = content.find("{/* Year Selector Tabs */}", grid_start_idx)
    year_selector_end = content.find("</div>", year_selector_start) + 6 # include </div>
    
    # The action buttons are at the bottom of the section
    # Let's just write them explicitly
    
    acc1_content = content[acc1_start:acc2_start].strip()
    acc2_content = content[acc2_start:acc3_start].strip()
    acc3_content = content[acc3_start:acc4_start].strip()
    acc4_content = content[acc4_start:acc5_start].strip()
    
    # Find the end of acc5 (which is before Action Buttons)
    action_btns_start = content.find("{/* Action Buttons */}", acc5_start)
    acc5_content = content[acc5_start:action_btns_start].strip()
    
    chart_start = content.find("{/* Right: Live visual chart */}", action_btns_start)
    chart_end = content.find("</section>", chart_start) + 10
    chart_content = content[chart_start:chart_end].strip()
    
    # We need to change chart wrapper to full width
    chart_content = chart_content.replace('lg:col-span-2 flex flex-col justify-between', 'w-full')
    chart_content = chart_content.replace('{/* Right: Live visual chart */}', '{/* Full Width Visual Chart */}')
    
    after_drivers = content[content.find("</div>", chart_end):]

    new_layout = f"""
          <div className="space-y-6 animate-fadeIn">
            {{/* Year Selector & Save Button Row */}}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-card border border-border rounded-xl p-2 flex gap-1 shadow-sm w-full sm:w-auto min-w-[300px]">
                {{[2025, 2026, 2027, 2028, 2029].map((yr) => (
                  <button
                    key={{yr}}
                    onClick={{() => setSelectedEditYear(yr)}}
                    className={{`flex-1 py-1.5 px-4 rounded-lg text-xs font-semibold transition-all ${{
                      selectedEditYear === yr 
                        ? "bg-primary text-primary-foreground shadow" 
                        : "text-muted-foreground hover:text-foreground"
                    }}`}}
                  >
                    {{yr}}
                  </button>
                ))}}
              </div>
              
              <button
                onClick={{handleSaveAssumptions}}
                disabled={{saving || !projectId}}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {{saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Simpan Asumsi
                  </>
                )}}
              </button>
            </div>

            {{/* Accordions in 2 Columns Masonry Layout */}}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {{/* Left Column */}}
              <div className="flex flex-col gap-6">
                {acc1_content}
                {acc3_content}
                {acc5_content}
              </div>

              {{/* Right Column */}}
              <div className="flex flex-col gap-6">
                {acc2_content}
                {acc4_content}
              </div>
            </div>

            {chart_content}
"""

    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "w") as f:
        f.write(before_grid + new_layout + after_drivers)
        
update_all()
