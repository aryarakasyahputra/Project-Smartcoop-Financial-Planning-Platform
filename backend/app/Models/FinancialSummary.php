<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class FinancialSummary extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'year',
        'active_cooperatives',
        'total_cooperative_members',
        'revenue',
        'cogs',
        'opex',
        'ebitda',
        'ebitda_margin',
        'net_profit',
        'net_margin',
        'ending_cash',
        'runway_months',
        'mrr',
        'arr',
        'estimated_cac',
        'estimated_ltv',
        'ltv_cac_ratio',
        'cac_payback_months',
        'rule_of_40',
        'enterprise_value_conservative',
        'enterprise_value_base',
        'enterprise_value_optimistic',
        'post_money_valuation',
        'implied_seed_equity_frac',
        'investor_moic_conservative',
        'investor_moic_base',
        'investor_moic_optimistic',
        'investor_irr_conservative',
        'investor_irr_base',
        'investor_irr_optimistic',
    ];

    protected $casts = [
        'year' => 'integer',
        'active_cooperatives' => 'integer',
        'total_cooperative_members' => 'integer',
        'revenue' => 'float',
        'cogs' => 'float',
        'opex' => 'float',
        'ebitda' => 'float',
        'ebitda_margin' => 'float',
        'net_profit' => 'float',
        'net_margin' => 'float',
        'ending_cash' => 'float',
        'runway_months' => 'float',
        'mrr' => 'float',
        'arr' => 'float',
        'estimated_cac' => 'float',
        'estimated_ltv' => 'float',
        'ltv_cac_ratio' => 'float',
        'cac_payback_months' => 'float',
        'rule_of_40' => 'float',
        'enterprise_value_conservative' => 'float',
        'enterprise_value_base' => 'float',
        'enterprise_value_optimistic' => 'float',
        'post_money_valuation' => 'float',
        'implied_seed_equity_frac' => 'float',
        'investor_moic_conservative' => 'float',
        'investor_moic_base' => 'float',
        'investor_moic_optimistic' => 'float',
        'investor_irr_conservative' => 'float',
        'investor_irr_base' => 'float',
        'investor_irr_optimistic' => 'float',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
