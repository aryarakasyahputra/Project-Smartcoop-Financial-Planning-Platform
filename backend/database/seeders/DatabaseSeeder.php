<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Role;
use App\Models\Company;
use App\Models\Project;
use App\Models\UserCompanyAccess;
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
            $roleModels[$roleName] = Role::firstOrCreate(['name' => $roleName]);
        }

        // Create a default company and project for testing
        $company = Company::firstOrCreate([
            'name' => 'Smartcoop Corp'
        ]);

        $project = Project::firstOrCreate([
            'company_id' => $company->id,
            'name' => 'Proyeksi Keuangan Utama'
        ]);

        // Create a user for each role for testing
        foreach ($roles as $roleName) {
            $emailPrefix = str_replace(' ', '', $roleName);
            $user = User::firstOrCreate(
                ['email' => $emailPrefix . '@test.com'],
                [
                    'name' => 'Test ' . ucfirst($roleName),
                    'password' => Hash::make('password'),
                    'role_id' => $roleModels[$roleName]->id,
                ]
            );

            // Link all non-admin users to the default company
            if ($roleName !== 'admin') {
                UserCompanyAccess::firstOrCreate([
                    'user_id' => $user->id,
                    'company_id' => $company->id
                ], [
                    'role_id' => $roleModels[$roleName]->id
                ]);
            }
        }
    }
}
