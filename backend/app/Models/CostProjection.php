<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CostProjection extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'year',
        'cloud_infrastructure_cost',
        'implementation_onboarding_cost',
        'customer_support_cost',
        'payment_api_variable_cost',
        'other_cost_of_revenue',
        'total_cogs',
        'gross_profit',
        'gross_margin',
        'payroll_opex',
        'sales_marketing_opex',
        'office_utilities_opex',
        'software_tools_opex',
        'legal_accounting_opex',
        'travel_events_opex',
        'recruitment_training_opex',
        'other_ga_opex',
        'total_opex',
    ];

    protected $casts = [
        'year' => 'integer',
        'cloud_infrastructure_cost' => 'float',
        'implementation_onboarding_cost' => 'float',
        'customer_support_cost' => 'float',
        'payment_api_variable_cost' => 'float',
        'other_cost_of_revenue' => 'float',
        'total_cogs' => 'float',
        'gross_profit' => 'float',
        'gross_margin' => 'float',
        'payroll_opex' => 'float',
        'sales_marketing_opex' => 'float',
        'office_utilities_opex' => 'float',
        'software_tools_opex' => 'float',
        'legal_accounting_opex' => 'float',
        'travel_events_opex' => 'float',
        'recruitment_training_opex' => 'float',
        'other_ga_opex' => 'float',
        'total_opex' => 'float',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
