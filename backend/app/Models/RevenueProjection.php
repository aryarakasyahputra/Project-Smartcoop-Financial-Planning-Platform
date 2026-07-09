<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RevenueProjection extends Model
{
    use HasFactory;

    protected $fillable = [
        'project_id',
        'year',
        'setup_implementation_revenue',
        'saas_subscription_revenue',
        'ios_addon_revenue',
        'white_label_revenue',
        'ppob_transaction_revenue',
        'academy_revenue',
        'offline_training_revenue',
        'enterprise_api_revenue',
        'total_revenue',
        'arr',
        'arpu',
    ];

    protected $casts = [
        'year' => 'integer',
        'setup_implementation_revenue' => 'float',
        'saas_subscription_revenue' => 'float',
        'ios_addon_revenue' => 'float',
        'white_label_revenue' => 'float',
        'ppob_transaction_revenue' => 'float',
        'academy_revenue' => 'float',
        'offline_training_revenue' => 'float',
        'enterprise_api_revenue' => 'float',
        'total_revenue' => 'float',
        'arr' => 'float',
        'arpu' => 'float',
    ];

    public function project()
    {
        return $this->belongsTo(Project::class);
    }
}
