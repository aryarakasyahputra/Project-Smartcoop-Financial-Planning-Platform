import re

def reformat():
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "r") as f:
        content = f.read()

    # 1. Replace the start of TAB 2
    # From:
    #         {/* TAB 2: Assumption Drivers */}
    #         {activeTab === "drivers" && (
    #           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn items-start">
    #             {/* Left: Driver Input Cards */}
    #             <section className="lg:col-span-1 space-y-4">
    #               {/* Year Selector Tabs */}
    #               <div className="bg-card border border-border rounded-xl p-2 flex gap-1 justify-between shadow-sm">
    #
    # To the new flex row layout
    
    start_pattern = r'\{\/\*\s*TAB 2: Assumption Drivers\s*\*\/\}\s*\{activeTab === "drivers" && \(\s*<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn items-start">\s*\{\/\*\s*Left: Driver Input Cards\s*\*\/\}\s*<section className="lg:col-span-1 space-y-4">\s*\{\/\*\s*Year Selector Tabs\s*\*\/\}\s*<div className="bg-card border border-border rounded-xl p-2 flex gap-1 justify-between shadow-sm">'
    
    new_start = '''{/* TAB 2: Assumption Drivers */}
        {activeTab === "drivers" && (
          <div className="space-y-6 animate-fadeIn">
            {/* Year Selector & Save Button Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="bg-card border border-border rounded-xl p-2 flex gap-1 shadow-sm w-full sm:w-auto min-w-[300px]">'''
              
    content = re.sub(start_pattern, new_start, content)

    # 2. Modify the Year Selector mapping to close the row and open the Grid
    # Finding the end of the year selector tabs
    #                     {yr}
    #                   </button>
    #                 ))}
    #               </div>
    year_end_pattern = r'(\{\[2025, 2026, 2027, 2028, 2029\]\.map\(\(yr\) => \([\s\S]*?</button>\s*\}\)\}\s*</div>)'
    
    # We want to insert the Action button here, and then open the accordion grid
    action_button = '''
              <button
                onClick={handleSaveAssumptions}
                disabled={saving || !projectId}
                className="flex items-center justify-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {saving ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin" /> Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" /> Simpan Asumsi
                  </>
                )}
              </button>
            </div>

            {/* Accordions in Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 items-start">'''

    def replace_year_end(match):
        return match.group(1) + action_button
        
    content = re.sub(year_end_pattern, replace_year_end, content, count=1)

    # 3. Remove the old action button that was below Accordion 5
    old_button_pattern = r'\{\/\*\s*Action Buttons\s*\*\/\}\s*<div className="pt-2">\s*<button\s*onClick=\{handleSaveAssumptions\}[\s\S]*?<\/button>\s*<\/div>'
    content = re.sub(old_button_pattern, '', content)

    # 4. Modify the end of the section and the chart container
    # From:
    #             </section>
    #
    #             {/* Right: Live visual chart */}
    #             <section className="bg-card border border-border rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm sticky top-6">
    
    chart_start_pattern = r'</section>\s*\{\/\*\s*Right: Live visual chart\s*\*\/\}\s*<section className="bg-card border border-border rounded-xl p-6 lg:col-span-2 flex flex-col justify-between shadow-sm sticky top-6">'
    
    new_chart_start = '''</div>

            {/* Full Width Visual Chart */}
            <section className="bg-card border border-border rounded-xl p-6 shadow-sm w-full">'''
            
    content = re.sub(chart_start_pattern, new_chart_start, content)

    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "w") as f:
        f.write(content)

if __name__ == "__main__":
    reformat()
