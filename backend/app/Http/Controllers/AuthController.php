<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $rules = [
            'firstname' => 'required|string|max:255',
            'lastname' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:6|confirmed',
            'gender' => 'required|in:male,female',
            'role' => 'required|in:student,teacher',
        ];

        if ($request->role === 'student') {
            $rules['field_id'] = 'required|exists:fields,id';
        }

        if ($request->role === 'teacher') {
            $rules['subject_id'] = 'required|exists:subjects,id';
        }

        $validated = $request->validate($rules);

        $user = User::create([
            'firstname' => $validated['firstname'],
            'lastname' => $validated['lastname'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'gender' => $validated['gender'],
            'role' => $validated['role'],
            'field_id' => $validated['field_id'] ?? null,
            'subject_id' => $validated['subject_id'] ?? null,
        ]);

        $user->load($user->isStudent() ? 'field.subjects' : 'subject');

        $token = Auth::login($user);

        return $this->respondWithToken($token, $user, 201);
    }

    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (! $token = Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'email' => ['The provided credentials are incorrect.'],
            ]);
        }

        $user = Auth::user();
        if ($user->isStudent()) {
            $user->load('field.subjects');
        } elseif ($user->isTeacher()) {
            $user->load('subject');
        }

        return $this->respondWithToken($token, $user);
    }

    public function logout()
    {
        Auth::logout();

        return response()->json(['message' => 'Successfully logged out']);
    }

    public function refresh()
    {
        return $this->respondWithToken(Auth::refresh(), Auth::user());
    }

    public function user()
    {
        $user = Auth::user();
        if ($user->isStudent()) {
            $user->load('field.subjects');
        } elseif ($user->isTeacher()) {
            $user->load('subject');
        }

        return response()->json($user);
    }

    private function respondWithToken(string $token, $user, int $status = 200)
    {
        return response()->json([
            'user' => $user,
            'token' => $token,
            'token_type' => 'bearer',
            'expires_in' => Auth::factory()->getTTL() * 60,
        ], $status);
    }
}
