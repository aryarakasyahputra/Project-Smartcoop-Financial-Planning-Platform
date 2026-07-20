<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Company extends Model
{
    protected $fillable = [
        'name',
        'description',
        'subscription_status',
        'subscription_ends_at'
    ];

    public function projects(): HasMany
    {
        return $this->hasMany(Project::class);
    }

    public function userAccesses(): HasMany
    {
        return $this->hasMany(UserCompanyAccess::class);
    }
}
