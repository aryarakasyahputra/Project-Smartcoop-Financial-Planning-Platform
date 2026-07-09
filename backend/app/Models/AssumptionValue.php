<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AssumptionValue extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'year',
        'new_coops_acquired',
        'monthly_churn_rate',
        'avg_members_per_coop',
        'subscription_paying_frac',
        'setup_fee',
        'paid_implementation_coops',
        'monthly_subscription_fee',
        'ios_addon_monthly_fee',
        'ios_adoption_frac',
        'white_label_projects',
        'white_label_fee_per_project',
        'ppob_active_coops_frac',
        'ppob_tx_per_coop_month',
        'avg_ppob_fee_per_tx',
        'academy_participants_frac',
        'academy_avg_price_per_participant',
        'offline_trainings_per_month',
        'offline_training_fee_per_coop',
        'enterprise_api_revenue',
        'cloud_cost_per_coop_month',
        'implementation_cost_per_coop',
        'support_cost_per_coop_month',
        'payment_api_var_cost_frac',
        'other_cost_of_revenue_frac',
        'payroll_cost',
        'sales_marketing_spend',
        'office_utilities_internet',
        'software_tools_subscriptions',
        'legal_accounting_compliance',
        'travel_events',
        'recruitment_training',
        'other_ga',
        'seed_investment',
        'pre_money_valuation',
        'exit_revenue_multiple_conservative',
        'exit_revenue_multiple_base',
        'exit_revenue_multiple_optimistic',
    ];

    protected $casts = [
        'year' => 'integer',
        'new_coops_acquired' => 'integer',
        'monthly_churn_rate' => 'float',
        'avg_members_per_coop' => 'integer',
        'subscription_paying_frac' => 'float',
        'setup_fee' => 'float',
        'paid_implementation_coops' => 'integer',
        'monthly_subscription_fee' => 'float',
        'ios_addon_monthly_fee' => 'float',
        'ios_adoption_frac' => 'float',
        'white_label_projects' => 'integer',
        'white_label_fee_per_project' => 'float',
        'ppob_active_coops_frac' => 'float',
        'ppob_tx_per_coop_month' => 'integer',
        'avg_ppob_fee_per_tx' => 'float',
        'academy_participants_frac' => 'float',
        'academy_avg_price_per_participant' => 'float',
        'offline_trainings_per_month' => 'integer',
        'offline_training_fee_per_coop' => 'float',
        'enterprise_api_revenue' => 'float',
        'cloud_cost_per_coop_month' => 'float',
        'implementation_cost_per_coop' => 'float',
        'support_cost_per_coop_month' => 'float',
        'payment_api_var_cost_frac' => 'float',
        'other_cost_of_revenue_frac' => 'float',
        'payroll_cost' => 'float',
        'sales_marketing_spend' => 'float',
        'office_utilities_internet' => 'float',
        'software_tools_subscriptions' => 'float',
        'legal_accounting_compliance' => 'float',
        'travel_events' => 'float',
        'recruitment_training' => 'float',
        'other_ga' => 'float',
        'seed_investment' => 'float',
        'pre_money_valuation' => 'float',
        'exit_revenue_multiple_conservative' => 'float',
        'exit_revenue_multiple_base' => 'float',
        'exit_revenue_multiple_optimistic' => 'float',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
