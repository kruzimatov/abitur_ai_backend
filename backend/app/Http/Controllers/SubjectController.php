<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user?->isStudent() && $user->field_id) {
            $subjects = $user->field->subjects()->withCount('topics')->get();
        } elseif ($user?->isTeacher() && $user->subject_id) {
            $subjects = Subject::whereKey($user->subject_id)->withCount('topics')->get();
        } else {
            $subjects = Subject::withCount('topics')->get();
        }

        return response()->json($subjects);
    }

    public function topics(Request $request, $id)
    {
        $this->authorizeSubjectAccess($request, (int) $id);

        $subject = Subject::with('topics:id,subject_id,title,order_num')->findOrFail($id);

        return response()->json($subject->topics);
    }

    private function authorizeSubjectAccess(Request $request, int $subjectId): void
    {
        $user = $request->user();

        if (! $user || $user->isAdmin()) {
            return;
        }

        if ($user->isTeacher() && (int) $user->subject_id === $subjectId) {
            return;
        }

        if ($user->isStudent() && $user->field_id) {
            $allowed = $user->field->subjects()->where('subjects.id', $subjectId)->exists();
            if ($allowed) {
                return;
            }
        }

        abort(403, 'Bu fan sizga biriktirilmagan');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subject = Subject::create($validated);

        return response()->json($subject, 201);
    }

    public function update(Request $request, $id)
    {
        $subject = Subject::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
        ]);

        $subject->update($validated);

        return response()->json($subject);
    }

    public function destroy($id)
    {
        Subject::findOrFail($id)->delete();

        return response()->json(['message' => 'Subject deleted']);
    }
}
