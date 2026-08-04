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

        // Create Admin user from .env variables (secure admin credentials)
        $adminEmail = env('ADMIN_EMAIL', 'admin@test.com');
        $adminPassword = env('ADMIN_PASSWORD', 'password');
        $adminName = env('ADMIN_NAME', 'Platform Admin');

        $adminUser = User::firstOrCreate(
            ['email' => $adminEmail],
            [
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'role_id' => $roleModels['admin']->id,
            ]
        );
        if (!$adminUser->wasRecentlyCreated) {
            $adminUser->update([
                'name' => $adminName,
                'password' => Hash::make($adminPassword),
                'role_id' => $roleModels['admin']->id,
            ]);
        }

        // Create a user for each remaining role for testing
        $testRoles = ['founder', 'finance', 'investor viewer'];
        foreach ($testRoles as $roleName) {
            $emailPrefix = str_replace(' ', '', $roleName);
            $user = User::firstOrCreate(
                ['email' => $emailPrefix . '@test.com'],
                [
                    'name' => 'Test ' . ucfirst($roleName),
                    'password' => Hash::make('password'),
                    'role_id' => $roleModels[$roleName]->id,
                ]
            );

            UserCompanyAccess::firstOrCreate([
                'user_id' => $user->id,
                'company_id' => $company->id
            ]);
        }

        $this->call(ExcelFinancialModelSeeder::class);
    }
}
