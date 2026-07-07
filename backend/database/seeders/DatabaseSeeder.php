<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $roles = [
            'admin',
            'founder',
            'finance',
            'investor viewer'
        ];

        $roleModels = [];
        foreach ($roles as $roleName) {
            $roleModels[$roleName] = Role::create(['name' => $roleName]);
        }

        // Create a user for each role for testing
        foreach ($roles as $roleName) {
            $emailPrefix = str_replace(' ', '', $roleName);
            User::factory()->create([
                'name' => 'Test ' . ucfirst($roleName),
                'email' => $emailPrefix . '@test.com',
                'password' => Hash::make('password'),
                'role_id' => $roleModels[$roleName]->id,
            ]);
        }
    }
}
