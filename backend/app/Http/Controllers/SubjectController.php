<?php

namespace App\Http\Controllers;

use App\Models\Subject;
use Illuminate\Http\Request;

class SubjectController extends Controller
{
    public function index()
    {
        $subjects = Subject::withCount('topics')->get();

        return response()->json($subjects);
    }

    public function topics($id)
    {
        $subject = Subject::with('topics:id,subject_id,title,order_num')->findOrFail($id);

        return response()->json($subject->topics);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'icon' => 'nullable|string|max:10',
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
            'icon' => 'nullable|string|max:10',
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
