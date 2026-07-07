<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ProjectYear extends Model
{
    protected $fillable = ['project_id', 'year'];

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }
}
