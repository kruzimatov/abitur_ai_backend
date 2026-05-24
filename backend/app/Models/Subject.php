<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Subject extends Model
{
    use HasFactory;

    protected $fillable = ['name', 'description'];

    public function topics(): HasMany
    {
        return $this->hasMany(Topic::class)->orderBy('order_num');
    }

    public function fields(): BelongsToMany
    {
        return $this->belongsToMany(Field::class);
    }
}
