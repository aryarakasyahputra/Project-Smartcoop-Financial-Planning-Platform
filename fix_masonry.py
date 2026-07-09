import re

def fix_layout():
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "r") as f:
        content = f.read()

    # Find the accordions container
    grid_start_pattern = r'\{\/\*\s*Accordions in Grid\s*\*\/\}\s*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">'
    
    # We will just replace the grid start to include the left column start
    new_grid_start = """{/* Accordions in Masonry-like 2 Columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Left Column */}
              <div className="flex flex-col gap-6">"""
              
    content = re.sub(grid_start_pattern, new_grid_start, content)

    # Insert end of Left column and start of Right column right before Accordion 2
    acc2_pattern = r'(\{\/\*\s*Accordion 2: Revenue Drivers\s*\*\/\})'
    new_acc2 = """</div>
              {/* Right Column */}
              <div className="flex flex-col gap-6">
              \\1"""
    content = re.sub(acc2_pattern, new_acc2, content)

    # We need to move Accordion 3 and 5 to the Left column, or simply just order them manually.
    # It's better to extract all 5 accordions and re-insert them.
    pass

# A more robust python parser
def reorder_accordions():
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "r") as f:
        content = f.read()

    # Regex to extract each accordion. They all start with {/* Accordion N: ... */}
    # and end with a closing </div> before the next accordion or before the chart section.
    
    parts = re.split(r'(\{\/\*\s*Accordion \d:.*?\{\/\*\s*Full Width Visual Chart\s*\*\/\})', content, flags=re.DOTALL)
    if len(parts) == 1:
        # try a different split
        pass
    
    # Let's just use simple string replacement since we know the exact comments
    acc1_start = content.find("{/* Accordion 1: Growth Drivers */}")
    acc2_start = content.find("{/* Accordion 2: Revenue Drivers */}")
    acc3_start = content.find("{/* Accordion 3: COGS */}")
    acc4_start = content.find("{/* Accordion 4: OPEX */}")
    acc5_start = content.find("{/* Accordion 5: Funding & Valuation */}")
    chart_start = content.find("{/* Full Width Visual Chart */}")
    
    acc1_content = content[acc1_start:acc2_start].strip()
    acc2_content = content[acc2_start:acc3_start].strip()
    acc3_content = content[acc3_start:acc4_start].strip()
    acc4_content = content[acc4_start:acc5_start].strip()
    # acc5 ends right before `</div>` which closes the grid
    # let's find the closing div of the grid
    acc5_content_full = content[acc5_start:chart_start].strip()
    # acc5_content_full has a `</div>` at the end which belongs to the grid.
    acc5_content = acc5_content_full[:-6].strip() # remove the last </div>
    
    before_grid = content[:acc1_start]
    # replace grid div definition in before_grid
    before_grid = before_grid.replace('<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">', '<div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">')
    
    after_grid = content[chart_start:]
    
    new_grid_content = f"""
              {{/* Left Column (Growth, COGS, Funding) */}}
              <div className="flex flex-col gap-6">
                {acc1_content}
                {acc3_content}
                {acc5_content}
              </div>

              {{/* Right Column (Revenue, OPEX) */}}
              <div className="flex flex-col gap-6">
                {acc2_content}
                {acc4_content}
              </div>
            </div>
            
            """
            
    with open("frontend/src/pages/cfo/CfoDashboard.jsx", "w") as f:
        f.write(before_grid + new_grid_content + after_grid)

reorder_accordions()
