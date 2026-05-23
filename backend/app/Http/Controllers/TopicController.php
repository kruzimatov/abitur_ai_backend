<?php

namespace App\Http\Controllers;

use App\Models\Topic;
use Illuminate\Http\Request;

class TopicController extends Controller
{
    public function show($id)
    {
        $topic = Topic::with('subject:id,name')->findOrFail($id);

        return response()->json($topic);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'subject_id' => 'required|exists:subjects,id',
            'title' => 'required|string|max:255',
            'content' => 'required|string',
            'order_num' => 'integer|min:0',
        ]);

        $topic = Topic::create($validated);

        return response()->json($topic, 201);
    }

    public function update(Request $request, $id)
    {
        $topic = Topic::findOrFail($id);

        $validated = $request->validate([
            'subject_id' => 'sometimes|exists:subjects,id',
            'title' => 'sometimes|string|max:255',
            'content' => 'sometimes|string',
            'order_num' => 'integer|min:0',
        ]);

        $topic->update($validated);

        return response()->json($topic);
    }

    public function destroy($id)
    {
        Topic::findOrFail($id)->delete();

        return response()->json(['message' => 'Topic deleted']);
    }
}
