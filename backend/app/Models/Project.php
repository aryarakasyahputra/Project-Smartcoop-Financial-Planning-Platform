<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Project extends Model
{
    protected $fillable = ['company_id', 'name', 'description'];

    public function company(): BelongsTo
    {
        return $this->belongsTo(Company::class);
    }

    public function years(): HasMany
    {
        return $this->hasMany(ProjectYear::class);
    }
}
